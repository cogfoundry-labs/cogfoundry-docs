---
title: Errors
description: What a failed model request looks like, and where to look first.
icon: triangle-alert
---

Errors come back as a JSON body with an `error` object, in the same shape OpenAI-compatible clients already parse, so existing retry and error-handling code keeps working:

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "missing or invalid Authorization header",
    "type": "authentication_error"
  }
}
```

| Status | `error.code` | Cause | What to do |
| --- | --- | --- | --- |
| `401` | `invalid_api_key` | Key missing, revoked, or copied incorrectly | Recreate the key in the [console](https://console.cogfoundry.ai/api-keys) and check the `Authorization: Bearer` header |
| `400` | `invalid_request` | Model slug unknown, or request shape rejected | Compare the slug against the [model list](https://cogfoundry.ai/en/models/) or `GET /api/v1/models`, then trim the request to the minimum |
| `429` | — | Request rate or concurrency limit reached | Back off and retry with jitter; see [Rate limits](/documentation/model-center/limits) |
| `5xx` | — | Upstream provider or routing failure | Retry once, then report the request with the returning timestamp |

Two failure modes are worth telling apart up front. An authentication problem returns `invalid_api_key` and never reaches a model. An unknown slug returns `400 invalid_request` with the model name in the message on an otherwise healthy key, which means the key is fine and only the `model` field is wrong.

## Asynchronous jobs fail later

For media models, a `200` on `POST /tasks/generations` only means the job was accepted — the submission is queued before the model is validated, so even an unavailable model gets a `request_id`. Poll `GET /tasks/generations/{request_id}` and trust `data.status`:

```json
{
  "code": "success",
  "data": {
    "request_id": "381389907275640832",
    "status": "FAILED",
    "fail_reason": "attach entry session: model \"invalid/nonexistent-model\" is not available",
    "progress": "100%",
    "cost": 0
  }
}
```

Do not treat the submission response as success, and do not retry a `FAILED` job without changing the input — the same request will fail the same way.

## Model names in responses

Upstream providers echo the model identifier with dots normalised to dashes: requesting `anthropic/claude-sonnet-5.5` returns `"model": "claude-sonnet-5-5"`. This is expected. Log the value you sent, not the value echoed back, if you group requests by model.
