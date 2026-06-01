import { PatchOperation } from './index';

export function diff(oldObj: any, newObj: any, path = ''): PatchOperation[] {
  const ops: PatchOperation[] = [];
  if (oldObj === newObj) return ops;
  if (oldObj === null || oldObj === undefined || newObj === null || newObj === undefined || typeof oldObj !== typeof newObj || typeof oldObj !== 'object' || Array.isArray(oldObj) !== Array.isArray(newObj)) {
    ops.push({ op: 'replace', path: path || '/', value: newObj });
    return ops;
  }
  if (Array.isArray(oldObj)) {
    const maxLen = Math.max(oldObj.length, newObj.length);
    for (let i = 0; i < maxLen; i++) {
      const p = `${path}/${i}`;
      if (i >= oldObj.length) ops.push({ op: 'add', path: p, value: newObj[i] });
      else if (i >= newObj.length) ops.push({ op: 'remove', path: p });
      else ops.push(...diff(oldObj[i], newObj[i], p));
    }
    return ops;
  }
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  for (const key of allKeys) {
    const p = `${path}/${key}`;
    if (!(key in oldObj)) ops.push({ op: 'add', path: p, value: newObj[key] });
    else if (!(key in newObj)) ops.push({ op: 'remove', path: p });
    else ops.push(...diff(oldObj[key], newObj[key], p));
  }
  return ops;
}
