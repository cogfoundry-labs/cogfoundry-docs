---
title: Models and Executable Assets
description: Query the model catalog and the current user's executable loomloom assets.
icon: boxes
---

## List models

Specify the execution-unit step type:

```bash
loomloom model list --step-type text-generate
loomloom model list --step-type image-generate
loomloom model list --step-type video-generate
```

Optional filters:

```bash
loomloom model list \
  --step-type text-generate \
  --provider google \
  --output json
```

By default, the command requests currently available models. Pass `--only-available=false` only when you also need known but unavailable catalog entries.

When authoring TemplateSpec, the equivalent command is:

```bash
loomloom template-spec models <text-generate|image-generate|video-generate>
```

Use a returned `model_id` rather than guessing one. For a readable snapshot of the current catalog, see [Supported models](/documentation/loomloom/supported-models).

## List executable assets

```bash
loomloom asset list --page-size 50 --output json
```

`asset list` is an aggregated view of private templates available to the current user and executable Market SkillBots. It does not include official templates and does not create a new asset type.

Use the specific command family after discovery:

- Official templates: `template list` and `template schema`
- Private templates: `template-spec list`, `get`, and `versions`
- Market SkillBots: `market list` and `market show`

<Note>
  A static documentation list is a summary, not an availability guarantee. The CLI response from the configured environment is authoritative at execution time.
</Note>
