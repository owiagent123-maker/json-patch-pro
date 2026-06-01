import { PatchOperation } from './index';

function getByPath(obj: any, parts: string[]): any {
  let cur = obj;
  for (const p of parts) { if (cur == null) return undefined; cur = cur[p]; }
  return cur;
}

function setByPath(obj: any, parts: string[], value: any): void {
  if (parts.length === 0) return;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] == null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function removeByPath(obj: any, parts: string[]): void {
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  if (Array.isArray(cur)) cur.splice(Number(parts[parts.length - 1]), 1);
  else delete cur[parts[parts.length - 1]];
}

function parsePath(path: string): string[] {
  return path.replace(/^\//, '').split('/').map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'));
}

export function apply(doc: any, ops: PatchOperation[]): any {
  const result = JSON.parse(JSON.stringify(doc));
  for (const op of ops) {
    const parts = parsePath(op.path);
    switch (op.op) {
      case 'add': setByPath(result, parts, JSON.parse(JSON.stringify(op.value))); break;
      case 'remove': removeByPath(result, parts); break;
      case 'replace': setByPath(result, parts, JSON.parse(JSON.stringify(op.value))); break;
      case 'move': {
        const fromParts = parsePath(op.from!);
        const val = getByPath(result, fromParts);
        removeByPath(result, fromParts);
        setByPath(result, parts, val);
        break;
      }
      case 'copy': {
        const fromParts = parsePath(op.from!);
        setByPath(result, parts, JSON.parse(JSON.stringify(getByPath(result, fromParts))));
        break;
      }
      case 'test': {
        const actual = getByPath(result, parts);
        if (JSON.stringify(actual) !== JSON.stringify(op.value)) throw new Error(`Test failed at ${op.path}`);
        break;
      }
    }
  }
  return result;
}

export function applyMergePatch(doc: any, patch: any): any {
  if (patch === null || typeof patch !== 'object') return patch;
  const result = JSON.parse(JSON.stringify(doc || {}));
  for (const key of Object.keys(patch)) {
    if (patch[key] === null) { delete result[key]; }
    else if (typeof patch[key] === 'object' && !Array.isArray(patch[key]) && typeof result[key] === 'object') {
      result[key] = applyMergePatch(result[key], patch[key]);
    } else {
      result[key] = JSON.parse(JSON.stringify(patch[key]));
    }
  }
  return result;
}
