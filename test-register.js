
const http = require('http');

const data = JSON.stringify({
  name: 'Browser Test User',
  email: 'browsertest@example.com',
  password: 'Password123!'
});

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
