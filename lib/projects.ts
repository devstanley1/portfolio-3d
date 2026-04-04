export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  duration: string;
  role: string;
  status: 'Live' | 'Case Study' | 'Open Source';
  description: string;
  longDescription: string;
  challenge: string;
  solution: string;
  outcome: string;
  tech: string[];
  highlights: { label: string; value: string }[];
  color: {
    primary: string;       // oklch string
    secondary: string;
    bg: string;
    card: string;
    gradient: string;
  };
  scene: 'helix' | 'sphere-cluster' | 'cube-grid' | 'rings' | 'diamond' | 'vortex';
}

export const PROJECTS: Project[] = [
  {
    slug: 'nexus-dashboard',
    title: 'Nexus Dashboard',
    tagline: 'Real-time analytics at planetary scale',
    category: 'Data Visualization',
    year: '2025',
    duration: '6 months',
    role: 'Lead Frontend Engineer',
    status: 'Live',
    description:
      'A hyper-performance analytics dashboard processing 50M events/day with sub-50ms query latency, custom WebGL charts, and AI-generated insights.',
    longDescription:
      'Nexus was built to replace a legacy BI tool that couldn\'t handle the client\'s data velocity. The platform ingests raw event streams, runs real-time aggregations via ClickHouse, and renders millions of data points through a custom WebGL renderer — all in the browser. The UX was designed around progressive disclosure: executives see a single-metric overview; engineers can drill down to raw SQL traces.',
    challenge:
      'The existing solution took 8-12 seconds to render a single chart with 1M rows. The client\'s growth projected 10x more data within 12 months, making the bottleneck existential.',
    solution:
      'We built a micro-batched event pipeline (Kafka → ClickHouse) and replaced Chart.js with a custom WebGL renderer using PixiJS. Queries run on the edge via Cloudflare Workers. The UI uses React Server Components for skeleton rendering and streams results progressively.',
    outcome:
      'Chart render time dropped from 8.2s to 47ms. Monthly Active Users increased 340%. The platform now handles 180M events/day after client growth, with zero performance degradation.',
    tech: ['Next.js 15', 'ClickHouse', 'WebGL / PixiJS', 'Kafka', 'Cloudflare Workers', 'Prisma', 'tRPC', 'TypeScript'],
    highlights: [
      { label: 'Events/day', value: '180M+' },
      { label: 'Query latency', value: '47ms' },
      { label: 'Render speedup', value: '174×' },
      { label: 'MAU growth', value: '+340%' },
    ],
    color: {
      primary: 'oklch(0.62 0.268 270)',
      secondary: 'oklch(0.72 0.18 200)',
      bg: 'from-violet-950/60 via-indigo-950/40 to-transparent',
      card: 'oklch(0.62 0.268 270)',
      gradient: 'linear-gradient(135deg, #6d28d9, #0ea5e9)',
    },
    scene: 'helix',
  },
  {
    slug: 'aura-ai',
    title: 'Aura AI',
    tagline: 'Generate 3D scenes through natural language',
    category: 'AI / Generative',
    year: '2025',
    duration: '4 months',
    role: 'Full-Stack Engineer',
    status: 'Live',
    description:
      'A creative AI platform that converts text prompts into fully interactive Three.js 3D scenes, exported as embeddable code or glTF files.',
    longDescription:
      'Aura sits at the intersection of LLMs and real-time 3D rendering. Users describe a scene in plain language ("a foggy mountain with a glowing temple") and the platform generates Three.js code, executes it in a sandboxed iframe, and streams the result. The AI model was fine-tuned on 120k Three.js code samples curated from CodeSandbox and GitHub.',
    challenge:
      'LLMs hallucinate invalid Three.js APIs constantly. We needed a validation and correction loop that kept latency under 3 seconds, while safely executing untrusted generated code.',
    solution:
      'We built a multi-stage pipeline: prompt → GPT-4 fine-tune → AST validation → safe eval sandbox → Three.js render. The validator catches 94% of API hallucinations. Invalid code triggers a targeted repair pass with a smaller, faster model.',
    outcome:
      'Aura reached 12k users in 8 weeks without paid marketing. 78% of generated scenes pass on first attempt. Featured in Product Hunt\'s top 5 of the week.',
    tech: ['Next.js', 'Three.js', 'OpenAI API', 'Vercel AI SDK', 'Sandpack', 'Prisma', 'tRPC', 'TypeScript'],
    highlights: [
      { label: 'Users in 8 weeks', value: '12,000' },
      { label: 'First-pass success', value: '78%' },
      { label: 'Generation time', value: '<3s' },
      { label: 'Training samples', value: '120k' },
    ],
    color: {
      primary: 'oklch(0.68 0.22 330)',
      secondary: 'oklch(0.72 0.2 10)',
      bg: 'from-pink-950/60 via-rose-950/40 to-transparent',
      card: 'oklch(0.68 0.22 330)',
      gradient: 'linear-gradient(135deg, #be185d, #f97316)',
    },
    scene: 'sphere-cluster',
  },
  {
    slug: 'prism-design',
    title: 'Prism Design System',
    tagline: '48 accessible components. Zero compromise.',
    category: 'UI Engineering',
    year: '2024',
    duration: '8 months',
    role: 'Design Systems Lead',
    status: 'Open Source',
    description:
      'A fully accessible, dark-first component library with 48 components, motion tokens, multi-brand theming, and a full Storybook documentation site.',
    longDescription:
      'Prism started as an internal tool to solve brand inconsistency across 6 product teams. Over 8 months it evolved into a standalone library with full WCAG 2.2 AA compliance, a semantic token system based on OKLCH color space, Radix-UI primitives, and a Storybook instance with interactive playground, accessibility audit panel, and visual regression tests against a Chromatic baseline.',
    challenge:
      'The existing design system had 3 different button implementations, zero keyboard navigation, and a Figma library that was 4 months out of sync with reality. Teams were shipping inaccessible UI under deadline pressure.',
    solution:
      'We introduced a Contract-first workflow: Figma tokens sync to code via Token Studio. Every component has a matching accessibility spec, keyboard map, and visual test. The library ships with a ESLint plugin that enforces correct prop usage.',
    outcome:
      '820 GitHub stars in 6 months. Adopted by all 6 internal product teams. Accessibility score across products went from 68 to 97 (Lighthouse). Developer survey showed 40% faster UI implementation.',
    tech: ['React', 'Radix UI', 'Tailwind CSS', 'Storybook', 'TypeScript', 'Chromatic', 'Figma Token Studio', 'OKLCH'],
    highlights: [
      { label: 'Components', value: '48' },
      { label: 'GitHub Stars', value: '820' },
      { label: 'a11y score', value: '97/100' },
      { label: 'Build speed', value: '+40%' },
    ],
    color: {
      primary: 'oklch(0.72 0.2 162)',
      secondary: 'oklch(0.75 0.18 140)',
      bg: 'from-emerald-950/60 via-teal-950/40 to-transparent',
      card: 'oklch(0.72 0.2 162)',
      gradient: 'linear-gradient(135deg, #059669, #14b8a6)',
    },
    scene: 'cube-grid',
  },
  {
    slug: 'orbit-commerce',
    title: 'Orbit Commerce',
    tagline: 'AR-powered shopping. Sub-2s on 3G.',
    category: 'E-commerce',
    year: '2024',
    duration: '5 months',
    role: 'Senior Frontend Engineer',
    status: 'Live',
    description:
      'A premium storefront with WebXR augmented reality product previews, a dynamic pricing engine, and Core Web Vitals perfection at global scale.',
    longDescription:
      'Orbit Commerce was built for a luxury furniture brand whose customers demanded "see it before you buy it." The platform integrates WebXR AR (via model-viewer) with a custom 3D asset pipeline that converts manufacturer CAD files to optimized glTF/Draco meshes. The storefront runs on Next.js with full ISR, Cloudflare CDN, and a custom edge pricing API that personalizes prices by region, loyalty tier, and real-time inventory.',
    challenge:
      'CAD files from manufacturers average 800MB. AR loads needed to feel instant. The pricing engine had to be real-time but couldn\'t expose business logic on the client. Global LCP was averaging 4.8 seconds.',
    solution:
      'We built a serverless 3D asset pipeline (Blender headless + Draco compression) that reduces CAD files to under 2MB glTFs. AR models lazy-load with a skeleton placeholder. Pricing runs at the edge on Cloudflare Workers with encrypted product config. Bundle splitting and critical CSS dropped LCP to 1.4s.',
    outcome:
      'Conversion rate increased 62%. Mobile AR sessions drive 3.1× higher AOV than desktop. LCP improved from 4.8s to 1.4s globally. Featured in Shopify\'s Tech Partner spotlight.',
    tech: ['Next.js', 'Three.js / React Three Fiber', 'model-viewer (WebXR)', 'Cloudflare Workers', 'Shopify Storefront API', 'Draco', 'Edge Config'],
    highlights: [
      { label: 'Conversion uplift', value: '+62%' },
      { label: 'AR AOV boost', value: '3.1×' },
      { label: 'LCP', value: '1.4s' },
      { label: 'Asset compression', value: '400×' },
    ],
    color: {
      primary: 'oklch(0.75 0.18 55)',
      secondary: 'oklch(0.78 0.16 75)',
      bg: 'from-amber-950/60 via-orange-950/40 to-transparent',
      card: 'oklch(0.75 0.18 55)',
      gradient: 'linear-gradient(135deg, #d97706, #ef4444)',
    },
    scene: 'rings',
  },
  {
    slug: 'void-protocol',
    title: 'Void Protocol',
    tagline: 'Cyberpunk multiplayer browser game',
    category: 'Game / WebGL',
    year: '2024',
    duration: '3 months',
    role: 'Solo Developer',
    status: 'Open Source',
    description:
      'A real-time multiplayer browser game built entirely in Three.js and WebSockets, with procedural level generation and a custom ECS architecture.',
    longDescription:
      'Void Protocol is a top-down arena shooter where 8 players compete in procedurally generated cyberpunk maps. The game runs fully in the browser — no downloads, no plugins. The architecture uses a custom Entity-Component-System (ECS) over a 20Hz authoritative WebSocket server. Procedural map generation uses Wave Function Collapse for deterministic seeds. The renderer targets 60fps at 1440p with post-processing (bloom, chromatic aberration, scanlines).',
    challenge:
      'Browser games traditionally suffer from latency and garbage collection spikes. WebSocket jitter caused visible stuttering above 100ms RTT. Object pools were critical but complex to manage with React-style thinking.',
    solution:
      'We built a pure JS ECS without React (zero virtual DOM in game loop). All game objects are pooled TypedArrays. Client-side prediction with server reconciliation keeps the game smooth up to 200ms RTT. The server is a tiny Bun process that handles 8 concurrent rooms with under 2MB RAM each.',
    outcome:
      '2,800 GitHub stars. 45k unique players in first month. Average session time of 22 minutes. Featured in JS Weekly and Web Weekly newsletters.',
    tech: ['Three.js', 'Bun.js', 'WebSockets', 'TypeScript', 'Custom ECS', 'Wave Function Collapse', 'WebGL Post-Processing'],
    highlights: [
      { label: 'GitHub Stars', value: '2,800' },
      { label: 'Players (month 1)', value: '45k' },
      { label: 'Avg session', value: '22 min' },
      { label: 'Server RAM/room', value: '<2MB' },
    ],
    color: {
      primary: 'oklch(0.65 0.22 25)',
      secondary: 'oklch(0.7 0.2 340)',
      bg: 'from-red-950/60 via-rose-950/40 to-transparent',
      card: 'oklch(0.65 0.22 25)',
      gradient: 'linear-gradient(135deg, #ef4444, #a855f7)',
    },
    scene: 'diamond',
  },
  {
    slug: 'flow-finance',
    title: 'Flow Finance',
    tagline: 'Personal finance powered by AI forecasting',
    category: 'FinTech',
    year: '2023',
    duration: '7 months',
    role: 'Frontend Lead',
    status: 'Live',
    description:
      'An AI-driven personal finance app that predicts cashflow 90 days ahead, categorizes transactions with 96% accuracy, and suggests micro-investments.',
    longDescription:
      'Flow Finance connects to 3,000+ banks via Plaid, runs ML categorization on raw transactions, and produces a 90-day cashflow forecast using a fine-tuned Prophet model. The app is built as a PWA with Service Workers for offline access. The UI features an animated cashflow timeline, budget rings, and an AI chat interface for natural language financial queries ("Will I be able to afford a vacation in August?").',
    challenge:
      'Financial data is deeply personal and legally regulated. We needed end-to-end encryption, GDPR compliance, PCI DSS scope reduction, and a model that works on sparse data (new users with <1 month history).',
    solution:
      'Data is encrypted at rest with per-user keys managed in AWS KMS. No raw transaction data is stored — only derived features. The forecasting model uses transfer learning to bootstrap predictions from anonymized aggregate patterns when user data is sparse.',
    outcome:
      '18k+ active users after 4 months of public beta. Average prediction error of 6.3% at 30-day horizon. App Store rating of 4.8/5 with 2,100 reviews. SOC 2 Type II certified.',
    tech: ['React Native', 'Expo', 'Python (Prophet / FastAPI)', 'Plaid API', 'AWS KMS', 'PostgreSQL', 'Redis', 'TypeScript'],
    highlights: [
      { label: 'Active users', value: '18k+' },
      { label: 'Forecast accuracy', value: '93.7%' },
      { label: 'App Store rating', value: '4.8 ★' },
      { label: 'Transaction accuracy', value: '96%' },
    ],
    color: {
      primary: 'oklch(0.62 0.18 230)',
      secondary: 'oklch(0.72 0.2 200)',
      bg: 'from-cyan-950/60 via-sky-950/40 to-transparent',
      card: 'oklch(0.62 0.18 230)',
      gradient: 'linear-gradient(135deg, #0891b2, #6366f1)',
    },
    scene: 'vortex',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
