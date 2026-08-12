---
title: Money Units and Confirmation
description: Interpret loomloom amounts and implement the required paid-execution gate.
icon: circle-dollar-sign
---

Backend fields ending in `FeeT`, `CostT`, `AmountT`, or `PayableT` use this scale:

```text
10,000,000 backend units = 1 currency unit
```

Default text output normally formats these values as, for example, `CNY 0.5000000`. JSON output preserves the raw backend integer fields and structured public money fields returned by the service.

If the service does not return a currency, keep the raw T value and label the currency as unknown. Do not guess CNY or USD, and do not perform a local currency conversion.

## Inputs and estimates

- `listing publish --task-fixed-fee <amount>` accepts a normal decimal currency amount such as `0.5`.
- Official and private prechecks expose estimated model/API cost and may return available-balance information.
- Market quotes expose the buyer-facing estimated payable amount. Do not invent a model/API-cost breakdown when the service does not return one separately.
- Prefer service-returned structured money values such as `estimatedTotalCost.amount` and `.currency` for display while preserving their corresponding raw `*T` field for reconciliation.

## Required execution gate

Before creating any hosted run:

1. Validate the exact input.
2. Run the applicable precheck or quote.
3. Show the template or Listing ID, input source, row or billable-item count, estimate, returned currency, and balance sufficiency when available.
4. Obtain explicit confirmation for that exact input and estimate.
5. Execute with a new `--client-request-id`.

If the input changes after validation, estimate, or confirmation, repeat the process and obtain a new confirmation.

<Warning>
  `--confirm` on a Market run is a CLI execution flag; it is not a substitute for obtaining the user's explicit approval after showing the current quote.
</Warning>

For command-specific flows, see [Official templates](/developer-reference/loomloom-cli/official-templates), [Private templates](/developer-reference/loomloom-cli/private-templates), and [Market for users](/developer-reference/loomloom-cli/market-for-users).
