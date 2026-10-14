import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  isValidElement,
} from 'react';
import type { ReactNode, ComponentProps, ComponentType } from 'react';
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Github,
  Menu,
  X,
  Home,
  BookOpen,
  Rocket,
  Layers,
  Grid2X2,
  Code2,
  LifeBuoy,
  Fingerprint,
  Mail,
  Play,
  Globe2,
  MessageCircle,
  Video,
  Terminal,
  Copy,
  Check,
  Info,
  Clock3,
  FileText,
  CornerDownLeft,
  Sparkles,
  Cloud,
  GitPullRequest,
  ShieldCheck,
  Hash,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { products, docs, categories, findDoc } from './data';
import type { Product, Category, Doc } from './data';
import repositories from './repositories.json';
import type { MDXComponents } from 'mdx/types';

const modules = import.meta.glob<{
  default: ComponentType<{ components?: MDXComponents }>;
}>('./content/*.mdx');
const rawContent = import.meta.glob('./content/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const contentComponents = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [
    path.split('/').pop()!.replace('.mdx', ''),
    lazy(load),
  ]),
);
const github = 'https://github.com/GothwadTech';
function readPreference(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
function useMobileLayout() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia('(max-width: 760px)').matches,
  );
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return mobile;
}
function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <path
          d="M28 11H16l-6 9 6 9h12V19H20v4h4v2h-6l-4-5 4-5h10z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
function Outside({ children, className, href, ...props }: ComponentProps<'a'>) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

