---
title: Market for Users
description: Discover, quote, and run loomloom Market SkillBots as a buyer.
icon: store
---

A SkillBot is the public, paid form of an approved private-template version. Buyers discover and call a Listing; the service selects the current sellable Listing Version and locks its version and price when the order is created.

## Discover the public input contract

```bash
loomloom market list --keyword "copywriting"
loomloom market show <listing-id> --output json
```

Build input only from the Listing's public schema:

- Display `fields[].label` to users.
- Submit each public `fields[].key` in `inputRows`.
- Honor `required`, value type, and published sample rows.
- Never reveal or reconstruct hidden prompts, internal steps, mappings, workflow definitions, or TemplateSpec.

## Workbook flow

```bash
loomloom market workbook download <listing-id> \
  --output-file ./input.xlsx
# Fill and review the workbook.
loomloom market workbook validate <listing-id> --file ./input.xlsx
loomloom market workbook quote <listing-id> --file ./input.xlsx
# Show the buyer-facing quote and obtain explicit confirmation.
loomloom market workbook run <listing-id> \
  --file ./input.xlsx \
  --confirm \
  --client-request-id <new-id>
```

## JSON flow

For programmatic input, prepare public `inputRows`:

```json
{
  "inputRows": [
    { "prompt": "Write a launch announcement" }
  ]
}
```

```bash
loomloom market quote <listing-id> --input-file ./request.json
# Show the buyer-facing quote and obtain explicit confirmation.
loomloom market run <listing-id> \
  --input-file ./request.json \
  --confirm \
  --client-request-id <new-id>
```

<Warning>
  A prior quote or confirmation is not reusable after input or Listing choice changes. Quote again, show the new estimate, obtain a new confirmation, and use a new client request ID.
</Warning>

## Track the call

Preserve both identifiers returned by a successful Market run:

- `runTransactionId` for `loomloom usage get <run-transaction-id>`
- `runId` for `run watch`, `run get`, and result commands

See [Usage and earnings](/developer-reference/loomloom-cli/usage-and-earnings) for transaction states and [Money units](/developer-reference/loomloom-cli/money-units) for currency handling.
