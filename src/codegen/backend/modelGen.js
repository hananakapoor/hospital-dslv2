import fs from 'fs';

const TYPE_MAP = {
  String: 'String', Number: 'Number', Date: 'Date',
  Boolean: 'Boolean', Email: 'String', Phone: 'String', Text: 'String',
};

export function generateModels(hospital) {
  fs.mkdirSync('generated/backend/models', { recursive: true });

  for (const mod of hospital.modules) {
    const fieldLines = mod.fields.map(f => {
      const t = TYPE_MAP[f.type] || 'String';
      const parts = [`type: ${t}`, `required: ${f.required}`];
      if (f.unique)           parts.push('unique: true');
      if (f.default !== null) parts.push(`default: "${f.default}"`);
      return `  ${f.name}: { ${parts.join(', ')} }`;
    }).join(',\n');

    const code = `const mongoose = require('mongoose');
const ${mod.id}Schema = new mongoose.Schema({
${fieldLines}
}, { timestamps: true });
module.exports = mongoose.model('${mod.id}', ${mod.id}Schema);
`;
    fs.writeFileSync(`generated/backend/models/${mod.id}Model.js`, code);
    console.log(`  📄 generated/backend/models/${mod.id}Model.js`);
  }

  // Availability Model
  const avail = `const mongoose = require('mongoose');
const AvailabilitySchema = new mongoose.Schema({
  doctorId:    { type: String, required: true, unique: true },
  doctorName:  { type: String, required: true },
  workingDays: { type: String, default: 'Mon-Fri' },
  startTime:   { type: String, default: '09:00' },
  endTime:     { type: String, default: '17:00' },
  slotDuration:{ type: Number, default: 30 },
}, { timestamps: true });
module.exports = mongoose.model('Availability', AvailabilitySchema);
`;
  fs.writeFileSync('generated/backend/models/AvailabilityModel.js', avail);
  console.log('  📄 generated/backend/models/AvailabilityModel.js');
}
