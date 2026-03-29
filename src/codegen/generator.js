import { generateModels }       from './backend/modelGen.js';
import { generateHMSRoutes }    from './backend/routeGen.js';
import { generateAuthServer,
         generateBackendAuth }  from './backend/authGen.js';
import { generateFrontendAuth } from './frontend/authGen.js';
import { generatePatientPortal }from './frontend/patientPortalGen.js';
import { generateDoctorPortal } from './frontend/doctorPortalGen.js';
import { generateAdminPortal }  from './frontend/adminPortalGen.js';
import { generateAppEntry }     from './frontend/appEntryGen.js';

export async function generateCode(hospital) {
  console.log('\n🏥 Generating HMS for:', hospital.name);
  console.log('━'.repeat(50));

  console.log('\n📦 Backend — Models');
  generateModels(hospital);

  console.log('\n🔐 Backend — Auth');
  generateBackendAuth(hospital);

  console.log('\n🛣️  Backend — HMS Routes');
  generateHMSRoutes(hospital);

  console.log('\n🚀 Backend — Server');
  generateAuthServer(hospital);

  console.log('\n🔑 Frontend — Auth (Context + Login)');
  generateFrontendAuth(hospital);

  console.log('\n🧑‍⚕️  Frontend — Patient Portal');
  generatePatientPortal(hospital);

  console.log('\n👨‍⚕️  Frontend — Doctor Portal');
  generateDoctorPortal(hospital);

  console.log('\n👑 Frontend — Admin Portal');
  generateAdminPortal(hospital);

  console.log('\n📱 Frontend — App Entry');
  generateAppEntry(hospital);

  console.log('\n' + '━'.repeat(50));
  console.log('✅ Generation complete!\n');
  console.log('📋 Next steps:');
  console.log('   1. Update generated/.env with your MongoDB Atlas URI');
  console.log('   2. cd generated && npm install && node server.js');
  console.log('   3. cd generated/frontend && npm install && npm run dev');
  console.log('\n👤 First, create an Admin account:');
  console.log(`   POST http://localhost:5000/api/auth/register`);
  console.log(`   Body: { "username":"admin", "password":"Admin@123", "role":"Admin", "name":"Administrator" }`);
  console.log('\n🔗 Then open: http://localhost:5173\n');
}
