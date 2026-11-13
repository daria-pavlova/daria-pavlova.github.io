# Updating the CV content

The text of four sections lives in [`cv.yml`](cv.yml):

| Key in `cv.yml` | Section on the site |
|---|---|
| `experience` | Professional Experience |
| `education` | Education |
| `skills` | Technical Skills cards (the chips inside each card) |
| `certificates` | The certificate cards |

## Workflow

1. Edit `data/cv.yml`.
2. Run `npm run build`. This rewrites the marked parts of `index.html`.
3. Open the page to look at it, then commit **both** `data/cv.yml` and `index.html`.

CI runs `npm run build:check` and fails the pull request if `index.html` does not match `cv.yml`.
The site itself stays plain static HTML: nothing is loaded from the YAML in the browser.

## Examples

Add a bullet to a job: add a line under that job's `bullets:`.

Add a skill chip: add its name under that card's `chips:`.

Add a new job: copy a whole `- title: ...` block under `experience:` (newest first).

Add a skill card: add an entry under `skills:` with a unique lowercase `id`, a Bootstrap Icons class
for `icon` (for example `bi bi-cloud`), a `title` and `chips`.

Add a certificate: put its badge image at `assets/img/certs/<image>.png`, then add an entry with
`name`, `description`, `issuer`, `badge` (the id from the Credly badge URL) and `image`.
Set `featured: true` for the large top card.

## Rules

- Write plain text. `&`, `<` and `>` are escaped for you, so do not write HTML tags.
- Quote a value if it contains `: ` or starts with a special character, for example `"Note: text"`.
- The build refuses to run on missing fields, a bad Credly id or a missing badge image, and says which entry is wrong.

## What is not generated

- The row of clickable tool icons at the top of the skills section, and the certification path graph, are
  drawn by hand in `index.html`. If you add a skill card, the build checks that every icon still points to a card.
  A new certificate also needs a node in the graph by hand if you want it drawn there.
- The About, Portfolio and Contact sections are normal HTML.
