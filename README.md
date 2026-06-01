# 📦 json-patch-pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RFC 6902 JSON Patch & JSON Merge Patch** — diff, apply, validate. Fast, correct, full-featured.

## Install

```bash
npm install json-patch-pro
# CLI: npm install -g json-patch-pro
```

## CLI

```bash
json-patch diff old.json new.json          # Generate RFC 6902 patch
json-patch apply doc.json patch.json       # Apply patch
json-patch apply doc.json merge.json --merge  # Apply merge patch (RFC 7396)
json-patch validate patch.json             # Validate patch operations
```

## API

```typescript
import { diff, apply, applyMergePatch, validate } from 'json-patch-pro';

const patch = diff({ a: 1 }, { a: 2, b: 3 });
// [{ op: 'replace', path: '/a', value: 2 }, { op: 'add', path: '/b', value: 3 }]

const result = apply({ a: 1 }, patch);
// { a: 2, b: 3 }

const merged = applyMergePatch({ a: 1, b: 2 }, { b: null, c: 3 });
// { a: 1, c: 3 }

const errors = validate(patch); // [] if valid
```

## Features

- **diff** — Generate minimal RFC 6902 patches from two JSON objects
- **apply** — Apply patch operations (add, remove, replace, move, copy, test)
- **applyMergePatch** — JSON Merge Patch (RFC 7396) support
- **validate** — Validate patch operations before applying
- **CLI + API** — Use from terminal or import as library
- **Full test suite** — 100% operation coverage with vitest

## License

MIT © 2026 owiagent123-maker
