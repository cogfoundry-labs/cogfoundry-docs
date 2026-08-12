---
title: Product Map
description: The currently documented CogFoundry product surface and where to find each workflow.
icon: map
---

The public documentation follows the loomloom compiler and execution lifecycle.

```text
CogFoundry
└── loomloom
    ├── loomloom CLI
    ├── SkillCompiler
    ├── Reusable AI work IR (TemplateSpec)
    ├── SkillBots and Market
    └── Execution platform
        ├── Official and private templates
        ├── Models and executable assets
        └── Runs, results, and artifacts
```

## Available product surfaces

| Surface | What users can do | Documentation |
| --- | --- | --- |
| loomloom CLI | Define, compile, execute, inspect, package, and manage AI work. | [loomloom CLI](/developer-reference/loomloom-cli/overview) |
| Reusable AI work IR | Define typed inputs, steps, dependencies, model use, and outputs with TemplateSpec. | [Create reusable AI work IR](/documentation/loomloom/private-templates) |
| Execution platform | Discover official templates, run versioned private templates, select supported models, monitor runs, and retrieve results. | [Official templates](/documentation/loomloom/official-templates), [Supported models](/documentation/loomloom/supported-models), [Run and monitor workflows](/documentation/loomloom/run-and-monitor-workflows) |
| SkillBots and Market | Package a private-template snapshot as a reviewed modular AI system, or discover and run approved SkillBots. | [Build and use SkillBots](/documentation/loomloom/skillbots-and-market) |
| Local Agent Skills | Install a local wrapper for Codex, Claude Code, or OpenClaw without copying server-side workflow logic. | [Local Agent Skills](/developer-reference/loomloom-cli/local-agent-skills) |
| HTTP API | Integrate templates, SkillBots, runs, and results programmatically. | [loomloom API](/developer-reference/loomloom-api/overview) |

## What is not represented as a separate product

**Supported Models** is a loomloom capability. Model availability is tied to the active environment and should be verified through the CLI before authoring or running a workflow.
