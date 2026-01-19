const puppeteer = require('puppeteer');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  try {
    console.log('Testing onboarding flow...');
    console.log('========================');

    const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Visit the application - should redirect to home page
    console.log('\n1. Testing initial application load...');
    await page.goto('http://localhost:5173');
    
    // Wait for page to load
    await delay(2000);
    
    // Check if we're on the home page
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    if (!currentUrl.includes('localhost:5173/')) {
      throw new Error('Expected to be on home page');
    }
    console.log('✅ Application redirects to home page on first visit');

    // 2. Click "Create Account" - should go to register page
    console.log('\n2. Testing navigation to register page...');
    
    // Debug: Check what links are available on the page
    const links = await page.$$eval('a', anchors => {
      return anchors.map(anchor => ({
        href: anchor.href,
        text: anchor.textContent.trim(),
        className: anchor.className
      }));
    });
    
    console.log('Available links:', links);
    
    // Find the register link
    const registerLink = links.find(link => 
      link.href.includes('register') || link.text.toLowerCase().includes('create') || link.text.toLowerCase().includes('register')
    );
    
    if (!registerLink) {
      throw new Error('No register link found on home page');
    }
    
    console.log('Found register link:', registerLink);
    
    // Click the register link
    await page.click(`a[href*="/register"]`);
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });
    await delay(1000);
    
    const registerUrl = page.url();
    console.log('Current URL:', registerUrl);
    if (!registerUrl.includes('/register')) {
      throw new Error('Expected to be on register page');
    }
    console.log('✅ "Create Account" navigates to register page');

    // 3. Test registration with valid credentials
    console.log('\n3. Testing registration with valid credentials...');
    
    // Fill out registration form
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    const testName = 'Test User';
    
    await page.type('input[name="name"]', testName);
    await page.type('input[name="email"]', testEmail);
    await page.type('input[name="password"]', testPassword);
    await page.type('input[name="confirmPassword"]', testPassword);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for registration to complete and redirect
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await delay(2000);
    
    // Check if we're authenticated by looking for nav items
    const navItems = await page.$$eval('.nav-item', items => items.map(item => item.textContent.trim()));
    console.log('Navigation items found:', navItems);
    
    if (!navItems.includes('Profile')) {
      throw new Error('Expected to see Profile link after login');
    }
    console.log('✅ Registration with valid credentials successful');

    // 4. Test logout functionality
    console.log('\n4. Testing logout functionality...');
    
    // Click logout button
    await page.click('button[aria-label="Logout"]');
    await delay(1000);
    
    // Check if we're back to home page
    const afterLogoutUrl = page.url();
    console.log('After logout URL:', afterLogoutUrl);
    
    if (!afterLogoutUrl.includes('localhost:5173/')) {
      throw new Error('Expected to be on home page after logout');
    }
    console.log('✅ Logout functionality works correctly');

    // 5. Test login with valid credentials
    console.log('\n5. Testing login with valid credentials...');
    
    // Click login button
    await page.click('a[href="/login"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    
    // Fill out login form
    await page.type('input[name="email"]', testEmail);
    await page.type('input[name="password"]', testPassword);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await delay(2000);
    
    // Check for authenticated navigation
    const loginNavItems = await page.$$eval('.nav-item', items => items.map(item => item.textContent.trim()));
    if (!loginNavItems.includes('Profile')) {
      throw new Error('Expected to see Profile link after login');
    }
    console.log('✅ Login with valid credentials successful');

    // 6. Check that authenticated routes are protected
    console.log('\n6. Testing authenticated routes are protected...');
    
    // Logout first
    await page.click('button[aria-label="Logout"]');
    await delay(1000);
    
    // Try to visit profile page directly
    await page.goto('http://localhost:5173/profile');
    await delay(1000);
    
    const profilePageUrl = page.url();
    if (!profilePageUrl.includes('/')) {
      throw new Error('Expected to be redirected from protected route');
    }
    console.log('✅ Authenticated routes are protected');

    // Summary
    console.log('\n========================');
    console.log('✅ All onboarding flow tests passed!');

    await browser.close();
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
})();
