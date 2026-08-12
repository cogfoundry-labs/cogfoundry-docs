---
title: Official templates
description: Discover and run CogFoundry-maintained loomloom workflows.
icon: badge-check
---

Official templates are CogFoundry-maintained workflows intended to provide the shortest path from structured input to a repeatable result.

## Discover what is available

```bash
loomloom template list
```

Availability can vary by environment and permission. Treat this command as the source of truth rather than relying on a static catalog.

The current repository documents these template IDs as common examples. Confirm each one against the configured service before use:

| Template ID | Intended workflow |
| --- | --- |
| `prd-four-perspective-review-v1` | Review one PRD from four perspectives |
| `text-v1` | Generate or transform text from structured instructions |
| `text-image-v1` | Generate images from text prompts and style settings |
| `text-image-video-v1` | Generate image and video outputs from scene inputs |

If an ID does not appear in `template list`, it is not available to your current environment.

## Inspect the current schema

```bash
loomloom template schema <template-id>
loomloom template schema <template-id> --output json
```

The schema is the authoritative definition of:

- required and optional fields;
- exact field keys and labels;
- allowed values and examples;
- the current template version.

## Recommended workbook flow

```bash
loomloom template download <template-id> --output-file ./input.xlsx
loomloom template validate-file <template-id> ./input.xlsx
loomloom template precheck-file <template-id> ./input.xlsx
# Review the estimate and explicitly confirm before continuing.
loomloom template submit-file <template-id> ./input.xlsx \
  --client-request-id <stable-id>
```

After submission, keep the returned run ID and use the [run and result commands](/documentation/loomloom/run-and-monitor-workflows).

<Warning>
  Download a fresh workbook when the template schema changes. Do not assume an older workbook remains compatible with the currently available template version.
</Warning>

## Programmatic JSON or JSONL flow

For programmatic input, keep validation, estimation, and execution separate:

```bash
loomloom run validate <template-id> --file ./rows.jsonl
loomloom run precheck <template-id> --file ./rows.jsonl
# Review the estimate and explicitly confirm before continuing.
loomloom run execute <template-id> --file ./rows.jsonl \
  --client-request-id <stable-id>
```

`validate` and `precheck` do not create a run. `execute` creates the run and returns its `runId`. It also accepts an optional `--callback-url <https-url>`.

<Note>
  The former combined `run submit` command is legacy and hidden. Use `run validate`, `run precheck`, and `run execute` for new integrations. `--idempotency-key` remains a deprecated alias for `--client-request-id` and should not be used in new scripts.
</Note>
