'use client';

import { useEffect, useRef, use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/lib/projects';
import { ProjectScene } from '@/components/ui/ProjectScene';
import { Floating3DObject } from '@/components/ui/Floating3DObject';

const accentMap: Record<string, string> = {
  'oklch(0.62 0.268 270)': '#6d28d9',
  'oklch(0.68 0.22 330)':  '#be185d',
  'oklch(0.72 0.2 162)':   '#059669',
  'oklch(0.75 0.18 55)':   '#d97706',
  'oklch(0.65 0.22 25)':   '#ef4444',
  'oklch(0.62 0.18 230)':  '#0891b2',
};
function hex(oklch: string) { return accentMap[oklch] ?? '#6d28d9'; }

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const primaryHex = hex(project.color.primary);
  const secondaryHex = hex(project.color.secondary);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Refs for animation
  const heroTextRef    = useRef<HTMLDivElement>(null);
  const metricsRef     = useRef<HTMLDivElement>(null);
  const challengeRef   = useRef<HTMLDivElement>(null);
  const solutionRef    = useRef<HTMLDivElement>(null);
  const outcomeRef     = useRef<HTMLDivElement>(null);
  const techRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);

    (async () => {
      const { animate, stagger } = await import('animejs');

      // Hero text entrance
      if (heroTextRef.current) {
        animate(
          Array.from(heroTextRef.current.querySelectorAll('.hero-anim')) as HTMLElement[],
          { translateY: [32, 0], opacity: [0, 1], delay: stagger(100, { start: 200 }), ease: 'outExpo', duration: 900 }
        );
      }

      // Metrics numbers appearance
      if (metricsRef.current) {
        animate(
          Array.from(metricsRef.current.querySelectorAll('.metric-card')) as HTMLElement[],
          { scale: [0.88, 1], opacity: [0, 1], delay: stagger(80, { start: 600 }), ease: 'outBack(1.5)', duration: 700 }
        );
      }

      // Scroll reveals for sections
      const sections = [challengeRef, solutionRef, outcomeRef, techRef];
      sections.forEach((ref) => {
        if (!ref.current) return;
        const el = ref.current;
        const obs = new IntersectionObserver(
          async (entries) => {
            if (entries[0].isIntersecting) {
              obs.disconnect();
              const { animate: a, stagger: s } = await import('animejs');
              a(
                Array.from(el.querySelectorAll('.section-anim')) as HTMLElement[],
                { translateY: [32, 0], opacity: [0, 1], delay: s(70), ease: 'outExpo', duration: 800 }
              );
            }
          },
          { threshold: 0.1 }
        );
        obs.observe(el);
      });
    })();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentIdx = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[currentIdx - 1];
  const next = PROJECTS[currentIdx + 1];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white/10 selection:text-white">

      {/* ─── Scroll Progress Bar ─── */}
      <div
        className="fixed top-0 left-0 h-1 z-[100] transition-all origin-left"
        style={{ width: `${scrollProgress}%`, background: primaryHex, boxShadow: `0 0 10px ${primaryHex}` }}
      />

      {/* ─── Fixed nav ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-14 h-18 py-4">
        <div className="absolute inset-0 glass border-b border-white/6 backdrop-blur-xl" />
        <Link href="/" className="relative z-10 font-display font-bold text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <div className="relative z-10 font-display font-bold text-lg hidden sm:block">
           <span className="gradient-text">{project.title.split(' ')[0]}</span>
           <span className="text-white/30 font-medium ml-1.5">— Vision</span>
        </div>
        <Link
          href="/#contact"
          className="relative z-10 text-sm font-semibold px-6 py-2 rounded-full text-white transition-all duration-300 transform active:scale-95"
          style={{ background: primaryHex, boxShadow: `0 0 25px ${primaryHex}40` }}
        >
          Hire me
        </Link>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <ProjectScene scene={project.scene} primaryColor={primaryHex} secondaryColor={secondaryHex} interactive />
        </div>

        <div className={`absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10`} />
        <div className={`absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-10`} />

        <div ref={heroTextRef} className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-14 flex flex-col gap-8">
          <div className="hero-anim opacity-0 flex flex-wrap items-center gap-3">
             <span className="pill text-xs uppercase font-bold tracking-widest"
              style={{ background: `${primaryHex}20`, borderColor: `${primaryHex}40`, color: primaryHex }}
            >
              {project.category}
            </span>
            <span className="text-white/30 text-sm font-semibold">{project.year} · {project.duration}</span>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
               <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{project.status}</span>
            </div>
          </div>

          <div className="hero-anim opacity-0 max-w-4xl">
            <h1 className="font-display font-bold text-[clamp(2.5rem,7vw,6rem)] text-white leading-[0.95] tracking-tight">
              {project.title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'gradient-text' : ''}>{word}{' '}</span>
              ))}
            </h1>
            <p className="mt-6 text-xl lg:text-2xl text-white/60 font-medium leading-normal max-w-2xl">{project.tagline}</p>
          </div>

          <p className="hero-anim opacity-0 text-white/50 text-lg leading-relaxed max-w-[55ch]">
            {project.description}
          </p>

          <div className="hero-anim opacity-0 flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-white/30 uppercase pt-2">
             <span>Lead Developer</span>
             <div className="w-10 h-px bg-white/10" />
             <span className="text-white/60">{project.role}</span>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-white/20 text-xs tracking-[0.3em] uppercase group">
           <div className="w-px h-16 bg-white/10 relative overflow-hidden">
               <div className="absolute inset-0 bg-white/40 -translate-y-full animate-[scroll-cue_2s_ease-in-out_infinite]" />
           </div>
           Scroll to explore
        </div>
      </section>

      {/* ─── Metrics Grid ─── */}
      <section className="relative py-32 px-6 lg:px-14">
        <div
          className="absolute inset-x-0 top-0 h-px bg-white/10 opacity-50"
          style={{ background: `linear-gradient(to right, transparent, ${primaryHex}20, transparent)` }}
        />
        <div ref={metricsRef} className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {project.highlights.map((h, idx) => (
            <div
              key={h.label}
              className="metric-card opacity-0 glass rounded-3xl p-10 flex flex-col gap-4 border border-white/8 text-center relative group"
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `radial-gradient(circle at 50% 0%, ${primaryHex}15, transparent 100%)` }}
              />
              <div
                className="relative font-display font-black text-[clamp(2rem,4vw,3.5rem)] leading-none tracking-tighter"
                style={{ color: primaryHex }}
              >
                {h.value}
              </div>
              <div className="relative text-white/30 text-xs font-black uppercase tracking-[0.25em]">{h.label}</div>
              <div className="absolute top-4 right-6 text-white/5 opacity-50 font-display font-black text-4xl select-none">
                 0{idx+1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Case Study Sections ─── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 pb-40 flex flex-col gap-40">

        {/* Challenge */}
        <div ref={challengeRef} className="grid lg:grid-cols-[1fr.8fr_1.4fr] gap-12 items-start relative">
          <div className="section-anim opacity-0 flex flex-col gap-6">
            <div className="pill w-fit" style={{ background: `${primaryHex}15`, borderColor: `${primaryHex}30`, color: primaryHex }}>
              01 — Challenge
            </div>
            <h2 className="font-display font-bold text-[clamp(2rem,3.5vw,3rem)] text-white leading-[1.1] tracking-tight">
              The problem scope<br />and mission objectives
            </h2>
            <Floating3DObject type="cube" color={primaryHex} size={0.8} />
          </div>
          <div className="section-anim opacity-0 bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:bg-white/10 transition-colors" />
            <p className="text-white/50 text-xl leading-relaxed italic relative z-10">
              "{project.challenge}"
            </p>
          </div>
        </div>

        {/* Immersive 3D Bridge */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/8 h-[450px] group">
          <ProjectScene scene={project.scene} primaryColor={primaryHex} secondaryColor={secondaryHex} interactive />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90 pointer-events-none" />
          <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-all duration-1000" />

          {/* HUD Elements */}
          <div className="absolute top-8 left-8 flex flex-col gap-1 pointer-events-none">
             <div className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Render Engine</div>
             <div className="text-xs font-bold text-white/50">THREE.JS v0.160.0</div>
          </div>
          <div className="absolute bottom-8 right-8 text-right pointer-events-none">
              <div className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mb-2">Interactivity</div>
              <div className="glass px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold text-white/60">
                 ACTIVE STREAM · DRAG TO EXPLORE
              </div>
          </div>
        </div>

        {/* Technical Solution */}
        <div ref={solutionRef} className="grid lg:grid-cols-[1.4fr_1fr] gap-20 items-center">
          <div className="section-anim opacity-0 order-2 lg:order-1">
             <div className="flex flex-col gap-8">
               <div className="flex flex-col gap-4">
                 <div className="pill w-fit" style={{ background: `${primaryHex}15`, borderColor: `${primaryHex}30`, color: primaryHex }}>
                    02 — Architecture
                 </div>
                 <h2 className="font-display font-bold text-[clamp(2rem,3.5vw,3rem)] text-white tracking-tight">
                    Engineering the solution
                 </h2>
               </div>
               <div className="space-y-6 text-white/50 text-lg leading-relaxed">
                  <p>{project.solution}</p>
               </div>
             </div>
          </div>
          <div className="section-anim opacity-0 order-1 lg:order-2 flex justify-center lg:justify-end">
             <div className="relative">
                <div className="absolute -inset-10 bg-white/5 blur-[80px] rounded-full animate-pulse" />
                <Floating3DObject type="torus" color={secondaryHex} size={1.2} />
             </div>
          </div>
        </div>

        {/* Outcome View */}
        <div ref={outcomeRef} className="flex flex-col gap-20">
           <div className="section-anim opacity-0 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
              <div className="pill" style={{ background: `${primaryHex}15`, borderColor: `${primaryHex}30`, color: primaryHex }}>
                  03 — Evaluation
              </div>
              <h2 className="font-display font-bold text-[clamp(2rem,3.5vw,3.5rem)] text-white tracking-tight">
                 Final Outcome &amp; Impact
              </h2>
           </div>

           <div className="section-anim opacity-0 grid lg:grid-cols-2 gap-10">
               <div className="glass rounded-[2rem] p-12 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: primaryHex }} />
                  <div className="font-display font-bold text-2xl text-white mb-6">Key Results</div>
                  <p className="text-white/50 text-lg leading-relaxed">{project.outcome}</p>
               </div>
               <div className="flex flex-col gap-6">
                <Floating3DObject type="pyramid" color={primaryHex} size={0.9} />
                 <div className="glass rounded-[2rem] p-10 border border-white/5">
                   <div className="text-xs font-black tracking-[0.2em] text-white/20 uppercase mb-4">Project Summary</div>
                   <div className="text-white text-lg font-medium leading-snug">
                     Successfully deployed a high-performance system that met all core objectives and exceeded scalability requirements.
                   </div>
                 </div>
               </div>
           </div>
        </div>

        {/* Tools Section */}
        <div ref={techRef} className="pt-20 border-t border-white/5">
          <div className="section-anim opacity-0 grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
             <div>
                <h2 className="font-display font-bold text-3xl text-white mb-4">Tech Infrastructure</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                   The foundation of the project was built using a carefully curated selection of modern technologies.
                </p>
             </div>
             <div className="flex flex-wrap gap-4">
                {project.tech.map((t, i) => (
                <div
                    key={t}
                    className="section-anim opacity-0 group glass border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
                    style={{ transitionDelay: `${i * 40}ms` }}
                >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: primaryHex }} />
                    <span className="text-white/70 font-display font-semibold group-hover:text-white transition-colors">{t}</span>
                </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ─── Navigation Foot ─── */}
      <section className="bg-white/[0.01] border-y border-white/5 py-32 px-6 lg:px-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{ background: `radial-gradient(circle at 50% 50%, ${primaryHex}10, transparent 70%)` }} />

        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-8 relative z-10">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group glass border border-white/8 rounded-[2.5rem] p-12 flex flex-col gap-6 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-center gap-3 text-white/30 text-[10px] font-black tracking-[0.4em] uppercase">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Project
              </div>
              <div className="flex flex-col gap-2">
                 <div className="font-display font-black text-4xl text-white group-hover:gradient-text transition-all duration-300">
                    {prev.title}
                 </div>
                 <div className="text-white/40 text-base font-medium">{prev.tagline}</div>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group glass border border-white/8 rounded-[2.5rem] p-12 flex flex-col gap-6 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 text-right w-full"
            >
              <div className="flex items-center gap-3 text-white/30 text-[10px] font-black tracking-[0.4em] uppercase justify-end">
                Next Project
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                 <div className="font-display font-black text-4xl text-white group-hover:gradient-text transition-all duration-300">
                    {next.title}
                 </div>
                 <div className="text-white/40 text-base font-medium">{next.tagline}</div>
              </div>
            </Link>
          ) : <div />}
        </div>

        <div className="max-w-[1400px] mx-auto mt-16 text-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-3 text-xs font-black tracking-[0.3em] uppercase text-white/30 hover:text-white transition-all duration-300 group"
          >
            <span className="w-8 h-px bg-white/20 group-hover:w-12 transition-all" />
            Return to Gallery
            <span className="w-8 h-px bg-white/20 group-hover:w-12 transition-all" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-16 px-6 lg:px-14">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-white/20 text-[10px] font-black tracking-[0.5em] uppercase">
          <div className="font-display font-black text-sm tracking-normal">
            <span className="gradient-text">DEV</span>folio
          </div>
          <p>© 2026 — DIGITAL ARCHIVE</p>
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             SYNCED
          </div>
        </div>
      </footer>
    </div>
  );
}
