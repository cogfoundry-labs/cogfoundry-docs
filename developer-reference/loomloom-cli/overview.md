---
title: LoomLoom CLI
description: Command-line reference for installing, configuring, and using LoomLoom.
icon: terminal
---

<Note>
  This reference covers LoomLoom `v0.2.1`. Use `loomloom <command> --help` as the syntax source of truth for your installed version.
</Note>

The LoomLoom CLI connects local files and developer tools to hosted LoomLoom workflows. It supports browser or API Token authentication, verified Server profiles, official templates, private TemplateSpec versions, Market SkillBots, run monitoring, and result retrieval.

This reference documents the currently implemented CLI behavior.

## Start here

1. [Install LoomLoom](/documentation/loomloom/installation).
2. [Choose a platform and authenticate](/developer-reference/loomloom-cli/authentication).
3. Verify the active environment:

```bash
loomloom doctor --output json
```

4. Discover official templates:

```bash
loomloom template list
loomloom template schema <template-id> --output json
```

## Command map

| Goal | Command group | Reference |
| --- | --- | --- |
| Check configuration | `doctor` | [Doctor](/developer-reference/loomloom-cli/doctor) |
| Authenticate and switch environments | `login`, `logout`, `server` | [Authentication](/developer-reference/loomloom-cli/authentication) and [Server profiles](/developer-reference/loomloom-cli/server-profiles) |
| Upload input material | `input-asset`, `orchestration-input` | [Input assets](/developer-reference/loomloom-cli/input-assets) |
| Use platform-maintained workflows | `template`, `run` | [Official templates](/developer-reference/loomloom-cli/official-templates) |
| Author private workflows | `template-spec` | [Private templates](/developer-reference/loomloom-cli/private-templates) |
| Monitor execution | `run` | [Runs](/developer-reference/loomloom-cli/runs) |
| Retrieve generated files | `artifact`, `run result-workbook` | [Artifacts](/developer-reference/loomloom-cli/artifacts) |
| Discover executable models and assets | `model`, `asset` | [Models and assets](/developer-reference/loomloom-cli/models-and-assets) |
| Use or publish SkillBots | `market`, `listing`, `creator`, `usage` | [Market for users](/developer-reference/loomloom-cli/market-for-users) |
| Install a template wrapper into an agent | `skill` | [Local Agent Skills](/developer-reference/loomloom-cli/local-agent-skills) |

<Info>
  The supported agents are Codex, Claude Code, and OpenClaw.
</Info>

## Safe execution contract

Validation, precheck, and quote commands do not create a hosted run. Before any paid execution, show the current server-provided estimate and obtain explicit confirmation. If input changes, validate, estimate, and confirm again.

Use a new `--client-request-id` for each newly confirmed execution. Reuse it only when retrying the identical payload after an ambiguous failure.
