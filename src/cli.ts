#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { diff } from './diff';
import { apply, applyMergePatch } from './apply';
import { validate } from './validate';

const program = new Command();
program.name('json-patch').description('RFC 6902 JSON Patch — diff, apply, validate').version('1.0.0');

program.command('diff').description('Generate patch between two JSON files')
  .argument('<old>', 'Old JSON file')
  .argument('<new>', 'New JSON file')
  .action((oldF, newF) => {
    const patch = diff(JSON.parse(readFileSync(oldF, 'utf8')), JSON.parse(readFileSync(newF, 'utf8')));
    console.log(JSON.stringify(patch, null, 2));
  });

program.command('apply').description('Apply a JSON patch to a document')
  .argument('<doc>', 'JSON document file')
  .argument('<patch>', 'Patch file')
  .option('--merge', 'Use JSON Merge Patch (RFC 7396)')
  .action((docF, patchF, opts) => {
    const doc = JSON.parse(readFileSync(docF, 'utf8'));
    const patch = JSON.parse(readFileSync(patchF, 'utf8'));
    const result = opts.merge ? applyMergePatch(doc, patch) : apply(doc, patch);
    console.log(JSON.stringify(result, null, 2));
  });

program.command('validate').description('Validate a JSON patch')
  .argument('<patch>', 'Patch file')
  .action((patchF) => {
    const errors = validate(JSON.parse(readFileSync(patchF, 'utf8')));
    if (errors.length) { console.error('Invalid:'); errors.forEach(e => console.error(`  ${e}`)); process.exit(1); }
    else console.log('Valid patch ✓');
  });

program.parse();
