---
title: Runs
description: Create, list, monitor, and inspect loomloom workflow runs.
icon: activity
---

A `runId` identifies one hosted workflow execution. Preserve it exactly from an official-template, private-template, or Market submission response.

## Create an official-template run from rows

The CLI separates preparation from execution:

```bash
loomloom run validate <template-id> --file ./rows.jsonl
loomloom run precheck <template-id> --file ./rows.jsonl
# Show the estimate and wait for explicit confirmation.
loomloom run execute <template-id> --file ./rows.jsonl \
  --client-request-id <new-id> \
  --callback-url <https-url>
```

`--callback-url` is optional. `run execute` creates the run and returns its `runId`. It is the current command for new integrations; the older combined `run submit` flow is legacy and hidden.

Use `--client-request-id` for retry safety. `--idempotency-key` is retained only as a deprecated compatibility alias and should not be used in new scripts.

## List and inspect

```bash
loomloom run list
loomloom run list --status running --page-size 20 --output json
loomloom run get <run-id> --output json
```

`run list` supports `--status`, `--page-size`, `--page-token`, and ordering by `createdAt` or `updatedAt` in ascending or descending order.

## Watch progress

```bash
loomloom run watch <run-id>
loomloom run watch <run-id> --interval 10s --max-wait 30m
```

Without `--max-wait`, watch continues until a terminal status. Recognized terminal statuses are `completed`, `failed`, `partially_failed`, and `cancelled`/`canceled`.

## Read results

```bash
loomloom run result-rows <run-id> --page-size 50
loomloom run result-workbook <run-id> --output-file ./result.xlsx
```

`result-rows` joins persisted input snapshots with row results and supports page tokens. `result-workbook` downloads the server-generated workbook containing original inputs and results.

<Tip>
  Prefer `result-workbook` for workbook workflows. It is generated from the server-side input snapshot and result data.
</Tip>

Do not construct a console URL from a `runId`; no stable run-detail URL format is published. Use the CLI unless the service explicitly returns a URL.

## Retry safely

After an ambiguous execution failure, query the run or related usage record before retrying. Reuse the original `--client-request-id` only for the identical confirmed payload. A changed input or new confirmation requires a new ID.
