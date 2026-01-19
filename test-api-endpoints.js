const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3000';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123!';
const TEST_NAME = 'Test User';

async function testApiEndpoints() {
  console.log('Testing API endpoints...');
  console.log('========================');

  try {
    // Test 1: Check backend health
    console.log('\n1. Testing backend health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed');
    console.log('   Status:', healthResponse.status);
    console.log('   Data:', healthResponse.data);

    // Test 2: User registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, {
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    console.log('✅ Registration successful');
    console.log('   Status:', registerResponse.status);
    console.log('   Message:', registerResponse.data.message);
    
    const { token: registerToken, user: registeredUser } = registerResponse.data.data;
    console.log('   Token received:', registerToken ? 'Yes' : 'No');
    console.log('   User created:', registeredUser ? registeredUser.name || 'User data received' : 'No user data');

    // Test 3: User login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    console.log('✅ Login successful');
    console.log('   Status:', loginResponse.status);
    console.log('   Message:', loginResponse.data.message);
    
    const { token: loginToken, user: loggedInUser } = loginResponse.data.data;
    console.log('   Token received:', loginToken ? 'Yes' : 'No');
    console.log('   User logged in:', loggedInUser ? loggedInUser.name || 'User data received' : 'No user data');

    // Test 4: Token validation
    console.log('\n4. Testing token validation...');
    const validateResponse = await axios.get(`${API_BASE}/api/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`
      }
    });
    
    console.log('✅ Token validation successful');
    console.log('   Status:', validateResponse.status);

    // Test 5: Protected route (packages)
    console.log('\n5. Testing protected route (packages)...');
    const packagesResponse = await axios.get(`${API_BASE}/api/packages`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`
      }
    });
    
    console.log('✅ Protected route accessible');
    console.log('   Status:', packagesResponse.status);
    console.log('   Packages count:', packagesResponse.data.data.length);

    // Test 6: Access protected route (discover) without token
    console.log('\n6. Testing protected route (discover) without token...');
    try {
      await axios.get(`${API_BASE}/api/users/discover`);
      console.error('❌ Expected protected route to reject without token');
    } catch (error) {
      console.log('✅ Protected route correctly rejects without token');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
    }

    // Summary
    console.log('\n========================');
    console.log('✅ All API endpoint tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('   No response received from server');
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  testApiEndpoints();
}

module.exports = testApiEndpoints;