function Header({
  onSearch,
  onMenu,
  menuOpen,
  theme,
  toggleTheme,
}: {
  onSearch: () => void;
  onMenu: () => void;
  menuOpen: boolean;
  theme: string;
  toggleTheme: () => void;
}) {
  return (
    <header className="topbar">
      <div className="brand-area">
        <button
          className="icon-button mobile-menu"
          onClick={onMenu}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          aria-controls="docs-sidebar"
        >
          <Menu size={21} />
        </button>
        <Link
          to="/"
          className="brand"
          aria-label="Gothwad Tech documentation home"
        >
          <BrandMark />
          <span>
            Gothwad<span className="brand-tech"> Tech</span>
          </span>
        </Link>
        <span className="brand-divider" />
        <span className="developer-label">Developers</span>
      </div>
      <button className="search-trigger" onClick={onSearch}>
        <Search size={17} />
        <span>Search documentation...</span>
        <kbd>Ctrl K</kbd>
      </button>
      <nav className="header-actions" aria-label="Global navigation">
        <Outside
          href={github}
          className="icon-button github-button"
          aria-label="GothwadTech on GitHub"
        >
          <Github size={19} />
        </Outside>
        <span className="header-separator" />
        <button
          className="icon-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Sun size={20} /> : <Moon size={19} />}
        </button>
        <Outside href="https://www.gothwadtech.com" className="website-link">
          Go to Gothwad <ArrowUpRight size={15} />
        </Outside>
      </nav>
    </header>
  );
}
function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(true);
  const mobile = useMobileLayout();
  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open || !mobile) return;
    const active = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebarRef.current
      ?.querySelector<HTMLButtonElement>('[aria-label="Close navigation"]')
      ?.focus();
    return () => {
      document.body.style.overflow = overflow;
      active?.focus();
    };
  }, [open, mobile]);
  useEffect(() => {
    close();
  }, [location.pathname]); // eslint-disable-line
  const nav = (
    to: string,
    label: string,
    Icon: typeof Home,
    extra?: ReactNode,
  ) => (
    <NavLink
      to={to}
      end
      onClick={close}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={17} />
      <span>{label}</span>
      {extra}
    </NavLink>
  );
  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'visible' : ''}`}
        onClick={close}
      />
      <aside
        ref={sidebarRef}
        id="docs-sidebar"
        inert={mobile && !open}
        onKeyDown={(e) => {
          if (e.key !== 'Tab' || !mobile || !open) return;
          const elements =
            sidebarRef.current?.querySelectorAll<HTMLElement>('a, button');
          if (!elements?.length) return;
          const first = elements[0],
            last = elements[elements.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }}
        className={`sidebar ${open ? 'is-open' : ''}`}
        aria-label="Documentation navigation"
      >
        <div className="sidebar-scroll">
          <div className="sidebar-heading">
            DOCUMENTATION
            <button
              className="icon-button mobile-menu"
              aria-label="Close navigation"
              onClick={close}
            >
              <X size={19} />
            </button>
          </div>
          <div className="nav-group">
            {nav('/', 'Overview', Home)}
            {nav('/docs/quickstart', 'Quickstart', Rocket)}
            {nav('/docs/architecture', 'Our ecosystem', Layers)}
          </div>
          <button
            className="nav-heading collapsible"
            onClick={() => setProductsOpen(!productsOpen)}
            aria-expanded={productsOpen}
          >
            Products{' '}
            <ChevronDown size={14} className={productsOpen ? '' : 'rotated'} />
          </button>
          {productsOpen && (
            <div className="nav-group product-nav">
              {products.slice(0, 6).map((p) => (
                <NavLink
                  key={p.id}
                  to={`/docs/${p.id}`}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <p.icon size={17} />
                  <span>{p.name}</span>
                  <ChevronRight className="nav-chevron" size={13} />
                </NavLink>
              ))}
              {nav(
                '/products',
                'All products',
                Grid2X2,
                <span className="count-badge">{products.length}</span>,
              )}
            </div>
          )}
          <div className="nav-heading">Resources</div>
          <div className="nav-group">
            {nav('/guides', 'Guides & tutorials', BookOpen)}
            {nav('/docs/api', 'API reference', Code2)}
            {nav('/docs/cloudflare', 'Deployment', Cloud)}
            {nav('/repositories', 'GitHub repositories', Github)}
            {nav('/docs/security', 'Security & configuration', ShieldCheck)}
          </div>
          <div className="sidebar-help">
            <span className="help-icon">
              <GitPullRequest size={19} />
            </span>
            <h4>Better docs, together.</h4>
            <p>
              Found something we can improve?
              <br />
              Your contribution matters.
            </p>
            <Link to="/docs/contributing">
              Contribute to the docs <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <div className="sidebar-bottom">
          <span className="source-dot" /> Source-backed documentation
          <Outside
            href={`${github}/docs`}
            aria-label="View documentation source"
          >
            <ArrowUpRight size={13} />
          </Outside>
        </div>
      </aside>
    </>
  );
}
function EcosystemArt() {
  return (
    <div
      className="ecosystem-art"
      aria-label="Gothwad connects identity, email, video, browsing, messaging, and meetings"
      role="img"
    >
      <div className="art-glow" />
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <svg className="connector-lines" viewBox="0 0 450 310" fill="none">
        <g stroke="var(--diagram-line)" strokeWidth="1.2">
          <path d="M223 150V52H120M223 150V52H330" />
          <path d="M222 151H70M222 151H379M223 150V252H130M223 150V252H328" />
        </g>
        <g fill="var(--orange)">
          <circle cx="223" cy="90" r="3" />
          <circle cx="130" cy="151" r="3" />
          <circle cx="310" cy="151" r="3" />
          <circle cx="223" cy="222" r="3" />
        </g>
      </svg>
      <div className="art-center">
        <BrandMark />
        <span>GOTHWAD TECH</span>
      </div>
      <div className="art-node node-accounts">
        <Fingerprint />
        <span>Accounts</span>
      </div>
      <div className="art-node node-mail">
        <Mail />
        <span>Mail</span>
      </div>
      <div className="art-node node-tube">
        <Play />
        <span>Tube</span>
      </div>
      <div className="art-node node-browser">
        <Globe2 />
        <span>Browser</span>
      </div>
      <div className="art-node node-chat">
        <MessageCircle />
        <span>GrixChat</span>
      </div>
      <div className="art-node node-meet">
        <Video />
        <span>Meet</span>
      </div>
      <span className="art-plus plus-one">+</span>
      <span className="art-plus plus-two">+</span>
      <span className="art-plus plus-three">+</span>
      <span className="art-caption">
        <span /> ONE ECOSYSTEM. ENDLESS POSSIBILITIES.
      </span>
    </div>
  );
}
function Breadcrumb({
  label = 'Documentation',
  section,
}: {
  label?: string;
  section?: string;
}) {
  return (
    <div className="breadcrumb-row">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" aria-label="Documentation home">
          <Home size={14} />
        </Link>
        <ChevronRight size={12} />
        {section && (
          <>
            <span>{section}</span>
            <ChevronRight size={12} />
          </>
        )}
        <span>{label}</span>
      </nav>
      <Outside href={github} className="open-badge">
        <span /> Built in the open <ArrowUpRight size={12} />
      </Outside>
    </div>
  );
}
function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link to={`/docs/${p.id}`} className={`product-card accent-${p.color}`}>
      <div className="product-card-top">
        <span className={`product-icon ${p.color}`}>
          <p.icon size={24} strokeWidth={1.7} />
        </span>
        <ArrowUpRight className="product-arrow" size={17} />
      </div>
      <h3>{p.name}</h3>
      <p>{p.description}</p>
      <div className="product-card-bottom">
        <span>{p.tag}</span>
        <span>
          View docs <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}
function ProductExplorer({ full = false }: { full?: boolean }) {
  const [category, setCategory] = useState<Category>('All products');
  const [query, setQuery] = useState('');
  const filtered = products.filter(
    (p) =>
      (category === 'All products' || p.category === category) &&
      `${p.name} ${p.description} ${p.tag}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const shown =
    full || category !== 'All products' ? filtered : filtered.slice(0, 6);
  return (
    <section className="product-section" id="explore-products">
      <div className="section-heading">
        <div>
          <h2>
            {full ? 'Find your next building block.' : 'Explore our products'}
            {!full && <span className="number-pill">{products.length}</span>}
          </h2>
          <p>Everything you need to build with the Gothwad ecosystem.</p>
        </div>
        {!full && (
          <Link className="text-link" to="/products">
            View all products <ArrowRight size={15} />
          </Link>
        )}
      </div>
      {full && (
        <label className="directory-search">
          <Search size={18} />
          <input
            aria-label="Filter products"
            placeholder="Find a product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      )}
      <div
        className="category-tabs"
        role="tablist"
        aria-label="Product categories"
      >
        {categories.map((c, index) => (
          <button
            key={c}
            role="tab"
            id={`category-${index}`}
            aria-controls="product-results"
            tabIndex={category === c ? 0 : -1}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === 'ArrowRight')
                next = (index + 1) % categories.length;
              else if (event.key === 'ArrowLeft')
                next = (index - 1 + categories.length) % categories.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = categories.length - 1;
              else return;
              event.preventDefault();
              setCategory(categories[next]);
              event.currentTarget.parentElement
                ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                [next]?.focus();
            }}
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={category === c ? 'selected' : ''}
          >
            {c === 'All products' && <Grid2X2 size={14} />} {c}
          </button>
        ))}
      </div>
      <div
        className="product-grid"
        id="product-results"
        role="tabpanel"
        aria-labelledby={`category-${categories.indexOf(category)}`}
      >
        {shown.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
      {!shown.length && (
        <div className="empty-state">
          <Search size={28} />
          <h3>No products found</h3>
          <p>Try another name or category.</p>
          <button
            className="button secondary"
            onClick={() => {
              setCategory('All products');
              setQuery('');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
function GuideCard({ doc, number }: { doc: Doc; number?: string }) {
  return (
    <Link className="guide-card" to={`/docs/${doc.slug}`}>
      <div className="guide-card-top">
        <doc.icon size={20} />
        {number ? <span>{number}</span> : <span>{doc.time} read</span>}
      </div>
      <h3>{doc.title}</h3>
      <p>{doc.description}</p>
      <span className="guide-link">
        Read the guide <ArrowRight size={14} />
      </span>
    </Link>
  );
}
function HomePage() {
  return (
    <div className="page home-page">
      <Breadcrumb />
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span /> THE GOTHWAD DEVELOPER HUB
          </div>
          <h1>
            Big ideas.
            <br />
            Build them <span>here.</span>
          </h1>
          <p>
            Your starting point for everything Gothwad Tech.
            <br className="desktop-br" /> Explore the docs, connect our
            products, and bring
            <br className="desktop-br" /> your next idea to life.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/docs/quickstart">
              Start building <ArrowRight size={16} />
            </Link>
            <a className="button secondary" href="#explore-products">
              Explore products <ChevronDown size={15} />
            </a>
          </div>
          <div className="hero-footnote">
            <Code2 size={14} />
            <span>Built for developers. Open to possibilities.</span>
          </div>
        </div>
        <EcosystemArt />
      </section>
      <Link to="/docs/architecture" className="welcome-banner">
        <span className="welcome-icon">
          <Rocket size={22} strokeWidth={1.7} />
        </span>
        <span className="welcome-text">
          <strong>New to Gothwad Tech?</strong>
          <span>
            Get to know the ecosystem and find the right tools for your project.
          </span>
        </span>
        <span className="welcome-action">
          Take a quick tour <ArrowRight size={16} />
        </span>
      </Link>
      <ProductExplorer />
      <section className="popular-section">
        <div className="section-heading">
          <div>
            <h2>A little guidance. A lot of possibilities.</h2>
            <p>Practical guides to get you from idea to implementation.</p>
          </div>
          <Link to="/guides" className="text-link">
            All guides <ArrowRight size={15} />
          </Link>
        </div>
        <div className="guide-grid">
          {['oauth', 'mail-setup', 'cloudflare'].map((slug, i) => (
            <GuideCard doc={findDoc(slug)!} key={slug} number={`0${i + 1}`} />
          ))}
        </div>
      </section>
      <section className="community-strip">
        <div className="community-symbol">
          <Github size={29} />
        </div>
        <div>
          <h3>Great things are built together.</h3>
          <p>
            Explore the source, share an idea, or make your first contribution.
          </p>
        </div>
        <Outside href={`${github}/docs`} className="button secondary">
          Find us on GitHub <ArrowUpRight size={15} />
        </Outside>
      </section>
      <Footer />
    </div>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Gothwad Tech</span>
      <div>
        <Link to="/docs/contributing">Contribute</Link>
        <Outside href={`${github}/docs/issues`}>
          Give feedback <ArrowUpRight size={12} />
        </Outside>
        <span className="footer-made">Made in India. Built for everyone.</span>
      </div>
    </footer>
  );
}
function ProductsPage() {
  return (
    <div className="page">
      <Breadcrumb label="All products" />
      <div className="page-intro">
        <div className="eyebrow">THE GOTHWAD ECOSYSTEM</div>
        <h1>One place. Every product.</h1>
        <p>
          From your first sign-in to your next big launch.
          <br />
          Find documentation for the tools you're building with.
        </p>
      </div>
      <ProductExplorer full />
      <div className="catalog-note">
        <Info size={18} />
        <p>
          Looking for another repository? Explore the{' '}
          <Link to="/repositories">complete GitHub directory</Link>. Detailed
          guide coverage varies by product.
        </p>
      </div>
      <Footer />
    </div>
  );
}
function GuidesPage() {
  return (
    <div className="page">
      <Breadcrumb label="Guides & tutorials" />
      <div className="page-intro">
        <div className="eyebrow">LEARN BY BUILDING</div>
        <h1>A clear path from idea to live.</h1>
        <p>
          Source-based walkthroughs for integrating, configuring,
          <br />
          and deploying the Gothwad ecosystem.
        </p>
      </div>
      <div className="guide-grid guide-index">
        {docs
          .filter(
            (d) =>
              d.section === 'Guides' ||
              ['quickstart', 'security', 'contributing'].includes(d.slug),
          )
          .map((d) => (
            <GuideCard doc={d} key={d.slug} />
          ))}
      </div>
      <div className="catalog-note">
        <BookOpen size={18} />
        <p>
          Every guide includes source references. Need a missing guide?{' '}
          <Outside href={`${github}/docs/issues`}>
            Request documentation
          </Outside>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
}
function RepositoriesPage() {
  const [query, setQuery] = useState('');
  const filtered = repositories.filter((r) =>
    `${r.name} ${r.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page">
      <Breadcrumb label="Repository directory" />
      <div className="page-intro">
        <div className="eyebrow">BUILT IN THE OPEN</div>
        <h1>Explore the source.</h1>
        <p>
          A snapshot of GothwadTech's public repositories.
          <br />
          Reviewed October 14, 2026. Repository descriptions come from GitHub.
        </p>
      </div>
      <label className="directory-search">
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories..."
          aria-label="Search repositories"
        />
        <span>{filtered.length} repos</span>
      </label>
      <div className="repository-list">
        {filtered.map((r) => {
          const product = products.find((p) => p.repo === r.name);
          return (
            <div className="repository-row" key={r.name}>
              <Github size={21} />
              <div>
                <h3>
                  <Outside href={r.url}>
                    {r.name} <ArrowUpRight size={14} />
                  </Outside>
                  {r.isFork && <span className="tag">Fork</span>}
                </h3>
                <p>
                  {r.description ||
                    'No repository description provided. Open the source to learn more.'}
                </p>
              </div>
              {product ? (
                <Link className="text-link" to={`/docs/${product.id}`}>
                  Read docs <ArrowRight size={14} />
                </Link>
              ) : r.name === 'docs' ? (
                <Link className="text-link" to="/docs/contributing">
                  Read docs <ArrowRight size={14} />
                </Link>
              ) : (
                <span className="coverage-label">Repository only</span>
              )}
            </div>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h3>No matching repositories</h3>
          <button className="button secondary" onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      )}
      <div className="catalog-note">
        <Info size={18} />
        <p>
          Public visibility does not imply an open-source license. Check each
          repository's license and current status before reuse.
        </p>
      </div>
      <Footer />
    </div>
  );
}

function getText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getText).join('');
  if (isValidElement<{ children?: ReactNode }>(node))
    return getText(node.props.children);
  return '';
}
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
function Heading({ children, ...props }: ComponentProps<'h2'>) {
  const id = slugify(getText(children));
  return (
    <h2 id={id} {...props}>
      <a href={`#${id}`}>
        {children}
        <Hash size={17} />
      </a>
    </h2>
  );
}
function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const text = getText(children).replace(/\n$/, '');
  const language = isValidElement<{ className?: string }>(children)
    ? children.props.className?.replace('language-', '') || 'text'
    : 'text';
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
    }
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          <Terminal size={13} />
          {language}
        </span>
        <button onClick={copy} aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span aria-live="polite">
            {copied ? 'Copied!' : error ? 'Select code to copy' : 'Copy'}
          </span>
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}
function Callout({
  children,
  title,
}: {
  children?: ReactNode;
  title?: string;
}) {
  return (
    <aside className="callout">
      <Info size={19} />
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </aside>
  );
}
function ContentLink({ href = '', children, ...props }: ComponentProps<'a'>) {
  return href.startsWith('/') ? (
    <Link to={href} {...props}>
      {children}
    </Link>
  ) : href.startsWith('#') ? (
    <a href={href} {...props}>
      {children}
    </a>
  ) : (
    <Outside href={href} {...props}>
      {children}
    </Outside>
  );
}
const mdxComponents = {
  h2: Heading,
  pre: CodeBlock,
  Callout,
  a: ContentLink,
  table: ({ children, ...props }: ComponentProps<'table'>) => (
    <div className="table-scroll">
      <table {...props}>{children}</table>
    </div>
  ),
};
function DocPage({ doc }: { doc: Doc }) {
  const Content = contentComponents[doc.slug];
  const [feedback, setFeedback] = useState<string | null>(() =>
    readPreference(`feedback-${doc.slug}`),
  );
  const [feedbackSaved, setFeedbackSaved] = useState(true);
  const [activeHeading, setActiveHeading] = useState('');
  const raw = rawContent[`./content/${doc.slug}.mdx`] || '';
  const headings = [...raw.matchAll(/^## (.+)$/gm)].map((m) => ({
    text: m[1],
    id: slugify(m[1]),
  }));
  useEffect(() => {
    setActiveHeading('');
    let observer: IntersectionObserver | undefined;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActiveHeading(e.target.id);
          });
        },
        { rootMargin: '-90px 0px -65% 0px' },
      );
      document
        .querySelectorAll('.prose h2')
        .forEach((h) => observer!.observe(h));
    }, 300);
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [doc.slug]);
  const index = docs.findIndex((d) => d.slug === doc.slug);
  const next = docs[index + 1];
  const prev = docs[index - 1];
  return (
    <div className="page document-page">
      <Breadcrumb label={doc.title} section={doc.section} />
      <div className="document-layout">
        <article className="document">
          <div className="doc-eyebrow">
            <doc.icon size={16} />
            {doc.section}
          </div>
          <h1>{doc.title}</h1>
          <p className="doc-description">{doc.description}</p>
          <div className="doc-meta">
            <span>
              <Clock3 size={13} />
              {doc.time} read
            </span>
            <span>Reviewed Oct 14, 2026</span>
            <Outside
              href={
                doc.repo
                  ? `${github}/${doc.repo}/blob/main/${doc.source}`
                  : `${github}/docs`
              }
            >
              View source <ArrowUpRight size={12} />
            </Outside>
          </div>
          <div className="prose">
            <Suspense
              fallback={<p className="loading-content">Loading guide...</p>}
            >
              <Content {...{ components: mdxComponents }} />
            </Suspense>
          </div>
          <div className="doc-feedback">
            <div>
              <strong>Was this page helpful?</strong>
              <p>
                {feedback
                  ? feedbackSaved
                    ? 'Thanks! Your feedback is saved on this device.'
                    : 'Thanks for your feedback for this visit.'
                  : 'Help us make the docs a little better.'}
              </p>
            </div>
            <div>
              {feedback ? (
                <span className="feedback-saved">
                  <Check size={16} /> Thank you
                </span>
              ) : (
                <>
                  <button
                    className="feedback-button"
                    onClick={() => {
                      setFeedback('yes');
                      setFeedbackSaved(
                        savePreference(`feedback-${doc.slug}`, 'yes'),
                      );
                    }}
                  >
                    <ThumbsUp size={15} />
                    Yes
                  </button>
                  <button
                    className="feedback-button"
                    onClick={() => {
                      setFeedback('no');
                      setFeedbackSaved(
                        savePreference(`feedback-${doc.slug}`, 'no'),
                      );
                    }}
                  >
                    <ThumbsDown size={15} />
                    Not quite
                  </button>
                </>
              )}
            </div>
          </div>
          {feedback === 'no' && (
            <p className="feedback-followup">
              <Outside
                href={`${github}/docs/issues/new?title=${encodeURIComponent(`Docs feedback: ${doc.title}`)}`}
              >
                Tell us what could be clearer on GitHub{' '}
                <ArrowUpRight size={13} />
              </Outside>
            </p>
          )}
          <div className="doc-pagination">
            {prev && (
              <Link to={`/docs/${prev.slug}`}>
                <span>
                  <ArrowLeft size={13} /> Previous
                </span>
                <strong>{prev.title}</strong>
              </Link>
            )}
            {next && (
              <Link to={`/docs/${next.slug}`} className="next">
                <span>
                  Up next <ArrowRight size={13} />
                </span>
                <strong>{next.title}</strong>
              </Link>
            )}
          </div>
        </article>
        <aside className="page-outline">
          <div className="outline-sticky">
            <h4>On this page</h4>
            <nav>
              {headings.map((h) => (
                <a
                  href={`#${h.id}`}
                  key={h.id}
                  className={activeHeading === h.id ? 'current' : ''}
                >
                  {h.text}
                </a>
              ))}
            </nav>
            <div className="outline-links">
              <Outside
                href={`${github}/docs/edit/main/src/content/${doc.slug}.mdx`}
              >
                <FileText size={14} />
                Edit this page <ArrowUpRight size={12} />
              </Outside>
              <Outside
                href={`${github}/docs/issues/new?title=${encodeURIComponent(`Documentation: ${doc.title}`)}`}
              >
                <LifeBuoy size={14} />
                Report an issue <ArrowUpRight size={12} />
              </Outside>
            </div>
            <div className="outline-tip">
              <Sparkles size={19} />
              <strong>Keep exploring.</strong>
              <p>Find your next building block in the Gothwad ecosystem.</p>
              <Link to="/products">
                Explore products <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
function NotFound() {
  return (
    <div className="page">
      <Breadcrumb label="Page not found" />
      <div className="not-found">
        <span className="eyebrow">404 · A SMALL DETOUR</span>
        <h1>This page is off the map.</h1>
        <p>The link may have moved. Let's get you back to building.</p>
        <Link to="/" className="button primary">
          Back to documentation <ArrowRight size={16} />
        </Link>
      </div>
      <Footer />
    </div>
  );
}
function SearchDialog({ close }: { close: () => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const normalized = query.toLowerCase().trim();
  const results = normalized
    ? docs
        .map((d) => ({
          doc: d,
          score: d.title.toLowerCase().includes(normalized)
            ? 3
            : d.description.toLowerCase().includes(normalized)
              ? 2
              : rawContent[`./content/${d.slug}.mdx`]
                    ?.toLowerCase()
                    .includes(normalized)
                ? 1
                : 0,
        }))
        .filter((r) => r.score)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.doc)
        .slice(0, 8)
    : ['quickstart', 'oauth', 'mail-setup', 'cloudflare', 'api'].map((s) =>
        findDoc(s)!,
      );
  const open = (d: Doc) => {
    navigate(`/docs/${d.slug}`);
    close();
  };
  useEffect(() => {
    const active = document.activeElement as HTMLElement;
    input.current?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = old;
      active?.focus();
    };
  }, []);
  useEffect(() => {
    setSelected(0);
  }, [query]);
  useEffect(() => {
    ref.current
      ?.querySelector(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selected]);
  return (
    <div className="search-backdrop" onClick={close}>
      <div
        ref={ref}
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelected((s) => Math.min(s + 1, results.length - 1));
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelected((s) => Math.max(s - 1, 0));
          }
          if (
            e.key === 'Enter' &&
            e.target === input.current &&
            results[selected]
          ) {
            e.preventDefault();
            open(results[selected]);
          }
          if (e.key === 'Tab') {
            const elements =
              ref.current?.querySelectorAll<HTMLElement>('input, button, a');
            if (!elements?.length) return;
            const first = elements[0],
              last = elements[elements.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="search-input-row">
          <Search size={22} />
          <input
            ref={input}
            placeholder="What would you like to build?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search all documentation"
            aria-controls="search-results"
            aria-activedescendant={
              results[selected] ? `result-${results[selected].slug}` : undefined
            }
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
          />
          <button onClick={close} aria-label="Close search">
            <kbd>Esc</kbd>
          </button>
        </div>
        <div className="search-results-heading">
          {query ? `${results.length} matching guides` : 'POPULAR SEARCHES'}
          <span>Search all documentation</span>
        </div>
        <div id="search-results" className="search-results" role="listbox">
          {results.map((d, i) => (
            <button
              role="option"
              aria-selected={selected === i}
              id={`result-${d.slug}`}
              data-index={i}
              onMouseEnter={() => setSelected(i)}
              onClick={() => open(d)}
              key={d.slug}
              className={`search-result ${selected === i ? 'highlighted' : ''}`}
            >
              <span className="result-icon">
                <d.icon size={21} />
              </span>
              <span>
                <small>{d.section}</small>
                <strong>{d.title}</strong>
                <p>{d.description}</p>
              </span>
              <CornerDownLeft size={16} />
            </button>
          ))}
        </div>
        {!results.length && (
          <div className="empty-state">
            <Search size={28} />
            <h3>No results for “{query}”</h3>
            <p>Try “Accounts”, “deployment”, or “OAuth”.</p>
          </div>
        )}
        <div className="search-dialog-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to navigate <kbd>↵</kbd> to open
          </span>
          <span>
            <BrandMark small /> Gothwad Docs
          </span>
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light',
  );
  const location = useLocation();
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch((v) => !v);
      }
      if (e.key === 'Escape') setMenu(false);
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('gothwad-theme', theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    setMenu(false);
    if (!location.hash) window.scrollTo(0, 0);
    else
      setTimeout(
        () => document.getElementById(location.hash.slice(1))?.scrollIntoView(),
        150,
      );
    const doc = findDoc(location.pathname.replace('/docs/', ''));
    const label =
      doc?.title ||
      {
        '/': 'Documentation',
        '/products': 'All products',
        '/guides': 'Guides & tutorials',
        '/repositories': 'Repository directory',
      }[location.pathname] ||
      'Page not found';
    document.title = `${label} · Gothwad Tech Developers`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        doc?.description ||
          'Documentation, integration guides, and developer resources for the Gothwad Tech ecosystem.',
      );
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header
        onSearch={() => setSearch(true)}
        onMenu={() => setMenu(true)}
        menuOpen={menu}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      <Sidebar open={menu} close={() => setMenu(false)} />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
          {docs.map((doc) => (
            <Route
              path={`/docs/${doc.slug}`}
              key={doc.slug}
              element={<DocPage key={doc.slug} doc={doc} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {search && <SearchDialog close={() => setSearch(false)} />}
    </>
  );
}
