const axios = require('axios');

const BASE_URL = process.env.API_URL || 'https://kolaq-project-production.up.railway.app';
const ADMIN_EMAIL = 'admin@kolaqbitters.com';
const ADMIN_PASSWORD = 'Kolaqbitters$';

let authToken = '';
let testProductId = '';
let testVariantId = '';

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    authToken = response.data.access_token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function getProducts() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/products`);
    if (response.data.products && response.data.products.length > 0) {
      testProductId = response.data.products[0].id;
      console.log(`✅ Found test product: ${response.data.products[0].name} (${testProductId})`);
      return true;
    }
    console.log('⚠️ No products found');
    return false;
  } catch (error) {
    console.error('❌ Failed to get products:', error.response?.data || error.message);
    return false;
  }
}

async function createVariant() {
  try {
    const variantData = {
      name: '750ml Premium Bottle',
      sku: `TEST-750-${Date.now()}`,
      bottleSize: '750ml',
      priceNGN: 8500,
      priceUSD: 12,
      stock: 100,
      isActive: true,
      sortOrder: 1,
    };

    const response = await axios.post(
      `${BASE_URL}/api/v1/products/${testProductId}/variants`,
      variantData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    testVariantId = response.data.id;
    console.log('✅ Created variant:', response.data.name, `(${testVariantId})`);
    return true;
  } catch (error) {
    console.error('❌ Failed to create variant:', error.response?.data || error.message);
    return false;
  }
}

async function getProductVariants() {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/products/${testProductId}/variants`
    );
    console.log(`✅ Retrieved ${response.data.length} variant(s) for product`);
    return true;
  } catch (error) {
    console.error('❌ Failed to get variants:', error.response?.data || error.message);
    return false;
  }
}

async function getVariantById() {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/products/variants/${testVariantId}`
    );
    console.log('✅ Retrieved variant by ID:', response.data.name);
    return true;
  } catch (error) {
    console.error('❌ Failed to get variant by ID:', error.response?.data || error.message);
    return false;
  }
}

async function updateVariant() {
  try {
    const updateData = {
      priceNGN: 9000,
      stock: 150,
    };

    const response = await axios.patch(
      `${BASE_URL}/api/v1/products/variants/${testVariantId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    console.log('✅ Updated variant:', response.data.name);
    return true;
  } catch (error) {
    console.error('❌ Failed to update variant:', error.response?.data || error.message);
    return false;
  }
}

async function updateVariantStock() {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/v1/products/variants/${testVariantId}/stock`,
      { stock: 200 },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    console.log('✅ Updated variant stock:', response.data.stock);
    return true;
  } catch (error) {
    console.error('❌ Failed to update stock:', error.response?.data || error.message);
    return false;
  }
}

async function checkDashboardStats() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/admin/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    console.log('✅ Dashboard stats retrieved:');
    console.log(`   - Total Variants: ${response.data.overview.totalVariants || 0}`);
    console.log(`   - Active Variants: ${response.data.overview.activeVariants || 0}`);
    console.log(`   - Low Stock Variants: ${response.data.lowStockVariants?.length || 0}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to get dashboard stats:', error.response?.data || error.message);
    return false;
  }
}

async function deleteVariant() {
  try {
    await axios.delete(
      `${BASE_URL}/api/v1/products/variants/${testVariantId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log('✅ Deleted test variant');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete variant:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('\n🚀 Testing Product Variants API\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  if (!(await login())) return;
  if (!(await getProducts())) return;
  
  console.log('\n--- Variant Operations ---');
  await createVariant();
  await getProductVariants();
  await getVariantById();
  await updateVariant();
  await updateVariantStock();
  
  console.log('\n--- Dashboard Integration ---');
  await checkDashboardStats();
  
  console.log('\n--- Cleanup ---');
  await deleteVariant();

  console.log('\n✅ All tests completed!\n');
}

runTests().catch(console.error);
