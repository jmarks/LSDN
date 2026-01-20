const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  console.log('Testing login flow...');
  
  try {
    // Test login with valid credentials
    console.log('1. Attempting login with test user...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'john.doe@example.com',
      password: 'Password123!'
    });
    
    console.log('✓ Login successful');
    console.log('Response:', loginResponse.data);
    
    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    
    // Test token validation
    console.log('\n2. Testing token validation...');
    const validateResponse = await axios.get(`${BASE_URL}/api/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ Token validation successful');
    console.log('User data:', validateResponse.data.data.user);
    
    // Verify user data matches
    if (validateResponse.data.data.user.id === user.id) {
      console.log('\n✓ User data matches');
    }
    
    // Test protected route (example: packages)
    console.log('\n3. Testing protected route (Packages)...');
    const packagesResponse = await axios.get(`${BASE_URL}/api/packages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ Protected route accessible');
    console.log('Packages count:', packagesResponse.data.data.packages.length);
    
    // Test discovery route
    console.log('\n4. Testing discovery route...');
    const discoverResponse = await axios.get(`${BASE_URL}/api/users/discover`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ Discovery route accessible');
    console.log('Users to discover:', discoverResponse.data.data.length);
    
    console.log('\n✅ All authentication tests passed!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

async function testInvalidLogin() {
  console.log('\nTesting invalid login...');
  
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    });
    
    console.error('❌ Expected invalid login to fail');
  } catch (error) {
    console.log('✓ Invalid login correctly rejected');
    console.log('Error message:', error.response?.data?.message);
  }
}

async function testNoToken() {
  console.log('\nTesting protected route without token...');
  
  try {
    const packagesResponse = await axios.get(`${BASE_URL}/api/packages`);
    
    console.error('❌ Expected protected route to reject without token');
  } catch (error) {
    console.log('✓ Protected route correctly rejects without token');
    console.log('Status code:', error.response?.status);
  }
}

async function runAllTests() {
  try {
    await testLogin();
    await testInvalidLogin();
    await testNoToken();
  } catch (error) {
    console.error('Test execution error:', error);
  }
}

runAllTests();
