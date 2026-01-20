
const http = require('http');

const uniqueEmail = `testuser${Date.now()}@example.com`;
const data = JSON.stringify({
  name: 'Unique Test User',
  email: uniqueEmail,
  password: 'Password123!'
});

console.log('Testing registration with email:', uniqueEmail);

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('Request completed');
  });
});

req.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

req.write(data);
req.end();
