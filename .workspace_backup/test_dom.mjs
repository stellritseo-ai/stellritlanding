import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:5175/');
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.evaluate(() => document.querySelector('#root')?.innerHTML.substring(0, 500));
  console.log('DOM CONTENT:', content);
  
  await browser.close();
})();
