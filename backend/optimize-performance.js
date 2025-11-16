/**
 * Performance Optimization Testing Script
 * Tests database queries, caching, and API response times
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = process.env.API_URL || 'https://kolaq-project-production.up.railway.app/api/v1';

let adminToken = '';

// HTTP request wrapper
function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL.startsWith('http') ? BASE_URL : `https://${BASE_URL}`);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Color output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60) + '\n');
}

function logTest(name, passed, duration) {
  const status = passed ? '✓' : '✗';
  const statusColor = passed ? colors.green : colors.red;
  const durationStr = duration ? ` (${duration}ms)` : '';
  log(`${status} ${name}${durationStr}`, statusColor);
}

// Performance tracking
const performanceMetrics = {
  endpoints: {},
  slowQueries: [],
  recommendations: []
};

async function measureRequest(name, requestFn) {
  const start = Date.now();
  try {
    const result = await requestFn();
    const duration = Date.now() - start;
    
    performanceMetrics.endpoints[name] = {
      duration,
      status: 'success',
      timestamp: new Date().toISOString()
    };

    // Flag slow requests (> 1000ms)
    if (duration > 1000) {
      performanceMetrics.slowQueries.push({
        endpoint: name,
        duration,
        severity: duration > 3000 ? 'critical' : 'warning'
      });
    }

    return { success: true, duration, data: result };
  } catch (error) {
    const duration = Date.now() - start;
    performanceMetrics.endpoints[name] = {
      duration,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
    return { success: false, duration, error };
  }
}

// 1. Authentication Performance
async function testAuthPerformance() {
  logSection('1. Authentication Performance Tests');

  // Test login speed
  const loginResult = await measureRequest('POST /auth/login', async () => {
    const response = await makeRequest('/auth/login', 'POST', {
      email: 'admin@kolaqbitters.com',
      password: 'Kolaqbitters$'
    });
    if (response.data && response.data.accessToken) {
      adminToken = response.data.accessToken;
    }
    return response.data;
  });

  logTest('Admin Login', loginResult.success, loginResult.duration);

  if (loginResult.duration > 500) {
    performanceMetrics.recommendations.push({
      area: 'Authentication',
      issue: 'Login endpoint is slow',
      suggestion: 'Consider reducing bcrypt rounds or implementing caching for user lookups'
    });
  }

  // Test token validation speed (multiple calls)
  const validationTimes = [];
  for (let i = 0; i < 5; i++) {
    const result = await measureRequest(`GET /auth/me (${i + 1})`, async () => {
      return await makeRequest('/auth/me', 'GET', null, { Authorization: `Bearer ${adminToken}` });
    });
    if (result.success) validationTimes.push(result.duration);
  }

  const avgValidation = validationTimes.length > 0 
    ? validationTimes.reduce((a, b) => a + b, 0) / validationTimes.length 
    : 0;
  logTest('Token Validation (avg)', validationTimes.length > 0, Math.round(avgValidation));
}

// 2. Catalog Performance
async function testCatalogPerformance() {
  logSection('2. Catalog Performance Tests');

  // Test product listing
  const productsResult = await measureRequest('GET /products', async () => {
    return await makeRequest('/products');
  });
  logTest('List All Products', productsResult.success, productsResult.duration);

  if (productsResult.success && productsResult.duration > 300) {
    performanceMetrics.recommendations.push({
      area: 'Catalog',
      issue: 'Product listing is slow',
      suggestion: 'Implement Redis caching for catalog data with 5-minute TTL'
    });
  }

  // Test product search
  const searchResult = await measureRequest('GET /products?search=kolaq', async () => {
    return await makeRequest('/products?search=kolaq');
  });
  logTest('Product Search', searchResult.success, searchResult.duration);

  // Test featured products
  const featuredResult = await measureRequest('GET /products/featured', async () => {
    return await makeRequest('/products/featured');
  });
  logTest('Featured Products', featuredResult.success, featuredResult.duration);

  // Test category filtering
  const categoryResult = await measureRequest('GET /products?category=BITTERS', async () => {
    return await makeRequest('/products?category=BITTERS');
  });
  logTest('Category Filter', categoryResult.success, categoryResult.duration);

  // Test price filtering
  const priceResult = await measureRequest('GET /products?minPrice=1000&maxPrice=10000', async () => {
    return await makeRequest('/products?minPrice=1000&maxPrice=10000');
  });
  logTest('Price Range Filter', priceResult.success, priceResult.duration);
}

// 3. Cart Performance
async function testCartPerformance() {
  logSection('3. Cart Performance Tests');

  // Test cart retrieval
  const getCartResult = await measureRequest('GET /cart', async () => {
    return await makeRequest('/cart', 'GET', null, { Authorization: `Bearer ${adminToken}` });
  });
  logTest('Get Cart', getCartResult.success, getCartResult.duration);

  // Test add to cart (get a product first)
  try {
    const products = await makeRequest('/products?limit=1');
    if (products.data && products.data.data && products.data.data.length > 0) {
      const product = products.data.data[0];
      
      const addCartResult = await measureRequest('POST /cart/items', async () => {
        return await makeRequest('/cart/items', 'POST', {
          variantId: product.variants[0]?.id || product.id,
          quantity: 1
        }, { Authorization: `Bearer ${adminToken}` });
      });
      logTest('Add to Cart', addCartResult.success, addCartResult.duration);
    }
  } catch (error) {
    logTest('Add to Cart', false, 0);
  }
}

// 4. Order Performance
async function testOrderPerformance() {
  logSection('4. Order Performance Tests');

  // Test order listing
  const ordersResult = await measureRequest('GET /orders', async () => {
    return await makeRequest('/orders', 'GET', null, { Authorization: `Bearer ${adminToken}` });
  });
  logTest('List Orders', ordersResult.success, ordersResult.duration);

  // Test order statistics
  const statsResult = await measureRequest('GET /orders/stats', async () => {
    return await makeRequest('/orders/stats', 'GET', null, { Authorization: `Bearer ${adminToken}` });
  });
  logTest('Order Statistics', statsResult.success, statsResult.duration);
}

// 5. Dashboard Performance
async function testDashboardPerformance() {
  logSection('5. Admin Dashboard Performance Tests');

  // Test sales analytics
  const salesResult = await measureRequest('GET /admin/analytics/sales', async () => {
    return await makeRequest('/admin/analytics/sales?startDate=2025-01-01&endDate=2025-12-31', 'GET', null, 
      { Authorization: `Bearer ${adminToken}` });
  });
  logTest('Sales Analytics', salesResult.success, salesResult.duration);

  if (salesResult.success && salesResult.duration > 1000) {
    performanceMetrics.recommendations.push({
      area: 'Dashboard',
      issue: 'Sales analytics query is slow',
      suggestion: 'Create materialized views or implement daily aggregation background job'
    });
  }

  // Test inventory summary
  const inventoryResult = await measureRequest('GET /admin/analytics/inventory', async () => {
    return await makeRequest('/admin/analytics/inventory', 'GET', null, { Authorization: `Bearer ${adminToken}` });
  });
  logTest('Inventory Summary', inventoryResult.success, inventoryResult.duration);

  // Test order analytics
  const orderAnalyticsResult = await measureRequest('GET /admin/analytics/orders', async () => {
    return await makeRequest('/admin/analytics/orders?period=30', 'GET', null, { Authorization: `Bearer ${adminToken}` });
  });
  logTest('Order Analytics', orderAnalyticsResult.success, orderAnalyticsResult.duration);
}

// 6. Concurrent Request Testing
async function testConcurrentRequests() {
  logSection('6. Concurrent Request Performance');

  const startTime = Date.now();
  const promises = [];

  // Simulate 10 concurrent product requests
  for (let i = 0; i < 10; i++) {
    promises.push(makeRequest('/products'));
  }

  try {
    await Promise.all(promises);
    const duration = Date.now() - startTime;
    logTest('10 Concurrent Product Requests', true, duration);

    if (duration > 3000) {
      performanceMetrics.recommendations.push({
        area: 'Scalability',
        issue: 'Poor performance under concurrent load',
        suggestion: 'Increase database connection pool size and implement request caching'
      });
    }
  } catch (error) {
    logTest('10 Concurrent Product Requests', false, 0);
  }
}

// 7. Generate Performance Report
function generateReport() {
  logSection('Performance Optimization Report');

  // Calculate statistics
  const durations = Object.values(performanceMetrics.endpoints)
    .filter(m => m.status === 'success')
    .map(m => m.duration);

  if (durations.length === 0) {
    log('No successful requests to analyze', colors.yellow);
    return;
  }

  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);

  log(`\n📊 Performance Statistics:`, colors.bright);
  log(`   Average Response Time: ${Math.round(avgDuration)}ms`);
  log(`   Fastest Response: ${minDuration}ms`);
  log(`   Slowest Response: ${maxDuration}ms`);
  log(`   Total Requests: ${Object.keys(performanceMetrics.endpoints).length}`);
  log(`   Successful: ${durations.length}`);
  log(`   Failed: ${Object.keys(performanceMetrics.endpoints).length - durations.length}`);

  // Slow queries
  if (performanceMetrics.slowQueries.length > 0) {
    log(`\n⚠️  Slow Endpoints (>1000ms):`, colors.yellow);
    performanceMetrics.slowQueries.forEach(query => {
      const severity = query.severity === 'critical' ? colors.red : colors.yellow;
      log(`   ${severity}${query.endpoint}: ${query.duration}ms${colors.reset}`);
    });
  } else {
    log(`\n✓ No slow endpoints detected`, colors.green);
  }

  // Recommendations
  if (performanceMetrics.recommendations.length > 0) {
    log(`\n💡 Optimization Recommendations:`, colors.cyan);
    performanceMetrics.recommendations.forEach((rec, index) => {
      log(`\n   ${index + 1}. ${rec.area}`, colors.bright);
      log(`      Issue: ${rec.issue}`, colors.yellow);
      log(`      Suggestion: ${rec.suggestion}`, colors.green);
    });
  } else {
    log(`\n✓ No immediate optimizations needed`, colors.green);
  }

  // Additional recommendations based on best practices
  log(`\n🎯 General Optimization Checklist:`, colors.cyan);
  log(`   [ ] Enable Prisma query logging to identify N+1 queries`);
  log(`   [ ] Implement Redis caching for catalog and dashboard data`);
  log(`   [ ] Add database indexes on frequently queried fields`);
  log(`   [ ] Use connection pooling (pgBouncer) for database`);
  log(`   [ ] Enable HTTP compression (gzip)`);
  log(`   [ ] Implement CDN for static assets`);
  log(`   [ ] Use pagination for large result sets`);
  log(`   [ ] Optimize Prisma queries (select only needed fields)`);
  log(`   [ ] Monitor memory usage and optimize if needed`);
  log(`   [ ] Set up APM (Application Performance Monitoring)`);
}

// Main execution
async function main() {
  log('\n🚀 Starting Performance Optimization Testing...', colors.bright + colors.blue);
  log(`Target: ${BASE_URL}\n`);

  try {
    await testAuthPerformance();
    await testCatalogPerformance();
    await testCartPerformance();
    await testOrderPerformance();
    await testDashboardPerformance();
    await testConcurrentRequests();

    generateReport();

    log('\n✅ Performance testing completed!', colors.green);
  } catch (error) {
    log(`\n❌ Testing failed: ${error.message}`, colors.red);
    console.error(error);
  }
}

// Run tests
main().catch(console.error);
