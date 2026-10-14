import {
  Fingerprint,
  Mail,
  Play,
  Globe2,
  MessageCircle,
  Video,
  Monitor,
  FolderOpen,
  GraduationCap,
  HardDrive,
  Braces,
  Building2,
  BookOpen,
  Layers,
  Rocket,
  ShieldCheck,
  Cloud,
  Code2,
  KeyRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
export type Category =
  | 'All products'
  | 'Identity & security'
  | 'Communication'
  | 'Media & apps'
  | 'Developer tools';
export const categories: Category[] = [
  'All products',
  'Identity & security',
  'Communication',
  'Media & apps',
  'Developer tools',
];
export type Product = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category: Category;
  repo: string;
  tag: string;
};
export const products: Product[] = [
  {
    id: 'accounts',
    name: 'Gothwad Accounts',
    description:
      'One identity for your ecosystem. Authentication, sessions, and OAuth 2.0.',
    icon: Fingerprint,
    color: 'orange',
    category: 'Identity & security',
    repo: 'accounts',
    tag: 'Identity',
  },
  {
    id: 'mail',
    name: 'Gothwad Mail',
    description:
      'Your inbox, connected. Send, receive, and manage email on the edge.',
    icon: Mail,
    color: 'blue',
    category: 'Communication',
    repo: 'mail',
    tag: 'Email',
  },
  {
    id: 'tube',
    name: 'Gothwad Tube',
    description:
      'A better way to watch. Explore the PlusTube app and its web platform.',
    icon: Play,
    color: 'red',
    category: 'Media & apps',
    repo: 'tubeweb',
    tag: 'Video & music',
  },
  {
    id: 'browser',
    name: 'Gothwad Browser',
    description:
      'Built for the bigger screen. Browsing for Android TVs, tablets, and more.',
    icon: Globe2,
    color: 'teal',
    category: 'Media & apps',
    repo: 'browser',
    tag: 'Browser',
  },
  {
    id: 'grixchat',
    name: 'GrixChat',
    description:
      'Bring conversations together with real-time messaging and private calls.',
    icon: MessageCircle,
    color: 'violet',
    category: 'Communication',
    repo: 'grixchat',
    tag: 'Messaging',
  },
  {
    id: 'meet',
    name: 'Gothwad Meet',
    description:
      'Connect face to face. Peer-to-peer video meetings, powered by WebRTC.',
    icon: Video,
    color: 'green',
    category: 'Communication',
    repo: 'meet',
    tag: 'Video conferencing',
  },
  {
    id: 'launcher',
    name: 'Gothwad Launcher',
    description:
      'A native Android TV home screen with remote-first navigation.',
    icon: Monitor,
    color: 'blue',
    category: 'Media & apps',
    repo: 'launcher',
    tag: 'Android TV',
  },
  {
    id: 'manager',
    name: 'Gothwad Manager',
    description: 'File management and archive tools for Android devices.',
    icon: FolderOpen,
    color: 'orange',
    category: 'Media & apps',
    repo: 'manager',
    tag: 'File management',
  },
  {
    id: 'education',
    name: 'Gothwad Education',
    description:
      'School administration and learning for teachers, students, and parents.',
    icon: GraduationCap,
    color: 'violet',
    category: 'Media & apps',
    repo: 'education',
    tag: 'Education',
  },
  {
    id: 'clashdrive',
    name: 'Clash Drive',
    description:
      'Turn Telegram forum topics into a browser-based storage workspace.',
    icon: HardDrive,
    color: 'teal',
    category: 'Media & apps',
    repo: 'Clashdrive',
    tag: 'Storage',
  },
  {
    id: 'ai',
    name: 'Gothwad AI',
    description:
      'Get oriented with the AI Studio application and local development setup.',
    icon: Braces,
    color: 'orange',
    category: 'Developer tools',
    repo: 'ai',
    tag: 'AI tools',
  },
  {
    id: 'gothwadtech',
    name: 'Gothwad Tech website',
    description:
      'Explore the corporate web platform, components, and developer entry points.',
    icon: Building2,
    color: 'blue',
    category: 'Developer tools',
    repo: 'gothwadtech',
    tag: 'Web platform',
  },
];
export type Doc = {
  slug: string;
  title: string;
  description: string;
  section: string;
  icon: LucideIcon;
  repo?: string;
  source?: string;
  time: string;
};
export const docs: Doc[] = [
  {
    slug: 'quickstart',
    title: 'Start building with Gothwad',
    description:
      'Choose a product, prepare your environment, and run your first project.',
    section: 'Getting started',
    icon: Rocket,
    time: '5 min',
  },
  {
    slug: 'architecture',
    title: 'The Gothwad ecosystem',
    description:
      'Understand how identity, Workers, web apps, and native products fit together.',
    section: 'Getting started',
    icon: Layers,
    time: '6 min',
  },
  ...products.map((p) => ({
    slug: p.id,
    title: p.name,
    description: p.description,
    section: 'Products',
    icon: p.icon,
    repo: p.repo,
    source: 'README.md',
    time: ['accounts', 'mail'].includes(p.id) ? '8 min' : '5 min',
  })),
  {
    slug: 'accounts-setup',
    title: 'Set up Gothwad Accounts',
    description:
      'Configure Supabase, deploy the auth Worker, and publish the Accounts frontend.',
    section: 'Guides',
    icon: Fingerprint,
    repo: 'accounts',
    source: 'docs/SETUP.md',
    time: '12 min',
  },
  {
    slug: 'oauth',
    title: 'Integrate Sign in with Gothwad',
    description:
      'Implement the authorization-code flow with PKCE, state validation, and user info.',
    section: 'Guides',
    icon: KeyRound,
    repo: 'accounts',
    source: 'docs/OAUTH.md',
    time: '10 min',
  },
  {
    slug: 'mail-setup',
    title: 'Deploy Gothwad Mail',
    description:
      'Connect Accounts, configure the Mail database and Worker, and enable email routing.',
    section: 'Guides',
    icon: Mail,
    repo: 'mail',
    source: 'docs/SETUP.md',
    time: '12 min',
  },
  {
    slug: 'cloudflare',
    title: 'Deploy to Cloudflare Pages',
    description:
      'Build and publish this documentation site, with working deep links and a custom domain.',
    section: 'Guides',
    icon: Cloud,
    time: '6 min',
  },
  {
    slug: 'api',
    title: 'API reference',
    description:
      'Explore the documented Accounts OAuth and Mail REST endpoints.',
    section: 'Resources',
    icon: Code2,
    time: '8 min',
  },
  {
    slug: 'security',
    title: 'Security & configuration',
    description:
      'Handle secrets, sessions, public variables, and production configuration safely.',
    section: 'Resources',
    icon: ShieldCheck,
    time: '5 min',
  },
  {
    slug: 'contributing',
    title: 'Contribute to the docs',
    description:
      'Add an MDX guide, cite its source, and validate changes locally.',
    section: 'Resources',
    icon: BookOpen,
    time: '4 min',
  },
];
export const findDoc = (slug: string) => docs.find((d) => d.slug === slug);
