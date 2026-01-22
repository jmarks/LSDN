const axios = require('axios');

async function testProfileUpdate() {
  try {
    // First, let's register a test user to get a token
    const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
      email: 'testprofile@example.com',
      password: 'Test123!',
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      zipCode: '12345',
      location: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749]
      }
    });

    console.log('✅ Registration successful');
    const token = registerResponse.data.data.token;

    // Now try to update profile
    console.log('🔄 Updating profile...');
    const profileResponse = await axios.put('http://localhost:3000/api/users/profile', {
      profilePicture: 'data:image/png;base64,testimage',
      firstName: 'Updated',
      lastName: 'User',
      age: 30,
      bio: 'This is a test bio',
      interests: ['Hiking', 'Reading'],
      relationshipGoals: ['Long-term relationship']
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Profile update successful');
    console.log('Response:', profileResponse.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testProfileUpdate();
