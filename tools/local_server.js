const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = Number(process.env.RAGBIA_PORT || 41731);
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg'
};

function safePathFromUrl(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, `http://${HOST}:${PORT}`).pathname);
  } catch {
    return null;
  }

  if (pathname === '/') {
    pathname = '/phaser_map_beta/index.html';
  }

  const candidate = path.resolve(ROOT, '.' + pathname);
  const relative = path.relative(ROOT, candidate);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }

  return candidate;
}

const server = http.createServer((req, res) => {
  const filePath = safePathFromUrl(req.url || '/');

  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end('Read error');
    });
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.log(`[RagbiaPixel] Porta ${PORT} ja esta em uso. Presumindo servidor local existente.`);
    process.exit(0);
  }

  console.error('[RagbiaPixel] Falha no servidor local:', err);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`[RagbiaPixel] Servidor local ativo em http://${HOST}:${PORT}/`);
  console.log(`[RagbiaPixel] Jogo: http://${HOST}:${PORT}/phaser_map_beta/index.html`);
  console.log('[RagbiaPixel] Feche esta janela para encerrar o servidor.');
});
