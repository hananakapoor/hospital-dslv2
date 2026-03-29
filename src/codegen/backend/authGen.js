import fs from 'fs';

export function generateAuthServer(hospital) {
  fs.mkdirSync('generated', { recursive: true });
  const { expiry } = hospital.auth;

  const code = `const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();
const { protect } = require('./backend/middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/hospitaldsl')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ── Public routes ──────────────────────────────────────────
app.use('/api/auth', require('./backend/routes/AuthRoutes'));

// ── HMS specific routes ────────────────────────────────────
app.use('/api/doctors',       protect, require('./backend/routes/DoctorRoutes'));
app.use('/api/patients',      protect, require('./backend/routes/PatientRoutes'));
app.use('/api/departments',   protect, require('./backend/routes/DepartmentRoutes'));
app.use('/api/appointments',  protect, require('./backend/routes/AppointmentRoutes'));
app.use('/api/prescriptions', protect, require('./backend/routes/PrescriptionRoutes'));
app.use('/api/labreports',    protect, require('./backend/routes/LabReportRoutes'));
app.use('/api/availability',  protect, require('./backend/routes/AvailabilityRoutes'));
app.use('/api/admin',         protect, require('./backend/routes/AdminRoutes'));

app.get('/health', (req, res) => res.json({ status: 'ok', hospital: '${hospital.name}' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🚀 Server running on http://localhost:\${PORT}\`));
`;
  fs.writeFileSync('generated/server.js', code);
  console.log('  📄 generated/server.js');

  const pkg = {
    name: hospital.name.toLowerCase() + '-backend',
    version: '1.0.0', main: 'server.js',
    scripts: { start: 'node server.js', dev: 'nodemon server.js' },
    dependencies: {
      express: '^4.18.2', mongoose: '^7.6.3', cors: '^2.8.5',
      dotenv: '^16.3.1', bcryptjs: '^2.4.3', jsonwebtoken: '^9.0.2'
    },
    devDependencies: { nodemon: '^3.0.1' }
  };
  fs.writeFileSync('generated/package.json', JSON.stringify(pkg, null, 2));
  fs.writeFileSync('generated/.env', 'MONGO_URI=mongodb://localhost:27017/hospitaldsl\nPORT=5000\nJWT_SECRET=hospitaldsl_secret_change_me\n');
  console.log('  📄 generated/package.json + .env');
}

export function generateBackendAuth(hospital) {
  const { roles, expiry } = hospital.auth;
  fs.mkdirSync('generated/backend/models',     { recursive: true });
  fs.mkdirSync('generated/backend/routes',     { recursive: true });
  fs.mkdirSync('generated/backend/middleware', { recursive: true });

  // ── User Model (Admin + Doctor accounts) ──────────────────
  const userModel = `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['Admin', 'Doctor'], required: true },
  name:     { type: String, required: true },
  doctorId: { type: String, default: null }, // links Doctor account to Doctor record
}, { timestamps: true });
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.comparePassword = async function(c) {
  return require('bcryptjs').compare(c, this.password);
};
module.exports = mongoose.model('User', UserSchema);
`;
  fs.writeFileSync('generated/backend/models/UserModel.js', userModel);

  // ── Patient Account Model ──────────────────────────────────
  const patientAccountModel = `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const PatientAccountSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String },
  role:      { type: String, default: 'Patient' },
  patientId: { type: String, default: null }, // links to Patient record
}, { timestamps: true });
PatientAccountSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await require('bcryptjs').hash(this.password, 10);
  next();
});
PatientAccountSchema.methods.comparePassword = async function(c) {
  return require('bcryptjs').compare(c, this.password);
};
module.exports = mongoose.model('PatientAccount', PatientAccountSchema);
`;
  fs.writeFileSync('generated/backend/models/PatientAccountModel.js', patientAccountModel);
  console.log('  📄 Auth models written');

  // ── Middleware ─────────────────────────────────────────────
  const middleware = `const jwt  = require('jsonwebtoken');
const User           = require('../models/UserModel');
const PatientAccount = require('../models/PatientAccountModel');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Not authorized' });
  try {
    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hospitaldsl_secret');
    req.user = decoded.type === 'patient'
      ? await PatientAccount.findById(decoded.id).select('-password')
      : await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: \`Access denied for role '\${req.user.role}'\` });
  next();
};

module.exports = { protect, requireRole };
`;
  fs.writeFileSync('generated/backend/middleware/authMiddleware.js', middleware);
  console.log('  📄 generated/backend/middleware/authMiddleware.js');

  // ── Auth Routes ────────────────────────────────────────────
  const authRoutes = `const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User           = require('../models/UserModel');
const PatientAccount = require('../models/PatientAccountModel');
const Patient        = require('../models/PatientModel');
const { protect }    = require('../middleware/authMiddleware');
const JWT_SECRET = process.env.JWT_SECRET || 'hospitaldsl_secret';
const JWT_EXPIRY = '${expiry}';

// Staff register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, name, doctorId } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'Username already exists' });
    const user  = new User({ username, password, role, name, doctorId: doctorId || null });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role, type: 'staff', doctorId: user.doctorId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name, type: 'staff', doctorId: user.doctorId } });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Staff login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ id: user._id, role: user.role, type: 'staff', doctorId: user.doctorId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name, type: 'staff', doctorId: user.doctorId } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Patient self-register
router.post('/patient/register', async (req, res) => {
  try {
    const { username, password, name, email, phone } = req.body;
    const exists = await PatientAccount.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: 'Username or email already exists' });

    // Create patient account
    const account = new PatientAccount({ username, password, name, email, phone });
    await account.save();

    // Auto-create patient record
    const Patient = require('../models/PatientModel');
    const record  = new Patient({ name, email, phone: phone || '', age: 0 });
    await record.save();

    // Link account to record
    account.patientId = record._id.toString();
    await account.save();

    const token = jwt.sign({ id: account._id, role: 'Patient', type: 'patient', patientId: account.patientId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.status(201).json({ token, user: { id: account._id, username: account.username, name: account.name, role: 'Patient', type: 'patient', patientId: account.patientId } });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Patient login
router.post('/patient/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const account = await PatientAccount.findOne({ username });
    if (!account || !(await account.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ id: account._id, role: 'Patient', type: 'patient', patientId: account.patientId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.json({ token, user: { id: account._id, username: account.username, name: account.name, role: 'Patient', type: 'patient', patientId: account.patientId } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all staff users (admin only)
router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
`;
  fs.writeFileSync('generated/backend/routes/AuthRoutes.js', authRoutes);
  console.log('  📄 generated/backend/routes/AuthRoutes.js');
}
