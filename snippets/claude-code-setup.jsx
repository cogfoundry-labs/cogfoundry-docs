export const ClaudeCodeSetup = () => {
  const BASE = "https://router.cogfoundry.ai/api";
  const MODELS = [
    "anthropic/claude-sonnet-5.5",
    "anthropic/claude-haiku-5.5",
    "anthropic/claude-opus-5.5",
  ];

  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [existingSettings, setExistingSettings] = useState("");
  const [checkedSignature, setCheckedSignature] = useState("");
  const [busy, setBusy] = useState(false);
  const [statusState, setStatusState] = useState({ text: "", kind: "" });

  const values = () => ({ key: apiKey.trim(), model });
  const signature = (v) => JSON.stringify(v);

  const setStatus = (text, kind) => {
    let message = text;
    if (/\p{Script=Han}/u.test(message)) {
      message =
        kind === "error"
          ? "The operation failed. Check your connection and folder permissions, then try again."
          : "Operation completed. Review your configuration before restarting Claude Code.";
    }
    setStatusState({ text: message, kind });
  };

  const validate = (v) => {
    if (!v.key || /\s/.test(v.key)) {
      throw new Error("Enter a CogFoundry API key without spaces.");
    }
    if (!MODELS.includes(v.model)) {
      throw new Error("Choose a model from the list.");
    }
  };

  const parseSettings = (text) => {
    let parsed;
    try {
      parsed = text.trim() ? JSON.parse(text) : {};
    } catch (_) {
      throw new Error(
        "The existing settings.json is not valid JSON. Fix it before continuing."
      );
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("settings.json must contain a JSON object.");
    }
    if (
      parsed.env !== undefined &&
      (!parsed.env || typeof parsed.env !== "object" || Array.isArray(parsed.env))
    ) {
      throw new Error("The env field must be a JSON object.");
    }
    return parsed;
  };

  const buildSettings = (v, existing = "") => {
    validate(v);
    const settings = parseSettings(existing);
    const env = { ...(settings.env || {}) };
    for (const field of [
      "CLAUDE_CODE_USE_BEDROCK",
      "CLAUDE_CODE_USE_VERTEX",
      "CLAUDE_CODE_USE_FOUNDRY",
    ]) {
      delete env[field];
    }
    Object.assign(env, {
      ANTHROPIC_BASE_URL: BASE,
      ANTHROPIC_AUTH_TOKEN: v.key,
      ANTHROPIC_API_KEY: "",
      ANTHROPIC_MODEL: v.model,
      ANTHROPIC_DEFAULT_SONNET_MODEL: "anthropic/claude-sonnet-5.5",
      ANTHROPIC_DEFAULT_HAIKU_MODEL: "anthropic/claude-haiku-5.5",
      ANTHROPIC_DEFAULT_OPUS_MODEL: "anthropic/claude-opus-5.5",
      ANTHROPIC_DEFAULT_FABLE_MODEL: "anthropic/claude-fable-5.1",
    });
    if (env.CLAUDE_CODE_SUBAGENT_MODEL) {
      env.CLAUDE_CODE_SUBAGENT_MODEL = v.model;
    }
    settings.env = env;
    return JSON.stringify(settings, null, 2) + "\n";
  };

  const readFile = async (directory, name) => {
    try {
      const handle = await directory.getFileHandle(name);
      return { exists: true, text: await (await handle.getFile()).text() };
    } catch (error) {
      if (error.name === "NotFoundError") return { exists: false, text: "" };
      throw error;
    }
  };

  const writeFile = async (directory, name, text) => {
    const handle = await directory.getFileHandle(name, { create: true });
    const stream = await handle.createWritable();
    try {
      await stream.write(text);
      await stream.close();
    } catch (error) {
      try {
        await stream.abort();
      } catch (_) {}
      throw error;
    }
    const saved = await readFile(directory, name);
    if (saved.text !== text) throw new Error("Could not verify " + name + ".");
  };

  const installToDirectory = async (directory, v) => {
    validate(v);
    if (directory.name !== ".claude") {
      throw new Error("Choose the .claude folder, not its parent folder.");
    }
    const previous = await readFile(directory, "settings.json");
    const content = buildSettings(v, previous.text);
    const stamp =
      new Date().toISOString().replace(/[:.]/g, "-") +
      "-" +
      Math.random().toString(36).slice(2, 7);
    const backup = previous.exists
      ? "settings.json.cogfoundry." + stamp + ".bak"
      : null;
    if (backup) await writeFile(directory, backup, previous.text);
    try {
      await writeFile(directory, "settings.json", content);
    } catch (error) {
      try {
        if (previous.exists) {
          await writeFile(directory, "settings.json", previous.text);
        } else {
          await directory.removeEntry("settings.json");
        }
      } catch (_) {
        throw new Error(
          "Write failed. Restore settings.json" +
            (backup ? " from " + backup : " manually") +
            "."
        );
      }
      throw new Error(
        "Write failed; the original configuration was restored. " + error.message
      );
    }
    return { backup };
  };

  const checkConnectionRequest = async (v) => {
    validate(v);
    const response = await fetch(BASE + "/v1/messages", {
      method: "POST",
      credentials: "omit",
      redirect: "error",
      headers: {
        Authorization: "Bearer " + v.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: v.model,
        max_tokens: 128,
        messages: [{ role: "user", content: "Reply with exactly COG_CLAUDE_OK." }],
        stream: true,
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) {
      let detail = "";
      try {
        const body = await response.json();
        detail = body.error?.message || "";
      } catch (_) {}
      throw new Error(
        "CogFoundry returned HTTP " +
          response.status +
          (detail ? ": " + detail : ".")
      );
    }
    if (!response.headers.get("content-type")?.includes("text/event-stream")) {
      throw new Error(
        "Expected a streaming Messages response. Try again before installing."
      );
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let output = "";
    let complete = false;
    let stopReason = "";
    const consume = (line) => {
      if (!line.startsWith("data:")) return;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") return;
      let event;
      try {
        event = JSON.parse(data);
      } catch (_) {
        return;
      }
      if (event.type === "error") {
        throw new Error(event.error?.message || "The model returned an error.");
      }
      if (
        event.type === "content_block_delta" &&
        event.delta?.type === "text_delta"
      ) {
        output += event.delta.text || "";
      }
      if (
        event.type === "content_block_start" &&
        event.content_block?.type === "text"
      ) {
        output += event.content_block.text || "";
      }
      if (event.type === "message_delta" && event.delta?.stop_reason) {
        stopReason = event.delta.stop_reason;
      }
      if (event.type === "message_stop") complete = true;
    };
    try {
      for (;;) {
        const part = await reader.read();
        buffer += decoder.decode(part.value || new Uint8Array(), {
          stream: !part.done,
        });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        lines.forEach(consume);
        if (part.done) break;
      }
      if (buffer) consume(buffer);
    } finally {
      try {
        await reader.cancel();
      } catch (_) {}
    }
    if (!complete || !output.trim() || stopReason !== "end_turn") {
      throw new Error(
        "The stream ended without a completed text response. Try again before installing."
      );
    }
    return output.trim();
  };

  const handleCheck = async () => {
    if (busy) return;
    const v = values();
    setBusy(true);
    setCheckedSignature("");
    setStatus("Checking the CogFoundry Messages connection...", "pending");
    try {
      const reply = await checkConnectionRequest(v);
      setCheckedSignature(signature(v));
      setStatus(
        "Connected. " + v.model + " completed a response: " + reply,
        "success"
      );
    } catch (error) {
      setStatus(
        error.name === "TypeError"
          ? "The browser could not reach CogFoundry. Check your network, then retry. No local files were changed."
          : error.message,
        "error"
      );
    } finally {
      setBusy(false);
    }
  };

  const handleInstall = async () => {
    if (busy) return;
    try {
      const v = values();
      validate(v);
      if (signature(v) !== checkedSignature) {
        throw new Error("Check the connection first.");
      }
      if (!window.showDirectoryPicker) {
        throw new Error(
          "This browser does not support folder access. Use desktop Chrome/Edge or download settings.json."
        );
      }
      const picker = window.showDirectoryPicker({ mode: "readwrite" });
      setBusy(true);
      const directory = await picker;
      const result = await installToDirectory(directory, v);
      setStatus(
        "Saved and verified settings.json. " +
          (result.backup ? "Backup: " + result.backup + ". " : "") +
          "Exit Claude Code and start a new session.",
        "success"
      );
    } catch (error) {
      setStatus(
        error.name === "AbortError"
          ? "Folder selection cancelled. No files were changed."
          : error.message,
        error.name === "AbortError" ? "pending" : "error"
      );
    } finally {
      setBusy(false);
    }
  };

  const handleExistingFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      parseSettings(text);
      setExistingSettings(text);
      setStatus(
        "Loaded your existing settings.json. The download will preserve its other settings.",
        "pending"
      );
    } catch (error) {
      setExistingSettings("");
      setStatus(error.message, "error");
    }
  };

  const handleDownloadSettings = () => {
    try {
      const text = buildSettings(values(), existingSettings);
      const url = URL.createObjectURL(
        new Blob([text], { type: "application/json;charset=utf-8" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "settings.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setStatus(error.message, "error");
    }
  };

  let previewText = "";
  try {
    previewText = buildSettings(
      { ...values(), key: "YOUR_COGFOUNDRY_API_KEY" },
      existingSettings
    );
  } catch (error) {
    previewText = error.message;
  }

  const canInstall =
    !busy && !!apiKey.trim() && signature(values()) === checkedSignature;

  return (
    <div className="my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 not-prose">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Connect Claude Code
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Configure Claude Code to use CogFoundry.
          </p>
        </div>
        <span className="inline-block rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">
          MESSAGES API
        </span>
      </div>

      <div className="flex flex-wrap gap-5 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          <strong className="text-zinc-900 dark:text-zinc-100 mr-1">01</strong>
          Enter key
        </span>
        <span>
          <strong className="text-zinc-900 dark:text-zinc-100 mr-1">02</strong>
          Check connection
        </span>
        <span>
          <strong className="text-zinc-900 dark:text-zinc-100 mr-1">03</strong>
          Write settings
        </span>
      </div>

      <div className="mb-4">
        <label
          htmlFor="claude-api-key"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5"
        >
          CogFoundry API key
        </label>
        <div className="flex gap-2">
          <input
            id="claude-api-key"
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setCheckedSignature("");
            }}
            placeholder="Paste your CogFoundry key"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
          <button
            type="button"
            onClick={() => setShowKey((prev) => !prev)}
            className="shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          Your key is sent only to router.cogfoundry.ai when you check the
          connection. It is saved locally when you install or download
          settings.json.
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="claude-model"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5"
        >
          Default model
        </label>
        <select
          id="claude-model"
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            setCheckedSignature("");
          }}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        >
          <option value="anthropic/claude-sonnet-5.5">
            anthropic/claude-sonnet-5.5
          </option>
          <option value="anthropic/claude-haiku-5.5">
            anthropic/claude-haiku-5.5
          </option>
          <option value="anthropic/claude-opus-5.5">
            anthropic/claude-opus-5.5
          </option>
        </select>
      </div>

      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        API base URL:{" "}
        <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-800 dark:text-zinc-200">
          https://router.cogfoundry.ai/api
        </code>
      </div>

      <div className="flex flex-wrap gap-2.5 my-4">
        <button
          type="button"
          disabled={busy}
          onClick={handleCheck}
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check connection
        </button>
        <button
          type="button"
          disabled={!canInstall}
          onClick={handleInstall}
          className="rounded-lg bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Write to .claude folder
        </button>
      </div>

      {statusState.kind && (
        <div
          role="status"
          aria-live="polite"
          className={
            statusState.kind === "success"
              ? "my-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2.5 text-sm text-emerald-800 dark:text-emerald-200 break-words"
              : statusState.kind === "error"
              ? "my-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-3.5 py-2.5 text-sm text-red-800 dark:text-red-200 break-words"
              : "my-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 break-words"
          }
        >
          {statusState.text}
        </div>
      )}

      <details className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        <summary className="cursor-pointer font-medium text-zinc-900 dark:text-zinc-100">
          Preview settings
        </summary>
        <pre className="mt-2 max-h-80 overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3.5 text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words">
          {previewText}
        </pre>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          The preview hides your key. The folder writer updates CogFoundry
          connection and model settings; other settings are preserved.
        </p>
      </details>

      <details className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        <summary className="cursor-pointer font-medium text-zinc-900 dark:text-zinc-100">
          Browser cannot access the folder?
        </summary>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          Use desktop Chrome or Edge on localhost or HTTPS for folder access.
          Otherwise, download{" "}
          <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 font-mono">
            settings.json
          </code>{" "}
          below. If you already have that file, load it first to preserve its
          other settings.
        </p>
        <label
          htmlFor="claude-existing"
          className="block mt-3 mb-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100"
        >
          Existing settings.json (optional)
        </label>
        <input
          id="claude-existing"
          type="file"
          accept=".json"
          onChange={handleExistingFile}
          className="block w-full text-xs text-zinc-600 dark:text-zinc-400 file:mr-3 file:rounded-md file:border file:border-zinc-300 dark:file:border-zinc-700 file:bg-white dark:file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-900 dark:file:text-zinc-100 hover:file:bg-zinc-50 dark:hover:file:bg-zinc-800"
        />
        <div className="flex flex-wrap gap-2.5 my-3">
          <button
            type="button"
            onClick={handleDownloadSettings}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Download settings.json
          </button>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Back up your original file, then place the download in your home
          folder&apos;s{" "}
          <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 font-mono">
            .claude
          </code>{" "}
          directory.
        </p>
      </details>
    </div>
  );
};
