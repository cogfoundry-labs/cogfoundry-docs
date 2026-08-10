---
title: Templates
description: Understand official templates, private templates, versions, and Market SkillBots.
icon: panels-top-left
---

A LoomLoom template is reusable AI work IR: it defines structured inputs, execution steps, dependencies, model use, and expected outputs. Combine a template with workbook or programmatic row input to create a run.

## Template types

| Type | Maintained by | How you use it | Version behavior |
| --- | --- | --- | --- |
| Official template | CogFoundry | `loomloom template ...` | Use the version available in your environment |
| Private template | You or your organization | `loomloom template-spec ...` | Each change creates a new immutable version |
| SkillBot | A Market creator | `loomloom market ...` | Runs the current sellable Listing Version |

Their relationship is:

```text
Official template ── run directly

Private template
  └─ private template version
       └─ submitted for Market review
            └─ immutable Listing Version
                 └─ available to buyers as a SkillBot
```

There is no separate public-template resource. A CogFoundry-maintained workflow is an official template; a creator-published workflow is a Market SkillBot.

## Choose the right starting point

- Use an [official template](/documentation/loomloom/official-templates) when an existing workflow already matches the outcome you need.
- Create a [private template](/documentation/loomloom/private-templates) when you need your own input schema or multi-step workflow.
- Use a [SkillBot](/documentation/loomloom/skillbots-and-market) when you want to run a creator's reviewed workflow without recreating it.

## Inspect before preparing input

```bash
# Official templates
loomloom template list
loomloom template schema <template-id> --output json

# Your private templates
loomloom template-spec list
loomloom template-spec get <template-id>

# Market SkillBots
loomloom market list
loomloom market show <listing-id> --output json
```

Use the schema returned by the current environment. Do not infer field keys, allowed values, hidden step IDs, or template availability from a name alone.

<Note>
  `loomloom asset list` combines your private templates and available Market SkillBots. It does not include official templates and does not define another template type.
</Note>
