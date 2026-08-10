---
title: Official Templates
description: Discover and execute platform-maintained LoomLoom templates through workbooks or row files.
icon: layout-template
---

Official templates are platform-maintained workflows. Discover them from the active environment instead of relying on a static list:

```bash
loomloom template list
loomloom template schema <template-id> --output json
```

The schema response is authoritative for field keys, labels, required inputs, accepted values, and the current template version.

## Workbook flow

```bash
loomloom template download <template-id> --output-file ./input.xlsx
# Fill and review the workbook.
loomloom template validate-file <template-id> ./input.xlsx
loomloom template precheck-file <template-id> ./input.xlsx
# Show the estimate and obtain explicit confirmation.
loomloom template submit-file <template-id> ./input.xlsx \
  --client-request-id <new-id>
```

`validate-file` and `precheck-file` do not create a run. `submit-file` does.

After submission:

```bash
loomloom run watch <run-id>
loomloom run result-workbook <run-id> --output-file ./result.xlsx
```

## Programmatic JSON or JSONL flow

Use the staged commands with the same unchanged input file:

```bash
loomloom run validate <template-id> --file ./rows.jsonl
loomloom run precheck <template-id> --file ./rows.jsonl
# Show the estimate and obtain explicit confirmation.
loomloom run execute <template-id> --file ./rows.jsonl \
  --client-request-id <new-id> \
  --callback-url <https-url>
```

The file may be a JSON array or JSONL. The CLI reads the template schema and maps accepted field keys or workbook header labels before validation.

<Warning>
  Do not skip from `validate` to `execute`. If the file changes after precheck or confirmation, validate and precheck it again, show the new estimate, and obtain a new confirmation.
</Warning>

`--callback-url` is optional. Treat callback endpoints as sensitive integration configuration and use HTTPS. `run execute` creates the run and returns its `runId`.

The former combined `run submit` command is legacy and hidden. Use `--client-request-id` for new integrations; `--idempotency-key` remains only as a deprecated compatibility alias.

## Legacy backfill

Prefer the server-generated result workbook. Use local backfill only when maintaining an older workflow:

```bash
loomloom template backfill-results <run-id> ./input.xlsx \
  --output-file ./backfilled.xlsx
```

See [Runs](/developer-reference/loomloom-cli/runs) for monitoring and [Money units](/developer-reference/loomloom-cli/money-units) for the confirmation contract.
