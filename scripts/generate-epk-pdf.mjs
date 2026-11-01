import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public/files');
const PORT = 4322;

const PAGES = [
  { lang: 'de', route: '/booking', file: 'dj-hulk-epk-de.pdf' },
  { lang: 'en', route: '/en/booking', file: 'dj-hulk-epk-en.pdf' },
];

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const relative = decoded.replace(/^\/+/, '');
  let filePath = path.join(DIST_DIR, relative);

  if (!filePath.startsWith(DIST_DIR)) return null;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, relative, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, '404.html');
  }

  return fs.existsSync(filePath) ? filePath : null;
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = new URL(req.url || '/', `http://localhost:${PORT}`).pathname;
      const filePath = resolveFile(urlPath);

      if (!filePath) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': CONTENT_TYPES[ext] || 'application/octet-stream',
      });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function main() {
  if (!fs.existsSync(path.join(DIST_DIR, 'booking', 'index.html'))) {
    console.error('dist/booking/index.html not found. Run `pnpm run build` first.');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const server = await startServer();
  const browser = await chromium.launch();

  try {
    for (const target of PAGES) {
      const page = await browser.newPage();
      const url = `http://127.0.0.1:${PORT}${target.route}`;

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'print' });
      await page.pdf({
        path: path.join(OUTPUT_DIR, target.file),
        format: 'A4',
        printBackground: true,
        margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' },
        displayHeaderFooter: false,
      });
      await page.close();
      console.log(`✓ ${target.lang}: public/files/${target.file}`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
