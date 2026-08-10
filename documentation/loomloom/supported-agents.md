---
title: Supported agents
description: Use LoomLoom with Codex, Claude Code, OpenClaw, or directly from the CLI.
icon: bot
---

LoomLoom currently provides integration packages for three agents.

| Agent | Installer value | Status |
| --- | --- | --- |
| Codex | `codex` | Supported |
| Claude Code | `claude` | Supported |
| OpenClaw | `openclaw` | Supported |

The default installation targets Codex. Select a different package with the installer's `--agent` option on macOS or Linux, or `-Agent` on Windows.

## Agent integration is optional

The LoomLoom CLI can be used without an AI agent. Each integration is packaged as a small core Skill plus focused reference modules. The agent loads the relevant setup, execution, billing, TemplateSpec, Market, local-Skill, or CLI guidance for the current intent.

Together, those modules help the agent:

- choose the appropriate official, private, or Market workflow;
- collect structured input without exposing unnecessary implementation details;
- validate and estimate before execution;
- ask for explicit confirmation before a paid run or remote state change;
- preserve returned IDs when commands are chained.

They do not move hosted execution logic, credentials, or private SkillBot instructions into the agent. The modular package changes how guidance is organized, not which agents are supported.

## Install a workflow as a local Agent Skill

LoomLoom can also generate a local Skill wrapper for a specific private template version or Market SkillBot. This is separate from installing the main LoomLoom integration package.

The wrapper records how to collect inputs and invoke LoomLoom, but it does not execute the workflow during installation. Every later paid run still requires a current estimate and explicit confirmation.

See [SkillBots and Market](/documentation/loomloom/skillbots-and-market) for the supported flow.
