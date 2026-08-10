---
title: Private Templates and TemplateSpec
description: Author, version, validate, and execute private LoomLoom workflows.
icon: workflow
---

A private template is a user-owned workflow authored with TemplateSpec. Each version is immutable; execution must bind to an explicit `template_id` and `version_id`.

## Read the bundled contract

The installed CLI carries the matching English and Chinese TemplateSpec documentation:

```bash
loomloom template-spec docs --lang en
loomloom template-spec docs spec --lang en
loomloom template-spec docs authoring --lang en
loomloom template-spec docs examples --lang en
loomloom template-spec docs spec --lang zh-CN
```

The syntax is `loomloom template-spec docs [topic] --lang en|zh-CN`. Topics include `spec`, `authoring`, `examples`, `conversation`, `metadata`, `inputs`, `steps`, `bindings`, and `execution-units`; use `all` for the complete set or omit the topic to print the index. English is the default language. The index reports spec and language revisions. Prefer these bundled documents over copied examples from another release.

## Check, create, and version

```bash
loomloom template-spec models text-generate
loomloom template-spec check ./template.json
# Describe the remote creation and obtain explicit confirmation.
loomloom template-spec create ./template.json --version-note "Initial version"
```

Append an immutable version instead of editing history:

```bash
loomloom template-spec create-version <template-id> ./template.json \
  --version-note "Updated workflow"
```

`check` is a local authoring validation step; the service can still reject an unavailable model or an environment-specific rule. `create` and `create-version` change remote state and require a separate, explicit confirmation when operated by an agent.

## Topology rule: TS-TOPOLOGY-001

New templates, new versions, and Market publication cannot use `bindMode=expanded` in `fieldBindings` or `paramBindings`.

- Use one workbook row per independently processed item.
- For a fixed number of parallel branches, declare multiple explicit steps and connect them with `dependsOn` and `upstreamBindings`.
- `multiValue=true` represents an ordered collection passed to a compatible input; it does not create dynamic executions.
- TemplateSpec v1 does not support dynamic-cardinality step fan-out.

Historical versions that already use expanded execution remain compatible for execution. The restriction applies to new authoring and publication; do not rewrite historical versions in place.

## Execute with a workbook

```bash
loomloom template-spec download-workbook <template-id> <version-id> \
  --output-file ./input.xlsx
loomloom template-spec validate-workbook <template-id> <version-id> ./input.xlsx
loomloom template-spec precheck-workbook <template-id> <version-id> ./input.xlsx
# Show the estimate and obtain explicit confirmation.
loomloom template-spec submit-workbook <template-id> <version-id> ./input.xlsx \
  --client-request-id <new-id>
```

Download a new workbook when the template version changes. Compatibility with a workbook generated for another version is not promised.

## Execute with JSONL

```bash
loomloom orchestration-input upload ./rows.jsonl --output json
loomloom template-spec precheck <template-id> \
  --version-id <version-id> \
  --input-file-id <input-file-id>
# Show the estimate and obtain explicit confirmation.
loomloom template-spec run <template-id> \
  --version-id <version-id> \
  --input-file-id <input-file-id> \
  --client-request-id <new-id>
```

Never guess step IDs or substitute an `inputAssetId` for `inputFileId`. See [Input assets](/developer-reference/loomloom-cli/input-assets) for the distinction.
