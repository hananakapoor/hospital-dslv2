import fs from 'fs';

export function generateDoctorPortal(hospital) {
  fs.mkdirSync('generated/frontend/src/pages/doctor', { recursive: true });

  const hasPrescription = hospital.modules.some(m => m.id === 'Prescription');
  const hasLabReport    = hospital.modules.some(m => m.id === 'LabReport');

  const tabs = ['MySchedule', 'PatientHistory', 'SetAvailability'];
  if (hasPrescription) tabs.splice(1, 0, 'WritePrescription');
  if (hasLabReport)    tabs.splice(hasPrescription ? 2 : 1, 0, 'UploadLabReport');

  const tabConfig = tabs.map(t => {
    const map = {
      MySchedule:       { label: 'My Schedule',      icon: '🗓️' },
      WritePrescription:{ label: 'Write Prescription',icon: '💊' },
      UploadLabReport:  { label: 'Upload Lab Report', icon: '🧪' },
      PatientHistory:   { label: 'Patient History',   icon: '📋' },
      SetAvailability:  { label: 'My Availability',   icon: '⚙️' },
    };
    return { id: t, ...map[t] };
  });

  const code = `import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

const TABS = ${JSON.stringify(tabConfig, null, 2)};

export default function DoctorPortal() {
  const { token, user } = useAuth();
  const [tab, setTab]   = useState('MySchedule');
  const headers = { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` };

  return (
    <div className="flex h-full">
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col py-4">
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Doctor Menu</p>
        </div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={\`mx-2 mb-1 text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors
              \${tab === t.id ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'}\`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {tab === 'MySchedule'        && <MySchedule       headers={headers} user={user} />}
        ${hasPrescription ? `{tab === 'WritePrescription' && <WritePrescription headers={headers} user={user} />}` : ''}
        ${hasLabReport    ? `{tab === 'UploadLabReport'   && <UploadLabReport   headers={headers} user={user} />}` : ''}
        {tab === 'PatientHistory'    && <PatientHistory    headers={headers} />}
        {tab === 'SetAvailability'   && <SetAvailability   headers={headers} user={user} />}
      </div>
    </div>
  );
}

// ── My Schedule ──────────────────────────────────────────────
function MySchedule({ headers, user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => { fetchSchedule(); }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    const res  = await fetch(\`\${API}/appointments/doctor/schedule\`, { headers });
    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleStatus = async (id, status, notes = '') => {
    await fetch(\`\${API}/appointments/status/\${id}\`, {
      method: 'PUT', headers,
      body: JSON.stringify({ status, notes })
    });
    fetchSchedule();
  };

  const STATUS_COLORS = {
    Pending:   'bg-yellow-100 text-yellow-700',
    Approved:  'bg-green-100 text-green-700',
    Rejected:  'bg-red-100 text-red-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-gray-100 text-gray-500',
  };

  const today    = new Date().toISOString().split('T')[0];
  const filtered = filter === 'today'
    ? appointments.filter(a => a.date === today)
    : filter === 'all' ? appointments
    : appointments.filter(a => a.status === filter);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">My Schedule</h2>
      <p className="text-gray-400 text-sm mb-6">Dr. {user?.name}</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all','today','Pending','Approved','Completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={\`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              \${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}\`}>
            {f === 'all' ? 'All' : f === 'today' ? "Today's" : f}
          </button>
        ))}
      </div>

      {loading ? <p className="text-gray-400">Loading schedule...</p>
      : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">🗓️</div><p>No appointments</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">🧑‍⚕️</div>
                  <div>
                    <p className="font-semibold text-gray-800">{a.patientName}</p>
                    <p className="text-sm text-gray-500">{a.date} at {a.timeSlot}</p>
                    {a.reason && <p className="text-xs text-gray-400 mt-1">Reason: {a.reason}</p>}
                  </div>
                </div>
                <span className={\`px-3 py-1 rounded-full text-xs font-medium \${STATUS_COLORS[a.status] || 'bg-gray-100'}\`}>
                  {a.status}
                </span>
              </div>

              {a.status === 'Pending' && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleStatus(a._id, 'Approved')}
                    className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                  <button onClick={() => handleStatus(a._id, 'Rejected')}
                    className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                    Reject
                  </button>
                </div>
              )}
              {a.status === 'Approved' && (
                <div className="mt-3">
                  <button onClick={() => handleStatus(a._id, 'Completed')}
                    className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Mark Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

${hasPrescription ? `
// ── Write Prescription ───────────────────────────────────────
function WritePrescription({ headers, user }) {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', patientName: '', diagnosis: '', medications: '', dosage: '', followUp: '', notes: '' });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(\`\${API}/patients\`, { headers })
      .then(r => r.json())
      .then(d => setPatients(Array.isArray(d) ? d : []));
  }, []);

  const handlePatientChange = (id) => {
    const p = patients.find(p => p._id === id);
    setForm({ ...form, patientId: id, patientName: p ? p.name : '' });
  };

  const handleSubmit = async () => {
    if (!form.patientId || !form.diagnosis || !form.medications) {
      setError('Patient, diagnosis and medications are required'); return;
    }
    setLoading(true); setError('');
    const res  = await fetch(\`\${API}/prescriptions/write\`, {
      method: 'POST', headers, body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setSuccess(\`Prescription written for \${form.patientName}\`);
    setForm({ patientId: '', patientName: '', diagnosis: '', medications: '', dosage: '', followUp: '', notes: '' });
    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Write Prescription</h2>
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}
      {error   && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Patient *</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.patientId} onChange={e => handlePatientChange(e.target.value)}>
            <option value="">-- Select Patient --</option>
            {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        {[['diagnosis','Diagnosis *','textarea'],['medications','Medications *','textarea'],
          ['dosage','Dosage Instructions','textarea'],['notes','Additional Notes','textarea']].map(([key,label,type]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Follow-up Date</label>
          <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.followUp} onChange={e => setForm({...form, followUp: e.target.value})} />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Prescription'}
        </button>
      </div>
    </div>
  );
}` : ''}

${hasLabReport ? `
// ── Upload Lab Report ────────────────────────────────────────
function UploadLabReport({ headers }) {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', patientName: '', testName: '', result: '', normalRange: '', status: 'Ready', notes: '' });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(\`\${API}/patients\`, { headers })
      .then(r => r.json())
      .then(d => setPatients(Array.isArray(d) ? d : []));
  }, []);

  const handlePatientChange = (id) => {
    const p = patients.find(p => p._id === id);
    setForm({ ...form, patientId: id, patientName: p ? p.name : '' });
  };

  const handleSubmit = async () => {
    if (!form.patientId || !form.testName || !form.result) {
      setError('Patient, test name and result are required'); return;
    }
    setLoading(true); setError('');
    const res  = await fetch(\`\${API}/labreports/upload\`, {
      method: 'POST', headers, body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setSuccess(\`Lab report uploaded for \${form.patientName}\`);
    setForm({ patientId: '', patientName: '', testName: '', result: '', normalRange: '', status: 'Ready', notes: '' });
    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Lab Report</h2>
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}
      {error   && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Patient *</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.patientId} onChange={e => handlePatientChange(e.target.value)}>
            <option value="">-- Select Patient --</option>
            {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Test Name *</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.testName} onChange={e => setForm({...form, testName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Result *</label>
          <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={form.result} onChange={e => setForm({...form, result: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Normal Range</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.normalRange} onChange={e => setForm({...form, normalRange: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="Ready">Ready</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
          <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 font-medium disabled:opacity-50">
          {loading ? 'Uploading...' : 'Upload Report'}
        </button>
      </div>
    </div>
  );
}` : ''}

// ── Patient History ──────────────────────────────────────────
function PatientHistory({ headers }) {
  const [patients, setPatients]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [history, setHistory]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    fetch(\`\${API}/patients\`, { headers })
      .then(r => r.json())
      .then(d => setPatients(Array.isArray(d) ? d : []));
  }, []);

  const loadHistory = async (patient) => {
    setSelected(patient);
    setLoading(true);
    const res  = await fetch(\`\${API}/admin/patient-history/\${patient._id}\`, { headers });
    const data = await res.json();
    setHistory(data);
    setLoading(false);
  };

  const filtered = patients.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient History</h2>
      <div className="flex gap-4">
        {/* Patient list */}
        <div className="w-64 flex-shrink-0">
          <input type="text" placeholder="Search patients..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filtered.map(p => (
              <button key={p._id} onClick={() => loadHistory(p)}
                className={\`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors
                  \${selected?._id === p._id ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'}\`}>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-400">{p.age ? \`Age: \${p.age}\` : ''} {p.bloodType ? \`· \${p.bloodType}\` : ''}</p>
              </button>
            ))}
          </div>
        </div>

        {/* History panel */}
        <div className="flex-1">
          {!selected && <div className="text-center py-20 text-gray-400"><p>Select a patient to view history</p></div>}
          {loading && <p className="text-gray-400">Loading history...</p>}
          {history && !loading && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Profile</h3>
                <div className="grid grid-cols-3 gap-3">
                  {history.profile && Object.entries(history.profile)
                    .filter(([k]) => !['_id','__v','createdAt','updatedAt'].includes(k))
                    .map(([key, val]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g,' $1')}</p>
                        <p className="text-sm font-medium">{String(val || '—')}</p>
                      </div>
                    ))}
                </div>
              </div>
              {history.appointments?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Appointments ({history.appointments.length})</h3>
                  <div className="space-y-2">
                    {history.appointments.slice(0,5).map(a => (
                      <div key={a._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{a.date} at {a.timeSlot}</p>
                          {a.reason && <p className="text-xs text-gray-400">{a.reason}</p>}
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              ${hasPrescription ? `
              {history.prescriptions?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Prescriptions ({history.prescriptions.length})</h3>
                  <div className="space-y-2">
                    {history.prescriptions.slice(0,3).map(rx => (
                      <div key={rx._id} className="py-2 border-b border-gray-100 last:border-0">
                        <p className="text-sm font-medium">{rx.date} — {rx.diagnosis}</p>
                        <p className="text-xs text-gray-400">{rx.medications}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}` : ''}
              ${hasLabReport ? `
              {history.labReports?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Lab Reports ({history.labReports.length})</h3>
                  <div className="space-y-2">
                    {history.labReports.slice(0,3).map(r => (
                      <div key={r._id} className="py-2 border-b border-gray-100 last:border-0">
                        <p className="text-sm font-medium">{r.testName} — {r.testDate}</p>
                        <p className="text-xs text-gray-400">{r.result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Set Availability ─────────────────────────────────────────
function SetAvailability({ headers, user }) {
  const [form, setForm] = useState({ workingDays: 'Mon-Fri', startTime: '09:00', endTime: '17:00', slotDuration: 30 });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(\`\${API}/availability/my\`, { headers })
      .then(r => r.json())
      .then(d => { if (d) setForm({ workingDays: d.workingDays, startTime: d.startTime, endTime: d.endTime, slotDuration: d.slotDuration || 30 }); });
  }, []);

  const handleSave = async () => {
    setLoading(true); setSuccess('');
    await fetch(\`\${API}/availability/set\`, { method: 'POST', headers, body: JSON.stringify(form) });
    setSuccess('Availability updated successfully!');
    setLoading(false);
  };

  // Preview slots
  const previewSlots = () => {
    const slots = [];
    const [sh, sm] = form.startTime.split(':').map(Number);
    const [eh, em] = form.endTime.split(':').map(Number);
    let cur = sh * 60 + sm;
    const end = eh * 60 + em;
    while (cur + form.slotDuration <= end) {
      const h = Math.floor(cur / 60).toString().padStart(2,'0');
      const m = (cur % 60).toString().padStart(2,'0');
      slots.push(\`\${h}:\${m}\`);
      cur += form.slotDuration;
    }
    return slots;
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Availability</h2>
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Working Days</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.workingDays} onChange={e => setForm({...form, workingDays: e.target.value})}>
            <option value="Mon-Fri">Monday – Friday</option>
            <option value="Mon-Sat">Monday – Saturday</option>
            <option value="Mon-Sun">Every day</option>
            <option value="Tue-Sat">Tuesday – Saturday</option>
            <option value="Wed-Sun">Wednesday – Sunday</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
            <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
            <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Slot Duration (minutes)</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.slotDuration} onChange={e => setForm({...form, slotDuration: parseInt(e.target.value)})}>
            <option value={15}>15 minutes</option>
            <option value={20}>20 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        {/* Slot preview */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Preview ({previewSlots().length} slots per day)</p>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {previewSlots().map(s => (
              <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{s}</span>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync('generated/frontend/src/pages/doctor/DoctorPortal.jsx', code);
  console.log('  📄 generated/frontend/src/pages/doctor/DoctorPortal.jsx');
}
