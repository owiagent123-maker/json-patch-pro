import { describe, it, expect } from 'vitest';
import { diff } from '../src/diff';
import { apply } from '../src/apply';
import { validate } from '../src/validate';

describe('diff', () => {
  it('detects added keys', () => {
    const ops = diff({ a: 1 }, { a: 1, b: 2 });
    expect(ops).toHaveLength(1);
    expect(ops[0]).toEqual({ op: 'add', path: '/b', value: 2 });
  });
  it('detects removed keys', () => {
    const ops = diff({ a: 1, b: 2 }, { a: 1 });
    expect(ops).toHaveLength(1);
    expect(ops[0]).toEqual({ op: 'remove', path: '/b' });
  });
  it('detects replaced values', () => {
    const ops = diff({ a: 1 }, { a: 2 });
    expect(ops).toHaveLength(1);
    expect(ops[0]).toEqual({ op: 'replace', path: '/a', value: 2 });
  });
  it('handles nested objects', () => {
    const ops = diff({ a: { b: 1 } }, { a: { b: 2 } });
    expect(ops).toHaveLength(1);
    expect(ops[0]).toEqual({ op: 'replace', path: '/a/b', value: 2 });
  });
  it('empty diff for identical objects', () => {
    expect(diff({ a: 1 }, { a: 1 })).toHaveLength(0);
  });
});

describe('apply', () => {
  it('applies add operation', () => {
    const result = apply({ a: 1 }, [{ op: 'add', path: '/b', value: 2 }]);
    expect(result).toEqual({ a: 1, b: 2 });
  });
  it('applies remove operation', () => {
    const result = apply({ a: 1, b: 2 }, [{ op: 'remove', path: '/b' }]);
    expect(result).toEqual({ a: 1 });
  });
  it('roundtrip diff+apply', () => {
    const old = { x: 1, y: [1, 2, 3], z: { a: 'hello' } };
    const neu = { x: 2, y: [1, 2], z: { a: 'world', b: true } };
    const ops = diff(old, neu);
    expect(apply(old, ops)).toEqual(neu);
  });
});

describe('validate', () => {
  it('validates correct ops', () => {
    expect(validate([{ op: 'add', path: '/a', value: 1 }]).valid).toBe(true);
  });
  it('rejects invalid op', () => {
    expect(validate([{ op: 'nope' as any, path: '/a' }]).valid).toBe(false);
  });
});
