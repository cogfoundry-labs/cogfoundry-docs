---
title: What is CogFoundry
description: CogFoundry's product position and the capabilities documented today.
icon: factory
---

CogFoundry is an **AI Workload production system**. Its focus is the production capability around AI execution: turning repeatable work into controlled workflows that can be run, observed, and reused.

An **AI Workload** is the smallest production unit that may contain model calls, API calls, tool execution, and multiple workflow steps. This documentation uses that term consistently instead of treating every operation as an isolated prompt.

## What is available in this documentation

The current public product surface centers on **LoomLoom**:

- compile AI work into reusable intermediate representation;
- package approved compiled systems as modular SkillBots;
- run platform-maintained official templates;
- create and version private templates with TemplateSpec;
- use Excel workbooks as the default structured input experience;
- submit JSON or JSONL through the CLI where supported;
- monitor runs and retrieve result workbooks and generated artifacts;
- discover, run, publish, and manage Market SkillBots;
- install a SkillBot or private template version as a local Agent Skill wrapper;
- select from the models currently available for text, image, and video generation.

Execution is performed by the configured remote LoomLoom service. LoomLoom `v0.2.1` includes preset Server profiles for ShengSuanYun and CogFoundry, and can register a compatible custom Server after verification. The CLI and Agent Skill packages act as local clients for the selected hosted execution service.

## Product principles

| Principle | What it means in the current product |
| --- | --- |
| Production First | Workflows are structured, validated, estimated, executed, and returned as traceable results. |
| Developer Centric | The CLI, HTTP API, and Agent integrations expose inspectable commands, contracts, and machine-readable output. |
| Transparent Infrastructure | Users choose the server, inspect inputs, review estimates, and explicitly confirm paid execution. |
| Responsible execution | Credentials, Customer Content, billing, and remote state changes have explicit safety boundaries. |

<Note>
  This site documents capabilities that can be verified through the current LoomLoom command or service workflow.
</Note>

<Card title="See the current product map" icon="map" href="/documentation/overview/product-map">
  Review how LoomLoom, templates, models, runs, artifacts, and the Market fit together.
</Card>
