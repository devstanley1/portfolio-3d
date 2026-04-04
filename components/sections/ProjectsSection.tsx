'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { ProjectScene } from '@/components/ui/ProjectScene';

// Approximate oklch → hex for gradient use
const accent: Record<string, string> = {
  'oklch(0.62 0.268 270)': '#6d28d9',
  'oklch(0.68 0.22 330)':  '#be185d',
  'oklch(0.72 0.2 162)':   '#059669',
  'oklch(0.75 0.18 55)':   '#d97706',
  'oklch(0.65 0.22 25)':   '#ef4444',
  'oklch(0.62 0.18 230)':  '#0891b2',
};
function hex(oklch: string) { return accent[oklch] ?? '#6d28d9'; }

export function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const headerDone = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !headerDone.current) {
          headerDone.current = true;
          observer.disconnect();
          const { animate, stagger } = await import('animejs');
          animate(
            Array.from(el.querySelectorAll('.ph-anim')) as HTMLElement[],
            { translateY: [28, 0], opacity: [0, 1], delay: stagger(90), ease: 'outExpo', duration: 800 }
          );
          animate(
            Array.from(el.querySelectorAll('.pc-anim')) as HTMLElement[],
            { translateY: [48, 0], opacity: [0, 1], delay: stagger(80, { start: 200 }), ease: 'outExpo', duration: 900 }
          );
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="relative py-28 px-5 lg:px-14 overflow-hidden" ref={sectionRef}>
      {/* Separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto mb-20">
        <div className="ph-anim pill opacity-0 mb-5 inline-flex">Selected Projects</div>
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          <h2 className="ph-anim font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-white leading-[0.95] tracking-tight opacity-0">
            Work that<br />
            <span className="gradient-text">makes waves</span>
          </h2>
          <p className="ph-anim text-white/40 text-base lg:ml-auto max-w-[42ch] leading-relaxed opacity-0 lg:text-right">
            Six projects spanning data analytics, AI, design systems, e-commerce, games, and fintech.
            Each is a full case study — click to explore.
          </p>
        </div>
      </div>

      {/* Projects grid – 3-column on desktop, each card is tall */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PROJECTS.map((project, idx) => {
          const isHovered = hovered === project.slug;
          const primaryHex = hex(project.color.primary);
          const secondaryHex = hex(project.color.secondary);

          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="pc-anim opacity-0 group relative overflow-hidden rounded-2xl flex flex-col cursor-pointer no-underline"
              style={{ minHeight: 480 }}
              onMouseEnter={() => setHovered(project.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Card background — glass + gradient tint */}
              <div
                className="absolute inset-0 glass border border-white/8 rounded-2xl transition-all duration-500"
                style={{
                  borderColor: isHovered ? `${primaryHex}50` : undefined,
                  boxShadow: isHovered ? `0 0 60px ${primaryHex}25, 0 0 120px ${primaryHex}10` : undefined,
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${project.color.bg} rounded-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />

              {/* 3D scene – upper 55% */}
              <div className="relative z-10 flex-1" style={{ minHeight: 260 }}>
                <ProjectScene
                  scene={project.scene}
                  primaryColor={primaryHex}
                  secondaryColor={secondaryHex}
                  interactive={false}
                />

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
                    style={{
                      background: `${primaryHex}20`,
                      borderColor: `${primaryHex}40`,
                      color: primaryHex,
                    }}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Index number */}
                <div className="absolute top-4 left-4 font-display font-bold text-4xl text-white/5 select-none">
                  {String(idx + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Bottom content */}
              <div className="relative z-10 p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className="text-[10px] font-semibold tracking-widest uppercase mb-1.5 transition-colors duration-300"
                      style={{ color: isHovered ? primaryHex : 'oklch(0.56 0.02 260)' }}
                    >
                      {project.category} · {project.year}
                    </div>
                    <h3 className="font-display font-bold text-xl text-white leading-tight">
                      {project.title}
                    </h3>
                  </div>

                  {/* Arrow icon */}
                  <div
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300"
                    style={{
                      background: isHovered ? `${primaryHex}25` : 'transparent',
                      borderColor: isHovered ? `${primaryHex}60` : 'oklch(1 0 0 / 10%)',
                      transform: isHovered ? 'translate(2px, -2px)' : 'none',
                    }}
                  >
                    <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                </div>

                <p className="text-white/45 text-sm leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-white/60">
                  {project.description}
                </p>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {project.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-white/8 text-white/40 transition-all duration-300 group-hover:border-white/15 group-hover:text-white/60"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/8 text-white/30">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
