---
title: Provider Logging
description: How selected model and tool providers may process loomloom workflow data.
icon: logs
---

loomloom workflows can call third-party model, API, or tool providers. To execute the requested AI Workload, CogFoundry may transmit the necessary Customer Content and execution metadata to the selected provider.

This page is an operational summary. The [full Privacy Policy](https://integration.test.cogfoundry.ai/zh/legal/privacy/) controls the legal terms.

## What a provider may receive

The data depends on the template and selected model or tool. It may include:

- prompts and workflow inputs;
- uploaded text, images, documents, or workbook fields used by a step;
- upstream outputs needed by a later workflow step;
- request settings and the selected model;
- technical metadata needed to execute, troubleshoot, secure, and account for the request.

loomloom should send only the information required by the workflow. A provider does not need every field in your workbook unless those fields are used by the provider-backed step.

## Provider retention and logging

Third-party providers may log, retain, or otherwise process submitted data according to their own terms, privacy notices, data-processing agreements, regional policies, and account-level controls. Their rules can differ by model, endpoint, account type, and region.

Before using sensitive data:

1. identify which models, APIs, or tools the workflow will call;
2. review the applicable provider terms and retention controls;
3. remove data that is not required for the workload;
4. use organization-approved models and providers;
5. avoid storing temporary signed artifact URLs in long-lived logs.

## CogFoundry's training position

CogFoundry does not train CogFoundry models or third-party models on Customer Content unless the user or organization explicitly authorizes it. This does not replace the separate data-handling terms of a provider used for execution.

## Logs and support

CogFoundry may retain service logs and execution metadata for security, reliability, billing, troubleshooting, and support. Do not include real tokens or complete workbook payloads when sharing diagnostic output. Remove secrets before opening a support request or GitHub issue.

<Card title="loomloom security notes" icon="shield" href="/documentation/loomloom/security-notes">
  Review token, endpoint, workbook, artifact URL, confirmation, and retry safeguards.
</Card>
