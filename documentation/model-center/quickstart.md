---
title: Quickstart
description: Send your first request to CogFoundry with one API key.
icon: rocket
---

CogFoundry gives you one API key for every frontier model, behind OpenAI, Anthropic, and Google compatible endpoints. This page takes you from zero to your first response.

<Steps>
  <Step title="Create an API key">
    Open [API keys](https://console.cogfoundry.ai/api-keys) in the console and create a key. The full value is shown once, so copy it immediately and store it as an environment variable:

    ```bash
    export MODEL_CENTER_API_KEY="<your-api-key>"
    ```

    Never commit the key to source control or paste it into screenshots and issue reports.
  </Step>

  <Step title="Point your client at the base URL">
    All requests go to the same host:

    ```text
    https://router.cogfoundry.ai/api/v1
    ```

    If you already use the OpenAI SDK, change `base_url` to this value and keep the rest of your code as it is.
  </Step>

  <Step title="Pick a model">
    Models are addressed by slug in the form `provider/model`, for example `anthropic/claude-sonnet-5.5`. Browse the full list, context windows, and per-token pricing on the [model list](https://cogfoundry.ai/en/models/).

    The current slug list is also available from the API: `GET /api/v1/models`. It answers without a key, so it tells you which slugs exist but not whether your key works.
  </Step>

  <Step title="Send the first request">
    With cURL:

    ```bash
    curl https://router.cogfoundry.ai/api/v1/chat/completions \
      -H "Authorization: Bearer $MODEL_CENTER_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "anthropic/claude-sonnet-5.5",
        "messages": [
          { "role": "user", "content": "Say hello in one short sentence." }
        ]
      }'
    ```

    A successful call returns the usual chat completion body. The reply text is at `choices[0].message.content`:

    ```json
    {
      "id": "msg_...",
      "model": "claude-sonnet-5-5",
      "choices": [
        {
          "index": 0,
          "message": { "role": "assistant", "content": "Hello, it's nice to meet you!" },
          "finish_reason": "stop"
        }
      ],
      "usage": { "prompt_tokens": 19, "completion_tokens": 14, "total_tokens": 33 }
    }
    ```

    The provider echoes the slug with dots normalised to dashes (`claude-sonnet-5.5` comes back as `claude-sonnet-5-5`). Match on your own request value, not on the response field.

    With the Python OpenAI SDK, install the package first:

    ```bash
    pip install openai
    ```

    ```python
    import os
    from openai import OpenAI

    client = OpenAI(
        base_url="https://router.cogfoundry.ai/api/v1",
        api_key=os.environ["MODEL_CENTER_API_KEY"],
        timeout=120.0,
    )

    response = client.chat.completions.create(
        model="anthropic/claude-sonnet-5.5",
        messages=[{"role": "user", "content": "Say hello in one short sentence."}],
    )
    print(response.choices[0].message.content)
    ```

    <Note>
      Keep the explicit `timeout`. The SDK defaults are short, and on a network with a slow TLS handshake the first request can fail with `openai.APITimeoutError` even though the request itself is fine — raise the timeout and retry before suspecting the key.
    </Note>

    If the key is wrong or missing, the request fails with an `invalid_api_key` error rather than an empty response. An unknown model returns `400 invalid_request`. See [Errors](/documentation/model-center/error-handling) for the full set.
  </Step>

  <Step title="Use it from your coding agent">
    Any agent that accepts a custom OpenAI-compatible base URL can use CogFoundry. Point it at `https://router.cogfoundry.ai/api/v1`, give it the key through an environment variable, and use model slugs for model selection. Clients that speak the Anthropic or Google protocol need a different header and path — see [Model routing](/documentation/model-center/model-routing).
  </Step>
</Steps>

<Note>
  Image and video models are asynchronous and live on the same host. Submit to `POST /tasks/generations`, read `data.request_id` from the response, then poll `GET /tasks/generations/{request_id}`. Submission returns `200` as soon as the job is queued, so a `200` there does not mean the job will succeed: read `data.status` while polling, and when it turns `FAILED` the reason is in `data.fail_reason`.
</Note>

## Next steps

<Columns cols={3}>
  <Card title="Models & pricing" icon="table" href="/documentation/model-center/models">
    Browse models, slugs, and per-token pricing.
  </Card>
  <Card title="Model routing" icon="git-branch" href="/documentation/model-center/model-routing">
    How slugs, providers, and compatible request formats fit together.
  </Card>
  <Card title="Credits & usage" icon="credit-card" href="/documentation/model-center/usage-billing">
    Where your balance and usage records live.
  </Card>
</Columns>
