---
title: Output Formats
description: Choose human-readable or machine-readable LoomLoom CLI output.
icon: braces
---

The global `--output` flag accepts `text` or `json`.

```bash
loomloom template list --output text
loomloom template list --output json
```

## Text output

Text is the default and is intended for terminal use. Commands generally use readable tables or tab-separated key/value lines. Monetary values are formatted with a currency when the service returns one.

## JSON output

Use JSON when another command, script, or agent consumes the result:

```bash
loomloom template list --output json
loomloom run get <run-id> --output json
```

Preserve opaque identifiers such as `runId`, `inputFileId`, `reviewRequestId`, and `runTransactionId` exactly. Do not derive an ID from a display name or convert one ID type into another.

JSON retains backend monetary fields such as `estimatedTotalCostT` and any structured money object returned by the service, such as `estimatedTotalCost: { amount, currency }`. Preserve both rather than recomputing or locally converting amounts; see [Money units](/developer-reference/loomloom-cli/money-units).

## stdout and stderr

- Normal command results are written to stdout.
- Errors, generated `clientRequestId` notices, deprecation notices, and `--verbose` diagnostics are written to stderr.
- A non-zero exit status indicates an error, even if stdout contains partial validation context.

<Warning>
  JSON results may include temporary signed artifact URLs. Do not store those URLs in long-lived logs or documentation. Prefer `run result-workbook` or `artifact download` for file retrieval.
</Warning>

See [Exit codes](/developer-reference/loomloom-cli/exit-codes) for process-status behavior.
