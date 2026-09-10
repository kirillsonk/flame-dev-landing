// Lists every computed font-size on the page. The site must use exactly three: 16px, 24px, 48px at 1440.
// Usage: node scripts/check-font-sizes.mjs [url] [width]   (needs `npx playwright install chromium` once)
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:3000';
const width = Number(process.argv[3] ?? 1440);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
const sizes = await page.evaluate(() => {
  const map = new Map();
  document.querySelectorAll('body *').forEach((el) => {
    if (el.closest('nextjs-portal')) return;
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) return;
    const size = getComputedStyle(el).fontSize;
    const entry = map.get(size) ?? { count: 0, sample: el.className || el.tagName };
    entry.count += 1;
    map.set(size, entry);
  });
  return [...map.entries()].map(([size, v]) => ({ size, ...v })).sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
});
console.table(sizes);
await browser.close();
