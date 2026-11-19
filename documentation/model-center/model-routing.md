---
title: Model routing
description: How model slugs map to providers, and the exact path and header for each compatible format.
icon: git-branch
---

Requests are routed by the slug. The part before the slash selects the provider; the part after it selects the model, so `anthropic/claude-sonnet-5.5` and `google/gemini-3-flash` travel to different upstreams while sharing one key, one host, and one bill.

## Host and paths

Every family is served from `https://router.cogfoundry.ai/api`, but the version prefix and the header differ:

| Format | Header | Path |
| --- | --- | --- |
| OpenAI compatible | `Authorization: Bearer <key>` | `/v1/chat/completions` |
| Anthropic compatible | `x-api-key: <key>` + `anthropic-version: 2023-06-01` | `/v1/messages` |
| Google compatible | `x-goog-api-key: <key>` | `/v1beta/models/<model>:generateContent` |

Note the Google path is under `/v1beta`, not `/v1`. Sending an OpenAI-style bearer token to the Anthropic or Google path does not authenticate.

This means you can keep the SDK you already use. Point its base URL at the matching host, keep your existing request shape, and swap the model name for a CogFoundry slug. The Python OpenAI SDK therefore takes `https://router.cogfoundry.ai/api/v1` as `base_url`.

## Text and media take different paths

Text and embedding requests answer inline on the same connection. Image and video models are asynchronous: submit a job to `POST /tasks/generations`, receive a `data.request_id`, then poll `GET /tasks/generations/{request_id}` until the job finishes and the artifact URLs are returned. A job accepts the submission before it validates the model, so a queued job can still end in `FAILED` with the reason in `data.fail_reason`.

<Note>
  Per-endpoint parameter reference is being written. Until it lands, use the [model list](https://cogfoundry.ai/en/models/) for slugs and pricing, `GET /api/v1/models` for the live slug list, and the quickstart for a working request.
</Note>
