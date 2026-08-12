---
title: loomloom overview
description: Compile, package, execute, and manage AI work as reusable software.
icon: workflow
---

loomloom is an **AI work compiler and runtime**. It enables developers and AI agents to define the inputs, logic, capabilities, and expected outputs required to produce an outcome, then compile that work into reusable AI systems.

AI work can range from a prompt or skill to a multi-step system containing instructions, tools, workflows, and generated artifacts. loomloom provides the toolchain to version, execute, maintain, and distribute it like software.

<Columns cols={3}>
  <Card title="AI work IR" icon="blocks" href="/documentation/loomloom/private-templates">
    Define typed inputs, steps, dependencies, models, and outputs in a reusable template.
  </Card>
  <Card title="SkillBots" icon="bot" href="/documentation/loomloom/skillbots-and-market">
    Package a compiled template version as a deployable, modular AI system.
  </Card>
  <Card title="Execution" icon="activity" href="/documentation/loomloom/workflows">
    Validate, estimate, confirm, run, monitor, and retrieve observable results.
  </Card>
</Columns>

## How loomloom works

loomloom applies a compiler-style pipeline to AI work:

```text
AI work
  → reusable AI work IR (TemplateSpec)
  → optimized execution plan
  → compiled AI system
  → SkillBot or direct execution
  → observable run, results, and artifacts
```

## Components

| Component | Role |
| --- | --- |
| loomloom CLI | Developer interface for defining, compiling, executing, debugging, packaging, and managing AI work. |
| Reusable AI work IR | Typed intermediate representation of workflow steps, dependencies, execution policies, model use, and expected outputs. |
| SkillCompiler | Reference compiler that transforms AI work into reusable IR and an executable system. |
| SkillBot | Deployable, modular AI system packaged from an immutable execution snapshot. |
| Execution platform | Managed runtime that executes compiled systems with observable state, safe parallelism, retries, artifacts, metering, and settlement. |

## Current public workflows

- Run official templates maintained by the selected execution environment.
- Create immutable private template versions with TemplateSpec.
- Use workbooks by default or explicit JSON/JSONL input for programmatic integrations.
- Monitor runs and retrieve result rows, result workbooks, and generated artifacts.
- Publish a proven private version as a SkillBot or call an approved SkillBot from the Market.
- Install a private template or Market SkillBot as a local Agent Skill wrapper for Codex, Claude Code, or OpenClaw.

<Note>
  loomloom is currently in beta. Implemented behavior is documented here; architecture and design details may continue to evolve through public releases.
</Note>

The CLI can be used directly. Agent integrations add guided planning, input collection, and confirmation around the same deterministic commands.

## Start here

1. [Install loomloom](/documentation/loomloom/installation).
2. [Configure your credentials](/documentation/loomloom/configure-credentials).
3. Complete the [Quick Start](/documentation/loomloom/quick-start) or browse the [main workflows](/documentation/loomloom/workflows).
4. Review [Security Notes](/documentation/loomloom/security-notes) before using production data.
