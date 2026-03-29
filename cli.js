#!/usr/bin/env node
import fs from 'fs';
import { parseDSL }     from './src/ir/transformer.js';
import { generateCode } from './src/codegen/generator.js';

const args      = process.argv.slice(2);
const command   = args[0];
const inputFile = args[1];

if (!inputFile) {
  console.log(`
Usage:
  node cli.js validate <file.hospital>
  node cli.js generate <file.hospital>
`);
  process.exit(1);
}

const dslContent = fs.readFileSync(inputFile, 'utf-8');

if (command === 'validate') {
  try {
    const result = parseDSL(dslContent);
    console.log('\n✅ DSL is valid!\n');
    console.log(`Hospital : ${result.name}`);
    console.log(`Modules  : ${result.modules.length}`);
    for (const m of result.modules) {
      console.log(`  • ${m.id} (${m.label}) — ${m.fields.length} fields`);
    }
    console.log(`\nRoles    : ${Object.keys(result.roles).join(', ')}`);
    for (const [roleName, role] of Object.entries(result.roles)) {
      if (role.portal.length)    console.log(`  • ${roleName} portal:   ${role.portal.join(', ')}`);
      if (role.manage.length)    console.log(`  • ${roleName} manages:  ${role.manage.join(', ')}`);
      if (role.dashboard.length) console.log(`  • ${roleName} dashboard:${role.dashboard.join(', ')}`);
    }
    if (result.auth) {
      console.log(`\nAuth     : ${result.auth.type}, expires ${result.auth.expiry}`);
      console.log(`  Roles  : ${result.auth.roles.join(', ')}`);
    }
  } catch (err) {
    console.error('❌ Invalid DSL:', err.message);
    process.exit(1);
  }

} else if (command === 'generate') {
  try {
    const hospital = parseDSL(dslContent);
    fs.mkdirSync('generated', { recursive: true });
    fs.writeFileSync('generated/hospital.json', JSON.stringify(hospital, null, 2));
    console.log('📄 generated/hospital.json');
    await generateCode(hospital);
  } catch (err) {
    console.error('❌ Generation failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }

} else {
  console.log(`Unknown command: ${command}`);
  console.log('Use: validate or generate');
}
