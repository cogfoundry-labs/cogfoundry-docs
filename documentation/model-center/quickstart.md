---
title: Quickstart
description: Connect an AI tool or send your first API request to access leading text, image, video, and audio models with a single key.
icon: rocket
---

CogFoundry is a production-grade AI execution platform offering built-in queue and rate-limit scheduling to turn AI capabilities into repeatable, predictable outcomes.

## Start with Model Access

<Columns cols={2}>
  <Card title="Use your preferred tool" icon="terminal" href="#use-an-ai-tool">
    Connect Codex Desktop or Claude Code.
  </Card>
  <Card title="Build with the API" icon="code" href="#call-the-api">
    Send a request with Python, Node.js, or cURL.
  </Card>
</Columns>

## Prepare your account and key

<Steps>
  <Step title="Create an account">
    [Sign up for CogFoundry](https://console.cogfoundry.ai/signup?redirect=%2Fapi-keys) and complete email verification. Already have an account? [Sign in](https://console.cogfoundry.ai/login?redirect=%2Fapi-keys).
  </Step>
  <Step title="Create an API key">
    Open [API Keys](https://console.cogfoundry.ai/api-keys), click **New Key**, give the key a name, and create it. Copy the full key when it appears; it is shown only once.
  </Step>
  <Step title="Check your balance">
    Open [Credits](https://console.cogfoundry.ai/credits) and confirm you have an available balance. If needed, click **Add Credits** and complete the purchase before making a model request.
  </Step>
</Steps>

<Note>
  Keep your key private. Do not put it in public repositories, screenshots, or website code served to users. Model requests are billed to your CogFoundry account.
</Note>

## Use an AI tool

Choose your tool and follow its setup guide. [Prepare a key and balance](#prepare-your-account-and-key) first.

<Columns cols={2}>
  <Card title="Codex Desktop" icon="terminal" href="/documentation/model-center/codex-desktop">
    Web to Agent, CC Switch, or manual configuration.
  </Card>
  <Card title="Claude Code" icon="terminal" href="/documentation/model-center/claude-code">
    Configure the Anthropic-compatible connection.
  </Card>
</Columns>

1. Install the tool using the official link in its guide.
2. Configure your CogFoundry key, the tool-specific base URL, and a supported model.
3. Reopen the tool and send a short message. A model reply confirms the connection.

Use the URL and settings in the matching guide. Codex and Claude Code use different API formats.

## Call the API

This example uses the OpenAI-compatible Chat Completions API and `openai/gpt-4o-mini`. [Prepare a key and balance](#prepare-your-account-and-key) first.

| Field | Value |
| --- | --- |
| **SDK base URL** | `https://router.cogfoundry.ai/api/v1` |
| **Request** | `POST /chat/completions` |
| **Authentication** | `Authorization: Bearer YOUR_COGFOUNDRY_API_KEY` |

### Save your key for this terminal session

Replace `YOUR_COGFOUNDRY_API_KEY` with your key and run the command below. Keep this window open for the next step.

<Tabs>
  <Tab title="macOS">
    Open Terminal.

    ```bash
    export COGFOUNDRY_API_KEY="YOUR_COGFOUNDRY_API_KEY"
    ```
  </Tab>
  <Tab title="Windows">
    Open **PowerShell**. In Windows Terminal, choose the PowerShell profile.

    ```powershell
    $env:COGFOUNDRY_API_KEY = "YOUR_COGFOUNDRY_API_KEY"
    ```
  </Tab>
  <Tab title="Linux">
    Open your terminal.

    ```bash
    export COGFOUNDRY_API_KEY="YOUR_COGFOUNDRY_API_KEY"
    ```
  </Tab>
</Tabs>

### Send your first request

Choose one option below. Run its install and example commands in the same window where you set your key.

<Tabs>
  <Tab title="Python">
    Requires [Python 3.9 or later](https://www.python.org/downloads/). Install the OpenAI SDK:

    <Tabs>
      <Tab title="macOS">
        ```bash
        python3 -m pip install openai
        ```
      </Tab>
      <Tab title="Windows">
        ```powershell
        py -m pip install openai
        ```

        If `py` is unavailable but `python --version` works, use `python` instead of `py` in both commands.
      </Tab>
      <Tab title="Linux">
        ```bash
        python3 -m pip install openai
        ```
      </Tab>
    </Tabs>

    Save this code as `quickstart.py` in your current folder:

    ```python
    import os
    from openai import OpenAI

    client = OpenAI(
        api_key=os.environ["COGFOUNDRY_API_KEY"],
        base_url="https://router.cogfoundry.ai/api/v1",
        timeout=120.0,
    )

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[{"role": "user", "content": "Say hello in one short sentence."}],
    )
    print(response.choices[0].message.content)
    ```

    Run it:

    <Tabs>
      <Tab title="macOS">
        ```bash
        python3 quickstart.py
        ```
      </Tab>
      <Tab title="Windows">
        ```powershell
        py quickstart.py
        ```
      </Tab>
      <Tab title="Linux">
        ```bash
        python3 quickstart.py
        ```
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="Node.js">
    Requires [Node.js 22 or later](https://nodejs.org/en/download). Install the OpenAI SDK in your project folder:

    <Tabs>
      <Tab title="macOS">
        ```bash
        npm install openai
        ```
      </Tab>
      <Tab title="Windows">
        ```powershell
        npm.cmd install openai
        ```
      </Tab>
      <Tab title="Linux">
        ```bash
        npm install openai
        ```
      </Tab>
    </Tabs>

    Save this code as `quickstart.mjs` in the same folder:

    ```javascript
    import OpenAI from "openai";

    const client = new OpenAI({
      apiKey: process.env.COGFOUNDRY_API_KEY,
      baseURL: "https://router.cogfoundry.ai/api/v1",
      timeout: 120_000,
    });

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello in one short sentence." }],
    });
    console.log(response.choices[0].message.content);
    ```

    Run it:

    ```bash
    node quickstart.mjs
    ```
  </Tab>

  <Tab title="HTTP">
    <Tabs>
      <Tab title="macOS">
        Run this request in Terminal:

        ```bash
        curl https://router.cogfoundry.ai/api/v1/chat/completions \
          -H "Authorization: Bearer $COGFOUNDRY_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "openai/gpt-4o-mini",
            "messages": [
              { "role": "user", "content": "Say hello in one short sentence." }
            ]
          }'
        ```
      </Tab>
      <Tab title="Windows">
        Run this request in PowerShell:

        ```powershell
        $CogRequest = @{
          model = 'openai/gpt-4o-mini'
          messages = @(
            @{ role = 'user'; content = 'Say hello in one short sentence.' }
          )
        } | ConvertTo-Json -Depth 4

        $CogReply = Invoke-RestMethod -Method Post `
          -Uri 'https://router.cogfoundry.ai/api/v1/chat/completions' `
          -Headers @{ Authorization = "Bearer $env:COGFOUNDRY_API_KEY" } `
          -ContentType 'application/json' -Body $CogRequest -TimeoutSec 120

        $CogReply.choices[0].message.content
        ```
      </Tab>
      <Tab title="Linux">
        Run this request in Terminal:

        ```bash
        curl https://router.cogfoundry.ai/api/v1/chat/completions \
          -H "Authorization: Bearer $COGFOUNDRY_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "openai/gpt-4o-mini",
            "messages": [
              { "role": "user", "content": "Say hello in one short sentence." }
            ]
          }'
        ```
      </Tab>
    </Tabs>
  </Tab>
</Tabs>

**You are connected when a model reply appears.** The SDK examples print the reply. In the cURL response, look for `choices[0].message.content`.

<Accordion title="Choose a different model">
  Browse [Models & pricing](https://cogfoundry.ai/en/models/) and copy the exact model ID. For this example, choose a model that supports Chat Completions, then replace only the `model` value.

  You can also list models with:

  <Tabs>
    <Tab title="macOS">
      ```bash
      curl https://router.cogfoundry.ai/api/v1/models
      ```
    </Tab>
    <Tab title="Windows">
      ```powershell
      curl.exe https://router.cogfoundry.ai/api/v1/models
      ```
    </Tab>
    <Tab title="Linux">
      ```bash
      curl https://router.cogfoundry.ai/api/v1/models
      ```
    </Tab>
  </Tabs>

  The model list is public. A successful response from this endpoint does not verify your API key or balance.
</Accordion>

## Frequently asked questions

<AccordionGroup>
  <Accordion title="My first request failed. What should I check?">
    | Error | What to check |
    | --- | --- |
    | 401 / invalid key | Copy the CogFoundry key again, remove extra spaces, and check that it is active and has not expired. |
    | 400 / invalid request | Check the exact model ID, its supported API format, and the request body. |
    | 404 | Check the full request URL. Read the error message for any model or upstream routing issue. |
    | Insufficient credits or quota | Check your available Credits and any quota assigned to the key. |
    | 429 | Read the error message. Check rate or concurrency limits, then reduce concurrent requests and wait before retrying. |
    | 5xx | Retry after a short wait. If the error persists, contact support with the model ID, time, and request ID if present. Remove your key from any logs you share. |
  </Accordion>

  <Accordion title="The model list works. Why does my request fail?">
    The model list does not require authentication. A model request still needs a valid key, sufficient balance, permission to use the model, and the correct API format. Check the error returned by the model request.
  </Accordion>

  <Accordion title="How much does the first request cost?">
    Model usage is pay-as-you-go. Rates vary by model and usage; check [Models & pricing](https://cogfoundry.ai/en/models/) before calling. Review your balance and transactions in [Credits](https://console.cogfoundry.ai/credits). API access does not require a separate monthly subscription. CogFoundry currently charges 0% platform fees for a limited time; model usage is still billed. Promotional terms are subject to change.
  </Accordion>

  <Accordion title="Can I use an existing OpenAI SDK project?">
    If your project uses Chat Completions, change the key, base URL, and model ID. For other endpoints, check the model’s supported API formats and parameters.
  </Accordion>
</AccordionGroup>

## Next steps

<Columns cols={2}>
  <Card title="Models & pricing" icon="table" href="https://cogfoundry.ai/en/models/">
    Compare capabilities, supported formats, and usage rates.
  </Card>
  <Card title="Manage API keys" icon="key" href="https://console.cogfoundry.ai/api-keys">
    Review model access, limits, and key status.
  </Card>
</Columns>
