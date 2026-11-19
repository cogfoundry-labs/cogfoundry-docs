---
title: Models & pricing
description: Where to find model slugs, capabilities, and per-token pricing.
icon: table
---

Every model is addressed by a slug in the form `provider/model`, such as `anthropic/claude-sonnet-5.5` or `google/veo3.1-preview`. The slug is what you send in the `model` field; display names are never accepted as identifiers.

The authoritative list is the [CogFoundry model list](https://cogfoundry.ai/en/models/). It carries the slug, provider, context window, and input/output pricing for each model. Availability and prices change as providers update their lineups, so link to that page instead of copying tables into internal documentation.

Model capability is not uniform. Text, image, and video models use different request shapes and different endpoints — see [Model routing](/documentation/model-center/model-routing) for the split between inline text responses and asynchronous media jobs.

<Note>
  If a slug you used before stops working, check the model list first. A withdrawn or renamed model is the most common cause, and it surfaces as an unknown-model error rather than an authentication failure.
</Note>
