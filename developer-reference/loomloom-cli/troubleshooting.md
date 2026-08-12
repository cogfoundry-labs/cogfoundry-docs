---
title: Troubleshooting
description: Diagnose common loomloom CLI setup, input, execution, and local Skill failures.
icon: wrench
---

## Choose the first check

| Symptom | First action |
| --- | --- |
| Invalid flag, local file, JSON, workbook, or TemplateSpec | Fix the reported local input; do not start with `doctor` |
| Authentication, endpoint, network, service-version, or unexpected server error | Run `loomloom doctor --output json` |
| Paid or state-changing request failed ambiguously | Query remote state before any retry |

## Configuration failures

If no Server is selected, choose a platform or register an exact compatible Server. The preset Servers are:

```bash
https://loomloom.shengsuanyun.com/loom/v1
https://loomloom.cogfoundry.ai/loom/v1
```

For either preset platform, prefer `loomloom login` when browser authorization is available. For an API Token, use the console belonging to the selected platform, verify the exact pair with `doctor --server ... --token ... --output json`, and persist it under the returned `token_env`. Never paste a real Token into an issue or log.

If the CLI reports a platform mismatch, stop. Verify that server and token were issued for the same platform and environment. Do not work around the check by sending the token to a different host.

## Input and authoring failures

- `orchestration input must be a .jsonl file`: use a `.jsonl` file for `orchestration-input upload`.
- Missing `inputFileId`: preserve the exact value returned by `orchestration-input upload`; do not use an `inputAssetId`.
- `TS-TOPOLOGY-001`: remove `bindMode=expanded`. Use one row per independent item or explicit fixed parallel steps connected with dependencies and upstream bindings.
- Workbook validation failed: fix the reported row and field, then validate and precheck the unchanged workbook again.
- Model unavailable: query `model list` or `template-spec models` against the active environment.

## Run and result failures

Use:

```bash
loomloom run get <run-id> --output json
loomloom run watch <run-id> --max-wait 30m
loomloom usage get <run-transaction-id> --output json
```

Do not construct a run-detail URL. If an artifact signed URL has expired, retrieve current result metadata or rerun `artifact download`; do not store the old URL.

For an identical confirmed retry after an ambiguous failure, reuse the original client request ID. If any input changed or a new confirmation was obtained, use a new ID.

## Local Agent Skill failures

If a dry run returns `output_dir_name_mismatch`, append the returned `skillName` to the parent directory and run the dry run again. If the destination contains files, choose an empty directory or run an uninstall dry run. Use `--force` only after explicit confirmation to remove unexpected files.

## Report a reproducible issue

Open an issue in the [loomloom GitHub repository](https://github.com/cogfoundry-labs/loomloom/issues) with:

- CLI version
- operating system and architecture
- sanitized command and error
- sanitized `doctor --output json` result
- minimal non-sensitive input that reproduces the problem

Remove tokens, workbook contents, private prompts, signed URLs, and customer data before sharing.
