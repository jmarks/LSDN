const axios = require('axios');

async function testProfileUpdate() {
  try {
    // First, let's register a test user to get a token
    const uniqueEmail = `testprofilenull${Date.now()}@example.com`;
  const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
      email: uniqueEmail,
      password: 'Test123!',
      name: 'Test Null User',
      firstName: 'Test',
      lastName: 'Null',
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

    // Now try to update profile with null profile picture
    console.log('🔄 Updating profile with null profile picture...');
    const profileResponse = await axios.put('http://localhost:3000/api/users/profile', {
      profilePicture: null,
      firstName: 'Updated',
      lastName: 'Null',
      age: 30,
      bio: 'This is a test bio with null profile picture',
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
