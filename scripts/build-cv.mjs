// Rebuilds the CV sections of index.html from data/cv.yml.
//   npm run build         rewrite index.html
//   npm run build:check   fail if index.html is out of date (used in CI)
//
// Only the text between <!-- cv:NAME:start --> and <!-- cv:NAME:end --> is replaced.
// Everything else in index.html (layout, icons row, certificate graph) is untouched.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = join(root, 'index.html');
const checkOnly = process.argv.includes('--check');
const problems = [];

const text = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (v) => text(v).replace(/"/g, '&quot;');

const data = YAML.parse(readFileSync(join(root, 'data', 'cv.yml'), 'utf8'));

function need(obj, keys, where) {
  for (const k of keys) {
    if (obj?.[k] === undefined || obj[k] === null || obj[k] === '') problems.push(`${where}: missing "${k}"`);
  }
}
const list = (name) => {
  if (!Array.isArray(data[name]) || !data[name].length) problems.push(`data/cv.yml: "${name}" must be a non-empty list`);
  return Array.isArray(data[name]) ? data[name] : [];
};

const renderers = {
  experience(items) {
    return items.map((j, i) => {
      need(j, ['title', 'dates', 'company'], `experience[${i}]`);
      if (!Array.isArray(j.bullets) || !j.bullets.length) problems.push(`experience[${i}]: "bullets" must be a list`);
      const lis = (j.bullets ?? []).map((b) => `                  <li>${text(b)}</li>`).join('\n');
      return `              <div class="resume-item">
                <h4>${text(j.title)}</h4>
                <h5>${text(j.dates)}</h5>
                <p><em>${text(j.company)}</em></p>
                <ul>
${lis}
                </ul>
              </div><!-- End Resume Item -->`;
    }).join('\n\n');
  },

  education(items) {
    return items.map((e, i) => {
      need(e, ['title', 'dates', 'school', 'description'], `education[${i}]`);
      return `        <div class="resume-item">
          <h4>${text(e.title)}</h4>
          <h5>${text(e.dates)}</h5>
          <p><em>${text(e.school)}</em></p>
          <p>${text(e.description)}</p>
        </div><!-- End Resume Item -->`;
    }).join('\n');
  },

  skills(items) {
    const seen = new Set();
    return items.map((s, i) => {
      need(s, ['id', 'icon', 'title'], `skills[${i}]`);
      if (!/^[a-z]+$/.test(s.id ?? '')) problems.push(`skills[${i}]: id must be lowercase letters only`);
      if (seen.has(s.id)) problems.push(`skills[${i}]: duplicate id "${s.id}"`);
      seen.add(s.id);
      const chips = (s.chips ?? []).length
        ? `\n              <ul class="chips">${s.chips.map((c) => `<li>${text(c)}</li>`).join('')}</ul>`
        : '';
      return `          <div class="col-md-6 col-xxl-4">
            <div class="skill-card h-100" id="skill-${attr(s.id)}">
              <h3><i class="${attr(s.icon)}"></i> ${text(s.title)}</h3>${chips}
            </div>
          </div>`;
    }).join('\n');
  },

  certificates(items) {
    return items.map((c, i) => {
      need(c, ['name', 'description', 'issuer', 'badge', 'image'], `certificates[${i}]`);
      if (!/^[0-9a-f-]{36}$/.test(c.badge ?? '')) problems.push(`certificates[${i}]: badge must be the Credly badge id`);
      if (!existsSync(join(root, 'assets', 'img', 'certs', `${c.image}.png`))) {
        problems.push(`certificates[${i}]: assets/img/certs/${c.image}.png does not exist`);
      }
      const cls = c.featured ? 'cert-card cert-card-top' : 'cert-card';
      return `          <a class="${cls}" href="https://www.credly.com/badges/${attr(c.badge)}" data-badge-id="${attr(c.badge)}" target="_blank" rel="noopener">
            <img src="assets/img/certs/${attr(c.image)}.png" alt="${attr(c.name)} badge" width="110" height="110" loading="lazy">
            <h3>${text(c.name)}</h3>
            <p>${text(c.description)}</p>
            <span>${text(c.issuer)}</span>
            <em class="cert-verify"><i class="bi bi-patch-check"></i> verify</em>
          </a>`;
    }).join('\n');
  },
};

let html = readFileSync(pagePath, 'utf8');
for (const [name, render] of Object.entries(renderers)) {
  const re = new RegExp(`([ \\t]*)<!-- cv:${name}:start -->[\\s\\S]*?<!-- cv:${name}:end -->`);
  const m = html.match(re);
  if (!m) { problems.push(`index.html: markers for "${name}" not found`); continue; }
  const indent = m[1];
  const body = render(list(name));
  html = html.replace(re, () => `${indent}<!-- cv:${name}:start -->\n${body}\n${indent}<!-- cv:${name}:end -->`);
}

// every icon in the skills row must point at an existing skill card
const cardIds = new Set([...html.matchAll(/id="(skill-[a-z]+)"/g)].map((m) => m[1]));
for (const m of html.matchAll(/data-target="(skill-[a-z]+)"/g)) {
  if (!cardIds.has(m[1])) problems.push(`index.html: an icon points at "${m[1]}" but data/cv.yml has no such skill`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const current = readFileSync(pagePath, 'utf8');
if (checkOnly) {
  if (current !== html) {
    console.error('index.html is out of date with data/cv.yml. Run `npm run build` and commit the result.');
    process.exit(1);
  }
  console.log('OK: index.html matches data/cv.yml');
} else {
  if (current !== html) writeFileSync(pagePath, html);
  console.log(current !== html ? 'Updated index.html from data/cv.yml' : 'index.html already up to date');
}
