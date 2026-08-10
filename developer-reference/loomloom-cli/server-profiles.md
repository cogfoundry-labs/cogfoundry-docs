---
title: Server Profiles
description: Register, inspect, switch, and remove verified LoomLoom Server profiles.
icon: servers
---

LoomLoom `v0.2.1` stores verified Server profiles locally so one CLI installation can work with ShengSuanYun, CogFoundry, or a compatible custom Server without mixing credentials.

## Register a Server

A profile is created only after `doctor` verifies the exact Server and Token:

```bash
loomloom doctor \
  --server "<exact-server-url>" \
  --token "<matching-api-token>" \
  --output json
```

You may add `--name <profile-name>` to choose a lowercase profile name. Otherwise, the CLI generates one. A successful result returns:

- `profile`: saved profile name;
- `server`: normalized Server URL;
- `platform`: `shengsuanyun`, `cogfoundry`, or `custom`;
- `token_env`: profile-specific Token environment variable;
- `next_action`: whether the Token still needs to be persisted.

If verification fails, LoomLoom does not save or activate the new Server.

## List profiles

```bash
loomloom server list
loomloom server list --output json
```

The output identifies the active profile and whether a credential is available without printing the Token.

## Switch the active profile

```bash
loomloom server use <name-or-server>
loomloom doctor --output json
```

Switch only when you intend to change environments. The active profile determines the default Server and the profile-specific Token variable used by authenticated commands.

## Remove a profile

```bash
loomloom server remove <name-or-server>
```

Removing a profile deletes its local profile metadata and any browser credential saved by `loomloom login`. It does not remove the corresponding API Token from shell profiles or user-level environment settings. The command reports the exact environment-variable name that may require separate cleanup.

<Warning>
  Never try one Token against multiple Servers. A Token must be sent only over HTTPS and only to the Server that issued it.
</Warning>
