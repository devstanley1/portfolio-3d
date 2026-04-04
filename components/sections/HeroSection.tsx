'use client';

import { ThreeScene } from '@/components/ui/ThreeIcon';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useEffect, useRef } from 'react';

const SKILLS = ['Next.js', 'Three.js', 'TypeScript', 'React', 'Node.js', 'Figma'];

export function HeroSection() {
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { animate, stagger } = await import('animejs');
      const targets = [badgeRef.current, subtitleRef.current, ctaRef.current, statsRef.current].filter(Boolean);

      animate(targets, {
        translateY: [20, 0],
        opacity: [0, 1],
        delay: stagger(120, { start: 700 }),
        ease: 'outExpo',
        duration: 900,
      });
    })();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient spots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-900/10 blur-[180px]" />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-16 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-8">
          {/* Availability badge */}
          <div ref={badgeRef} className="opacity-0 flex items-center gap-3">
            <div className="pill">
              <span className="dot-live" />
              Available for work
            </div>
            <div className="pill bg-transparent border-white/10 text-white/40">
              2026
            </div>
          </div>

          {/* Main headline */}
          <div>
            <AnimatedText
              text="Creative"
              className="font-display text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight text-white"
              delay={0}
            />
            <div className="overflow-hidden">
              <div className="gradient-text font-display text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight">
                Developer.
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="opacity-0 text-[oklch(0.56_0.02_260)] text-lg lg:text-xl leading-relaxed max-w-[50ch]"
          >
            I craft high-performance, visually stunning digital experiences — from sleek interfaces to
            interactive 3D worlds. Let&apos;s build something that stands out.
          </p>

          {/* CTA Row */}
          <div ref={ctaRef} className="opacity-0 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[oklch(0.62_0.268_270)] text-white font-semibold text-sm hover:bg-[oklch(0.68_0.268_270)] transition-all duration-300 shadow-[0_0_30px_oklch(0.62_0.268_270/40%)] hover:shadow-[0_0_50px_oklch(0.62_0.268_270/60%)] hover:-translate-y-0.5"
            >
              View Projects
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-white/80 font-semibold text-sm hover:text-white hover:bg-white/8 transition-all duration-300 border border-white/10"
            >
              Get in touch
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="opacity-0 grid grid-cols-3 gap-4 pt-4 border-t border-white/8">
            {[
              { value: '5+', label: 'Years exp.' },
              { value: '40+', label: 'Projects' },
              { value: '12+', label: 'Happy clients' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display font-bold text-3xl text-white">{stat.value}</span>
                <span className="text-sm text-white/40">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — 3D Canvas */}
        <div className="relative h-[420px] lg:h-[580px] flex items-center justify-center">
          {/* Soft glow behind the 3D */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[340px] h-[340px] rounded-full bg-violet-600/20 blur-[100px] animate-[spotlight-pulse_4s_ease-in-out_infinite]" />
          </div>

          <div className="relative w-full h-full">
            <ThreeScene />
          </div>

          {/* Floating skill pills */}
          <div className="absolute inset-0 pointer-events-none">
            {SKILLS.map((skill, i) => {
              const positions = [
                { top: '8%', right: '2%' },
                { top: '22%', left: '0%' },
                { bottom: '30%', right: '0%' },
                { bottom: '15%', left: '5%' },
                { top: '55%', right: '5%' },
                { top: '70%', left: '10%' },
              ];
              const pos = positions[i] || {};
              return (
                <div
                  key={skill}
                  className="absolute glass text-white/70 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10"
                  style={{
                    ...pos,
                    animation: `float ${5 + i * 0.7}s ease-in-out ${i * 0.4}s infinite`,
                  }}
                >
                  {skill}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
        Scroll
      </div>
    </section>
  );
}
