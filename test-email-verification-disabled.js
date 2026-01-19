#!/usr/bin/env node

const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3000';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123!';
const TEST_NAME = 'Test User';

// Test function to verify email verification is disabled
async function testEmailVerificationDisabled() {
  console.log('Testing email verification is disabled...');
  console.log('========================================');

  try {
    // Test 1: User Registration
    console.log('\n1. Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, {
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    console.log('✅ Registration successful');
    console.log('   Response status:', registerResponse.status);
    console.log('   Response message:', registerResponse.data.message);
    
    // Verify user is created with verified status
    const registeredUser = registerResponse.data.data.user;
    console.log('   User verification status:', registeredUser.verificationStatus);
    console.log('   Verified at:', registeredUser.verifiedAt);
    console.log('   Verification token:', registeredUser.verificationToken);
    
    if (registeredUser.verificationStatus !== 'verified') {
      throw new Error('❌ User not created with verified status');
    }
    if (!registeredUser.verifiedAt) {
      throw new Error('❌ User not created with verifiedAt timestamp');
    }
    if (registeredUser.verificationToken) {
      throw new Error('❌ User created with verification token');
    }

    // Test 2: User Login (should work without email verification)
    console.log('\n2. Testing User Login (without email verification)...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    console.log('✅ Login successful');
    console.log('   Response status:', loginResponse.status);
    console.log('   Response message:', loginResponse.data.message);
    
    const { token, refreshToken, user } = loginResponse.data.data;
    console.log('   Token received:', token ? 'Yes' : 'No');
    console.log('   Refresh token received:', refreshToken ? 'Yes' : 'No');
    console.log('   User ID:', user.id);

    // Test 3: Validate Token
    console.log('\n3. Testing Token Validation...');
    const validateResponse = await axios.get(`${API_BASE}/api/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Token validation successful');
    console.log('   Response status:', validateResponse.status);

    // Summary
    console.log('\n========================================');
    console.log('✅ Email verification has been successfully disabled!');
    console.log('   - Users are created with verified status');
    console.log('   - Login works without email verification');
    console.log('   - No verification tokens are generated');
    console.log('   - Users can immediately access the system after registration');

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
  testEmailVerificationDisabled();
}

module.exports = testEmailVerificationDisabled;