import fs from 'fs';

export function generateAdminPortal(hospital) {
  fs.mkdirSync('generated/frontend/src/pages/admin', { recursive: true });

  const managedModules = hospital.roles?.Admin?.manage || ['Doctor', 'Patient', 'Department'];

  const code = `import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

const TABS = [
  { id: 'Dashboard',  label: 'Dashboard',       icon: '📊' },
  { id: 'Doctors',    label: 'Manage Doctors',   icon: '👨‍⚕️' },
  { id: 'Patients',   label: 'Manage Patients',  icon: '🧑‍⚕️' },
  { id: 'Departments',label: 'Departments',      icon: '🏢' },
  { id: 'Staff',      label: 'Staff Accounts',   icon: '👥' },
];

export default function AdminPortal() {
  const { token } = useAuth();
  const [tab, setTab] = useState('Dashboard');
  const headers = { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` };

  return (
    <div className="flex h-full">
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col py-4">
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Menu</p>
        </div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={\`mx-2 mb-1 text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors
              \${tab === t.id ? 'bg-red-100 text-red-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'}\`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {tab === 'Dashboard'   && <AdminDashboard  headers={headers} />}
        {tab === 'Doctors'     && <ManageDoctors   headers={headers} />}
        {tab === 'Patients'    && <ManagePatients  headers={headers} />}
        {tab === 'Departments' && <ManageDepts     headers={headers} />}
        {tab === 'Staff'       && <ManageStaff     headers={headers} />}
      </div>
    </div>
  );
}

// ── Admin Dashboard ──────────────────────────────────────────
function AdminDashboard({ headers }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(\`\${API}/admin/stats\`, { headers })
      .then(r => r.json())
      .then(d => setStats(d));
  }, []);

  const cards = stats ? [
    { label: 'Total Doctors',       value: stats.doctors,      icon: '👨‍⚕️', color: 'green'  },
    { label: 'Total Patients',      value: stats.patients,     icon: '🧑‍⚕️', color: 'blue'   },
    { label: 'Total Appointments',  value: stats.appointments, icon: '📅',  color: 'purple' },
    { label: 'Pending Approvals',   value: stats.pendingAppts, icon: '⏳',  color: 'yellow' },
    { label: 'Completed Visits',    value: stats.completedAppts,icon: '✅', color: 'teal'   },
    { label: 'Prescriptions',       value: stats.prescriptions,icon: '💊',  color: 'orange' },
    { label: 'Lab Reports',         value: stats.labReports,   icon: '🧪',  color: 'red'    },
  ] : [];

  const BG = {
    green:'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple:'bg-purple-50 border-purple-200 text-purple-700',
    yellow:'bg-yellow-50 border-yellow-200 text-yellow-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
    orange:'bg-orange-50 border-orange-200 text-orange-700',
    red:  'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
      <p className="text-gray-400 text-sm mb-6">System overview</p>
      {!stats ? <p className="text-gray-400">Loading stats...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(c => (
            <div key={c.label} className={\`rounded-xl border p-5 \${BG[c.color]}\`}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-3xl font-bold">{c.value ?? 0}</div>
              <div className="text-sm mt-1 opacity-80">{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Generic CRUD table for Admin ─────────────────────────────
function CRUDTable({ title, icon, endpoint, fields, headers }) {
  const [items, setItems]   = useState([]);
  const [form, setForm]     = useState({});
  const [editId, setEditId] = useState(null);
  const [error, setError]   = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const emptyForm = fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {});

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res  = await fetch(\`\${API}/\${endpoint}\`, { headers });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    setError('');
    const method = editId ? 'PUT' : 'POST';
    const url    = editId ? \`\${API}/\${endpoint}/\${editId}\` : \`\${API}/\${endpoint}\`;
    const res    = await fetch(url, { method, headers, body: JSON.stringify(form) });
    const data   = await res.json();
    if (!res.ok) { setError(data.error || 'Error'); return; }
    setForm(emptyForm); setEditId(null); fetchItems();
  };

  const handleEdit = (item) => {
    const f = {};
    fields.forEach(field => { f[field.key] = item[field.key] ?? ''; });
    setForm(f); setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    await fetch(\`\${API}/\${endpoint}/\${id}\`, { method: 'DELETE', headers });
    fetchItems();
  };

  const filtered = items.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{icon} {title}</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit' : 'Add New'}</h3>
        <div className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
              {f.type === 'select' ? (
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})}>
                  <option value="">-- Select --</option>
                  {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})} />
              ) : f.type === 'checkbox' ? (
                <input type="checkbox" className="w-4 h-4"
                  checked={!!form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.checked})} />
              ) : (
                <input type={f.type || 'text'} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium">
            {editId ? 'Update' : 'Save'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(emptyForm); }}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          )}
        </div>
      </div>

      {/* Search + Table */}
      <input type="text" placeholder={\`Search \${title.toLowerCase()}...\`}
        className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {fields.map(f => (
                <th key={f.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{f.label}</th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={fields.length + 1} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={fields.length + 1} className="text-center py-8 text-gray-400">No records found</td></tr>
            ) : filtered.map(item => (
              <tr key={item._id} className="hover:bg-gray-50">
                {fields.map(f => (
                  <td key={f.key} className="px-4 py-3 text-sm text-gray-700">
                    {f.type === 'checkbox' ? (item[f.key] ? '✅' : '❌') : String(item[f.key] ?? '—')}
                  </td>
                ))}
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Manage Doctors ───────────────────────────────────────────
function ManageDoctors({ headers }) {
  return <CRUDTable title="Doctors" icon="👨‍⚕️" endpoint="doctors" headers={headers} fields={[
    { key: 'name',           label: 'Name',                 type: 'text'     },
    { key: 'specialization', label: 'Specialization',       type: 'text'     },
    { key: 'department',     label: 'Department',           type: 'select',  options: ['Cardiology','Pediatrics','Orthopedics','Neurology','General'] },
    { key: 'phone',          label: 'Phone',                type: 'tel'      },
    { key: 'email',          label: 'Email',                type: 'email'    },
    { key: 'available',      label: 'Accepting Patients',   type: 'checkbox' },
    { key: 'workingDays',    label: 'Working Days',         type: 'text'     },
    { key: 'startTime',      label: 'Start Time',           type: 'time'     },
    { key: 'endTime',        label: 'End Time',             type: 'time'     },
  ]} />;
}

// ── Manage Patients ──────────────────────────────────────────
function ManagePatients({ headers }) {
  return <CRUDTable title="Patients" icon="🧑‍⚕️" endpoint="patients" headers={headers} fields={[
    { key: 'name',       label: 'Full Name',          type: 'text'   },
    { key: 'age',        label: 'Age',                type: 'number' },
    { key: 'gender',     label: 'Gender',             type: 'select', options: ['Male','Female','Other'] },
    { key: 'bloodType',  label: 'Blood Type',         type: 'select', options: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
    { key: 'phone',      label: 'Phone',              type: 'tel'    },
    { key: 'email',      label: 'Email',              type: 'email'  },
    { key: 'address',    label: 'Address',            type: 'textarea'},
    { key: 'allergies',  label: 'Known Allergies',    type: 'textarea'},
    { key: 'conditions', label: 'Existing Conditions',type: 'textarea'},
  ]} />;
}

// ── Manage Departments ───────────────────────────────────────
function ManageDepts({ headers }) {
  return <CRUDTable title="Departments" icon="🏢" endpoint="departments" headers={headers} fields={[
    { key: 'name',        label: 'Department Name', type: 'text'    },
    { key: 'head',        label: 'Head of Dept',    type: 'text'    },
    { key: 'description', label: 'Description',     type: 'textarea'},
  ]} />;
}

// ── Manage Staff ─────────────────────────────────────────────
function ManageStaff({ headers }) {
  const [users, setUsers]   = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm]     = useState({ username: '', password: '', name: '', role: 'Doctor', doctorId: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [usersRes, doctorsRes] = await Promise.all([
      fetch(\`\${API}/auth/users\`, { headers }),
      fetch(\`\${API}/doctors\`, { headers }),
    ]);
    const u = await usersRes.json();
    const d = await doctorsRes.json();
    setUsers(Array.isArray(u) ? u : []);
    setDoctors(Array.isArray(d) ? d : []);
    setLoading(false);
  };

  const handleCreate = async () => {
    setError('');
    const res  = await fetch(\`\${API}/auth/register\`, {
      method: 'POST', headers,
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setForm({ username: '', password: '', name: '', role: 'Doctor', doctorId: '' });
    fetchAll();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Staff Accounts</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Create Staff Account</h3>
        <div className="grid grid-cols-2 gap-4">
          {[['username','Username','text'],['password','Password','password'],['name','Full Name','text']].map(([key,label,type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
              <input type={type} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>
          {form.role === 'Doctor' && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Link to Doctor Record</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
                <option value="">-- Select Doctor Record --</option>
                {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name} — {d.specialization}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">Linking lets the doctor see their own schedule and patients</p>
            </div>
          )}
        </div>
        <button onClick={handleCreate}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium">
          Create Account
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{['Name','Username','Role','Doctor Linked','Created'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading...</td></tr>
            : users.map(u => {
              const linkedDoctor = doctors.find(d => d._id === u.doctorId);
              return (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.username}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={\`px-2 py-1 rounded-full text-xs font-medium \${u.role === 'Admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}\`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{linkedDoctor ? \`Dr. \${linkedDoctor.name}\` : '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync('generated/frontend/src/pages/admin/AdminPortal.jsx', code);
  console.log('  📄 generated/frontend/src/pages/admin/AdminPortal.jsx');
}
