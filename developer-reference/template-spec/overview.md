---
title: TemplateSpec
description: Define reusable AI work IR with typed inputs, steps, dependencies, models, and outputs.
icon: blocks
---

TemplateSpec is the source format used to define a private loomloom template. The resulting template is reusable AI work IR: an immutable, inspectable definition of the inputs, execution steps, dependencies, models, and expected outputs required to produce an outcome.

## Start with the version shipped in the CLI

```bash
loomloom template-spec docs
loomloom template-spec docs spec
loomloom template-spec docs examples
loomloom template-spec docs conversation
```

The bundled manual matches the installed CLI and is available in English and Simplified Chinese:

```bash
loomloom template-spec docs spec --lang en
loomloom template-spec docs spec --lang zh-CN
```

## Authoring path

```text
describe the outcome → review the TemplatePlan → generate TemplateSpec
→ check locally → confirm creation → create an immutable version
```

Before selecting a default model, query the active environment:

```bash
loomloom template-spec models <text-generate|image-generate|video-generate>
loomloom template-spec check ./template.spec.json
```

Creating a template or adding a version changes remote state and requires explicit confirmation. Existing versions are immutable.

## Current topology boundary

New templates and versions must not use `bindMode=expanded`. Put dynamic independent items on separate workbook rows. Model a fixed number of parallel branches as separate steps connected through `dependsOn` and `upstreamBindings`.

<Card title="Read the source manual" icon="github" href="https://github.com/cogfoundry-labs/loomloom/tree/main/docs/template-spec/en">
  Browse the English TemplateSpec manual maintained with the loomloom source.
</Card>

<Card title="Create reusable AI work IR" icon="workflow" href="/documentation/loomloom/private-templates">
  Follow the product guide for planning, checking, creating, versioning, and running a private template.
</Card>
