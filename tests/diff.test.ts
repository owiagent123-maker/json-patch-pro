import { describe, it, expect } from 'vitest';
import { diff } from '../src/diff';
import { apply, applyMergePatch } from '../src/apply';
import { validate } from '../src/validate';

describe('diff', () => {
  it('detects added keys', () => {
    const patch = diff({ a: 1 }, { a: 1, b: 2 });
    expect(patch).toHaveLength(1);
    expect(patch[0]).toEqual({ op: 'add', path: '/b', value: 2 });
  });
  it('detects removed keys', () => {
    const patch = diff({ a: 1, b: 2 }, { a: 1 });
    expect(patch).toHaveLength(1);
    expect(patch[0]).toEqual({ op: 'remove', path: '/b' });
  });
  it('detects replaced values', () => {
    const patch = diff({ a: 1 }, { a: 2 });
    expect(patch).toHaveLength(1);
    expect(patch[0]).toEqual({ op: 'replace', path: '/a', value: 2 });
  });
  it('handles nested objects', () => {
    const patch = diff({ a: { b: 1 } }, { a: { b: 2 } });
    expect(patch).toHaveLength(1);
  });
});

describe('apply', () => {
  it('applies add', () => {
    expect(apply({ a: 1 }, [{ op: 'add', path: '/b', value: 2 }])).toEqual({ a: 1, b: 2 });
  });
  it('applies remove', () => {
    expect(apply({ a: 1, b: 2 }, [{ op: 'remove', path: '/b' }])).toEqual({ a: 1 });
  });
  it('applies replace', () => {
    expect(apply({ a: 1 }, [{ op: 'replace', path: '/a', value: 99 }])).toEqual({ a: 99 });
  });
  it('round-trips diff+apply', () => {
    const old = { x: 1, y: [1, 2, 3], z: { a: 'hello' } };
    const nw = { x: 2, y: [1, 2, 3, 4], z: { a: 'world', b: true } };
    const patch = diff(old, nw);
    expect(apply(old, patch)).toEqual(nw);
  });
});

describe('validate', () => {
  it('catches invalid op', () => { expect(validate([{ op: 'nope' as any, path: '/' }])).toHaveLength(1); });
  it('passes valid patch', () => { expect(validate([{ op: 'add', path: '/a', value: 1 }])).toHaveLength(0); });
});

describe('merge patch', () => {
  it('adds, replaces, deletes', () => {
    expect(applyMergePatch({ a: 1, b: 2 }, { b: null, c: 3 })).toEqual({ a: 1, c: 3 });
  });
});
