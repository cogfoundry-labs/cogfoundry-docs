---
title: Exit Codes
description: Handle loomloom CLI process status safely in scripts and agents.
icon: binary
---

| Code | Meaning |
| --- | --- |
| `0` | The command completed without a CLI error |
| `1` | The command returned an error, including invalid arguments, failed validation, network/authentication errors, timeouts, or server errors |

The CLI does not assign stable numeric codes to individual error categories. Read stderr and, when available, structured stdout.

```bash
if result=$(loomloom run validate <template-id> --file rows.jsonl --output json); then
  printf '%s\n' "$result"
else
  printf 'Validation failed\n' >&2
  exit 1
fi
```

## Important behaviors

- A validation command can write structured validation details and still exit `1` when the input is invalid.
- `run watch --max-wait` exits `1` if the wait limit is reached before a terminal status.
- `doctor` can exit `0` while reporting `healthy: false` and a credential action. Inspect its JSON fields instead of relying only on `$?`.
- `--output json` does not guarantee that every CLI-generated error is emitted as JSON; errors are written to stderr.

After an ambiguous error from a paid or remote-state-changing command, query the relevant run, usage transaction, Listing, or review request before retrying. See [Troubleshooting](/developer-reference/loomloom-cli/troubleshooting).
