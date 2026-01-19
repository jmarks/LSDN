const http = require('http');

// Test login endpoint
const loginData = JSON.stringify({
  email: 'john.doe@example.com',
  password: 'Password123!'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5173,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('Testing login endpoint...');

const loginReq = http.request(loginOptions, (res) => {
  console.log('Login status code:', res.statusCode);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const loginResponse = JSON.parse(data);
      console.log('Login response:', loginResponse);
      
      if (loginResponse.success) {
        const token = loginResponse.data.token;
        console.log('Received token:', token);
        
        // Test validate token endpoint
        console.log('\nTesting token validation...');
        const validateOptions = {
          hostname: 'localhost',
          port: 5173,
          path: '/api/auth/validate',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const validateReq = http.request(validateOptions, (validateRes) => {
          console.log('Validation status code:', validateRes.statusCode);
          let validateData = '';
          
          validateRes.on('data', (chunk) => {
            validateData += chunk;
          });
          
          validateRes.on('end', () => {
            try {
              const validateResponse = JSON.parse(validateData);
              console.log('Validation response:', validateResponse);
              
              if (validateResponse.success) {
                console.log('\n✅ Authentication flow working correctly');
                console.log('User info:', validateResponse.data.user);
              } else {
                console.log('\n❌ Token validation failed');
              }
            } catch (error) {
              console.log('\n❌ Failed to parse validation response:', error.message);
            }
          });
        });
        
        validateReq.on('error', (error) => {
          console.log('\n❌ Error validating token:', error.message);
        });
        
        validateReq.end();
      } else {
        console.log('\n❌ Login failed');
      }
    } catch (error) {
      console.log('\n❌ Failed to parse login response:', error.message);
    }
  });
});

loginReq.on('error', (error) => {
  console.log('\n❌ Error during login:', error.message);
  console.log('Are you sure the backend is running on port 3000 and frontend on port 5173?');
});

loginReq.write(loginData);
loginReq.end();
