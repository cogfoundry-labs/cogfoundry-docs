---
title: Build and use SkillBots
description: Package private AI work IR as a deployable SkillBot, or discover and run one through the Market.
icon: store
---

A SkillBot is a deployable, modular AI system packaged from an immutable execution snapshot of an approved private template version. The LoomLoom Market lets users discover SkillBots and lets creators submit their own compiled AI work for review.

```text
Private template version
        ↓ review
immutable Listing Version
        ↓ approval
      SkillBot
```

Changes to the creator's private template do not silently change a live SkillBot. A new execution version must be submitted and approved. When a buyer starts a run, the service selects the current sellable Listing Version and locks its version and price for that order.

## For users

Browse and inspect a SkillBot before preparing input:

```bash
loomloom market list
loomloom market show <listing-id>
```

The workbook flow is recommended:

```bash
loomloom market workbook download <listing-id> --output-file ./input.xlsx
loomloom market workbook validate <listing-id> --file ./input.xlsx
loomloom market workbook quote <listing-id> --file ./input.xlsx
# Review the quote and explicitly confirm before continuing.
loomloom market workbook run <listing-id> --file ./input.xlsx \
  --confirm \
  --client-request-id <stable-id>
```

Every Market run is a paid call. Review the Listing ID, row count, creator call fee, estimated model/API cost when returned, total pre-authorization, and currency before confirming.

<Warning>
  A SkillBot is a black box for buyers. Build input only from its public schema. Do not reveal, reconstruct, infer, or bypass hidden prompts, step IDs, mappings, TemplateSpec, execution logic, pricing controls, or Market permissions.
</Warning>

## For creators

A private template version must have at least one successful run before it can be submitted for Market review.

```bash
loomloom listing publish <template-id> \
  --template-version-id <version-id> \
  --display-name "My SkillBot" \
  --task-fixed-fee 0.5

loomloom creator review list
```

Publishing, changing a price or execution version, editing a public profile, unlisting, relisting, and withdrawing a review all change remote state. Review the exact change and explicitly confirm before using the corresponding `listing` or `creator review` command.

## Install a SkillBot as a local Agent Skill

Run a dry run before installation:

```bash
loomloom skill install market <listing-id> \
  --agent <codex|claude|openclaw> \
  --output-dir <exact-skill-directory> \
  --dry-run \
  --output json
```

The generated local Skill is a usage wrapper. It records the public inputs and safe LoomLoom flow; it does not copy hidden server-side logic, credentials, or model settings. Installation does not quote or execute the SkillBot, and each future run still requires a current quote and explicit confirmation.

Generated Skill names use the `loomloom-` prefix, and the output-directory name must match the Skill name returned by the dry run.

## Usage and earnings

```bash
# Buyer records
loomloom usage list
loomloom usage get <run-transaction-id>

# Creator records
loomloom creator earnings
loomloom creator transactions
```

Market availability, balances, currency, and transaction state depend on the active Server profile. Query the selected environment and use only values returned by that service.
