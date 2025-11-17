/**
 * Test Frontend-Backend Integration
 * 
 * This script tests the API endpoints that the frontend uses
 */

const BACKEND_URL = 'https://kolaq-project-production.up.railway.app';

async function testEndpoint(name, url, options = {}) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   URL: ${url}`);
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📊 Response:`, JSON.stringify(data).substring(0, 150) + '...');
      return { success: true, data };
    } else {
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   📊 Error:`, data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ Network Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 KOLAQ ALAGBO BITTERS - Integration Tests\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  // Test 1: Health Check
  results.push(await testEndpoint(
    'Health Check',
    `${BACKEND_URL}/health`
  ));
  
  // Test 2: List All Products
  results.push(await testEndpoint(
    'List All Products',
    `${BACKEND_URL}/api/v1/products`
  ));
  
  // Test 3: Get Featured Products
  results.push(await testEndpoint(
    'Get Featured Products',
    `${BACKEND_URL}/api/v1/products/featured`
  ));
  
  // Test 4: Get Categories
  results.push(await testEndpoint(
    'Get Categories',
    `${BACKEND_URL}/api/v1/products/categories`
  ));
  
  // Test 5: Get Product by Slug (if products exist)
  const productsResult = results.find(r => r.success && r.data.products);
  if (productsResult && productsResult.data.products.length > 0) {
    const firstProduct = productsResult.data.products[0];
    results.push(await testEndpoint(
      'Get Product by Slug',
      `${BACKEND_URL}/api/v1/products/slug/${firstProduct.slug}`
    ));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TEST SUMMARY:\n');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total:  ${results.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Frontend-Backend integration is working! ');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run tests
runTests().catch(console.error);
