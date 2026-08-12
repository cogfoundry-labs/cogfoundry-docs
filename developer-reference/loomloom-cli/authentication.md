---
title: Authentication
description: Authenticate with ShengSuanYun, CogFoundry, or a compatible custom loomloom Server.
icon: key-round
---

loomloom uses a verified Server profile and a credential issued for that environment. Both preset platforms are operational in `v0.2.1`:

| Platform | Server | Authentication |
| --- | --- | --- |
| ShengSuanYun | `https://loomloom.shengsuanyun.com/loom/v1` | Browser login or API Token |
| CogFoundry | `https://loomloom.cogfoundry.ai/loom/v1` | Browser login or API Token |

Run `loomloom doctor --output json` first. If the current profile is already healthy, continue using it.

## Browser login for preset platforms

```bash
loomloom login --server "https://loomloom.shengsuanyun.com/loom/v1"
loomloom login --server "https://loomloom.cogfoundry.ai/loom/v1"
loomloom doctor --output json
```

Run only the command for the platform you selected. The CLI opens its authorization page and saves the returned credential locally after validating it against the selected Server. Use `--no-browser` to print the URL instead of opening it automatically, or `--login-timeout 10m` when more than the default five minutes is needed.

Browser login is supported for the ShengSuanYun and CogFoundry presets. Custom Servers use an API Token.

## API Token authentication

Create a Token from the selected platform:

- [ShengSuanYun API keys](https://console.shengsuanyun.com/user/keys)
- [CogFoundry API keys](https://console.cogfoundry.ai/api-keys)

Verify the exact Server and Token pair before persisting it:

```bash
loomloom doctor \
  --server "<exact-server-url>" \
  --token "<api-token>" \
  --output json
```

If verification succeeds, persist the Token under the exact variable returned in `token_env`, then verify the active profile:

```bash
loomloom doctor --output json
```

## Credential rules

- Use a token only with the environment and platform that issued it.
- Send a token only over HTTPS and only to the host you explicitly configured.
- Never send a ShengSuanYun token to a CogFoundry host, or a CogFoundry token to a ShengSuanYun host.
- Do not follow a cross-domain redirect while retaining a token.
- Never place a real token in source code, committed `.env` files, documentation, screenshots, logs, or support tickets.
- Prefer the profile-specific `token_env` returned by `doctor` over a command-line `--token`; command-line arguments may be retained in shell history or visible to local process inspection.

<Warning>
  An environment Token has higher priority than a browser credential for the same profile. If they differ, remove or update the environment variable intentionally; do not describe this as a browser-login failure.
</Warning>

## Logout

```bash
loomloom logout
loomloom logout --output json
```

Logout removes only the browser credential saved for the active profile. It reports `environment_token_set` separately and does not edit shell configuration. Remove an environment Token only after identifying the exact `token_env` and intentionally updating your local configuration.

## Explicit verification

Use explicit flags when registering or checking a new Server:

```bash
loomloom doctor \
  --server "https://loomloom.shengsuanyun.com/loom/v1" \
  --token "<temporary-token>"
```

Use this only in a protected terminal session. See [Server profiles](/developer-reference/loomloom-cli/server-profiles) and [Environment variables](/developer-reference/loomloom-cli/environment-variables) for profile behavior and precedence.
