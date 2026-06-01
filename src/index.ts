export { diff } from './diff';
export { apply, applyMergePatch } from './apply';
export { validate } from './validate';
export interface PatchOperation { op: 'add'|'remove'|'replace'|'move'|'copy'|'test'; path: string; value?: any; from?: string; }
