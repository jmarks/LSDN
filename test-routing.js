const puppeteer = require('puppeteer');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  try {
    console.log('Testing frontend routing...');
    
    const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Visit home page
    await page.goto('http://localhost:5173');
    await delay(2000);
    
    // Check if we can reach login page
    console.log('Checking login page...');
    await page.goto('http://localhost:5173/auth/login');
    await delay(2000);
    console.log('Login page URL:', page.url());
    
    // Check if we can reach register page
    console.log('Checking register page...');
    await page.goto('http://localhost:5173/auth/register');
    await delay(2000);
    console.log('Register page URL:', page.url());
    
    // Check if we can reach email verification page
    console.log('Checking email verification page...');
    await page.goto('http://localhost:5173/auth/verify');
    await delay(2000);
    console.log('Email verification page URL:', page.url());
    
    await browser.close();
    console.log('✅ Routing test complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
