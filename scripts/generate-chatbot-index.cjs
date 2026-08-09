#!/usr/bin/env node
/**
 * Genera dist/chatbot/index.html a partir del index de la SPA,
 * con metadatos Open Graph / Twitter para que WhatsApp y similares
 * muestren el logo UTE al compartir https://www.relaticpanama.org/chatbot/
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'dist/index.html');
const OUT_DIR = path.join(ROOT, 'dist/chatbot');
const OUT = path.join(OUT_DIR, 'index.html');

const SITE = 'https://www.relaticpanama.org';
const PAGE_URL = `${SITE}/chatbot/`;
const IMAGE_URL = `${SITE}/logo-ute.png`;
const TITLE = 'Chatbot UTE | University of Technology and Education';
const DESCRIPTION =
  'Consulta el estado de tu artículo científico y descarga tu carta de aceptación. University of Technology and Education (UTE).';

if (!fs.existsSync(SRC)) {
  console.error('No existe dist/index.html. Ejecuta npm run build primero.');
  process.exit(1);
}

let html = fs.readFileSync(SRC, 'utf8');

const metaBlock = `
  <link rel="icon" type="image/png" href="/logo-ute.png" />
  <title>${TITLE}</title>
  <meta name="description" content="${DESCRIPTION}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${PAGE_URL}" />
  <meta property="og:title" content="${TITLE}" />
  <meta property="og:description" content="${DESCRIPTION}" />
  <meta property="og:image" content="${IMAGE_URL}" />
  <meta property="og:image:alt" content="University of Technology and Education (UTE)" />
  <meta property="og:site_name" content="UTE" />
  <meta property="og:locale" content="es_PA" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${TITLE}" />
  <meta name="twitter:description" content="${DESCRIPTION}" />
  <meta name="twitter:image" content="${IMAGE_URL}" />
`.trim();

// Quitar title / icon previos del head de la SPA e inyectar bloque UTE
html = html.replace(/<link\s+rel="icon"[^>]*>\s*/i, '');
html = html.replace(/<title>[^<]*<\/title>\s*/i, '');
html = html.replace(/<html\s+lang="[^"]*"/i, '<html lang="es"');
html = html.replace(/<head>/i, `<head>\n  ${metaBlock}\n`);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html);
console.log('OK →', OUT);
