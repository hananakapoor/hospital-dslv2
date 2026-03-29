import fs from 'fs';

export function generateFrontendAuth(hospital) {
  fs.mkdirSync('generated/frontend/src/context', { recursive: true });
  fs.mkdirSync('generated/frontend/src/pages',   { recursive: true });

  // ── AuthContext ──────────────────────────────────────────────
  const authContext = `import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = sessionStorage.getItem('hms_token');
    const u = sessionStorage.getItem('hms_user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    setLoading(false);
  }, []);

  const login = (tokenVal, userData) => {
    setToken(tokenVal); setUser(userData);
    sessionStorage.setItem('hms_token', tokenVal);
    sessionStorage.setItem('hms_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null); setUser(null);
    sessionStorage.removeItem('hms_token');
    sessionStorage.removeItem('hms_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
`;
  fs.writeFileSync('generated/frontend/src/context/AuthContext.jsx', authContext);
  console.log('  📄 generated/frontend/src/context/AuthContext.jsx');

  // ── Login Page ───────────────────────────────────────────────
  const loginPage = `import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab]   = useState('staff');
  const [form, setForm] = useState({ username: '', password: '' });
  const [signup, setSignup] = useState({ username: '', password: '', confirmPassword: '', name: '', email: '', phone: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async (endpoint) => {
    setError(''); setLoading(true);
    try {
      const res  = await fetch(\`\${API}/auth/\${endpoint}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return; }
      login(data.token, data.user);
    } catch { setError('Cannot connect to server. Is the backend running?'); }
    setLoading(false);
  };

  const doSignup = async () => {
    setError(''); setSuccess('');
    if (signup.password !== signup.confirmPassword) { setError('Passwords do not match'); return; }
    if (!signup.username || !signup.password || !signup.name || !signup.email) {
      setError('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      const res  = await fetch(\`\${API}/auth/patient/register\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signup)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }
      setSuccess('Account created! You can now log in as a Patient.');
      setTab('patient');
      setForm({ username: signup.username, password: '' });
    } catch { setError('Cannot connect to server.'); }
    setLoading(false);
  };

  const T = (t) => \`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors
    \${tab === t ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-blue-600'}\`;

  const ROLE_INFO = {
    staff:   { title: 'Staff Login',   desc: 'For Admin and Doctor accounts', btn: 'Sign In as Staff',   color: 'bg-blue-600 hover:bg-blue-700',   fn: () => doLogin('login')          },
    patient: { title: 'Patient Login', desc: 'For registered patients',       btn: 'Sign In as Patient', color: 'bg-green-600 hover:bg-green-700', fn: () => doLogin('patient/login')  },
  };
  const current = ROLE_INFO[tab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-blue-900 text-white p-6 text-center">
          <div className="text-5xl mb-2">🏥</div>
          <h1 className="text-xl font-bold">${hospital.name}</h1>
          <p className="text-blue-300 text-sm mt-1">Hospital Management System</p>
        </div>

        <div className="p-6">
          {/* Tab switcher */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5">
            <button className={T('staff')}   onClick={() => { setTab('staff');   setError(''); setSuccess(''); }}>Staff</button>
            <button className={T('patient')} onClick={() => { setTab('patient'); setError(''); setSuccess(''); }}>Patient</button>
            <button className={T('signup')}  onClick={() => { setTab('signup');  setError(''); setSuccess(''); }}>Sign Up</button>
          </div>

          {error   && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

          {/* Staff / Patient login */}
          {(tab === 'staff' || tab === 'patient') && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 text-center">{current.desc}</p>
              {[['username','Username','text'],['password','Password','password']].map(([key,label,type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                  <input type={type} placeholder={label}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && current.fn()} />
                </div>
              ))}
              <button onClick={current.fn} disabled={loading}
                className={\`w-full \${current.color} text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors\`}>
                {loading ? 'Signing in...' : current.btn}
              </button>
              {tab === 'patient' && (
                <p className="text-center text-xs text-gray-400">
                  No account? <button onClick={() => setTab('signup')} className="text-blue-500 hover:underline">Create one here</button>
                </p>
              )}
            </div>
          )}

          {/* Patient Signup */}
          {tab === 'signup' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 text-center mb-2">Create a new patient account</p>
              {[
                ['name',            'Full Name *',        'text',     'John Doe'],
                ['email',           'Email *',            'email',    'john@example.com'],
                ['username',        'Username *',         'text',     'johndoe123'],
                ['phone',           'Phone',              'tel',      '+1-555-0000'],
                ['password',        'Password *',         'password', ''],
                ['confirmPassword', 'Confirm Password *', 'password', ''],
              ].map(([key, label, type, placeholder]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                  <input type={type} placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                    value={signup[key]} onChange={e => setSignup({...signup, [key]: e.target.value})} />
                </div>
              ))}
              <button onClick={doSignup} disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 mt-2">
                {loading ? 'Creating account...' : 'Create Patient Account'}
              </button>
              <p className="text-center text-xs text-gray-400">
                Already have an account? <button onClick={() => setTab('patient')} className="text-blue-500 hover:underline">Login here</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync('generated/frontend/src/pages/LoginPage.jsx', loginPage);
  console.log('  📄 generated/frontend/src/pages/LoginPage.jsx');
}
