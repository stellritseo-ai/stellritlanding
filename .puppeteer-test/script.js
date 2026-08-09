const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: "new"
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log("Navigating to http://localhost:5173...");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  console.log("Evaluating DOM coordinates at initial scroll position...");
  let cardRect = await page.evaluate(() => {
    // Assuming the left video card is the one with aspect-video and origin-bottom in Hero.tsx
    const cards = Array.from(document.querySelectorAll('.origin-bottom'));
    if (cards.length > 0) {
      const rect = cards[0].getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom };
    }
    return null;
  });
  console.log("Initial Card Bounding Box:", cardRect);

  console.log("Scrolling down by 1080px (1 viewport height)...");
  await page.evaluate(() => window.scrollBy(0, 1080));
  await page.waitForTimeout(1000); // wait for framer motion animation

  cardRect = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.origin-bottom'));
    if (cards.length > 0) {
      const rect = cards[0].getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom };
    }
    return null;
  });
  console.log("After Scroll 1080px Card Bounding Box:", cardRect);

  console.log("Scrolling down to 2000px...");
  await page.evaluate(() => window.scrollBy(0, 920));
  await page.waitForTimeout(1000); // wait for framer motion animation

  cardRect = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.origin-bottom'));
    if (cards.length > 0) {
      const rect = cards[0].getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom };
    }
    return null;
  });
  console.log("After Scroll 2000px Card Bounding Box:", cardRect);

  await page.screenshot({ path: '/tmp/screenshot.png' });
  console.log("Saved screenshot to /tmp/screenshot.png");
  
  await browser.close();
})();
