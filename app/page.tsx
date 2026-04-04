import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-100">

      {/* ─── Fixed Navigation ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-16 h-20">
        {/* Glass nav bar */}
        <div className="absolute inset-0 glass border-b border-white/6 backdrop-blur-xl" />

        <a href="/" className="relative font-display font-bold text-lg text-white tracking-tight z-10">
          <span className="gradient-text">DEV</span>
          <span className="text-white/60">·</span>
          <span>folio</span>
        </a>

        <div className="relative z-10 flex items-center gap-8">
          {['Projects', 'About', 'Contact'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="hidden md:block text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[oklch(0.62_0.268_270)] hover:bg-[oklch(0.68_0.268_270)] text-white transition-all duration-300 shadow-[0_0_20px_oklch(0.62_0.268_270/30%)] hover:shadow-[0_0_30px_oklch(0.62_0.268_270/50%)]"
          >
            Hire me
          </a>
        </div>
      </nav>

      {/* ─── Sections ─── */}
      <HeroSection />
      <ProjectsSection />
      <ContactSection />

      {/* ─── Footer ─── */}
      <footer className="relative border-t border-white/6 py-10 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/25 text-sm">
          <div className="font-display font-semibold">
            <span className="gradient-text">DEV</span>folio
          </div>
          <p>© 2026 — Crafted with Next.js, Three.js &amp; Anime.js</p>
          <div className="flex items-center gap-1">
            <span className="dot-live" />
            <span className="ml-2">All systems operational</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
