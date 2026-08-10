---
title: API Authentication
description: Authenticate LoomLoom API requests with a CogFoundry API token.
icon: key-round
---

Create or copy an API token from the [CogFoundry API Keys console](https://console.cogfoundry.ai/api-keys), then send it as a bearer credential:

```bash
curl "https://loomloom.cogfoundry.ai/loom/v1/models" \
  --header "Authorization: Bearer $COGFOUNDRY_API_TOKEN"
```

Use an environment variable or a secret manager. Do not commit the token or pass it to a host other than the CogFoundry Server that issued it.

## Request headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <api-token>` | Yes for authenticated endpoints |
| `Content-Type` | `application/json` | For JSON request bodies |
| `Accept` | Response media type expected by the endpoint | Recommended |

Workbook and file endpoints may use multipart input or return binary content. Follow the generated endpoint page instead of forcing `application/json` on every request.

## Verify before integrating

```bash
curl "https://loomloom.cogfoundry.ai/healthz"
curl "https://loomloom.cogfoundry.ai/version"
```

A successful health check confirms reachability, not user authorization. Verify an authenticated endpoint such as `GET /loom/v1/models` before building the rest of the integration.

<Warning>
  Never copy a ShengSuanYun token into a CogFoundry request. Credentials are bound to their issuing environment.
</Warning>
