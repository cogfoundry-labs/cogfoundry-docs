---
title: Environment Variables
description: Configure the loomloom CLI through environment variables.
icon: variable
---

| Variable | Required | Description |
| --- | --- | --- |
| `LOOMLOOM_SERVER` | Legacy/new-profile bootstrap | Full HTTPS base URL paired with the global Token |
| `LOOMLOOM_TOKEN` | Legacy/new-profile bootstrap | Global Token; valid only when bound to the same `LOOMLOOM_SERVER` |
| `LOOMLOOM_TOKEN_<PROFILE>` | Recommended after verification | Profile-specific Token variable generated and returned by `doctor` |
| `LOOMLOOM_VERBOSE` | No | Go-style boolean that enables debug logs on stderr |

Do not guess a profile-specific variable. Register the exact Server and Token pair, then read `token_env` from the successful result:

```bash
loomloom doctor --server "<exact-server>" --token "<matching-token>" --output json
```

## Precedence

For the Server, resolution order is:

1. `--server`
2. Active verified Server profile
3. `LOOMLOOM_SERVER` when no profile state exists

For the token, resolution order is:

1. `--token`
2. Active profile's generated `LOOMLOOM_TOKEN_<PROFILE>` variable
3. Browser credential saved by `loomloom login` for that profile
4. `LOOMLOOM_TOKEN` only when it is bound to the selected Server

Legacy `BATCHJOB_SERVER` and `BATCHJOB_TOKEN` are not part of the `v0.2.1` profile resolution path. New setups should use verified profiles and their generated Token variables.

## Bootstrap a new profile

Pass the Server and Token explicitly to the first verification rather than relying on temporary global variables:

```bash
loomloom doctor \
  --server "https://loomloom.cogfoundry.ai/loom/v1" \
  --token "<cogfoundry-api-token>" \
  --output json
```

If the result returns `next_action: persist_token`, store the Token under the returned `token_env`. Do not commit shell profiles or environment files containing real tokens. For profile management, see [Server profiles](/developer-reference/loomloom-cli/server-profiles).
