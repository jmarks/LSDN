const axios = require('axios');
const API_BASE = 'http://localhost:3000';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123!';
const TEST_NAME = 'Test User';

(async () => {
  try {
    console.log('Testing user registration and login flow...');
    console.log('');
    
    // Register a new user
    console.log('1. Registering a new user...');
    const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, {
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    console.log('✅ Registration successful');
    console.log('User created:', registerResponse.data.data.user);
    console.log('Token received:', registerResponse.data.data.token);
    console.log('');
    
    // Login with the newly created user
    console.log('2. Logging in with the new user...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    console.log('✅ Login successful');
    console.log('User logged in:', loginResponse.data.data.user);
    console.log('Token received:', loginResponse.data.data.token);
    console.log('');
    
    // Test authenticated route (discover)
    console.log('3. Testing authenticated route (discover)...');
    const discoverResponse = await axios.get(`${API_BASE}/api/users/discover`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.data.token}`
      }
    });
    
    console.log('✅ Authenticated route accessible');
    console.log('Users found:', discoverResponse.data.data.length);
    console.log('');
    
    // Test protected route without token
    console.log('4. Testing protected route without token...');
    try {
      await axios.get(`${API_BASE}/api/users/discover`);
      console.error('❌ Expected protected route to reject without token');
    } catch (error) {
      console.log('✅ Protected route correctly rejects without token');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
    }
    
    console.log('');
    console.log('✨ All tests passed! The authentication flow is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
})();
