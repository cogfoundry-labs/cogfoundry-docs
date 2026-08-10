---
title: Troubleshooting
description: Diagnose common LoomLoom installation, authentication, input, and run problems.
icon: wrench
---

Start by identifying whether the failure is local input, authentication, service connectivity, or a hosted run.

## Installation or command not found

```bash
loomloom --version
```

If the command is unavailable, reinstall LoomLoom and ensure its install directory is on `PATH`. Confirm the installed version before comparing its command set with these docs.

## Authentication, server, or network error

```bash
loomloom doctor --output json
```

Check that:

- `server` is the intended HTTPS endpoint;
- `profile` is the intended active Server profile;
- `token_env` identifies the correct profile-specific Token variable;
- `token_valid` is `true` and the Token belongs to that Server;
- your network can reach the configured host;
- the installed CLI and service are compatible.

Never paste the token into a support request.

## Local file or schema error

Read the error first. Correct a flag, JSON/JSONL file, workbook, or TemplateSpec locally and retry the relevant validation command. `doctor` is not necessary for an ordinary local input error.

For official workbooks:

```bash
loomloom template schema <template-id>
loomloom template validate-file <template-id> <input.xlsx>
```

For private templates:

```bash
loomloom template-spec docs spec --lang en
loomloom template-spec check <spec.json>
```

If `TS-TOPOLOGY-001` appears, remove new `bindMode=expanded` authoring. Use one workbook row per independently processed item or define a fixed number of parallel steps with `dependsOn` and `upstreamBindings`.

## Template or model is unavailable

```bash
loomloom template list
loomloom model list --step-type <text-generate|image-generate|video-generate>
```

Availability depends on the current environment and permission. Use IDs returned by the service; do not guess them from display names or a static list.

## Workbook validation fails after a template change

Download a fresh workbook for the current official template or exact private template version. Do not assume an older workbook remains compatible.

## A submission timed out or returned an ambiguous error

Do not immediately repeat a paid or state-changing command.

```bash
loomloom run list
loomloom run get <run-id>
```

For Market calls, also inspect the usage record. For publishing changes, inspect the Listing and review request. Reuse a client request ID only if the original payload and confirmation are unchanged.

## Where to report a reproducible issue

Open an issue in the [LoomLoom GitHub repository](https://github.com/cogfoundry-labs/loomloom/issues). Include the CLI version, operating system, sanitized `doctor` output, the command shape, and the error message. Remove tokens, Customer Content, signed URLs, and other sensitive values.
