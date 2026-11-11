// Copies the library files the site actually loads from node_modules into assets/vendor.
// Run with `npm run vendor` after `npm ci`. assets/vendor is committed, because
// GitHub Pages serves the repository as-is and has no build step.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');
const out = join(root, 'assets', 'vendor');

// [from (inside node_modules), to (inside assets/vendor)]
const files = [
  ['bootstrap/dist/css/bootstrap.min.css', 'bootstrap/css/bootstrap.min.css'],
  ['bootstrap/dist/js/bootstrap.bundle.min.js', 'bootstrap/js/bootstrap.bundle.min.js'],
  ['bootstrap-icons/font/bootstrap-icons.min.css', 'bootstrap-icons/bootstrap-icons.min.css'],
  ['bootstrap-icons/font/fonts/bootstrap-icons.woff', 'bootstrap-icons/fonts/bootstrap-icons.woff'],
  ['bootstrap-icons/font/fonts/bootstrap-icons.woff2', 'bootstrap-icons/fonts/bootstrap-icons.woff2'],
  ['aos/dist/aos.css', 'aos/aos.css'],
  ['aos/dist/aos.js', 'aos/aos.js'],
  ['typed.js/dist/typed.umd.js', 'typed.js/typed.umd.js'],
  // Font Awesome: brand icons only
  ['@fortawesome/fontawesome-free/css/fontawesome.min.css', 'fontawesome/css/fontawesome.min.css'],
  ['@fortawesome/fontawesome-free/css/brands.min.css', 'fontawesome/css/brands.min.css'],
  ['@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2', 'fontawesome/webfonts/fa-brands-400.woff2'],
  ['@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff', 'fontawesome/webfonts/fa-brands-400.woff'],
];

rmSync(out, { recursive: true, force: true });
for (const [from, to] of files) {
  const dest = join(out, to);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(join(nm, from), dest);
}
console.log(`Copied ${files.length} files into assets/vendor`);
