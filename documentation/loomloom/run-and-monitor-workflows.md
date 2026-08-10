---
title: Run and monitor workflows
description: Track a LoomLoom run from submission through its terminal status.
icon: activity
---

Each submitted workflow returns a run ID. Preserve it exactly: the ID connects monitoring, row results, result workbooks, and artifacts to the same execution.

## Monitor a run

```bash
loomloom run watch <run-id>
```

`watch` polls until the run reaches a terminal status. Use `get` for one snapshot or `list` to find recent runs:

```bash
loomloom run get <run-id>
loomloom run list
```

There is no documented URL pattern for a LoomLoom run detail page. Do not construct one from the run ID; use the CLI unless the service explicitly returns a URL.

## Run statuses

| Status | Meaning |
| --- | --- |
| `pending` or `queued` | Accepted and waiting to execute |
| `running` | Execution is in progress |
| `completed` | All rows completed successfully |
| `partially_failed` | Some rows failed; partial results may be available |
| `failed` | The run failed completely |
| `cancelled` | The run was cancelled |

## Retrieve results

```bash
loomloom run result-rows <run-id>
loomloom run result-workbook <run-id> --output-file ./result.xlsx
loomloom artifact list <run-id>
loomloom artifact download <run-id> --output-dir ./artifacts
```

See [Artifacts and results](/documentation/loomloom/artifacts-and-results) for the differences between these outputs.

## Advanced JSON or JSONL submission

For programmatic official-template input, the CLI separates validation, cost estimation, and execution:

```bash
loomloom run validate <template-id> -f ./rows.jsonl
loomloom run precheck <template-id> -f ./rows.jsonl
# Review the estimate and explicitly confirm before continuing.
loomloom run execute <template-id> -f ./rows.jsonl \
  --client-request-id <stable-id>
```

`validate` and `precheck` do not create a hosted run. `execute` creates the run, returns its `runId`, and must only be used for the same unchanged input after the current estimate is explicitly approved. Add `--callback-url <https-url>` when an HTTPS callback is required. Prefer the workbook flow unless you specifically need programmatic input.

The former combined `run submit` command is legacy and hidden. `--idempotency-key` remains available only as a deprecated alias for `--client-request-id`.

<Note>
  Confirm command syntax with the help output from your installed CLI.
</Note>

<Warning>
  Do not blindly retry a submission after a timeout or ambiguous error. First inspect recent runs and related usage. Reuse the same client request ID only for an identical payload.
</Warning>
