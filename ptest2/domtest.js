/**
 * DOM test script using puppeteer-core with a fresh Chromium download 
 * or via remote debugging of existing Chrome
 */
const puppeteer = require('puppeteer-core');

const CHROMIUM_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

(async () => {
  let browser = null;

  for (const execPath of CHROMIUM_PATHS) {
    try {
      console.log(`Trying: ${execPath}`);
      browser = await puppeteer.launch({
        executablePath: execPath,
        headless: true,
        dumpio: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-background-networking',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-crash-reporter',
          '--disable-breakpad',
          '--disable-features=TranslateUI',
          '--disable-sync',
          '--metrics-recording-only',
          '--mute-audio',
        ]
      });
      console.log('Browser launched successfully!');
      break;
    } catch (err) {
      console.log(`Failed with ${execPath}: ${err.message}`);
    }
  }

  if (!browser) {
    console.log('ERROR: Could not launch any browser.');
    process.exit(1);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:8081...');
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('Page loaded!');
  } catch (e) {
    console.log('Navigation error:', e.message);
    await browser.close();
    process.exit(1);
  }

  // Wait for React to hydrate
  await new Promise(r => setTimeout(r, 3000));

  // Get initial card position
  const getState = async (scrollY, label) => {
    await page.evaluate((sy) => window.scrollTo(0, sy), scrollY);
    await new Promise(r => setTimeout(r, 800));

    const data = await page.evaluate(() => {
      const vp = { w: window.innerWidth, h: window.innerHeight };

      // Try finding the left video card by various selectors
      const selectors = [
        '[class*="origin-center"]',
        '[class*="origin-bottom"]',
        '[class*="bottom-8"]',
        '[class*="bg-\\\\[\\\\#0e0228\\\\]"]',
      ];

      let card = null;
      for (const sel of selectors) {
        try {
          const el = document.querySelector(sel);
          if (el) { card = el; break; }
        } catch(e) {}
      }

      // Fallback: look for the video wrapper divs
      if (!card) {
        const allDivs = Array.from(document.querySelectorAll('div[style*="transform"]'));
        card = allDivs.find(d => {
          const r = d.getBoundingClientRect();
          return r.width > 100 && r.width < 800 && r.height > 50;
        });
      }

      const rect = card ? card.getBoundingClientRect() : null;
      return {
        vp,
        scrollY: window.scrollY,
        card: rect ? {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          centerX: Math.round(rect.x + rect.width / 2),
          centerY: Math.round(rect.y + rect.height / 2),
        } : null,
        vpCenterX: Math.round(vp.w / 2),
        vpCenterY: Math.round(vp.h / 2),
      };
    });

    console.log(`\n--- ${label} (scrollY: ${scrollY}) ---`);
    console.log('Viewport:', JSON.stringify(data.vp));
    console.log('Viewport Center X/Y:', data.vpCenterX, '/', data.vpCenterY);
    if (data.card) {
      console.log('Card Position:', JSON.stringify(data.card));
      console.log('Card Center X offset from vp center:', data.card.centerX - data.vpCenterX);
      console.log('Card Center Y offset from vp center:', data.card.centerY - data.vpCenterY);
    } else {
      console.log('Card: NOT FOUND');
    }
  };

  await getState(0, 'Initial');
  await getState(1080, 'Scrolled 1x viewport');
  await getState(1620, 'Scrolled 1.5x viewport');
  await getState(2000, 'Scrolled ~2x viewport');

  console.log('\nDone!');
  await browser.close();
})();
