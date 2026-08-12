---
title: FAQ
description: Common questions about CogFoundry, loomloom, models, execution, and data handling.
icon: book-open
---

<AccordionGroup>
  <Accordion title="Which loomloom release do these docs cover?" icon="tags">
    These docs cover the `v0.2.1` public beta release. Use `loomloom <command> --help` as the source of truth for the version installed on your machine.
  </Accordion>

  <Accordion title="Which service should I configure?" icon="server">
    Choose the platform that owns your account and credential. Both preset platforms are operational:

    ```text
    ShengSuanYun: https://loomloom.shengsuanyun.com/loom/v1
    CogFoundry:   https://loomloom.cogfoundry.ai/loom/v1
    ```

    Both preset platforms support browser login and API Tokens. A compatible custom Server may also be registered with an API Token after `doctor` verifies it.
  </Accordion>

  <Accordion title="Do I need an AI coding agent to use loomloom?" icon="bot">
    No. You can use the CLI directly. Optional integrations are available for Codex, Claude Code, and OpenClaw.
  </Accordion>

  <Accordion title="Where can I find the available models?" icon="blocks">
    Use [Supported Models](/documentation/loomloom/supported-models) for a current snapshot, then query the active environment because availability can change by service configuration, permissions, or region.
  </Accordion>

  <Accordion title="Does every model work with every template?" icon="workflow">
    No. A model can be available in the environment without being compatible with every template or step. Inspect the template schema and the model list for the relevant execution unit.
  </Accordion>

  <Accordion title="Does preparation create a paid run?" icon="circle-dollar-sign">
    No. Validation, precheck, quote, schema inspection, uploads, and downloads are preparation steps. Execution creates a hosted run and requires a current estimate followed by explicit confirmation.
  </Accordion>

  <Accordion title="Is execution local?" icon="cloud">
    No. The CLI runs locally, but confirmed workflows are executed by the configured remote loomloom service. A local Agent Skill is a wrapper and does not copy hidden prompts or server-side execution logic.
  </Accordion>

  <Accordion title="Is Customer Content used to train models?" icon="shield-check">
    CogFoundry does not train CogFoundry or third-party models on Customer Content unless the user or organization explicitly authorizes it. Selected providers may process Customer Content under their own terms and configured controls. See [Data Collection](/documentation/privacy/data-collection) and [Provider Logging](/documentation/privacy/provider-logging).
  </Accordion>

  <Accordion title="Where do I report a problem?" icon="bug">
    Run `loomloom doctor`, remove secrets from the output, and open an issue in the [loomloom GitHub repository](https://github.com/cogfoundry-labs/loomloom/issues).
  </Accordion>
</AccordionGroup>
