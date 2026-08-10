---
title: Quick Start
description: Run an official LoomLoom workflow from an Excel workbook.
icon: rocket
---

This walkthrough uses the recommended workbook flow for an official template.

<Steps>
  <Step title="Check your environment">
    ```bash
    loomloom doctor
    ```

    If no environment is configured, [choose a platform and authenticate](/documentation/loomloom/configure-credentials). Continue only when `doctor` reports a healthy active Server profile.
  </Step>
  <Step title="Choose an official template">
    ```bash
    loomloom template list
    ```

    Template availability depends on the environment. The remaining examples use `text-image-v1`; replace it with a visible template ID when needed.
  </Step>
  <Step title="Download the workbook">
    ```bash
    loomloom template download text-image-v1 --output-file ./input.xlsx
    ```

    Open the workbook and add one AI Workload per row. Keep the column headers and workbook structure unchanged.
  </Step>
  <Step title="Validate and estimate">
    ```bash
    loomloom template validate-file text-image-v1 ./input.xlsx
    loomloom template precheck-file text-image-v1 ./input.xlsx
    ```

    Validation checks the workbook without starting a run. Precheck estimates model/API cost and checks available balance without creating billable usage.
  </Step>
  <Step title="Review and submit">
    Review the template ID, input file, row count, cost estimate, currency, and balance. Submit only after you explicitly decide to proceed.

    ```bash
    loomloom template submit-file text-image-v1 ./input.xlsx \
      --client-request-id <stable-id>
    ```

    Keep the client request ID with the input. Reuse it only when retrying the identical submission.
  </Step>
  <Step title="Monitor and download results">
    Preserve the returned run ID exactly.

    ```bash
    loomloom run watch <run-id>
    loomloom run result-workbook <run-id> --output-file ./result.xlsx
    loomloom artifact download <run-id> --output-dir ./artifacts
    ```
  </Step>
</Steps>

<Warning>
  `template submit-file` creates a hosted run and can create billable model/API usage. An AI agent must show the current estimate and obtain a fresh explicit confirmation before running it.
</Warning>

Next, learn how [templates](/documentation/loomloom/templates), [runs](/documentation/loomloom/run-and-monitor-workflows), and [artifacts](/documentation/loomloom/artifacts-and-results) work.
