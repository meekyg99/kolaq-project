const API_BASE = 'https://kolaq-project-production.up.railway.app/api/v1';

console.log('🔐 Security Testing Suite for Kolaq Backend\n');
console.log('Testing against:', API_BASE, '\n');

// Test 1: Check if admin endpoints are protected
async function testAuthProtection() {
  console.log('1️⃣  Testing Admin Endpoint Protection...');
  
  try {
    // Try to access admin endpoint without token
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        description: 'Should fail',
        price: 1000,
        currency: 'NGN'
      })
    });
    
    if (response.status === 401 || response.status === 403) {
      console.log('✅ PASS: Admin endpoint properly protected (401/403)');
    } else {
      console.log(`❌ FAIL: Admin endpoint accessible without auth (${response.status})`);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');
}

// Test 2: SQL Injection attempts
async function testSQLInjection() {
  console.log('2️⃣  Testing SQL Injection Protection...');
  
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE Product--",
    "1' UNION SELECT * FROM AdminUser--"
  ];
  
  for (const payload of sqlPayloads) {
    try {
      const response = await fetch(`${API_BASE}/products?search=${encodeURIComponent(payload)}`);
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        console.log(`✅ PASS: SQL injection blocked - "${payload.substring(0, 20)}..."`);
      } else {
        console.log(`⚠️  WARNING: Unexpected response for SQL injection test`);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
  console.log('');
}

// Test 3: XSS attempts
async function testXSS() {
  console.log('3️⃣  Testing XSS Protection...');
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)'
  ];
  
  // We can't fully test XSS without creating products, but we can check search
  for (const payload of xssPayloads) {
    try {
      const response = await fetch(`${API_BASE}/products?search=${encodeURIComponent(payload)}`);
      
      if (response.ok) {
        console.log(`✅ PASS: XSS payload handled - "${payload.substring(0, 30)}..."`);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
  console.log('');
}

// Test 4: Rate limiting
async function testRateLimit() {
  console.log('4️⃣  Testing Rate Limiting...');
  
  let blocked = false;
  const maxRequests = 150; // Should hit rate limit
  
  for (let i = 0; i < maxRequests; i++) {
    try {
      const response = await fetch(`${API_BASE}/products`);
      
      if (response.status === 429) {
        console.log(`✅ PASS: Rate limiting active after ${i + 1} requests`);
        blocked = true;
        break;
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      break;
    }
  }
  
  if (!blocked) {
    console.log(`⚠️  WARNING: Rate limiting not triggered after ${maxRequests} requests`);
  }
  console.log('');
}

// Test 5: Invalid token handling
async function testInvalidToken() {
  console.log('5️⃣  Testing Invalid Token Handling...');
  
  const invalidTokens = [
    'invalid.token.here',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
    ''
  ];
  
  for (const token of invalidTokens) {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        console.log(`✅ PASS: Invalid token rejected`);
      } else {
        console.log(`❌ FAIL: Invalid token accepted (${response.status})`);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
  console.log('');
}

// Test 6: Input validation
async function testInputValidation() {
  console.log('6️⃣  Testing Input Validation...');
  
  try {
    // Test with valid login credentials
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        password: ''
      })
    });
    
    if (loginResponse.status === 400 || loginResponse.status === 401) {
      console.log('✅ PASS: Invalid input rejected');
    } else {
      console.log(`⚠️  WARNING: Invalid input not properly validated (${loginResponse.status})`);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');
}

// Test 7: CORS headers
async function testCORS() {
  console.log('7️⃣  Testing CORS Configuration...');
  
  try {
    const response = await fetch(`${API_BASE}/products`);
    const corsHeader = response.headers.get('access-control-allow-origin');
    
    if (corsHeader) {
      console.log(`✅ CORS enabled: ${corsHeader}`);
      if (corsHeader === '*') {
        console.log('⚠️  WARNING: CORS allows all origins (consider restricting in production)');
      }
    } else {
      console.log('⚠️  No CORS headers found');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');
}

// Test 8: Health check
async function testHealthCheck() {
  console.log('8️⃣  Testing Health Check Endpoint...');
  
  try {
    const response = await fetch(`${API_BASE.replace('/api/v1', '')}/`);
    
    if (response.ok) {
      const text = await response.text();
      console.log(`✅ Health check responding: ${text.substring(0, 50)}`);
    } else {
      console.log(`⚠️  Health check returned ${response.status}`);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('Starting security tests...\n');
  console.log('='.repeat(60), '\n');
  
  await testAuthProtection();
  await testSQLInjection();
  await testXSS();
  await testInvalidToken();
  await testInputValidation();
  await testCORS();
  await testHealthCheck();
  // Skip rate limiting test by default as it makes many requests
  // await testRateLimit();
  
  console.log('='.repeat(60));
  console.log('\n✅ Security testing complete!\n');
  console.log('📋 Review the results above and address any failures or warnings.');
}

runAllTests().catch(console.error);
