import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5500/api/v1';

// Test data
const testUser = {
  firstname: 'Test',
  lastname: 'User',
  email: 'test@example.com',
  password: 'password123'
};

const testProduct = {
  name: 'Test Pizza',
  description: 'A test pizza for API testing',
  price: 12.99,
  category: 'Food',
  ingredients: ['cheese', 'tomato', 'dough'],
  stock: 10
};

let authToken = '';
let userId = '';
let productId = '';

// Improved utility function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    }
  };

  try {
    console.log(`\n🌐 Making ${options.method || 'GET'} request to: ${url}`);
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log(`📄 Response Text: ${text}`);
      data = { error: 'Non-JSON response', text };
    }
    
    if (response.ok) {
      console.log(`✅ Success: ${JSON.stringify(data, null, 2)}`);
    } else {
      console.log(`❌ Error: ${JSON.stringify(data, null, 2)}`);
    }
    
    return { response, data };
  } catch (error) {
    console.log(`💥 Network Error: ${error.message}`);
    return { response: null, data: { error: error.message } };
  }
}

// Test functions
async function testAuth() {
  console.log('\n🔐 Testing Authentication...');
  
  // Test registration
  console.log('\n📝 Testing user registration...');
  const { data: signupData } = await apiCall('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (signupData.success) {
    authToken = signupData.data.token;
    userId = signupData.data.user._id;
    console.log('✅ Registration successful');
  } else {
    console.log('❌ Registration failed');
  }
  
  // Test login
  console.log('\n Testing user login...');
  const { data: loginData } = await apiCall('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  
  if (loginData.success) {
    authToken = loginData.data.token;
    console.log('✅ Login successful');
  } else {
    console.log('❌ Login failed');
  }
}

async function testUsers() {
  console.log('\n👥 Testing User Endpoints...');
  
  if (!userId) {
    console.log('⚠️ Skipping user tests - no user ID available');
    return;
  }
  
  // Get user profile
  console.log('\n👤 Testing get user profile...');
  await apiCall(`/users/${userId}`);
  
  // Get user settings
  console.log('\n⚙️ Testing get user settings...');
  await apiCall(`/users/settings/user/${userId}`);
}

async function testProducts() {
  console.log('\n🍽️ Testing Product Endpoints...');
  
  // Get all products
  console.log('\n📋 Testing get all products...');
  const { data: productsData } = await apiCall('/products');
  
  if (productsData.success && productsData.data && productsData.data.length > 0) {
    productId = productsData.data[0]._id;
    console.log('✅ Found existing products');
  } else {
    console.log('⚠️ No products found or error occurred');
  }
  
  // Get single product
  if (productId) {
    console.log('\n Testing get single product...');
    await apiCall(`/products/${productId}`);
  }
}

async function testTransactions() {
  console.log('\n💳 Testing Transaction Endpoints...');
  
  if (!userId || !productId) {
    console.log('⚠️ Skipping transaction tests - missing user or product ID');
    return;
  }
  
  // Create transaction
  console.log('\n💰 Testing create transaction...');
  const transactionData = {
    userID: userId,
    fullname: 'Test Customer',
    typeService: 'Dine In',
    totalPrice: 25.98,
    products: [
      {
        productId: productId,
        count: 2,
        price: 12.99
      }
    ],
    paymentMethod: 'Credit Card'
  };
  
  const { data: transactionResponse } = await apiCall('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData)
  });
  
  if (transactionResponse.success) {
    console.log('✅ Transaction created successfully');
    
    // Get all transactions
    console.log('\n📊 Testing get all transactions...');
    await apiCall('/transactions');
  } else {
    console.log('❌ Transaction creation failed');
  }
}

async function testNotifications() {
  console.log('\n🔔 Testing Notification Endpoints...');
  
  if (!userId) {
    console.log('⚠️ Skipping notification tests - no user ID available');
    return;
  }
  
  // Get user notifications
  console.log('\n📢 Testing get user notifications...');
  await apiCall(`/notifications/user/${userId}`);
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log(`🎯 Base URL: ${BASE_URL}`);
  
  try {
    await testAuth();
    await testUsers();
    await testProducts();
    await testTransactions();
    await testNotifications();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests }; 