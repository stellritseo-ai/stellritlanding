const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log("Navigating to http://localhost:5173...");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  const getCardPosition = async (label) => {
    let cardRect = await page.evaluate(() => {
      // Find the Left Video Card using its classes
      const cards = Array.from(document.querySelectorAll('.origin-bottom.bg-\\[\\#0e0228\\]'));
      if (cards.length > 0) {
        const rect = cards[0].getBoundingClientRect();
        return { y: rect.y, height: rect.height, bottom: rect.bottom, width: rect.width };
      }
      return null;
    });
    console.log(`[${label}] Card Y Position:`, cardRect ? cardRect.y : "Not found");
    console.log(`[${label}] Card Height:`, cardRect ? cardRect.height : "Not found");
    console.log(`[${label}] Card Bottom:`, cardRect ? cardRect.bottom : "Not found");
  }

  await getCardPosition("Initial Load");

  // Scroll down one viewport
  await page.evaluate(() => window.scrollBy(0, 1080));
  await page.waitForTimeout(1000); 
  await getCardPosition("Scrolled 1080px");

  // Scroll down another viewport
  await page.evaluate(() => window.scrollBy(0, 1080));
  await page.waitForTimeout(1000);
  await getCardPosition("Scrolled 2160px");
  
  await browser.close();
})();
