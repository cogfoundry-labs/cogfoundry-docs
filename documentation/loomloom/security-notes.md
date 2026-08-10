---
title: Security notes
description: Protect credentials, workflow inputs, results, and paid execution in LoomLoom.
icon: shield-check
---

LoomLoom sends workflow input to the configured service for hosted execution. Apply the following controls before using sensitive or production data.

## Protect the token boundary

- Send `LOOMLOOM_TOKEN` only over HTTPS.
- Send it only to the host explicitly configured in `LOOMLOOM_SERVER` or `--server`.
- Do not retain the token when a redirect changes domains.
- Do not reuse a token across services or environments.
- Never include a real token in source, documentation, screenshots, issue reports, or logs.

The current production server is:

```text
https://loomloom.shengsuanyun.com/loom/v1
```

## Separate preparation from execution

Installation, discovery, downloads, uploads, validation, precheck, and quote do not create a hosted run. A run must occur only after the current input and estimate have been shown and explicitly confirmed.

Every changed input, template, private version, or Market Listing requires a new estimate and a fresh confirmation.

## Confirm remote changes

Creating a private template or version, publishing or updating a Listing, changing a price or execution version, unlisting, relisting, and withdrawing a review modify persistent remote state. Explain the exact change and obtain explicit confirmation first.

## Handle data and results carefully

- Do not print complete encoded workbook payloads.
- Treat uploaded files and workbook rows as Customer Content.
- Treat returned artifact locations as opaque references.
- Do not store temporary signed artifact URLs in long-lived logs.
- Download results to an access-controlled location.
- Follow your organization's retention and data-classification policies.

## Retry safely

After an ambiguous failure, inspect the relevant run, usage record, Listing, or review before retrying. Reuse a client request ID only for the identical previously confirmed payload. Changed input or a new confirmation requires a new ID.

Read the [CogFoundry Privacy Policy](https://integration.test.cogfoundry.ai/zh/legal/privacy/) and the documentation on [data collection](/documentation/privacy/data-collection) for how Customer Content is processed.
