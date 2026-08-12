---
title: Command Help
description: Inspect loomloom commands, flags, and the current command tree.
icon: book-open
---

Use the CLI's built-in help as the source of truth for the version installed on your machine.

```bash
loomloom --help
loomloom <command> --help
loomloom <command> <subcommand> --help
loomloom --version
```

For example:

```bash
loomloom run --help
loomloom run precheck --help
loomloom template-spec docs --help
```

## Global flags

| Flag | Default | Purpose |
| --- | --- | --- |
| `-s, --server <url>` | Configured server | Override the loomloom base URL for this invocation |
| `-t, --token <token>` | Configured token | Override the bearer token; prefer `LOOMLOOM_TOKEN` to avoid shell history exposure |
| `--timeout <duration>` | `30s` | Set the HTTP request timeout |
| `-o, --output <format>` | `text` | Select `text` or `json` |
| `-v, --verbose` | Off | Write request diagnostics to stderr |
| `-h, --help` | — | Show command help |
| `--version` | — | Show the installed version |

Global flags can be used with subcommands:

```bash
loomloom run list --output json --timeout 45s
```

## Authentication and Server profiles

```bash
# Browser login for either preset platform
loomloom login --server "https://loomloom.shengsuanyun.com/loom/v1"
loomloom login --server "https://loomloom.cogfoundry.ai/loom/v1"
loomloom login --server "https://loomloom.shengsuanyun.com/loom/v1" --no-browser

# Remove the active profile's saved browser credential
loomloom logout --output json

# Manage verified Servers
loomloom server list --output json
loomloom server use <name-or-server>
loomloom server remove <name-or-server>
```

Browser login is available for ShengSuanYun and CogFoundry. Custom Servers use an API Token verified through `doctor`.

## Staged execution commands

Programmatic official-template execution is intentionally separated into three commands:

```bash
loomloom run validate <template-id> --file rows.jsonl
loomloom run precheck <template-id> --file rows.jsonl
loomloom run execute <template-id> --file rows.jsonl \
  --client-request-id <id> \
  --callback-url <https-url>
```

`--callback-url` is optional. `run execute` does not replace the confirmation step in your application or agent. Run it only after the same input has been validated, prechecked, shown to the user with its estimate, and explicitly confirmed.

<Note>
  The old combined `run submit` command is legacy and hidden. New integrations should use `run validate`, `run precheck`, and `run execute`. `--idempotency-key` is a deprecated alias for `--client-request-id`.
</Note>

## TemplateSpec documentation language

```bash
loomloom template-spec docs [topic] --lang en|zh-CN
```

Available topics include `spec`, `authoring`, `examples`, `conversation`, `metadata`, `inputs`, `steps`, `bindings`, and `execution-units`; `all` prints the complete bundled set. Omit the topic to print the index. The `--lang` flag defaults to `en`; use `zh-CN` for Simplified Chinese.

For machine-to-machine chaining, use [JSON output](/developer-reference/loomloom-cli/output-formats) and preserve returned IDs exactly.
