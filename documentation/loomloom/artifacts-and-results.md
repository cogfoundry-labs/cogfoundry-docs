---
title: Artifacts and results
description: Retrieve row results, result workbooks, and generated files from a loomloom run.
icon: package-open
---

loomloom exposes three complementary result views. Use the run ID returned at submission to retrieve each one.

| Result | Best for | Command |
| --- | --- | --- |
| Result rows | Programmatic inspection of row status and inline output | `loomloom run result-rows <run-id>` |
| Result workbook | Reviewing input, output, and errors in Excel | `loomloom run result-workbook <run-id>` |
| Artifacts | Downloading generated images, videos, or files | `loomloom artifact list/download <run-id>` |

## Download the result workbook

```bash
loomloom run result-workbook <run-id> --output-file ./result.xlsx
```

The server-generated workbook uses the submitted input snapshot to align each result with its original row. It remains useful when a run is partially failed because completed and failed rows can be reviewed together.

## Inspect and download artifacts

```bash
loomloom artifact list <run-id>
loomloom artifact download <run-id> --output-dir ./artifacts
```

Text results may be returned inline. Generated file outputs are exposed as artifacts and can be downloaded to a directory you control.

## Programmatic result inspection

```bash
loomloom run result-rows <run-id> --output json
```

Use JSON output when another command or program will consume the response. Keep identifiers unchanged when chaining commands.

<Warning>
  Artifact access URLs may be temporary signed URLs. Download the file when needed, but do not copy those URLs into documentation, source code, or long-lived logs.
</Warning>

If a run is `partially_failed`, review row-level error information before deciding whether to prepare a new input. A changed payload requires a new client request ID.
