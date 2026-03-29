import fs from 'fs';

export function generateDashboard(hospital) {
  fs.mkdirSync('generated/frontend/src/pages', { recursive: true });

  const hasAuth = !!hospital.auth;

  const statsCode = hospital.modules.map(m => {
    const endpoint = m.id.toLowerCase() + 's';
    return `  { label: '${m.label}', endpoint: 'http://localhost:5000/api/${endpoint}', icon: '${m.icon}', color: '${m.color}' }`;
  }).join(',\n');

  const fetchCode = hasAuth
    ? `fetch(s.endpoint, { headers: { Authorization: \`Bearer \${token}\` } })`
    : `fetch(s.endpoint)`;

  const authImport = hasAuth ? `import { useAuth } from '../context/AuthContext';` : '';
  const authHook   = hasAuth ? `const { token, user } = useAuth();` : '';

  const code = `import { useState, useEffect } from 'react';
${authImport}

const STATS = [
${statsCode}
];

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700'   },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700'  },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700'   },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700'    },
};

export default function Dashboard() {
  const [counts, setCounts]   = useState({});
  const [loading, setLoading] = useState(true);
  ${authHook}

  useEffect(() => {
    Promise.all(
      STATS.map(s =>
        ${fetchCode}
          .then(r => r.json())
          .then(d => ({ label: s.label, count: Array.isArray(d) ? d.length : 0 }))
          .catch(() => ({ label: s.label, count: '!' }))
      )
    ).then(results => {
      const c = {};
      results.forEach(r => { c[r.label] = r.count; });
      setCounts(c);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">${hospital.name}</h1>
        <p className="text-gray-400 mt-1 text-sm">Hospital Management System — Overview</p>
        ${hasAuth ? `{user && <p className="text-blue-600 text-sm mt-1">Welcome back, <strong>{user.name}</strong> ({user.role})</p>}` : ''}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {STATS.map(s => {
          const colors = COLOR_MAP[s.color] || COLOR_MAP.blue;
          return (
            <div key={s.label} className={\`rounded-xl border p-5 flex items-center gap-4 \${colors.bg} \${colors.border}\`}>
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={\`text-3xl font-bold \${colors.text}\`}>{loading ? '...' : counts[s.label] ?? 0}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-4">System Modules</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STATS.map(s => (
            <div key={s.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-medium text-gray-700 text-sm">{s.label}</p>
                <p className="text-xs text-gray-400">{counts[s.label] ?? 0} records</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync('generated/frontend/src/pages/Dashboard.jsx', code);
  console.log('  📄 generated/frontend/src/pages/Dashboard.jsx');
}