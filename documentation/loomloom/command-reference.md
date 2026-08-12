---
title: Command reference
description: Find the loomloom CLI command group for each user workflow.
icon: terminal
---

<Note>
  Use `loomloom <command> --help` as the syntax source of truth for your installed version.
</Note>

| Goal | Command group | Developer reference |
| --- | --- | --- |
| Check configuration | `loomloom doctor` | [Doctor](/developer-reference/loomloom-cli/doctor) |
| Log in or manage environments | `login`, `logout`, `server` | [Authentication](/developer-reference/loomloom-cli/authentication) and [Server profiles](/developer-reference/loomloom-cli/server-profiles) |
| Upload reference material or JSONL rows | `input-asset`, `orchestration-input` | [Input assets](/developer-reference/loomloom-cli/input-assets) |
| Discover and run official templates | `template`, `run` | [Official templates](/developer-reference/loomloom-cli/official-templates) |
| Create and run private templates | `template-spec` | [Private templates](/developer-reference/loomloom-cli/private-templates) |
| Monitor execution | `run` | [Runs](/developer-reference/loomloom-cli/runs) |
| Retrieve generated files | `artifact` | [Artifacts](/developer-reference/loomloom-cli/artifacts) |
| Inspect models and executable assets | `model`, `asset` | [Models and assets](/developer-reference/loomloom-cli/models-and-assets) |
| Install a workflow as a local Agent Skill | `skill` | [Local Agent Skills](/developer-reference/loomloom-cli/local-agent-skills) |
| Browse and run SkillBots | `market`, `usage` | [Market for users](/developer-reference/loomloom-cli/market-for-users) |
| Publish and manage SkillBots | `listing`, `creator` | [Market for creators](/developer-reference/loomloom-cli/market-for-creators) |

## Global options

Global flags apply across command groups. Inspect the installed CLI for the complete current set:

```bash
loomloom --help
loomloom <command> --help
```

Use `--output json` when another command or program consumes the response, and preserve returned IDs exactly. Default text output is intended for people.

## Official programmatic input

The CLI separates the official-template JSON/JSONL flow so the estimate can be reviewed before execution:

```bash
loomloom run validate <template-id> -f <rows.json-or-jsonl>
loomloom run precheck <template-id> -f <rows.json-or-jsonl>
# Explicitly confirm the current estimate before continuing.
loomloom run execute <template-id> -f <rows.json-or-jsonl> \
  --client-request-id <stable-id>
```

| Command | Behavior |
| --- | --- |
| `run validate` | Validates JSON or JSONL input without creating a run |
| `run precheck` | Estimates cost and checks balance without creating a run |
| `run execute` | Creates the run and returns its `runId` |

`run execute` optionally accepts `--callback-url <https-url>`. Use `--client-request-id` for safe retries; `--idempotency-key` remains only as a deprecated compatibility alias. The former combined `run submit` command is legacy and hidden, so new integrations must use the staged flow.

## Built-in TemplateSpec documentation

Choose a bundled topic and language explicitly when needed:

```bash
loomloom template-spec docs [topic] --lang en
loomloom template-spec docs [topic] --lang zh-CN
```

Topics include `spec`, `authoring`, `examples`, `conversation`, `metadata`, `inputs`, `steps`, `bindings`, and `execution-units`; use `all` for the complete set or omit the topic to print the index. The default language is English.

For Excel input, continue to use `template validate-file → template precheck-file → confirm → template submit-file`.

## Safety boundary

Discovery, downloads, uploads, validation, precheck, and quote are preparation steps. Commands that create a hosted run or change remote resources require explicit confirmation after the user has seen the current action and, for a run, its fee estimate.

See the complete [loomloom CLI developer reference](/developer-reference/loomloom-cli/overview).
