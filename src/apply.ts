import { PatchOperation } from './index';
import { validate } from './validate';

function getByPath(obj: any, parts: string[]): { parent: any; key: string } {
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    current = Array.isArray(current) ? current[parseInt(key)] : current[key];
    if (current === undefined) throw new Error(`Path not found: /${parts.slice(0, i + 1).join('/')}`);
  }
  return { parent: current, key: parts[parts.length - 1] };
}

function parsePath(path: string): string[] {
  return path.replace(/^\//, '').split('/').map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'));
}

export function apply(doc: any, patch: PatchOperation[]): any {
  const errors = validate(patch);
  if (errors.length) throw new Error(`Invalid patch: ${errors.join(', ')}`);
  doc = JSON.parse(JSON.stringify(doc));
  for (const op of patch) {
    const parts = parsePath(op.path);
    switch (op.op) {
      case 'add': {
        if (op.path === '/') { doc = op.value; break; }
        const { parent, key } = getByPath(doc, parts);
        if (Array.isArray(parent)) parent.splice(parseInt(key), 0, op.value);
        else parent[key] = op.value;
        break;
      }
      case 'remove': {
        const { parent, key } = getByPath(doc, parts);
        if (Array.isArray(parent)) parent.splice(parseInt(key), 1);
        else delete parent[key];
        break;
      }
      case 'replace': {
        if (op.path === '/') { doc = op.value; break; }
        const { parent, key } = getByPath(doc, parts);
        parent[key] = op.value;
        break;
      }
      case 'move': {
        const fromParts = parsePath(op.from!);
        const src = getByPath(doc, fromParts);
        const val = Array.isArray(src.parent) ? src.parent.splice(parseInt(src.key), 1)[0] : (() => { const v = src.parent[src.key]; delete src.parent[src.key]; return v; })();
        if (op.path === '/') { doc = val; break; }
        const dst = getByPath(doc, parts);
        if (Array.isArray(dst.parent)) dst.parent.splice(parseInt(dst.key), 0, val);
        else dst.parent[dst.key] = val;
        break;
      }
      case 'copy': {
        const fromParts = parsePath(op.from!);
        const src = getByPath(doc, fromParts);
        const val = JSON.parse(JSON.stringify(Array.isArray(src.parent) ? src.parent[parseInt(src.key)] : src.parent[src.key]));
        if (op.path === '/') { doc = val; break; }
        const dst = getByPath(doc, parts);
        if (Array.isArray(dst.parent)) dst.parent.splice(parseInt(dst.key), 0, val);
        else dst.parent[dst.key] = val;
        break;
      }
      case 'test': {
        const { parent, key } = getByPath(doc, parts);
        const actual = Array.isArray(parent) ? parent[parseInt(key)] : parent[key];
        if (JSON.stringify(actual) !== JSON.stringify(op.value)) throw new Error(`Test failed at ${op.path}`);
        break;
      }
    }
  }
  return doc;
}

export function applyMergePatch(doc: any, patch: any): any {
  if (typeof patch !== 'object' || patch === null) return patch;
  doc = typeof doc === 'object' && doc !== null ? JSON.parse(JSON.stringify(doc)) : {};
  for (const key of Object.keys(patch)) {
    if (patch[key] === null) delete doc[key];
    else if (typeof patch[key] === 'object' && !Array.isArray(patch[key])) doc[key] = applyMergePatch(doc[key], patch[key]);
    else doc[key] = patch[key];
  }
  return doc;
}
