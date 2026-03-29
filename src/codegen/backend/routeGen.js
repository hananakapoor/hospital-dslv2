import fs from 'fs';

export function generateHMSRoutes(hospital) {
  fs.mkdirSync('generated/backend/routes', { recursive: true });

  // ── Generic CRUD for Admin-managed modules ─────────────────
  const adminModules = ['Doctor', 'Patient', 'Department'];
  for (const name of adminModules) {
    const mod = hospital.modules.find(m => m.id === name);
    if (!mod) continue;
    const code = `const express = require('express');
const router  = express.Router();
const ${name}Model = require('../models/${name}Model');
const { requireRole } = require('../middleware/authMiddleware');

// GET all
router.get('/', async (req, res) => {
  try {
    const items = await ${name}Model.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const item = await ${name}Model.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST — Admin only
router.post('/', requireRole('Admin'), async (req, res) => {
  try {
    const item = new ${name}Model(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT — Admin only
router.put('/:id', requireRole('Admin'), async (req, res) => {
  try {
    const item = await ${name}Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE — Admin only
router.delete('/:id', requireRole('Admin'), async (req, res) => {
  try {
    await ${name}Model.findByIdAndDelete(req.params.id);
    res.json({ message: '${name} deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
`;
    fs.writeFileSync(`generated/backend/routes/${name}Routes.js`, code);
    console.log(`  📄 generated/backend/routes/${name}Routes.js`);
  }

  // ── Appointment Routes ──────────────────────────────────────
  const apptRoutes = `const express = require('express');
const router  = express.Router();
const Appointment = require('../models/AppointmentModel');
const { requireRole } = require('../middleware/authMiddleware');

// Patient: book appointment
router.post('/book', requireRole('Patient'), async (req, res) => {
  try {
    const appt = new Appointment({
      ...req.body,
      patientId:   req.user.patientId,
      patientName: req.user.name,
      status: 'Pending'
    });
    await appt.save();
    res.status(201).json(appt);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Patient: get own appointments
router.get('/my', requireRole('Patient'), async (req, res) => {
  try {
    const items = await Appointment.find({ patientId: req.user.patientId }).sort({ date: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Patient: cancel appointment
router.put('/cancel/:id', requireRole('Patient'), async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, patientId: req.user.patientId });
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    if (!['Pending', 'Approved'].includes(appt.status))
      return res.status(400).json({ error: 'Cannot cancel this appointment' });
    appt.status = 'Cancelled';
    await appt.save();
    res.json(appt);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Doctor: get own schedule
router.get('/doctor/schedule', requireRole('Doctor'), async (req, res) => {
  try {
    const items = await Appointment.find({ doctorId: req.user.doctorId }).sort({ date: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Doctor: update appointment status
router.put('/status/:id', requireRole('Doctor'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appt = await Appointment.findOne({ _id: req.params.id, doctorId: req.user.doctorId });
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    appt.status = status;
    if (notes) appt.notes = notes;
    await appt.save();
    res.json(appt);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get available slots — uses Availability record, falls back to Doctor record defaults
router.get('/slots/:doctorId/:date', async (req, res) => {
  try {
    const Availability = require('../models/AvailabilityModel');
    const Doctor       = require('../models/DoctorModel');

    let startTime    = '09:00';
    let endTime      = '17:00';
    let slotDuration = 30;

    const avail = await Availability.findOne({ doctorId: req.params.doctorId });
    if (avail) {
      startTime    = avail.startTime    || startTime;
      endTime      = avail.endTime      || endTime;
      slotDuration = avail.slotDuration || slotDuration;
    } else {
      // Fall back to doctor record fields
      const doctor = await Doctor.findById(req.params.doctorId);
      if (doctor) {
        startTime = doctor.startTime || startTime;
        endTime   = doctor.endTime   || endTime;
      }
    }

    // Generate all time slots
    const slots = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH,   endM]   = endTime.split(':').map(Number);
    let current = startH * 60 + startM;
    const end   = endH   * 60 + endM;

    while (current + slotDuration <= end) {
      const h = Math.floor(current / 60).toString().padStart(2, '0');
      const m = (current % 60).toString().padStart(2, '0');
      slots.push(\`\${h}:\${m}\`);
      current += slotDuration;
    }

    // Remove already booked slots for this date
    const booked = await Appointment.find({
      doctorId: req.params.doctorId,
      date:     req.params.date,
      status:   { $in: ['Pending', 'Approved'] }
    });
    const bookedSlots = new Set(booked.map(a => a.timeSlot));
    res.json({ slots: slots.filter(s => !bookedSlots.has(s)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: get all appointments
router.get('/all', requireRole('Admin'), async (req, res) => {
  try {
    const items = await Appointment.find().sort({ date: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
`;
  fs.writeFileSync('generated/backend/routes/AppointmentRoutes.js', apptRoutes);
  console.log('  📄 generated/backend/routes/AppointmentRoutes.js');

  // ── Prescription Routes ─────────────────────────────────────
  const rxRoutes = `const express = require('express');
const router  = express.Router();
const Prescription = require('../models/PrescriptionModel');
const { requireRole } = require('../middleware/authMiddleware');

// Doctor: write prescription
router.post('/write', requireRole('Doctor'), async (req, res) => {
  try {
    const rx = new Prescription({
      ...req.body,
      doctorId:   req.user.doctorId,
      doctorName: req.user.name,
      date: new Date().toISOString().split('T')[0]
    });
    await rx.save();
    res.status(201).json(rx);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Doctor: prescriptions they wrote
router.get('/doctor', requireRole('Doctor'), async (req, res) => {
  try {
    const items = await Prescription.find({ doctorId: req.user.doctorId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Patient: own prescriptions
router.get('/my', requireRole('Patient'), async (req, res) => {
  try {
    const items = await Prescription.find({ patientId: req.user.patientId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: all prescriptions
router.get('/all', requireRole('Admin'), async (req, res) => {
  try {
    const items = await Prescription.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
`;
  fs.writeFileSync('generated/backend/routes/PrescriptionRoutes.js', rxRoutes);
  console.log('  📄 generated/backend/routes/PrescriptionRoutes.js');

  // ── Lab Report Routes ───────────────────────────────────────
  const labRoutes = `const express = require('express');
const router  = express.Router();
const LabReport = require('../models/LabReportModel');
const { requireRole } = require('../middleware/authMiddleware');

// Doctor: upload lab report
router.post('/upload', requireRole('Doctor'), async (req, res) => {
  try {
    const report = new LabReport({
      ...req.body,
      doctorId:   req.user.doctorId,
      doctorName: req.user.name,
      testDate: new Date().toISOString().split('T')[0]
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Doctor: reports they uploaded
router.get('/doctor', requireRole('Doctor'), async (req, res) => {
  try {
    const items = await LabReport.find({ doctorId: req.user.doctorId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Patient: own reports
router.get('/my', requireRole('Patient'), async (req, res) => {
  try {
    const items = await LabReport.find({ patientId: req.user.patientId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: all reports
router.get('/all', requireRole('Admin'), async (req, res) => {
  try {
    const items = await LabReport.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
`;
  fs.writeFileSync('generated/backend/routes/LabReportRoutes.js', labRoutes);
  console.log('  📄 generated/backend/routes/LabReportRoutes.js');

  // ── Availability Routes ─────────────────────────────────────
  const availRoutes = `const express = require('express');
const router  = express.Router();
const Availability = require('../models/AvailabilityModel');
const { requireRole } = require('../middleware/authMiddleware');

// Doctor: get own availability
router.get('/my', requireRole('Doctor'), async (req, res) => {
  try {
    const avail = await Availability.findOne({ doctorId: req.user.doctorId });
    res.json(avail || {
      doctorId:     req.user.doctorId,
      workingDays:  'Mon-Fri',
      startTime:    '09:00',
      endTime:      '17:00',
      slotDuration: 30
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Doctor: set availability
router.post('/set', requireRole('Doctor'), async (req, res) => {
  try {
    const avail = await Availability.findOneAndUpdate(
      { doctorId: req.user.doctorId },
      { ...req.body, doctorId: req.user.doctorId, doctorName: req.user.name },
      { upsert: true, new: true }
    );
    res.json(avail);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
`;
  fs.writeFileSync('generated/backend/routes/AvailabilityRoutes.js', availRoutes);
  console.log('  📄 generated/backend/routes/AvailabilityRoutes.js');

  // ── Admin Routes ────────────────────────────────────────────
  const adminRoutes = `const express = require('express');
const router  = express.Router();
const { requireRole } = require('../middleware/authMiddleware');

// Admin: system stats
router.get('/stats', requireRole('Admin'), async (req, res) => {
  try {
    const Doctor       = require('../models/DoctorModel');
    const Patient      = require('../models/PatientModel');
    const Appointment  = require('../models/AppointmentModel');
    const Prescription = require('../models/PrescriptionModel');
    const LabReport    = require('../models/LabReportModel');

    const [doctors, patients, appointments, prescriptions, labReports,
           pendingAppts, completedAppts] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Prescription.countDocuments(),
      LabReport.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Completed' }),
    ]);

    res.json({ doctors, patients, appointments, prescriptions, labReports, pendingAppts, completedAppts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Doctor: get full patient history
router.get('/patient-history/:patientId', requireRole('Doctor'), async (req, res) => {
  try {
    const Patient      = require('../models/PatientModel');
    const Appointment  = require('../models/AppointmentModel');
    const Prescription = require('../models/PrescriptionModel');
    const LabReport    = require('../models/LabReportModel');

    const [profile, appointments, prescriptions, labReports] = await Promise.all([
      Patient.findById(req.params.patientId),
      Appointment.find({ patientId: req.params.patientId }).sort({ date: -1 }),
      Prescription.find({ patientId: req.params.patientId }).sort({ createdAt: -1 }),
      LabReport.find({ patientId: req.params.patientId }).sort({ createdAt: -1 }),
    ]);

    res.json({ profile, appointments, prescriptions, labReports });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
`;
  fs.writeFileSync('generated/backend/routes/AdminRoutes.js', adminRoutes);
  console.log('  📄 generated/backend/routes/AdminRoutes.js');
}
