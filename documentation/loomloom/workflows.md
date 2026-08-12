---
title: loomloom workflows
description: Follow the supported end-to-end paths for official templates, reusable AI work IR, and SkillBots.
icon: route
---

loomloom supports five primary workflows. Each one uses the active verified Server profile and preserves the separation between preparation and execution.

If more than one profile exists, select the intended environment first:

```bash
loomloom server list
loomloom server use <name-or-server>
loomloom doctor --output json
```

## Run an official template from Excel

```bash
loomloom template list
loomloom template download <template-id> --output-file ./input.xlsx
# Fill the downloaded workbook without changing its structure.
loomloom template validate-file <template-id> ./input.xlsx
loomloom template precheck-file <template-id> ./input.xlsx
# Review the estimate and confirm before submitting.
loomloom template submit-file <template-id> ./input.xlsx \
  --client-request-id <client-request-id>
loomloom run watch <run-id>
loomloom run result-workbook <run-id> --output-file ./result.xlsx
```

## Run an official template with programmatic rows

Use this path only for an explicit JSON or JSONL integration:

```bash
loomloom run validate <template-id> --file ./rows.jsonl
loomloom run precheck <template-id> --file ./rows.jsonl
# Review the estimate and confirm before executing.
loomloom run execute <template-id> --file ./rows.jsonl \
  --client-request-id <client-request-id>
```

## Create and run reusable AI work IR

```bash
loomloom template-spec models text-generate
loomloom template-spec check ./template.spec.json
# Confirm before creating the remote template.
loomloom template-spec create ./template.spec.json --version-note "initial version"
loomloom template-spec download-workbook <template-id> <version-id> \
  --output-file ./input.xlsx
loomloom template-spec validate-workbook <template-id> <version-id> ./input.xlsx
loomloom template-spec precheck-workbook <template-id> <version-id> ./input.xlsx
# Review the estimate and confirm before submitting.
loomloom template-spec submit-workbook <template-id> <version-id> ./input.xlsx \
  --client-request-id <client-request-id>
```

## Publish a private template as a SkillBot

A private template version must have at least one successful run before publication:

```bash
# Confirm before submitting the Listing for review.
loomloom listing publish <template-id> \
  --template-version-id <version-id> \
  --display-name "My SkillBot" \
  --task-fixed-fee 0.1
loomloom creator review list
```

## Discover and run a SkillBot

```bash
loomloom market list --keyword "example"
loomloom market show <listing-id>
loomloom market workbook download <listing-id> --output-file ./input.xlsx
loomloom market workbook validate <listing-id> --file ./input.xlsx
loomloom market workbook quote <listing-id> --file ./input.xlsx
# Review the quote and confirm before the paid run.
loomloom market workbook run <listing-id> --file ./input.xlsx \
  --confirm \
  --client-request-id <client-request-id>
```

<Warning>
  Use a new client request ID for every newly confirmed execution. Reuse one only when retrying the identical confirmed request after an ambiguous failure.
</Warning>

Continue with [Create reusable AI work IR](/documentation/loomloom/private-templates), [Build and use SkillBots](/documentation/loomloom/skillbots-and-market), or the [CLI reference](/developer-reference/loomloom-cli/overview).
