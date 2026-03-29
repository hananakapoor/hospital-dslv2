import fs from 'fs';

export function generateAppEntry(hospital) {
  fs.mkdirSync('generated/frontend/src', { recursive: true });

  const code = `import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage     from './pages/LoginPage';
import AdminPortal   from './pages/admin/AdminPortal';
import DoctorPortal  from './pages/doctor/DoctorPortal';
import PatientPortal from './pages/patient/PatientPortal';

function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  // Route to correct portal based on role
  const renderPortal = () => {
    if (user.role === 'Admin')   return <AdminPortal />;
    if (user.role === 'Doctor')  return <DoctorPortal />;
    if (user.role === 'Patient') return <PatientPortal />;
    return <div className="p-8 text-gray-500">Unknown role: {user.role}</div>;
  };

  const ROLE_COLORS = {
    Admin:   { sidebar: 'bg-red-900',   accent: 'bg-red-700',   badge: 'bg-red-600'   },
    Doctor:  { sidebar: 'bg-blue-900',  accent: 'bg-blue-700',  badge: 'bg-blue-600'  },
    Patient: { sidebar: 'bg-green-900', accent: 'bg-green-700', badge: 'bg-green-600' },
  };
  const colors = ROLE_COLORS[user.role] || ROLE_COLORS.Doctor;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <div>
            <h1 className="text-base font-bold text-gray-800">${hospital.name}</h1>
            <p className="text-xs text-gray-400">Hospital Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={\`w-8 h-8 rounded-full \${colors.badge} flex items-center justify-center text-white text-sm font-bold\`}>
              {user.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
          <button onClick={logout}
            className="text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Portal content (offset by header) */}
      <div className="flex-1 mt-14 overflow-hidden">
        {renderPortal()}
      </div>
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
`;

  fs.writeFileSync('generated/frontend/src/App.jsx', code);
  console.log('  📄 generated/frontend/src/App.jsx');

  // main.jsx
  fs.writeFileSync('generated/frontend/src/main.jsx',
    `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\nimport './index.css'\nReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)\n`
  );

  // index.css
  fs.writeFileSync('generated/frontend/src/index.css',
    '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n'
  );

  // index.html
  fs.writeFileSync('generated/frontend/index.html',
    `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${hospital.name} HMS</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>\n`
  );

  // Config files
  fs.writeFileSync('generated/frontend/vite.config.js',
    `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nexport default defineConfig({ plugins: [react()] })\n`
  );
  fs.writeFileSync('generated/frontend/tailwind.config.js',
    `export default { content: ['./index.html', './src/**/*.{js,jsx}'], theme: { extend: {} }, plugins: [] }\n`
  );
  fs.writeFileSync('generated/frontend/postcss.config.js',
    `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }\n`
  );

  const pkg = {
    name: hospital.name.toLowerCase() + '-frontend',
    version: '1.0.0', type: 'module', private: true,
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
    dependencies: { react: '^18.2.0', 'react-dom': '^18.2.0' },
    devDependencies: {
      '@vitejs/plugin-react': '^4.2.0', vite: '^5.0.0',
      tailwindcss: '^3.3.5', autoprefixer: '^10.4.16', postcss: '^8.4.31'
    }
  };
  fs.writeFileSync('generated/frontend/package.json', JSON.stringify(pkg, null, 2));
  console.log('  📄 All frontend config files written');
}
