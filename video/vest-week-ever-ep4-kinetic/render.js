// usage: node render.js out.mp4 [--from N --to M --step K --png dir] [query params...]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const outFile = args[0];
const q = opt('q', '');
const W = +(new URLSearchParams(q).get('w') || 1920), H = +(new URLSearchParams(q).get('h') || 1080);

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + '?' + q);
  await page.evaluate(() => window.READY);
  const meta = await page.evaluate(() => window.META);
  fs.writeFileSync(path.join(__dirname, 'meta.json'), JSON.stringify(meta, null, 1));
  const from = +opt('from', 0), to = +opt('to', meta.FRAMES), step = +opt('step', 1);
  const pngDir = opt('png', null);
  let ff = null;
  if (!pngDir) {
    ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(meta.FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  } else fs.mkdirSync(pngDir, { recursive: true });
  const t0 = Date.now();
  const list = opt('frames', null) ? opt('frames').split(',').map(Number) : null;
  const frames = list || Array.from({ length: Math.ceil((to - from) / step) }, (_, i) => from + i * step);
  for (const f of frames) {
    await page.evaluate((f) => window.renderFrame(f), f);
    const buf = await page.locator('#c').screenshot({ type: 'png' });
    if (pngDir) fs.writeFileSync(path.join(pngDir, `f${String(f).padStart(5, '0')}.png`), buf);
    else if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 90 === 0) console.log(`frame ${f}/${to} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  if (ff) { ff.stdin.end(); await new Promise(r => ff.on('close', r)); }
  await browser.close();
})();
