import fs from 'fs';

export function generateServer(hospital) {
  fs.mkdirSync('generated', { recursive: true });

  const routeImports = hospital.modules.map(m => {
    const endpoint = m.id.toLowerCase() + 's';
    return `app.use('/api/${endpoint}', require('./backend/routes/${m.id}Routes'));`;
  }).join('\n');

  const code = `const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/hospitaldsl')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

${routeImports}

app.get('/health', (req, res) => res.json({ status: 'ok', hospital: '${hospital.name}' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🚀 Server running on http://localhost:\${PORT}\`));
`;

  fs.writeFileSync('generated/server.js', code);
  console.log('  📄 generated/server.js');

  const pkg = {
    name: hospital.name.toLowerCase() + '-backend',
    version: '1.0.0',
    main: 'server.js',
    scripts: { start: 'node server.js', dev: 'nodemon server.js' },
    dependencies: {
      express: '^4.18.2', mongoose: '^7.6.3',
      cors: '^2.8.5', dotenv: '^16.3.1'
    },
    devDependencies: { nodemon: '^3.0.1' }
  };
  fs.writeFileSync('generated/package.json', JSON.stringify(pkg, null, 2));
  console.log('  📄 generated/package.json');

  fs.writeFileSync('generated/.env', 'MONGO_URI=mongodb://localhost:27017/hospitaldsl\nPORT=5000\n');
  console.log('  📄 generated/.env');
}