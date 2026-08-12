---
title: Usage and Earnings
description: Inspect Market buyer transactions and creator earnings in the loomloom CLI.
icon: receipt-text
---

## Buyer usage

```bash
loomloom usage list --page-size 50
loomloom usage get <run-transaction-id> --output json
```

Use the `runTransactionId` returned by `market run` or `market workbook run`. It is distinct from `runId`, which is used for run progress and results.

## Creator earnings

```bash
loomloom creator earnings --limit 100
loomloom creator transactions --page-size 50
```

The earnings overview and transaction records may include call counts, gross call fees, platform fees, net creator receivables, and settlement state. Display only fields returned by the service; do not infer missing amounts.

## Current settlement states

- Completed Market runs settle the applicable creator call fee and actual model/API usage.
- Failed or cancelled Market runs have zero buyer final charge, release the reserved amount, and create no creator earning.
- Partially failed or partially cancelled Market runs remain pending resolution in the current implementation; do not claim that capture, release, or creator credit has completed.

Always inspect the transaction returned by `usage get` or the creator commands rather than inferring settlement from run status alone.

## Currency and privacy

Default text output formats known currencies. JSON preserves raw `*T` fields, where 10,000,000 backend units equal one currency unit. If currency is missing, retain the raw value and label the currency unknown.

Do not expose creator commission or net-earnings data in a buyer-facing quote. Keep buyer usage records and creator financial records within their intended account context.

See [Money units](/developer-reference/loomloom-cli/money-units) for formatting and [Market for users](/developer-reference/loomloom-cli/market-for-users) for the quote/run flow.
