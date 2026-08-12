---
title: Install loomloom
description: Install the loomloom CLI and its integration package from GitHub.
icon: download
---

The loomloom CLI is the developer interface for defining, compiling, executing, and managing AI work as software. The official installer also installs the integration package for one supported agent. These docs cover the `v0.2.1` public beta release.

<Note>
  Running the installer without `--version` resolves the latest stable release. Use `--channel beta` when you explicitly want the newest beta build.
</Note>

## macOS and Linux

```bash
curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.sh | bash
```

To pin a release or select the beta channel:

```bash
curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.sh | \
  bash -s -- --version <release-tag>

curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.sh | \
  bash -s -- --channel beta
```

Choose another supported agent with `--agent`:

```bash
# Claude Code
curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.sh | \
  bash -s -- --agent claude

# OpenClaw
curl -fsSL https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.sh | \
  bash -s -- --agent openclaw
```

## Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.ps1 | iex
```

To install the package for another agent:

```powershell
# Claude Code
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.ps1))) -Agent claude

# OpenClaw
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/cogfoundry-labs/loomloom/main/install.ps1))) -Agent openclaw
```

## Verify the installation

```bash
loomloom --version
```

Next, [configure your credentials](/documentation/loomloom/configure-credentials) and run:

```bash
loomloom doctor --output json
```

The agent package uses a small core Skill plus focused reference modules for setup, execution, billing, TemplateSpec, Market, local Skills, and CLI error handling. The installer places the complete package for the selected agent.

<Info>
  GitHub is the default distribution source. Choosing GitHub or an explicitly requested Gitee mirror does not select a loomloom platform, Server, or credential.
</Info>
