import fs from 'fs';

export function generatePatientPortal(hospital) {
  fs.mkdirSync('generated/frontend/src/pages/patient', { recursive: true });

  const hasLabReport    = hospital.modules.some(m => m.id === 'LabReport');
  const hasPrescription = hospital.modules.some(m => m.id === 'Prescription');

  const tabs = ['BookAppointment', 'MyAppointments', 'MyProfile'];
  if (hasPrescription) tabs.splice(2, 0, 'MyPrescriptions');
  if (hasLabReport)    tabs.splice(hasPrescription ? 3 : 2, 0, 'MyLabReports');

  const tabConfig = tabs.map(t => {
    const map = {
      BookAppointment: { label: 'Book Appointment', icon: '📅' },
      MyAppointments:  { label: 'My Appointments',  icon: '🗓️' },
      MyPrescriptions: { label: 'Prescriptions',    icon: '💊' },
      MyLabReports:    { label: 'Lab Reports',       icon: '🧪' },
      MyProfile:       { label: 'My Profile',        icon: '👤' },
    };
    return { id: t, ...map[t] };
  });

  const prescriptionTab = hasPrescription
    ? `{tab === 'MyPrescriptions' && <MyPrescriptions token={token} />}`
    : '';

  const labReportTab = hasLabReport
    ? `{tab === 'MyLabReports' && <MyLabReports token={token} />}`
    : '';

  const prescriptionComponent = hasPrescription ? `
function MyPrescriptions({ token }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
    fetch(API + '/prescriptions/my', { headers: h })
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h2>
      {loading ? <p className="text-gray-400">Loading...</p>
      : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">💊</div><p>No prescriptions yet</p></div>
      ) : (
        <div className="space-y-4">
          {items.map(rx => (
            <div key={rx._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">Dr. {rx.doctorName}</p>
                  <p className="text-sm text-gray-400">{rx.date}</p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-orange-700 mb-1">Diagnosis</p>
                <p className="text-sm text-gray-700">{rx.diagnosis}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 mb-2">
                <p className="text-xs font-medium text-blue-700 mb-1">Medications</p>
                <p className="text-sm text-gray-700">{rx.medications}</p>
              </div>
              {rx.dosage   && <p className="text-xs text-gray-500 mt-1">Dosage: {rx.dosage}</p>}
              {rx.followUp && <p className="text-xs text-gray-500 mt-1">Follow-up: {rx.followUp}</p>}
              {rx.notes    && <p className="text-xs text-gray-400 mt-1">{rx.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}` : '';

  const labReportComponent = hasLabReport ? `
function MyLabReports({ token }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
    fetch(API + '/labreports/my', { headers: h })
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const STATUS_COLORS = {
    Pending:  'bg-yellow-100 text-yellow-700',
    Ready:    'bg-green-100 text-green-700',
    Reviewed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Lab Reports</h2>
      {loading ? <p className="text-gray-400">Loading...</p>
      : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">🧪</div><p>No lab reports yet</p></div>
      ) : (
        <div className="space-y-4">
          {items.map(r => (
            <div key={r._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{r.testName}</p>
                  <p className="text-sm text-gray-400">By Dr. {r.doctorName} · {r.testDate}</p>
                </div>
                <span className={\`px-3 py-1 rounded-full text-xs font-medium \${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}\`}>
                  {r.status}
                </span>
              </div>
              {r.status !== 'Pending' ? (
                <>
                  <div className="bg-red-50 rounded-lg p-3 mb-2">
                    <p className="text-xs font-medium text-red-700 mb-1">Result</p>
                    <p className="text-sm text-gray-700">{r.result}</p>
                  </div>
                  {r.normalRange && <p className="text-xs text-gray-500">Normal Range: {r.normalRange}</p>}
                  {r.notes       && <p className="text-xs text-gray-400 mt-1">{r.notes}</p>}
                </>
              ) : (
                <p className="text-sm text-gray-400 mt-2">Results not yet available.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}` : '';

  const code = `import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

const TABS = ${JSON.stringify(tabConfig, null, 2)};

export default function PatientPortal() {
  const { token, user } = useAuth();
  const [tab, setTab]   = useState('BookAppointment');

  return (
    <div className="flex h-full">
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col py-4">
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient Menu</p>
        </div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={\`mx-2 mb-1 text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors
              \${tab === t.id ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'}\`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {tab === 'BookAppointment' && <BookAppointment token={token} user={user} />}
        {tab === 'MyAppointments'  && <MyAppointments  token={token} />}
        ${prescriptionTab}
        ${labReportTab}
        {tab === 'MyProfile'       && <MyProfile       token={token} user={user} />}
      </div>
    </div>
  );
}

// ── Book Appointment ──────────────────────────────────────────
function BookAppointment({ token, user }) {
  const [step, setStep]                     = useState(1);
  const [departments, setDepartments]       = useState([]);
  const [doctors, setDoctors]               = useState([]);
  const [slots, setSlots]                   = useState([]);
  const [selectedDept, setSelectedDept]     = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate]     = useState('');
  const [selectedSlot, setSelectedSlot]     = useState('');
  const [reason, setReason]                 = useState('');
  const [loading, setLoading]               = useState(false);
  const [success, setSuccess]               = useState('');
  const [error, setError]                   = useState('');

  const makeHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  });

  useEffect(() => {
    fetch(API + '/departments', { headers: makeHeaders() })
      .then(r => r.json())
      .then(d => setDepartments(Array.isArray(d) ? d : []))
      .catch(() => setDepartments([]));
  }, [token]);

  const loadDoctors = async (dept) => {
    setSelectedDept(dept);
    setLoading(true);
    try {
      const res  = await fetch(API + '/doctors', { headers: makeHeaders() });
      const data = await res.json();
      const filtered = (Array.isArray(data) ? data : []).filter(d =>
        d.department?.toLowerCase().trim() === dept?.toLowerCase().trim()
      );
      setDoctors(filtered);
    } catch {
      setDoctors([]);
    }
    setStep(2);
    setLoading(false);
  };

  const loadSlots = async (doctor, date) => {
    if (!doctor || !date) return;
    setLoading(true);
    try {
      const res  = await fetch(API + '/appointments/slots/' + doctor._id + '/' + date, { headers: makeHeaders() });
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    }
    setLoading(false);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
    if (selectedDate) loadSlots(doctor, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedDoctor) loadSlots(selectedDoctor, date);
  };

  const handleBook = async () => {
    if (!selectedSlot)  { setError('Please select a time slot'); return; }
    if (!selectedDate)  { setError('Please select a date'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(API + '/appointments/book', {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify({
          doctorId:   selectedDoctor._id,
          doctorName: selectedDoctor.name,
          department: selectedDept,
          date:       selectedDate,
          timeSlot:   selectedSlot,
          reason,
        })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Booking failed'); setLoading(false); return; }
      setSuccess('Appointment booked with Dr. ' + selectedDoctor.name + ' on ' + selectedDate + ' at ' + selectedSlot + '!');
      setStep(1);
      setSelectedDept(''); setSelectedDoctor(null);
      setSelectedDate(''); setSelectedSlot(''); setReason('');
    } catch {
      setError('Failed to book. Is the backend running?');
    }
    setLoading(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Appointment</h2>
      <p className="text-gray-400 text-sm mb-6">Choose department → doctor → time slot</p>

      {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">{success}</div>}
      {error   && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {['Department', 'Doctor', 'Time Slot'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={\`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              \${step > i+1 ? 'bg-green-500 text-white' : step === i+1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}\`}>
              {step > i+1 ? '✓' : i+1}
            </div>
            <span className={\`text-sm \${step === i+1 ? 'font-semibold text-blue-700' : 'text-gray-400'}\`}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Department */}
      {step === 1 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Select Department</h3>
          {departments.length === 0 ? (
            <p className="text-gray-400 text-sm">No departments found. Please ask Admin to add departments first.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {departments.map(d => (
                <button key={d._id} onClick={() => loadDoctors(d.name)}
                  className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 text-left transition-all">
                  <p className="font-semibold text-gray-800">{d.name}</p>
                  {d.head && <p className="text-xs text-gray-400 mt-1">Head: {d.head}</p>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Doctor */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-blue-500 text-sm mb-4 hover:underline">
            ← Back to Departments
          </button>
          <h3 className="font-semibold text-gray-700 mb-3">
            Select Doctor in <span className="text-blue-600">{selectedDept}</span>
          </h3>
          {loading ? (
            <p className="text-gray-400">Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-700 text-sm">No doctors found in {selectedDept}.</p>
              <p className="text-yellow-600 text-xs mt-1">Make sure doctors are added with the correct department name.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map(d => (
                <button key={d._id} onClick={() => handleSelectDoctor(d)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 text-left transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">👨‍⚕️</div>
                  <div>
                    <p className="font-semibold text-gray-800">Dr. {d.name}</p>
                    <p className="text-sm text-gray-500">{d.specialization}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {d.workingDays || 'Mon-Fri'} · {d.startTime || '09:00'}–{d.endTime || '17:00'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Date + Slot */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="text-blue-500 text-sm mb-4 hover:underline">
            ← Back to Doctors
          </button>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">👨‍⚕️</div>
            <div>
              <p className="font-semibold">Dr. {selectedDoctor?.name}</p>
              <p className="text-sm text-gray-500">{selectedDoctor?.specialization} · {selectedDept}</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Date</label>
            <input type="date" min={today}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedDate}
              onChange={e => handleDateChange(e.target.value)} />
          </div>

          {selectedDate && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Available Slots
                {loading && <span className="text-gray-400 text-xs ml-2">(loading...)</span>}
              </label>
              {!loading && slots.length === 0 ? (
                <p className="text-gray-400 text-sm">No available slots for this date.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map(s => (
                    <button key={s} onClick={() => setSelectedSlot(s)}
                      className={\`py-2 rounded-lg text-sm font-medium border transition-colors
                        \${selectedSlot === s
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-300 hover:border-blue-400 text-gray-700'}\`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Reason for Visit (optional)</label>
            <textarea rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Describe your symptoms or reason..."
              value={reason} onChange={e => setReason(e.target.value)} />
          </div>

          <button onClick={handleBook} disabled={!selectedSlot || !selectedDate || loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── My Appointments ───────────────────────────────────────────
function MyAppointments({ token }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    const h = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
    fetch(API + '/appointments/my', { headers: h })
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    const h = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
    await fetch(API + '/appointments/cancel/' + id, { method: 'PUT', headers: h });
    const res  = await fetch(API + '/appointments/my', { headers: h });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  const STATUS_COLORS = {
    Pending:   'bg-yellow-100 text-yellow-700',
    Approved:  'bg-green-100 text-green-700',
    Rejected:  'bg-red-100 text-red-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-gray-100 text-gray-500',
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all','Pending','Approved','Completed','Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={\`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              \${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}\`}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>
      {loading ? <p className="text-gray-400">Loading...</p>
      : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📅</div>
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">👨‍⚕️</div>
                <div>
                  <p className="font-semibold text-gray-800">Dr. {a.doctorName}</p>
                  <p className="text-sm text-gray-500">{a.department}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.date} at {a.timeSlot}</p>
                  {a.reason && <p className="text-xs text-gray-400">Reason: {a.reason}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={\`px-3 py-1 rounded-full text-xs font-medium \${STATUS_COLORS[a.status] || 'bg-gray-100'}\`}>
                  {a.status}
                </span>
                {['Pending','Approved'].includes(a.status) && (
                  <button onClick={() => handleCancel(a._id)}
                    className="text-xs text-red-500 hover:underline">Cancel</button>
                )}
                {a.notes && <p className="text-xs text-gray-400 max-w-xs text-right">Note: {a.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

${prescriptionComponent}

${labReportComponent}

// ── My Profile ────────────────────────────────────────────────
function MyProfile({ token, user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.patientId) {
      const h = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
      fetch(API + '/patients/' + user.patientId, { headers: h })
        .then(r => r.json())
        .then(d => { setProfile(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <p className="text-gray-400">Loading profile...</p>;

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">🧑‍⚕️</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
            <p className="text-gray-400 text-sm">Patient</p>
          </div>
        </div>
        {profile ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(profile)
              .filter(([k]) => !['_id','__v','createdAt','updatedAt'].includes(k))
              .map(([key, val]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g,' $1')}</p>
                  <p className="text-sm font-medium text-gray-700">{String(val || '—')}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No medical record linked yet. Please visit the clinic to complete your profile.</p>
        )}
      </div>
    </div>
  );
}
`;

  fs.writeFileSync('generated/frontend/src/pages/patient/PatientPortal.jsx', code);
  console.log('  📄 generated/frontend/src/pages/patient/PatientPortal.jsx');
}
