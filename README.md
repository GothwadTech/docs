# Gothwad Tech · Developer documentation

A central, source-based documentation portal for the Gothwad Tech ecosystem. Built with **React 19, Vite, TypeScript, MDX, and CSS**, with a responsive Cloudflare-inspired interface and a distinct Gothwad identity.

## Included

- 12 product guides and 21 MDX pages in total.
- Accounts deployment and OAuth / PKCE integration, Mail setup and REST reference, PlusTube web, Meet, GrixChat, and additional product orientations.
- Full-text local search with `Ctrl+K` / `⌘K`, keyboard navigation, and no external search service.
- Product category filters, a searchable public-repository inventory, and guide indexes.
- Light/dark themes, responsive mobile navigation, heading anchors, page outlines, and copyable code blocks.
- Source references, contribution links, and clearly labeled documentation boundaries.
- Cloudflare Pages redirects and security/cache headers.
- Content-integrity tests, browser tests, and GitHub Actions validation.

**Coverage is intentionally explicit:** this is a curated initial documentation release, not a claim that every product or deployment is fully documented or verified. See [SOURCES.md](SOURCES.md). No live product infrastructure was changed.

## Local development

Use **Node.js 22.13 or later** (Node 22 LTS recommended).

```bash
npm ci
npm run dev
```

Vite prints the local URL. The dev server listens on `0.0.0.0`; `.e2b.app` preview hosts are allowed. No environment variables or API keys are needed for this documentation site.

```bash
npm test               # Metadata, content, links, and deployment-file checks
npm run build         # TypeScript check + Vite / MDX production build
npm run preview       # Serve the production dist directory
```

### Browser tests

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

The Playwright configuration starts Vite automatically, or reuses the local development server. The tests cover all 21 guides, search, filters, deep links, anchors, code copy, theme persistence, feedback, repository search, not-found routes, and mobile overflow/navigation. To use an already-installed browser, set `CHROMIUM_PATH` to its executable. `TEST_BASE_URL` can point tests at a separately running production preview.

## Deploy to Cloudflare Pages

1. Push the finished code to the branch you intend to deploy. The current development work is on `arena/14d98888-docs`; production can follow your normal reviewed merge process.
2. In Cloudflare, create a **Pages** project and connect `GothwadTech/docs`.
3. Select the branch that contains this implementation.
4. Configure:

   | Setting                | Value             |
   | ---------------------- | ----------------- |
   | Framework preset       | Vite              |
   | Build command          | `npm run build`   |
   | Build output directory | `dist`            |
   | Root directory         | Repository root   |
   | Environment variable   | `NODE_VERSION=22` |

5. Deploy and test `/`, `/products`, and a direct guide URL such as `/docs/oauth`.
6. Add your own domain in the project's **Custom domains** settings and complete the DNS instructions Cloudflare supplies.

No runtime Worker, database, or secret is required. `public/_redirects` ensures SPA deep links work. `public/_headers` sets safe static headers and long-lived caching only for hashed assets. This does not deploy the Accounts or Mail Workers; those are separate products with separate guides.

This is a client-rendered SPA. Per-route titles and descriptions are updated in the browser. Prerendered HTML, a production-domain sitemap, and localized content can be added once the production domain and publishing strategy are decided; they are not presented as already implemented.

## Content structure

```text
src/
  App.tsx              Layout, routing, search, and MDX UI components
  data.ts              Product and guide metadata
  content/*.mdx        Source-based documentation
  repositories.json    Public GitHub inventory snapshot
  styles.css           Responsive light and dark styles
public/
  favicon.svg
  _redirects
  _headers
tests/
  content.test.mjs      Content and link integrity
  e2e/site.spec.ts      Browser interactions and route checks
SOURCES.md              Source revisions and coverage boundaries
```

### Add a guide

1. Create `src/content/your-guide.mdx`.
2. Add matching metadata to `docs` in `src/data.ts`. The slug must match the filename.
3. Use `##` headings for the on-page outline and fenced code blocks for snippets.
4. Add `<Callout title="Important">…</Callout>` for warnings or configuration boundaries.
5. Cite verified product source files and update `SOURCES.md` with the reviewed revision.
6. Run tests and the build, then inspect the route, search results, mobile layout, and dark theme.

MDX is compiled at build time and must be reviewed trusted repository content. There is no runtime upload or execution of untrusted MDX. Raw content is also bundled for local full-text search; never put secrets in a guide, even in a hidden component or example.

### Refresh the repository inventory

With your own authenticated GitHub CLI:

```bash
gh repo list GothwadTech --limit 100 \
  --json name,description,url,isPrivate,isFork > src/repositories.json
```

Review the output and retain **public repositories only** before committing. This inventory is not fetched from visitors' browsers. Repo descriptions and product documentation are snapshots, not automatic live synchronization.

## Privacy and feedback

Search runs locally. Theme preference and page-helpfulness selections are stored only in the current browser's local storage; feedback is **not sent to a backend**. The interface links to GitHub issues for actionable feedback. The site does not request product tokens, cookies, passwords, or provider keys.

## Source and licensing boundaries

Product documentation is paraphrased from public GothwadTech source files and credits the relevant repositories. Product licenses differ: public source does not imply an open-source license. Browser's source-available restrictions and PlusTube's upstream Flow attribution are explicitly noted. No product secrets or native signing materials are included.
