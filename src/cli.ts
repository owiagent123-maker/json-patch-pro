#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { diff } from './diff';
import { apply, applyMergePatch } from './apply';
import { validate } from './validate';

const program = new Command();
program.name('json-patch').description('RFC 6902 JSON Patch tool').version('1.0.0');

program.command('diff').description('Generate patch between two JSON files')
  .argument('<old>', 'Old JSON file')
  .argument('<new>', 'New JSON file')
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .action((oldFile, newFile, opts) => {
    const old = JSON.parse(readFileSync(oldFile, 'utf-8'));
    const neu = JSON.parse(readFileSync(newFile, 'utf-8'));
    const ops = diff(old, neu);
    const out = JSON.stringify(ops, null, 2);
    if (opts.output) writeFileSync(opts.output, out);
    else console.log(out);
  });

program.command('apply').description('Apply a JSON patch to a document')
  .argument('<doc>', 'JSON document file')
  .argument('<patch>', 'Patch operations file')
  .option('-o, --output <file>', 'Output file')
  .option('--merge', 'Use JSON Merge Patch (RFC 7396)')
  .action((docFile, patchFile, opts) => {
    const doc = JSON.parse(readFileSync(docFile, 'utf-8'));
    const patch = JSON.parse(readFileSync(patchFile, 'utf-8'));
    const result = opts.merge ? applyMergePatch(doc, patch) : apply(doc, patch);
    const out = JSON.stringify(result, null, 2);
    if (opts.output) writeFileSync(opts.output, out);
    else console.log(out);
  });

program.command('validate').description('Validate patch operations')
  .argument('<patch>', 'Patch file to validate')
  .action((patchFile) => {
    const ops = JSON.parse(readFileSync(patchFile, 'utf-8'));
    const result = validate(ops);
    if (result.valid) console.log('✅ Valid patch');
    else { console.log('❌ Invalid patch:'); result.errors.forEach(e => console.log(`  ${e}`)); process.exit(1); }
  });

program.parse();
