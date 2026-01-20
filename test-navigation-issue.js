const puppeteer = require('puppeteer');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  try {
    console.log('Testing navigation issue...');
    
    const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Visit home page
    await page.goto('http://localhost:5174');
    await delay(2000);
    console.log('1. Home page:', page.url());

    // 2. Go directly to email verification
    await page.goto('http://localhost:5174/auth/verify');
    await delay(2000);
    console.log('2. Email verification page:', page.url());

    // 3. Check if we can see the button
    const buttonText = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => btn.textContent.trim());
    });
    console.log('3. Available buttons:', buttonText);

    // 4. Try clicking the button
    const buttonFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const continueButton = buttons.find(btn => 
        btn.textContent.trim() === 'Continue without authentication'
      );
      if (continueButton) {
        console.log('Found button, clicking...');
        continueButton.click();
        return true;
      } else {
        console.log('Button not found');
        return false;
      }
    });

    if (!buttonFound) {
      throw new Error('Button not found on email verification page');
    }

    await delay(3000);
    console.log('4. After clicking button:', page.url());

    // 5. Check localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const isAuthenticated = await page.evaluate(() => {
      return localStorage.getItem('token') !== null;
    });
    console.log('5. Token present:', token !== null);
    console.log('6. Token value:', token);
    console.log('7. Is authenticated:', isAuthenticated);

    await browser.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
})();
