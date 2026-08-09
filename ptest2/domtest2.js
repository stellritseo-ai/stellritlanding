/**
 * DOM test using Chrome remote debugging protocol (no sandbox needed)
 * First launches Chrome with --remote-debugging-port, then connects to it
 */
const { execSync, spawn } = require('child_process');
const http = require('http');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9227;
const TARGET_URL = 'http://localhost:8081';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    }).on('error', reject);
  });
}

function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const u = new URL(url);
    opts.hostname = u.hostname;
    opts.port = u.port;
    opts.path = u.pathname;
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(d); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function sendCDP(ws, method, params = {}) {
  const WebSocket = require('ws');
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const msg = JSON.stringify({ id, method, params });
    const client = new WebSocket(ws);
    client.on('open', () => client.send(msg));
    client.on('message', raw => {
      const d = JSON.parse(raw);
      if (d.id === id) {
        client.close();
        resolve(d.result);
      }
    });
    client.on('error', reject);
    setTimeout(() => { client.close(); reject(new Error('CDP timeout')); }, 10000);
  });
}

(async () => {
  console.log('Starting Chrome with remote debugging...');
  
  const chromeProc = spawn(CHROME, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-sync',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=1920,1080',
    'about:blank'
  ], { stdio: 'ignore', detached: false });

  await sleep(3000);

  // Get list of targets
  let targets;
  try {
    targets = await httpGet(`http://localhost:${DEBUG_PORT}/json`);
    console.log('Chrome running, targets:', targets.length);
  } catch (e) {
    console.log('Could not connect to Chrome debugger:', e.message);
    chromeProc.kill();
    process.exit(1);
  }

  const wsUrl = targets[0]?.webSocketDebuggerUrl;
  if (!wsUrl) {
    console.log('No WebSocket URL found');
    chromeProc.kill();
    process.exit(1);
  }

  // Navigate to page
  console.log('Navigating to', TARGET_URL);
  await sendCDP(wsUrl, 'Page.navigate', { url: TARGET_URL });
  await sleep(5000); // Wait for React to load

  // Run test at different scroll positions
  const testAtScroll = async (scrollY, label) => {
    await sendCDP(wsUrl, 'Runtime.evaluate', {
      expression: `window.scrollTo(0, ${scrollY})`
    });
    await sleep(800);

    const result = await sendCDP(wsUrl, 'Runtime.evaluate', {
      expression: `
        (function() {
          const vp = { w: window.innerWidth, h: window.innerHeight };
          
          // Try multiple ways to find the left video card
          let card = null;
          
          // By style transform (framer motion cards have this)
          const styled = Array.from(document.querySelectorAll('div[style*="scale"]'));
          for (const el of styled) {
            const r = el.getBoundingClientRect();
            if (r.width > 100 && r.width < 1000 && r.height > 50) {
              card = el;
              break;
            }
          }
          
          const rect = card ? card.getBoundingClientRect() : null;
          return JSON.stringify({
            vp,
            scrollY: window.scrollY,
            vpCenterX: Math.round(vp.w / 2),
            vpCenterY: Math.round(vp.h / 2),
            card: rect ? {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
              centerX: Math.round(rect.x + rect.width/2),
              centerY: Math.round(rect.y + rect.height/2),
              offsetFromCenter: Math.round((rect.y + rect.height/2) - vp.h/2)
            } : null,
            totalFramerDivs: styled.length
          });
        })()
      `
    });
    
    const data = JSON.parse(result.result.value);
    console.log(`\n=== ${label} (scrollY=${scrollY}) ===`);
    console.log(`Viewport: ${data.vp.w}x${data.vp.h}, Center: (${data.vpCenterX}, ${data.vpCenterY})`);
    if (data.card) {
      console.log(`Card: x=${data.card.x}, y=${data.card.y}, w=${data.card.w}, h=${data.card.h}`);
      console.log(`Card center: (${data.card.centerX}, ${data.card.centerY})`);
      console.log(`Offset from screen center: ${data.card.offsetFromCenter}px (0 = perfect center, negative = above center)`);
    } else {
      console.log(`Card: NOT FOUND (${data.totalFramerDivs} framer divs found)`);
    }
  };

  await testAtScroll(0, 'Initial - no scroll');
  await testAtScroll(1080, 'Scrolled 1x viewport');
  await testAtScroll(1620, 'Scrolled 1.5x viewport');
  await testAtScroll(2000, 'Scrolled ~2x viewport (card fully expanded)');
  
  console.log('\n=== DONE ===');
  chromeProc.kill();
})();
