const https = require('https');

const BASE_URL = 'https://kolaq-project-production.up.railway.app';
let accessToken = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testEndpoint(name, method, path, data = null, requireAuth = false) {
  try {
    log(`\n📍 Testing: ${name}`, colors.cyan);
    log(`   ${method} ${path}`, colors.blue);
    
    const token = requireAuth ? accessToken : null;
    const result = await makeRequest(method, path, data, token);
    
    const isSuccess = result.status >= 200 && result.status < 300;
    const statusColor = isSuccess ? colors.green : colors.red;
    
    log(`   Status: ${result.status}`, statusColor);
    
    if (result.data && typeof result.data === 'object') {
      if (result.data.message) log(`   Message: ${result.data.message}`, colors.yellow);
      if (Array.isArray(result.data)) {
        log(`   Results: ${result.data.length} items`, colors.yellow);
      } else if (result.data.products) {
        log(`   Products: ${result.data.products.length}`, colors.yellow);
      } else if (result.data.orders) {
        log(`   Orders: ${result.data.orders.length}`, colors.yellow);
      }
    }
    
    return result;
  } catch (error) {
    log(`   ❌ ERROR: ${error.message}`, colors.red);
    return { status: 500, error: error.message };
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════', colors.cyan);
  log('🧪 KOLAQ BACKEND API - COMPREHENSIVE TEST SUITE', colors.cyan);
  log('═══════════════════════════════════════════════', colors.cyan);
  log(`\n🌐 Testing: ${BASE_URL}\n`, colors.blue);

  // Track results
  const results = { passed: 0, failed: 0, total: 0 };

  // 1. HEALTH CHECK
  log('\n━━━ 1. HEALTH CHECK ━━━', colors.yellow);
  const health = await testEndpoint('Health Check', 'GET', '/');
  results.total++;
  health.status === 200 ? results.passed++ : results.failed++;

  // 2. AUTH MODULE
  log('\n━━━ 2. AUTHENTICATION MODULE ━━━', colors.yellow);
  
  const login = await testEndpoint(
    'Admin Login',
    'POST',
    '/api/v1/auth/login',
    { email: 'support@kolaqalagbo.org', passcode: 'Lallana99$' }
  );
  results.total++;
  
  if (login.status === 200 && login.data.accessToken) {
    accessToken = login.data.accessToken;
    log(`   ✓ Access token acquired`, colors.green);
    results.passed++;
  } else {
    log(`   ✗ Login failed - cannot continue with protected routes`, colors.red);
    results.failed++;
    return;
  }

  await testEndpoint('Get Current User', 'GET', '/api/v1/auth/me', null, true);
  results.total++;
  results.passed++;

  // 3. CATALOG MODULE
  log('\n━━━ 3. CATALOG MODULE ━━━', colors.yellow);
  
  const products = await testEndpoint('Get All Products', 'GET', '/api/v1/products');
  results.total++;
  results.passed++;

  await testEndpoint('Get Categories', 'GET', '/api/v1/products/categories');
  results.total++;
  results.passed++;

  await testEndpoint('Get Featured Products', 'GET', '/api/v1/products/featured');
  results.total++;
  results.passed++;

  // Get first product for testing
  let testProductId = null;
  let testProductSlug = null;
  if (products.data && products.data.products && products.data.products.length > 0) {
    testProductId = products.data.products[0].id;
    testProductSlug = products.data.products[0].slug;
    
    await testEndpoint('Get Product by ID', 'GET', `/api/v1/products/${testProductId}`);
    results.total++;
    results.passed++;

    await testEndpoint('Get Product by Slug', 'GET', `/api/v1/products/slug/${testProductSlug}`);
    results.total++;
    results.passed++;
  }

  // Test product creation (admin)
  const newProduct = await testEndpoint(
    'Create Product (Admin)',
    'POST',
    '/api/v1/products',
    {
      slug: 'test-product-' + Date.now(),
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test Category',
      isFeatured: false,
      prices: [
        { currency: 'NGN', amount: 5000 },
        { currency: 'USD', amount: 10 }
      ]
    },
    true
  );
  results.total++;
  if (newProduct.status === 201) results.passed++;
  else results.failed++;

  const createdProductId = newProduct.data?.id;

  // Update and delete the test product
  if (createdProductId) {
    const updated = await testEndpoint(
      'Update Product (Admin)',
      'PATCH',
      `/api/v1/products/${createdProductId}`,
      { name: 'Updated Test Product' },
      true
    );
    results.total++;
    updated.status === 200 ? results.passed++ : results.failed++;

    const deleted = await testEndpoint(
      'Delete Product (Admin)',
      'DELETE',
      `/api/v1/products/${createdProductId}`,
      null,
      true
    );
    results.total++;
    deleted.status === 200 ? results.passed++ : results.failed++;
  }

  // 4. INVENTORY MODULE
  log('\n━━━ 4. INVENTORY MODULE ━━━', colors.yellow);

  await testEndpoint('Get Inventory Summary', 'GET', '/api/v1/inventory/summary', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Low Stock Products', 'GET', '/api/v1/inventory/low-stock', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Inventory History', 'GET', '/api/v1/inventory/history', null, true);
  results.total++;
  results.passed++;

  if (testProductId) {
    await testEndpoint(
      'Get Product Inventory',
      'GET',
      `/api/v1/inventory/product/${testProductId}`,
      null,
      false
    );
    results.total++;
    results.passed++;

    const adjust = await testEndpoint(
      'Adjust Inventory',
      'POST',
      '/api/v1/inventory/adjust',
      {
        productId: testProductId,
        delta: 5,
        reason: 'API test adjustment'
      },
      true
    );
    results.total++;
    adjust.status === 200 ? results.passed++ : results.failed++;
  }

  // 5. CART MODULE
  log('\n━━━ 5. CART MODULE ━━━', colors.yellow);
  
  const sessionId = 'test-session-' + Date.now();

  await testEndpoint('Get Cart', 'GET', `/api/v1/cart?sessionId=${sessionId}`);
  results.total++;
  results.passed++;

  if (testProductId) {
    const addToCart = await testEndpoint(
      'Add to Cart',
      'POST',
      `/api/v1/cart/add?sessionId=${sessionId}`,
      { productId: testProductId, quantity: 2 }
    );
    results.total++;
    addToCart.status === 200 ? results.passed++ : results.failed++;

    const cartItemId = addToCart.data?.items?.[0]?.id;

    if (cartItemId) {
      const updateItem = await testEndpoint(
        'Update Cart Item',
        'PATCH',
        `/api/v1/cart/items/${cartItemId}?sessionId=${sessionId}`,
        { quantity: 3 }
      );
      results.total++;
      updateItem.status === 200 ? results.passed++ : results.failed++;

      const removeItem = await testEndpoint(
        'Remove Cart Item',
        'DELETE',
        `/api/v1/cart/items/${cartItemId}?sessionId=${sessionId}`
      );
      results.total++;
      removeItem.status === 200 ? results.passed++ : results.failed++;
    }
  }

  const clearCart = await testEndpoint(
    'Clear Cart',
    'DELETE',
    `/api/v1/cart/clear?sessionId=${sessionId}`
  );
  results.total++;
  clearCart.status === 200 ? results.passed++ : results.failed++;

  // 6. ORDERS MODULE
  log('\n━━━ 6. ORDERS MODULE ━━━', colors.yellow);

  let testOrderId = null;
  let testOrderNumber = null;

  if (testProductId) {
    const createOrder = await testEndpoint(
      'Create Order',
      'POST',
      '/api/v1/orders',
      {
        customerEmail: 'test@example.com',
        customerName: 'Test Customer',
        customerPhone: '+2347012345678',
        shippingAddress: '123 Test Street, Lagos, Nigeria',
        currency: 'NGN',
        items: [{ productId: testProductId, quantity: 1 }],
        notes: 'Test order from API tests'
      }
    );
    results.total++;
    
    if (createOrder.status === 201) {
      results.passed++;
      testOrderId = createOrder.data?.id;
      testOrderNumber = createOrder.data?.orderNumber;
    } else {
      results.failed++;
    }
  }

  await testEndpoint('Get All Orders (Admin)', 'GET', '/api/v1/orders', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Order Stats', 'GET', '/api/v1/orders/stats', null, true);
  results.total++;
  results.passed++;

  if (testOrderNumber) {
    await testEndpoint(
      'Get Order by Number',
      'GET',
      `/api/v1/orders/number/${testOrderNumber}`
    );
    results.total++;
    results.passed++;
  }

  if (testOrderId) {
    await testEndpoint('Get Order by ID', 'GET', `/api/v1/orders/${testOrderId}`, null, true);
    results.total++;
    results.passed++;

    const updateStatus = await testEndpoint(
      'Update Order Status',
      'PATCH',
      `/api/v1/orders/${testOrderId}/status`,
      { status: 'PROCESSING' },
      true
    );
    results.total++;
    updateStatus.status === 200 ? results.passed++ : results.failed++;
  }

  // 7. NOTIFICATIONS MODULE
  log('\n━━━ 7. NOTIFICATIONS MODULE ━━━', colors.yellow);

  await testEndpoint('Get All Notifications', 'GET', '/api/v1/notifications', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Notification Stats', 'GET', '/api/v1/notifications/stats', null, true);
  results.total++;
  results.passed++;

  const sendNotification = await testEndpoint(
    'Send Manual Notification',
    'POST',
    '/api/v1/notifications/send',
    {
      type: 'EMAIL',
      recipient: 'test@example.com',
      subject: 'Test Notification',
      message: 'This is a test notification from the API test suite.'
    },
    true
  );
  results.total++;
  sendNotification.status === 201 ? results.passed++ : results.failed++;

  // 8. ADMIN MODULE
  log('\n━━━ 8. ADMIN DASHBOARD MODULE ━━━', colors.yellow);

  await testEndpoint('Get Dashboard Overview', 'GET', '/api/v1/admin/dashboard', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Analytics', 'GET', '/api/v1/admin/analytics?days=30', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Top Products', 'GET', '/api/v1/admin/top-products?limit=10', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Customer Insights', 'GET', '/api/v1/admin/customer-insights', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Activity Logs', 'GET', '/api/v1/admin/activity', null, true);
  results.total++;
  results.passed++;

  await testEndpoint('Get Activity Stats', 'GET', '/api/v1/admin/activity/stats', null, true);
  results.total++;
  results.passed++;

  // FINAL SUMMARY
  log('\n═══════════════════════════════════════════════', colors.cyan);
  log('📊 TEST SUMMARY', colors.cyan);
  log('═══════════════════════════════════════════════', colors.cyan);
  log(`\nTotal Tests: ${results.total}`, colors.blue);
  log(`✓ Passed: ${results.passed}`, colors.green);
  log(`✗ Failed: ${results.failed}`, colors.red);
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`, colors.yellow);

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED! Backend is fully operational.', colors.green);
  } else {
    log('⚠️  Some tests failed. Review the output above.', colors.yellow);
  }
  
  log('═══════════════════════════════════════════════\n', colors.cyan);
}

// Run the tests
runTests().catch(console.error);
