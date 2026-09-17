import { createRequire } from 'module';
import { mkdirSync, renameSync, existsSync } from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/Users/vladislavpavlikov/.npm/_npx/31e32ef8478fbf80/node_modules/playwright');

const OUT = new URL('./raw/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// Снимаем собственные площадки Flame: тёмные, с движением в кадре, без логин-стен.
const SHOTS = [
  { id: 'cgi', url: 'https://flamecgi.com', from: 0, to: 2600, seconds: 7 },
  { id: 'ai', url: 'https://flameai.studio', from: 0, to: 2200, seconds: 7 },
  { id: 'app', url: 'https://app.flameai.studio', from: 0, to: 1400, seconds: 6 },
];

const browser = await chromium.launch({
  executablePath: '/Users/vladislavpavlikov/Library/Caches/ms-playwright/chromium-1187/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
  args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'],
});

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  try {
    await page.goto(shot.url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(5000);

    // Баннеры согласий убираем, чтобы не попали в кадр.
    for (const re of [/принять/i, /accept/i, /соглас/i, /got it/i]) {
      const btn = page.getByRole('button', { name: re }).first();
      if (await btn.count().catch(() => 0)) await btn.click({ timeout: 1500 }).catch(() => {});
    }
    await page.waitForTimeout(1200);

    // Прокрутка по плавной кривой: ускорение и торможение, без рывков мыши.
    await page.evaluate(
      ({ from, to, seconds }) =>
        new Promise((done) => {
          const start = performance.now();
          const ms = seconds * 1000;
          const step = (now) => {
            const t = Math.min(1, (now - start) / ms);
            const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            scrollTo(0, from + (to - from) * e);
            if (t < 1) requestAnimationFrame(step);
            else setTimeout(done, 700);
          };
          requestAnimationFrame(step);
        }),
      shot,
    );
  } catch (e) {
    console.log(shot.id, 'FAIL', e.message.split('\n')[0]);
  }

  const video = page.video();
  await context.close();
  const src = await video.path();
  const dst = OUT + shot.id + '.webm';
  if (existsSync(dst)) renameSync(dst, dst + '.bak');
  renameSync(src, dst);
  console.log(shot.id, 'saved', dst);
}

await browser.close();
