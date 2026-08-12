---
title: Local Agent Skills
description: Use the modular loomloom Skill and install template-specific wrappers for supported agents.
icon: bot
---

loomloom supports local Agent Skills for exactly three targets: `codex`, `claude`, and `openclaw`.

## Modular loomloom Skill

The current release packages one loomloom Skill per supported agent. Its entry file routes the agent to focused references for setup, execution, billing, Market, TemplateSpec, local Skill management, and CLI recovery. The package also includes generated English and Chinese TemplateSpec reference material and machine-readable validation rules.

This modular package is installed with loomloom. It guides agent behavior; it is not a local workflow runtime and does not itself execute an AI Workload.

## Install a template-specific wrapper

You can generate a local wrapper for either a Market SkillBot or one exact private-template version.

Always run a dry run first:

```bash
loomloom skill install market <listing-id> \
  --agent <codex|claude|openclaw> \
  --output-dir <skill-dir> \
  --dry-run \
  --output json
```

```bash
loomloom skill install template-spec <template-id> <version-id> \
  --agent <codex|claude|openclaw> \
  --output-dir <skill-dir> \
  --dry-run \
  --output json
```

The dry run returns the generated `skillName`, source binding, input fields, warnings, and whether the destination is installable. When an input field includes `enumValues`, present the allowed choices before installation. Generated names use the `loomloom-` prefix, and the final directory basename must match `skillName`.

After reviewing the exact destination and files, obtain explicit confirmation and repeat the same command without `--dry-run`.

<Info>
  Installing a wrapper writes local files only. It does not quote, precheck, or execute a template and does not create model/API usage. Every future hosted run still requires a current estimate and explicit confirmation.
</Info>

## Binding behavior

- A Market wrapper binds to the Listing. A recorded Listing Version is traceability only; future execution resolves the current sellable version and must use the Market quote/run flow.
- A private-template wrapper binds to the exact `template_id` and `version_id` and must use `template-spec` execution commands.

## Uninstall safely

Run a dry run before deleting files:

```bash
loomloom skill uninstall --dir <skill-dir> --dry-run --output json
```

Review `willDelete`, then obtain explicit confirmation before running:

```bash
loomloom skill uninstall --dir <skill-dir>
```

Do not delete generated Skill directories through the CLI with `--force` unless the dry run reports unexpected files and the user explicitly confirms removal of the entire directory.
