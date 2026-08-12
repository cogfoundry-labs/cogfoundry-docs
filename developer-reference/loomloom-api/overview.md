---
title: loomloom API
description: Integrate loomloom AI work, templates, SkillBots, runs, and results through the CogFoundry HTTP API.
icon: braces
---

The loomloom API is the programmatic interface to the CogFoundry execution environment. Use it to discover executable assets, validate and estimate input, start confirmed runs, and retrieve results.

```text
Base URL: https://loomloom.cogfoundry.ai
API version: /loom/v1
Authentication: Authorization: Bearer <api-token>
```

System endpoints such as `/healthz` and `/version` live at the host root. Product endpoints use the `/loom/v1` prefix.

## API surface

| Area | What it covers |
| --- | --- |
| Official templates | Discover platform-maintained templates, inspect schemas, download workbooks, validate, precheck, and run. |
| Private templates | Create templates from TemplateSpec, manage immutable versions, and run a selected version. |
| Market SkillBots | Discover Listings, quote buyer cost, validate workbooks, and execute the current sellable Listing Version. |
| Runs and results | Inspect run state, result rows, result workbooks, and generated artifacts. |
| Creator operations | Publish and manage Listings, review requests, transactions, and earnings. |
| Models and assets | Discover models and the assets currently executable by the authenticated user. |

## Required execution sequence

```text
discover → inspect schema → prepare input → validate → precheck or quote
→ show the estimate → receive explicit confirmation → execute → retrieve results
```

Validation, schema inspection, workbook download, precheck, and quote do not create a hosted run. If input changes after validation or estimation, validate and estimate again before requesting a new confirmation.

<Warning>
  Do not send an API token to a different host, reuse a token across platforms, or place a real token in source code, screenshots, documentation, logs, or support requests.
</Warning>

<CardGroup cols={2}>
  <Card title="Authenticate" icon="key-round" href="/developer-reference/loomloom-api/authentication">
    Configure the CogFoundry API token and request headers safely.
  </Card>
  <Card title="API quickstart" icon="rocket" href="/developer-reference/loomloom-api/quickstart">
    Follow the shortest path from health check to run results.
  </Card>
</CardGroup>

The endpoint pages in this module are generated from the repository's OpenAPI 3.1 document. The [loomloom CLI reference](/developer-reference/loomloom-cli/overview) remains the source for command-line workflows.
