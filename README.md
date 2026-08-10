# CogFoundry Documentation

This GitHub repository is the single source of truth and Mintlify deployment source for CogFoundry documentation.

- Documentation source: https://github.com/cogfoundry-labs/cogfoundry-docs
- LoomLoom product source: https://github.com/cogfoundry-labs/loomloom

## Content structure

- `documentation/` — Product documentation, concepts, guides, and privacy information.
- `developer-reference/` — LoomLoom API, CLI, TemplateSpec, and developer-facing operational references.
- `assets/` — Shared logos and documentation assets.
- `docs.json` — Mintlify navigation, branding, and site configuration.
- `style.css` — Global Mintlify styling overrides.

## Maintenance rules

Edit product content only under `documentation/` and developer-facing content only under `developer-reference/`. Every documentation page referenced by `docs.json` must remain inside one of these two content directories.

Validate changes before publishing:

```bash
mint validate
mint broken-links
```

Mintlify deploys the `main` branch. GitHub pushes and pull requests trigger production and preview deployments through the Mintlify GitHub App.
