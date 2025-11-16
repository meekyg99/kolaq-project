// Test live Railway API
const https = require('https');

const BASE_URL = 'https://kolaq-project-production.up.railway.app';

function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Testing Railway Deployment\n');
  console.log('URL:', BASE_URL);
  console.log('='.repeat(60), '\n');

  // Test 1: Root endpoint
  try {
    console.log('1. Testing root endpoint...');
    const res = await makeRequest('/');
    console.log(`   Status: ${res.status}`);
    console.log(`   Body: ${res.body.substring(0, 100)}\n`);
  } catch (err) {
    console.log(`   ERROR: ${err.message}\n`);
  }

  // Test 2: Health check
  try {
    console.log('2. Testing health check...');
    const res = await makeRequest('/api/v1/monitoring/health');
    console.log(`   Status: ${res.status}`);
    console.log(`   Body: ${res.body}\n`);
  } catch (err) {
    console.log(`   ERROR: ${err.message}\n`);
  }

  // Test 3: Get products
  try {
    console.log('3. Testing GET /api/v1/products...');
    const res = await makeRequest('/api/v1/products');
    console.log(`   Status: ${res.status}`);
    const data = JSON.parse(res.body);
    console.log(`   Products: ${Array.isArray(data) ? data.length : 'Not an array'}\n`);
  } catch (err) {
    console.log(`   ERROR: ${err.message}\n`);
  }

  // Test 4: Login attempt
  try {
    console.log('4. Testing POST /api/v1/auth/login...');
    const res = await makeRequest('/api/v1/auth/login', 'POST', {
      email: 'admin@kolaqbitters.com',
      password: 'Kolaqbitters$'
    });
    console.log(`   Status: ${res.status}`);
    const data = JSON.parse(res.body);
    console.log(`   Response:`, data.accessToken ? 'Login successful!' : JSON.stringify(data).substring(0, 100), '\n');
  } catch (err) {
    console.log(`   ERROR: ${err.message}\n`);
  }

  console.log('='.repeat(60));
  console.log('\n✅ API Testing complete!');
}

runTests().catch(console.error);
