import { PatchOperation } from './index';

export function validate(ops: PatchOperation[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validOps = ['add', 'remove', 'replace', 'move', 'copy', 'test'];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (!validOps.includes(op.op)) errors.push(`[${i}] Invalid op: ${op.op}`);
    if (!op.path || !op.path.startsWith('/')) errors.push(`[${i}] Invalid path: ${op.path}`);
    if ((op.op === 'move' || op.op === 'copy') && (!op.from || !op.from.startsWith('/'))) errors.push(`[${i}] Missing/invalid from: ${op.from}`);
    if (['add', 'replace', 'test'].includes(op.op) && op.value === undefined) errors.push(`[${i}] Missing value for ${op.op}`);
  }
  return { valid: errors.length === 0, errors };
}
