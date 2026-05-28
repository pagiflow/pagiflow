import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const corePath = resolve('packages/core/src/pagiflow.js');
const coreCode = readFileSync(corePath, 'utf8');

const html = `<!doctype html>
<html>
  <body>
    <div class="slider"></div>
    <script>${coreCode}</script>
    <script>
      const slider = document.querySelector('.slider');
      for (let i = 0; i < 30; i++) {
        const d = document.createElement('div');
        d.textContent = 'Slide ' + (i + 1);
        slider.appendChild(d);
      }
    </script>
  </body>
</html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'domcontentloaded' });

const result = await page.evaluate(() => {
  const inst = window.Pagiflow('.slider', {
    loop: true,
    speed: 0,
    nav: true,
    paginate: true,
    prevIcon: 'Previous',
    nextIcon: 'Next',
  });
  const runs = 2000;
  const start = performance.now();
  for (let i = 0; i < runs; i += 1) inst.next();
  const elapsed = performance.now() - start;
  return { runs, elapsed, avgMs: elapsed / runs };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
