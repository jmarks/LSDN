const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testLoginAndOnboarding() {
  console.log('Testing login and onboarding check...');
  console.log('========================================');

  const testUser = {
    email: `testlogin${Date.now()}@example.com`,
    password: 'Test123!@#',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    city: 'Test City',
    state: 'Test State',
    country: 'Test Country',
    zipCode: '12345'
  };

  try {
    // 1. Register user
    console.log('1. Registering user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful');
    const { token, user } = registerResponse.data.data;

    // 2. Login user
    console.log('2. Logging in user...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');

    // 3. Check user data
    console.log('3. User data from login:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      dateOfBirth: user.dateOfBirth,
      profilePhotoUrl: user.profilePhotoUrl
    });

    // 4. Get user profile data
    console.log('4. Fetching user profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile fetch successful');

    // 5. Check profile completion status
    const userProfile = profileResponse.data.data.user;
    const isProfileComplete = 
      userProfile.firstName && 
      userProfile.lastName && 
      userProfile.bio && 
      userProfile.dateOfBirth;
    
    console.log('5. Profile completion status:', isProfileComplete ? '✅ Complete' : '❌ Incomplete');
    
    if (!isProfileComplete) {
      console.log('Missing fields:', {
        firstName: userProfile.firstName ? '✅' : '❌',
        lastName: userProfile.lastName ? '✅' : '❌',
        bio: userProfile.bio ? '✅' : '❌',
        dateOfBirth: userProfile.dateOfBirth ? '✅' : '❌'
      });
    }

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testLoginAndOnboarding();
