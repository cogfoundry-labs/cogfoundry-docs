---
title: Uninstall
description: Remove the loomloom CLI, its main agent package, or a generated local Agent Skill.
icon: trash-2
---

The official uninstallers can remove the CLI and the main loomloom agent package together or separately.

## macOS and Linux

```bash
# Remove the CLI and main agent package
curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/uninstall.sh | bash

# Remove only the CLI
curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/uninstall.sh | bash -s -- --cli-only

# Remove only the main agent package
curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/uninstall.sh | bash -s -- --skill-only
```

## Windows PowerShell

```powershell
# Remove the CLI and main agent package
irm https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/uninstall.ps1 | iex

# Remove only the CLI
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/uninstall.ps1))) -CliOnly

# Remove only the main agent package
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/uninstall.ps1))) -SkillOnly
```

## Remove a generated local Agent Skill

A Skill generated from a Market SkillBot or private template version is separate from the main loomloom agent package. Run a dry run before removing it:

```bash
loomloom skill uninstall --dir <exact-skill-directory> --dry-run --output json
```

Review the Skill name, source, agent, directory, and files that will be deleted. After explicit confirmation:

```bash
loomloom skill uninstall --dir <exact-skill-directory>
```

Do not delete a generated Skill directory manually. If the dry run finds unexpected files, use `--force` only after you explicitly decide to remove the whole directory.

<Note>
  The standalone uninstaller removes the CLI, bundled loomloom Agent Skill, and local `config.json` according to the selected scope. It does not edit Token definitions in shell startup files or user-level environment settings. If it prints `environment token cleanup required: <variable>`, review that exact variable and remove it separately only when intended.
</Note>

Uninstalling local software does not delete remote templates, Listings, runs, usage records, or Customer Content retained under the applicable service policy.
