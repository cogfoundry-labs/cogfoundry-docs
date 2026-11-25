export const CodexDesktopSetup = () => {
  const BASE = "https://router.cogfoundry.ai/api/v1";
  const MODELS = ["openai/gpt-5.6-terra", "openai/gpt-5.6-sol"];

  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [effort, setEffort] = useState("medium");
  const [existingConfig, setExistingConfig] = useState("");
  const [checkedSignature, setCheckedSignature] = useState("");
  const [busy, setBusy] = useState(false);
  const [statusState, setStatusState] = useState({ text: "", kind: "" });

  const values = () => ({ key: apiKey.trim(), model, effort });
  const signature = (v) => JSON.stringify(v);

  const setStatus = (text, kind) => {
    let message = text;
    if (/[^\x00-\x7F]/.test(message) && /\p{Script=Han}/u.test(message)) {
      message =
        kind === "error"
          ? "The operation failed. Check your connection and folder permissions, then try again."
          : "Operation completed. Review your configuration before restarting Codex.";
    }
    setStatusState({ text: message, kind });
  };

  const validate = (v) => {
    if (!v.key || /\s/.test(v.key)) {
      throw new Error("Enter a CogFoundry API key without spaces.");
    }
    if (!MODELS.includes(v.model)) {
      throw new Error("Choose a tested Codex model.");
    }
    if (!["low", "medium", "high"].includes(v.effort)) {
      throw new Error("Choose a valid reasoning effort.");
    }
  };

  const buildConfig = (v, existing = "") => {
    validate(v);
    if (existing.includes('"""') || existing.includes("'''")) {
      throw new Error(
        "This config uses multiline TOML. Use the manual method to preserve it."
      );
    }
    const rootValues = {
      model_provider: '"cogfoundry"',
      model: JSON.stringify(v.model),
      model_reasoning_effort: JSON.stringify(v.effort),
      cli_auth_credentials_store: '"file"',
    };
    const lines = existing.replace(/\r\n/g, "\n").split("\n");
    const kept = [];
    let atRoot = true;
    let skip = false;
    for (const line of lines) {
      const section = line.match(/^\s*\[([^\]]+)\]\s*(?:#.*)?$/);
      if (section) {
        atRoot = false;
        const name = section[1].trim().replace(/["']/g, "");
        skip =
          name === "model_providers.cogfoundry" ||
          name.startsWith("model_providers.cogfoundry.");
      }
      if (skip) continue;
      const assignment = line.match(/^\s*([A-Za-z_][\w-]*)\s*=/);
      if (
        atRoot &&
        assignment &&
        (assignment[1] in rootValues ||
          assignment[1] === "disable_response_storage")
      ) {
        continue;
      }
      kept.push(line);
    }
    const header = Object.entries(rootValues)
      .map(([k, val]) => `${k} = ${val}`)
      .join("\n");
    const keptText = kept.join("\n").trim();
    return (
      header +
      "\n\n" +
      (keptText ? keptText + "\n\n" : "") +
      '[model_providers.cogfoundry]\nname = "CogFoundry"\nbase_url = "' +
      BASE +
      '"\nrequires_openai_auth = true\nwire_api = "responses"\n'
    );
  };

  const buildAuth = (v) => {
    validate(v);
    return JSON.stringify({ OPENAI_API_KEY: v.key }, null, 2) + "\n";
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
    if (directory.name !== ".codex") {
      throw new Error("Choose the .codex folder, not its parent folder.");
    }
    const previous = {};
    for (const name of ["config.toml", "auth.json"]) {
      previous[name] = await readFile(directory, name);
    }
    const files = {
      "config.toml": buildConfig(v, previous["config.toml"].text),
      "auth.json": buildAuth(v),
    };
    const stamp =
      new Date().toISOString().replace(/[:.]/g, "-") +
      "-" +
      Math.random().toString(36).slice(2, 7);
    const suffix = ".cogfoundry." + stamp + ".bak";
    for (const name of Object.keys(files)) {
      if (previous[name].exists) {
        await writeFile(directory, name + suffix, previous[name].text);
      }
    }
    const modified = [];
    try {
      for (const [name, text] of Object.entries(files)) {
        modified.push(name);
        await writeFile(directory, name, text);
      }
    } catch (error) {
      const failures = [];
      for (const name of modified.reverse()) {
        try {
          if (previous[name].exists) {
            await writeFile(directory, name, previous[name].text);
          } else {
            await directory.removeEntry(name);
          }
        } catch (_) {
          failures.push(name);
        }
      }
      throw new Error(
        failures.length
          ? "Write failed. Restore " +
              failures.join(", ") +
              " from backups ending " +
              suffix
          : "Write failed; the original configuration was restored. " +
              error.message
      );
    }
    return {
      suffix,
      backups: Object.keys(files)
        .filter((name) => previous[name].exists)
        .map((name) => name + suffix),
    };
  };

  const checkConnectionRequest = async (v) => {
    validate(v);
    const response = await fetch(BASE + "/responses", {
      method: "POST",
      credentials: "omit",
      redirect: "error",
      headers: {
        Authorization: "Bearer " + v.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: v.model,
        input: "Reply with exactly COG_OK.",
        stream: true,
        max_output_tokens: 128,
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
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let output = "";
    let complete = false;
    const consume = (line) => {
      if (!line.startsWith("data: ")) return;
      const data = line.slice(6).trim();
      if (!data || data === "[DONE]") return;
      let event;
      try {
        event = JSON.parse(data);
      } catch (_) {
        return;
      }
      if (event.type === "response.output_text.delta") {
        output += event.delta || "";
      }
      if (event.type === "response.completed") {
        complete = event.response?.status === "completed";
        if (!output) {
          output = (event.response?.output || [])
            .flatMap((item) => item.content || [])
            .map((part) => part.text || "")
            .join("");
        }
      }
      if (
        ["error", "response.failed", "response.incomplete"].includes(event.type)
      ) {
        throw new Error(
          event.error?.message ||
            event.response?.error?.message ||
            "The model did not complete the response."
        );
      }
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
    if (!complete || !output.trim()) {
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
    setStatus("Checking the CogFoundry Responses connection…", "pending");
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
          "This browser does not support folder access. Use desktop Chrome/Edge or download the files."
        );
      }
      const picker = window.showDirectoryPicker({ mode: "readwrite" });
      setBusy(true);
      const directory = await picker;
      const result = await installToDirectory(directory, v);
      setStatus(
        "Installed and verified auth.json + config.toml. " +
          (result.backups.length
            ? "Backups: " + result.backups.join(", ") + ". "
            : "") +
          "Fully quit and reopen Codex, then start a new conversation.",
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
      buildConfig({ ...values(), key: "PREVIEW" }, text);
      setExistingConfig(text);
      setStatus(
        "Loaded your existing config.toml. Downloads will preserve its other settings.",
        "pending"
      );
    } catch (error) {
      setExistingConfig("");
      setStatus(error.message, "error");
    }
  };

  const downloadFile = (name, text) => {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadConfig = () => {
    try {
      downloadFile("config.toml", buildConfig(values(), existingConfig));
    } catch (error) {
      setStatus(error.message, "error");
    }
  };

  const handleDownloadAuth = () => {
    try {
      downloadFile("auth.json", buildAuth(values()));
    } catch (error) {
      setStatus(error.message, "error");
    }
  };

  let previewText = "";
  try {
    const display = { ...values(), key: "YOUR_COGFOUNDRY_API_KEY" };
    previewText =
      buildConfig(display, existingConfig) +
      "\n# auth.json\n" +
      buildAuth(display);
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
            Connect Codex
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Configure Codex to use CogFoundry.
          </p>
        </div>
        <span className="inline-block rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">
          RESPONSES API
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
          Write configuration
        </span>
      </div>

      <div className="mb-4">
        <label
          htmlFor="codex-api-key"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5"
        >
          CogFoundry API key
        </label>
        <div className="flex gap-2">
          <input
            id="codex-api-key"
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
          auth.json.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="codex-model"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5"
          >
            Default model
          </label>
          <select
            id="codex-model"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setCheckedSignature("");
            }}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          >
            <option value="openai/gpt-5.6-terra">openai/gpt-5.6-terra</option>
            <option value="openai/gpt-5.6-sol">openai/gpt-5.6-sol</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="codex-effort"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5"
          >
            Reasoning effort
          </label>
          <select
            id="codex-effort"
            value={effort}
            onChange={(e) => {
              setEffort(e.target.value);
              setCheckedSignature("");
            }}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          >
            <option value="medium">Medium · balanced</option>
            <option value="low">Low · faster</option>
            <option value="high">High · deeper reasoning</option>
          </select>
        </div>
      </div>

      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        API base URL:{" "}
        <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-800 dark:text-zinc-200">
          https://router.cogfoundry.ai/api/v1
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
          Write to .codex folder
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
          Preview configuration
        </summary>
        <pre className="mt-2 max-h-80 overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3.5 text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words">
          {previewText}
        </pre>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          The API key is hidden from the preview. Existing settings are
          preserved when you use the folder writer.
        </p>
      </details>

      <details className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        <summary className="cursor-pointer font-medium text-zinc-900 dark:text-zinc-100">
          Browser cannot access the folder?
        </summary>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          Use desktop Chrome or Edge on localhost or HTTPS for direct folder
          access. Otherwise download both files below. If you already have a
          config.toml, load it first to preserve its other settings.
        </p>
        <label
          htmlFor="codex-existing"
          className="block mt-3 mb-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100"
        >
          Existing config.toml (optional)
        </label>
        <input
          id="codex-existing"
          type="file"
          accept=".toml"
          onChange={handleExistingFile}
          className="block w-full text-xs text-zinc-600 dark:text-zinc-400 file:mr-3 file:rounded-md file:border file:border-zinc-300 dark:file:border-zinc-700 file:bg-white dark:file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-900 dark:file:text-zinc-100 hover:file:bg-zinc-50 dark:hover:file:bg-zinc-800"
        />
        <div className="flex flex-wrap gap-2.5 my-3">
          <button
            type="button"
            onClick={handleDownloadConfig}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Download config.toml
          </button>
          <button
            type="button"
            onClick={handleDownloadAuth}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Download auth.json
          </button>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Back up the original files before placing the downloads in your .codex
          folder.
        </p>
      </details>
    </div>
  );
};
