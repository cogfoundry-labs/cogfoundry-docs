---
title: Configure credentials
description: Choose a loomloom platform, authenticate, and verify the active Server safely.
icon: key-round
---

loomloom `v0.2.1` provides two preset platforms. Choose the platform that owns your account and credential; do not infer the platform from your language, location, or download source.

| Platform | Server | Authentication | Account links |
| --- | --- | --- | --- |
| ShengSuanYun | `https://loomloom.shengsuanyun.com/loom/v1` | Browser login preferred; API Token supported | [API keys](https://console.shengsuanyun.com/user/keys) · [Recharge](https://console.shengsuanyun.com/user/recharge) |
| CogFoundry | `https://loomloom.cogfoundry.ai/loom/v1` | Browser login preferred; API Token supported | [API keys](https://console.cogfoundry.ai/api-keys) · [Credits](https://console.cogfoundry.ai/credits) |

## Check existing configuration first

```bash
loomloom doctor --output json
```

If `healthy` is `true`, continue with the existing profile. Do not replace a working credential unnecessarily.

## Browser login

```bash
loomloom login --server "https://loomloom.shengsuanyun.com/loom/v1"
loomloom login --server "https://loomloom.cogfoundry.ai/loom/v1"
loomloom doctor --output json
```

Use only the command for the platform you selected, then complete authorization in the browser. In a headless environment, add `--no-browser` to print the authorization URL. If browser login is unavailable or you prefer an API Token, use the Token flow below.

## API Token flow

Create a Token from the selected platform's console, then verify the exact Server and Token together:

```bash
loomloom doctor \
  --server "<exact-server-url>" \
  --token "<api-token>" \
  --output json
```

Continue only when `healthy` and `token_valid` are `true`. The result includes a generated `profile`, `token_env`, and `next_action`. If `next_action` is `persist_token`, store the Token under the exact environment variable named by `token_env`, then run `loomloom doctor --output json` again. Do not invent a profile or environment-variable name.

For example, the default profiles normally use platform-specific variables instead of sharing one global Token:

```bash
export LOOMLOOM_TOKEN_SHENGSUANYUN="<shengsuanyun-api-token>"
export LOOMLOOM_TOKEN_COGFOUNDRY="<cogfoundry-api-token>"
```

Always use the actual `token_env` returned by your CLI.

## Custom compatible Server

A custom compatible Server is allowed. Pass its exact HTTPS URL and corresponding Token to `doctor`; do not append `/loom/v1` automatically or reuse a Token from another environment. A new Server profile is saved only after verification succeeds.

## Keep the server and token paired

An API key is issued for a particular service environment. Do not reuse it with a different host.

<Warning>
  Send any loomloom Token only to the exact Server that issued it, and only over HTTPS. Do not place a real Token in source control, documentation, screenshots, issue reports, or shared logs.
</Warning>

Use [Server profiles](/developer-reference/loomloom-cli/server-profiles) to list or switch verified environments. `loomloom logout` removes a saved browser credential only; it does not remove an API Token from your shell configuration.
