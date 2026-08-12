---
title: Supported Models
description: Text, image, and video models currently available to loomloom workflows.
icon: blocks
---

loomloom exposes a model catalog for the execution units used by official and private templates. The current catalog contains **12 text-generation models, 4 image-generation models, and 3 video-generation models**.

<Warning>
  This is a snapshot verified on July 20, 2026. Availability can change by environment, region, permissions, and provider status. Query the active loomloom service before creating or running a workflow.
</Warning>

## Check the live catalog

```bash
loomloom model list --step-type text-generate
loomloom model list --step-type image-generate
loomloom model list --step-type video-generate
```

When authoring a private template, you can also query the model catalog for its execution unit:

```bash
loomloom template-spec models text-generate
loomloom template-spec models image-generate
loomloom template-spec models video-generate
```

Use the returned `model_id` exactly. Do not derive IDs from display names.

## Text generation

| Display name | Model ID |
| --- | --- |
| DeepSeek V3.1 | `deepseek/deepseek-v3.1` |
| DeepSeek V3.2 Experimental | `deepseek/deepseek-v3.2-exp` |
| DeepSeek V4 Flash | `deepseek/deepseek-v4-flash` |
| DeepSeek V4 Pro | `deepseek/deepseek-v4-pro` |
| Gemini 2.5 Flash | `google/gemini-2.5-flash` |
| Gemini 2.5 Flash Lite | `google/gemini-2.5-flash-lite` |
| Gemini 2.5 Pro | `google/gemini-2.5-pro` |
| Gemini 3 Flash Preview | `google/gemini-3-flash` |
| Gemini 3.1 Flash Lite | `google/gemini-3.1-flash-lite` |
| Gemini 3.1 Flash Lite Preview | `google/gemini-3.1-flash-lite-preview` |
| Gemini 3.1 Pro Preview | `google/gemini-3.1-pro-preview` |
| Gemini 3.5 Flash | `google/gemini-3.5-flash` |

## Image generation

| Display name | Model ID |
| --- | --- |
| Nano Banana / Gemini 2.5 Flash Image | `google/gemini-2.5-flash-image` |
| Nano Banana Pro / Gemini 3 Pro Image Preview | `google/gemini-3-pro-image-preview` |
| Nano Banana 2 / Gemini 3.1 Flash Image Preview | `google/gemini-3.1-flash-image-preview` |
| Gemini 3.1 Flash Lite Image | `google/gemini-3.1-flash-lite-image` |

## Video generation

| Display name | Model ID |
| --- | --- |
| Veo 3 | `google/veo3` |
| Veo 3.1 Fast | `google/veo3.1-fast-preview` |
| Veo 3.1 | `google/veo3.1-preview` |

## Use a model in a workflow

- For an **official template**, inspect `loomloom template schema <template-id>` and its workbook. A model override is available only when the template exposes one.
- For a **private template**, select a returned model ID as the step's default. Expose a model input only when that step allows user override.
- A model listed in the environment is not automatically compatible with every template or step.
- Re-check the catalog when creating a new template version.

<Card title="Models and assets CLI reference" icon="terminal" href="/developer-reference/loomloom-cli/models-and-assets">
  See exact catalog commands and machine-readable output guidance.
</Card>
