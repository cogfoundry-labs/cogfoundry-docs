---
title: Excel workbook workflows
description: Prepare, validate, estimate, and submit loomloom workflows from Excel.
icon: sheet
---

Workbooks are the recommended input experience for loomloom. They keep the expected fields, input rows, row-level results, and errors in a format that users can inspect before and after execution.

## One row, one AI Workload

Download the workbook from the exact template or Listing you plan to use. Keep its headers and structure unchanged, and add one AI Workload per input row.

| Workflow source | Download | Validate | Estimate | Submit after confirmation |
| --- | --- | --- | --- | --- |
| Official template | `template download` | `template validate-file` | `template precheck-file` | `template submit-file` |
| Private template version | `template-spec download-workbook` | `template-spec validate-workbook` | `template-spec precheck-workbook` | `template-spec submit-workbook` |
| Market SkillBot | `market workbook download` | `market workbook validate` | `market workbook quote` | `market workbook run` |

## Official template example

```bash
loomloom template download <template-id> --output-file ./input.xlsx
# Fill the workbook.
loomloom template validate-file <template-id> ./input.xlsx
loomloom template precheck-file <template-id> ./input.xlsx
# Review the estimate and explicitly confirm before continuing.
loomloom template submit-file <template-id> ./input.xlsx \
  --client-request-id <stable-id>
```

## Before submitting

Confirm all of the following:

- the template or Listing ID is correct;
- a private workflow uses the intended fixed version ID;
- validation passes;
- the row count and input file are correct;
- the estimate includes a known currency and sufficient balance;
- you understand that submission creates a hosted run and may create billable model/API usage.

An AI agent must ask for a new explicit confirmation for every changed template, version, Listing, or input file.

## Retrieve the result workbook

```bash
loomloom run watch <run-id>
loomloom run result-workbook <run-id> --output-file ./result.xlsx
```

The result workbook is generated from the server-side input snapshot and aligns outputs with the submitted rows. Prefer it over the legacy local backfill command.

<Warning>
  Workbook contents are transferred to the configured loomloom server. Do not print complete encoded request payloads or store temporary signed result URLs in long-lived logs.
</Warning>
