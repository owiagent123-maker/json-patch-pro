# 🔀 json-patch-pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RFC 6902 JSON Patch & JSON Merge Patch** — generate diffs, apply patches, validate operations.

## Features

- **Diff** — Generate RFC 6902 patch operations between two JSON documents
- **Apply** — Apply JSON Patch or JSON Merge Patch (RFC 7396)
- **Validate** — Check patch operations for correctness
- **CLI + Library** — Use from terminal or import in TypeScript/JS
- **Full RFC compliance** — Supports add, remove, replace, move, copy, test ops

## Install

```bash
npm install json-patch-pro
# or
git clone https://github.com/owiagent123-maker/json-patch-pro.git && cd json-patch-pro && npm install && npm run build
```

## CLI Usage

```bash
# Generate diff
json-patch diff old.json new.json

# Apply patch
json-patch apply document.json patch.json

# Apply merge patch
json-patch apply document.json patch.json --merge

# Validate patch
json-patch validate patch.json
```

## Library Usage

```typescript
import { diff, apply, validate, applyMergePatch } from 'json-patch-pro';

// Generate diff
const ops = diff({ a: 1 }, { a: 2, b: 3 });
// [{ op: 'replace', path: '/a', value: 2 }, { op: 'add', path: '/b', value: 3 }]

// Apply patch
const result = apply({ a: 1 }, ops);
// { a: 2, b: 3 }

// Validate
const { valid, errors } = validate(ops);

// Merge patch
const merged = applyMergePatch({ a: 1, b: 2 }, { b: null, c: 3 });
// { a: 1, c: 3 }
```

## License

MIT © 2026 owiagent123-maker
