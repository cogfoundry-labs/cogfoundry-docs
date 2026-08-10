---
title: Create reusable AI work IR
description: Define, check, create, version, and execute private AI work IR with TemplateSpec.
icon: file-code-2
---

A private template is reusable AI work IR that you create and maintain. Its source definition is a TemplateSpec JSON file, and each change becomes a new immutable version.

Use a private template when an official template does not match your input fields, workflow steps, dependencies, model requirements, or outputs.

## Plan before compiling

Describe the intended outcome in business terms, including what one workbook row represents, required inputs, workflow steps, visible intermediate results, final outputs, and failure behavior. Review that TemplatePlan before generating TemplateSpec.

```text
describe the outcome → review the TemplatePlan → generate TemplateSpec
→ check locally → confirm creation → create an immutable version
```

## Author safely

Start with the documentation bundled with your installed CLI:

```bash
loomloom template-spec docs spec --lang en
loomloom template-spec docs authoring --lang en
loomloom template-spec docs examples --lang en
loomloom template-spec docs spec --lang zh-CN
loomloom template-spec models <text-generate|image-generate|video-generate>
```

The command syntax is `loomloom template-spec docs [topic] --lang en|zh-CN`. In addition to the main `spec`, `authoring`, and `examples` entries, focused topics cover metadata, inputs, steps, bindings, and execution units. Omit the topic to print the index; use `all` to print every bundled topic. English is the default language. The installed modular Agent Skill contains the current conversational authoring protocol, while the `conversation` topic remains available as a compatibility entry.

Validate the definition locally before creating anything remotely:

```bash
loomloom template-spec check ./template.spec.json
```

Creation changes remote state. Review the template name, purpose, and local check result, then explicitly confirm before creating it.

```bash
loomloom template-spec create ./template.spec.json --version-note "initial version"
```

When the workflow changes, append a version instead of changing historical versions in place:

```bash
loomloom template-spec create-version <template-id> ./template.spec.json
```

## Topology rule for new authoring

New templates, new versions, and new publication flows must not use `bindMode=expanded`. The authoring gate rejects it with `TS-TOPOLOGY-001`.

- Put independently processed dynamic items on separate workbook rows.
- For a fixed number of parallel branches, declare multiple steps.
- Connect fixed steps with `dependsOn` and `upstreamBindings`.
- Do not add invented `parallel` or `branch` properties.

Historical versions that already contain `expanded` remain readable, precheckable, and executable for compatibility. This does not make `expanded` valid for new authoring or for switching another historical version into the published position.

## Run a fixed version from a workbook

```bash
loomloom template-spec download-workbook <template-id> <version-id> \
  --output-file ./input.xlsx
loomloom template-spec validate-workbook <template-id> <version-id> ./input.xlsx
loomloom template-spec precheck-workbook <template-id> <version-id> ./input.xlsx
# Review the estimate and explicitly confirm before continuing.
loomloom template-spec submit-workbook <template-id> <version-id> ./input.xlsx \
  --client-request-id <stable-id>
```

TemplateSpec JSON is the source of truth; a downloaded workbook is derived from one template version. Download a new workbook after changing versions.

## Programmatic row input

For an explicit JSONL integration, upload row data separately, precheck the fixed version, and run only after confirmation:

```bash
loomloom orchestration-input upload ./rows.jsonl
loomloom template-spec precheck <template-id> \
  --version-id <version-id> \
  --input-file-id <input-file-id>
loomloom template-spec run <template-id> \
  --version-id <version-id> \
  --input-file-id <input-file-id> \
  --client-request-id <stable-id>
```

<Warning>
  An `input_asset_id` references material inside one workflow input. It is not the `input_file_id` used to supply JSONL rows. Preserve each returned ID exactly and never guess a hidden step ID.
</Warning>
