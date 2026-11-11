// Static checks for the pages, run in CI (`npm run check`). No dependencies.
//  1. every local file a page references exists
//  2. no inline <script> blocks or inline event handlers (the CSP forbids them)
//  3. every target="_blank" link has rel="noopener"
//  4. each page declares a Content-Security-Policy
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', '404.html'];
const problems = [];

for (const page of pages) {
  // ignore commented-out markup
  const html = readFileSync(join(root, page), 'utf8').replace(/<!--[\s\S]*?-->/g, '');

  for (const m of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:)?\/\//.test(ref) || /^(mailto:|tel:|data:|#)/.test(ref)) continue;
    const path = ref.split(/[?#]/)[0].replace(/^\//, '');
    if (path && !existsSync(join(root, path))) problems.push(`${page}: missing file ${ref}`);
  }

  for (const m of html.matchAll(/url\('\.\.\/([^']+)'\)/g)) {
    // --si icon urls are relative to assets/css/
    if (!existsSync(join(root, 'assets', m[1]))) problems.push(`${page}: missing file assets/${m[1]}`);
  }

  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    if (!/\ssrc=/.test(m[1])) problems.push(`${page}: inline <script> (move it to a file; the CSP blocks inline scripts)`);
  }

  if (/\son[a-z]+\s*=\s*"/i.test(html)) problems.push(`${page}: inline event handler attribute`);

  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) problems.push(`${page}: target="_blank" without rel="noopener": ${m[0].slice(0, 80)}`);
  }

  if (!/http-equiv="Content-Security-Policy"/.test(html)) problems.push(`${page}: no Content-Security-Policy meta tag`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`OK: ${pages.join(', ')} passed all checks`);
