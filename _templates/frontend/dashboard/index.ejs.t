---
to: generated/frontend/src/pages/Dashboard.jsx
inject: false
---
import { useState, useEffect } from 'react';
import axios from 'axios';

const stats = [
<%_ modules.forEach(mod => { _%>
  { label: '<%= mod.Name %>s', endpoint: '/api/<%= mod.name %>', color: '<%= mod.color %>' },
<%_ }); _%>
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    stats.forEach(async s => {
      const res = await axios.get(s.endpoint);
      setCounts(prev => ({ ...prev, [s.label]: res.data.length }));
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-2">Hospital Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome to <%= hospitalName %> Management System</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-lg p-4`}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold text-${s.color}-700`}>{counts[s.label] ?? '...'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}