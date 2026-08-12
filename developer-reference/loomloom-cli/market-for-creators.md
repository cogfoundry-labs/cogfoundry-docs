---
title: Market for Creators
description: Publish and manage private-template versions as loomloom SkillBots.
icon: badge-dollar-sign
---

Publishing creates an immutable Listing Version snapshot from one private-template version. Later private-template changes do not alter the live SkillBot automatically.

The selected private-template version must have at least one successful run before publication. New publication also enforces [TS-TOPOLOGY-001](/developer-reference/loomloom-cli/private-templates): newly authored or published versions cannot use expanded execution.

## Submit for review

Describe the intended Listing, version, display name, and price, then obtain explicit confirmation before running:

```bash
loomloom listing publish <template-id> \
  --template-version-id <version-id> \
  --display-name "My SkillBot" \
  --description "What this SkillBot does" \
  --task-fixed-fee 0.5
```

`--task-fixed-fee` uses normal decimal currency units. Preserve the returned `reviewRequestId`.

## Publish a change

Use the same publish command with `--listing-id <listing-id>`:

- To change only price, submit the currently published private-template version with the new fee.
- To change execution behavior, submit the new private-template version.

The active Listing Version remains unchanged until the review is approved.

## Inspect and manage Listings

```bash
loomloom listing list
loomloom listing show <listing-id>
loomloom listing versions <listing-id>
loomloom listing update <listing-id> --description "Updated description"
loomloom listing unlist <listing-id>
loomloom listing relist <listing-id>
loomloom listing withdraw <listing-id> --reason "Reason"
```

`listing update` submits public profile changes for review; it does not change pricing or the execution version. `unlist` stops new calls, while `relist` resumes them when allowed.

Track review requests directly:

```bash
loomloom creator review list
loomloom creator review get <review-request-id>
loomloom creator review withdraw <review-request-id> --reason "Reason"
```

<Warning>
  Publishing, price or version changes, profile updates, unlisting, relisting, and review withdrawal all change persistent remote state. An agent must explain the exact change and obtain explicit confirmation before each command.
</Warning>

See [Usage and earnings](/developer-reference/loomloom-cli/usage-and-earnings) for creator financial records.
