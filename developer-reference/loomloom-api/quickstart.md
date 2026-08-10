---
title: API Quickstart
description: Discover an official template, prepare a confirmed run, and retrieve LoomLoom results through the API.
icon: rocket
---

This guide uses the current CogFoundry API structure. The earlier ShengSuanYun guide used legacy `/batch/v1` paths; new integrations should use the `/loom/v1` operations generated from the OpenAPI document in this repository.

## 1. Check the service

```bash
curl "https://loomloom.cogfoundry.ai/healthz"
```

## 2. Discover available models and official templates

```bash
curl "https://loomloom.cogfoundry.ai/loom/v1/models" \
  --header "Authorization: Bearer $COGFOUNDRY_API_TOKEN"

curl "https://loomloom.cogfoundry.ai/loom/v1/officialTemplates" \
  --header "Authorization: Bearer $COGFOUNDRY_API_TOKEN"
```

Use the returned template identifier. Do not infer availability or field names from an example.

## 3. Inspect the selected template

```bash
curl "https://loomloom.cogfoundry.ai/loom/v1/officialTemplates/{officialTemplate}/schema" \
  --header "Authorization: Bearer $COGFOUNDRY_API_TOKEN"
```

The schema returned by the active environment defines the accepted field keys, value types, required inputs, and available choices.

## 4. Validate, estimate, and confirm

Choose the row or workbook operation that matches your input:

```text
validateRows or validateWorkbook
        ↓
precheckRows or precheckWorkbook
        ↓
show the current estimate and obtain explicit confirmation
```

Do not create a run before the user has reviewed the current estimate. If the payload changes, repeat validation and precheck and obtain a new confirmation.

## 5. Run and preserve the returned ID

After confirmation, call `runRows` or `runWorkbook` and preserve the returned `runId` exactly. Use a new client request ID for every newly confirmed execution; reuse one only for an identical retry after an ambiguous failure.

## 6. Retrieve progress and results

```bash
curl "https://loomloom.cogfoundry.ai/loom/v1/users/me/runs/{run}" \
  --header "Authorization: Bearer $COGFOUNDRY_API_TOKEN"

curl "https://loomloom.cogfoundry.ai/loom/v1/users/me/runs/{run}/resultRows" \
  --header "Authorization: Bearer $COGFOUNDRY_API_TOKEN"

curl "https://loomloom.cogfoundry.ai/loom/v1/users/me/runs/{run}/resultWorkbook" \
  --header "Authorization: Bearer $COGFOUNDRY_API_TOKEN" \
  --output result.xlsx
```

Generated artifact download URLs may be temporary. Retrieve current result metadata instead of storing signed URLs in long-lived logs.

<Note>
  Use the generated endpoint pages for exact request bodies, parameters, response schemas, and error models. This quickstart explains the safe sequence rather than duplicating the OpenAPI contract.
</Note>
