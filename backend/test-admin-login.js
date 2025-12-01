const axios = require('axios');

async function testAdminLogin() {
  const credentials = [
    { email: 'support@kolaqalagbo.org', passcode: 'Lallana99$' },
    { email: 'admin@kolaqalagbo.com', passcode: 'Lallana99$' },
    { email: 'admin@kolaqbitters.com', passcode: 'Lallana99$' }
  ];

  // Get the backend URL from environment or use default
  const BACKEND_URL = process.env.BACKEND_URL || 'https://kolaq-project-production.up.railway.app';
  
  console.log(`Testing login on: ${BACKEND_URL}\n`);

  for (const cred of credentials) {
    try {
      console.log(`Testing login for: ${cred.email}`);
      
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
        email: cred.email,
        passcode: cred.passcode
      });

      console.log(`✅ SUCCESS - ${cred.email}`);
      console.log(`   Role: ${response.data.user.role}`);
      console.log(`   Token received: ${response.data.accessToken ? 'Yes' : 'No'}\n`);
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ FAILED - ${cred.email}`);
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data.message || error.response.statusText}\n`);
      } else {
        console.log(`❌ ERROR - ${cred.email}`);
        console.log(`   ${error.message}\n`);
      }
    }
  }
}

testAdminLogin();
