const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testLoginAndOnboarding() {
  console.log('Testing login and onboarding check...');
  console.log('========================================');

  const testUser = {
    email: 'testprofilenull1768980116814@example.com',
    password: 'Test123!@#'
  };

  try {
    // 1. Login user
    console.log('1. Logging in user...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, testUser);
    console.log('✅ Login successful');
    const { token, user } = loginResponse.data.data;

    // 2. Check user data
    console.log('2. User data from login:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      dateOfBirth: user.dateOfBirth,
      profilePhotoUrl: user.profilePhotoUrl
    });

    // 3. Get user profile data
    console.log('3. Fetching user profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile fetch successful');

    // 4. Check profile completion status
    const userProfile = profileResponse.data.data.user;
    const isProfileComplete = 
      userProfile.firstName && 
      userProfile.lastName && 
      userProfile.bio && 
      userProfile.dateOfBirth;
    
    console.log('4. Profile completion status:', isProfileComplete ? '✅ Complete' : '❌ Incomplete');
    
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
