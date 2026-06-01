import { PatchOperation } from './index';

export function validate(patch: PatchOperation[]): string[] {
  const errors: string[] = [];
  const validOps = ['add', 'remove', 'replace', 'move', 'copy', 'test'];
  for (let i = 0; i < patch.length; i++) {
    const op = patch[i];
    if (!validOps.includes(op.op)) errors.push(`[${i}] Invalid op: ${op.op}`);
    if (typeof op.path !== 'string' || !op.path.startsWith('/')) errors.push(`[${i}] Invalid path: ${op.path}`);
    if (['move', 'copy'].includes(op.op) && !op.from?.startsWith('/')) errors.push(`[${i}] Missing/invalid from for ${op.op}`);
    if (['add', 'replace', 'test'].includes(op.op) && op.value === undefined) errors.push(`[${i}] Missing value for ${op.op}`);
    if (['remove'].includes(op.op) && 'value' in (op as any)) errors.push(`[${i}] Remove should not have value`);
  }
  return errors;
}
