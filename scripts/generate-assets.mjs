// Post-build step: renders the print CV to PDF and the social card to PNG using the built site in dist/.
import { createServer } from 'node:http';
import { readFile, rm, stat, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const basePath = '/cv';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!path.startsWith(basePath)) throw new Error('outside base');
    path = normalize(path.slice(basePath.length) || '/');
    let file = join(dist, path);
    if (!file.startsWith(dist)) throw new Error('outside dist');
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}${basePath}`;
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.goto(`${origin}/resume/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await mkdir(join(dist, 'documents'), { recursive: true });
  await page.pdf({ path: join(dist, 'documents', 'higor-lima-cv.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log('✓ dist/documents/higor-lima-cv.pdf');

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto(`${origin}/og-card/`, { waitUntil: 'networkidle' });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: join(dist, 'og.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('✓ dist/og.png');
} finally {
  await browser.close();
  server.close();
}

await rm(join(dist, 'og-card'), { recursive: true, force: true });
