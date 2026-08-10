---
title: Core Concepts
description: The objects and terms used throughout CogFoundry and LoomLoom documentation.
icon: boxes
---

## Platform concepts

### AI Workload

The smallest production unit that can contain multiple model calls, API calls, tool executions, or workflow steps.

### LoomLoom

An AI work compiler and runtime. LoomLoom turns AI work into reusable intermediate representation, compiles it for execution, and returns observable runs, result rows, workbooks, and artifacts.

### Reusable AI work IR

The typed intermediate representation of a LoomLoom workflow: inputs, steps, dependencies, execution policies, model use, and expected outputs. TemplateSpec is the source format used to define private AI work IR.

### SkillCompiler

The reference compiler integrated into the LoomLoom CLI. It transforms AI work into reusable IR and a compiled execution system.

## LoomLoom workflow objects

```text
Official template ── platform-maintained and executed directly

Private template ── created and versioned by a user with TemplateSpec
   └─ Private template version
        └─ Submitted to the Market for review
             └─ Listing Version (immutable publication snapshot)
                  └─ Executed by buyers as a SkillBot
```

| Term | Meaning |
| --- | --- |
| Template | A reusable AI work IR definition. |
| Official template | A platform-maintained workflow discovered through `loomloom template list`. |
| Private template | A user-owned workflow created with TemplateSpec. Changes create a new immutable version. |
| SkillBot | A deployable, modular AI system packaged from an approved immutable private-template snapshot. |
| Listing | The Market object through which a SkillBot is published, priced, discovered, and run. |
| Run | A recorded execution against structured input. One run may contain multiple input rows. |
| Result workbook | A server-generated workbook aligning submitted rows with outputs and errors. |
| Artifact | A generated file such as an image, video, or document associated with a run. |
| Model | A currently available text, image, or video generation model referenced by its model ID. |

## Inputs

- **Workbook input** is the default user experience for official templates, private templates, and Market SkillBots.
- **JSON or JSONL input** is available for programmatic CLI workflows.
- **Input assets** are reference files used inside template fields. They are not row-data files.
- **Orchestration inputs** contain JSONL rows for private-template execution. Their IDs cannot be substituted for input-asset IDs.

## Preparation and execution

Validation, uploads, downloads, schema inspection, model lookup, quoting, and prechecks prepare a workflow. They do not start a paid run.

An execution command creates a hosted run. Review the current estimate and explicitly confirm each execution. A previous confirmation does not apply to changed input, a different template, or a later run.

<Card title="Learn the template types" icon="layout-template" href="/documentation/loomloom/templates">
  Choose between an official template, a private template, and a Market SkillBot.
</Card>
