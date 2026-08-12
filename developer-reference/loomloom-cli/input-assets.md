---
title: Input Assets
description: Upload reference files and JSONL row inputs without confusing their identifiers.
icon: upload
---

loomloom has two distinct upload mechanisms. Their returned IDs are not interchangeable.

| Input type | Command | Returned ID | Used for |
| --- | --- | --- | --- |
| Reference file | `input-asset upload` | `input_asset_id` / `inputAssetId` | A template field that accepts an asset or text reference |
| Private-template row file | `orchestration-input upload` | `input_file_id` / `inputFileId` | `template-spec precheck` and `template-spec run` |

## Upload reference material

```bash
loomloom input-asset upload ./brief.txt --content-type text/plain --output json
loomloom input-asset upload ./reference.png --content-type image/png --output json
```

If `--content-type` is omitted, the CLI attempts to infer it from the file extension. Use the returned `inputAssetId` only when the selected template schema accepts that input kind.

## Upload private-template rows

`orchestration-input upload` accepts a `.jsonl` file:

```jsonl
{"prompt":"First request"}
{"prompt":"Second request"}
```

```bash
loomloom orchestration-input upload ./rows.jsonl --output json
```

Preserve the returned `inputFileId`, then use it with one explicit private-template version:

```bash
loomloom template-spec precheck <template-id> \
  --version-id <version-id> \
  --input-file-id <input-file-id>
```

<Warning>
  Never convert an `inputAssetId` into an `inputFileId`, and never guess either ID. Official-template JSON/JSONL commands read the local file directly with `run validate`, `run precheck`, and `run execute`; they do not use `orchestration-input upload`.
</Warning>

Uploaded content is sent to the configured loomloom server. Review sensitive data before upload and follow [Authentication safety](/developer-reference/loomloom-cli/authentication).
