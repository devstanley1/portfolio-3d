'use client';

import { useEffect, useRef } from 'react';
import { ContactScene } from '@/components/ui/ContactScene';

const SOCIALS = [
  { label: 'GitHub', href: '#', icon: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )},
  { label: 'LinkedIn', href: '#', icon: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )},
  { label: 'Twitter / X', href: '#', icon: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
];

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          const { animate, stagger } = await import('animejs');
          animate(
            Array.from(el.querySelectorAll('.contact-reveal')) as HTMLElement[],
            {
              translateY: [40, 0],
              opacity: [0, 1],
              delay: stagger(100),
              ease: 'outExpo',
              duration: 1000,
            }
          );
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="relative py-40 px-6 lg:px-16 overflow-hidden" ref={sectionRef}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-900/10 blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* LEFT — 3D Scene */}
        <div className="contact-reveal opacity-0 relative h-[500px] flex items-center justify-center">
            {/* Background glow for 3D */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[300px] h-[300px] rounded-full bg-violet-600/20 blur-[100px] animate-[spotlight-pulse_4s_ease-in-out_infinite]" />
            </div>
            <ContactScene />
        </div>

        {/* RIGHT — Contact Content */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="contact-reveal pill opacity-0 w-fit">Get in touch</div>
            <h2 className="contact-reveal font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-tight text-white opacity-0">
              Ready to start your<br />
              <span className="gradient-text text-violet-400">next project?</span>
            </h2>
            <p className="contact-reveal text-white/40 text-lg leading-relaxed max-w-[45ch] opacity-0">
              Whether you have a specific project in mind or just want to say hi,
              my inbox is always open. Let&apos;s create something remarkable together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Email CTA */}
            <div className="contact-reveal opacity-0 flex flex-col gap-4">
               <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Email me</span>
               <a
                href="mailto:hello@stanley.dev"
                className="group flex flex-col gap-1 w-fit"
              >
                <span className="text-2xl font-display font-bold text-white group-hover:text-violet-400 transition-colors">
                  hello@stanley.dev
                </span>
                <div className="h-px w-full bg-white/10 group-hover:bg-violet-400 transition-all duration-500 scale-x-100 origin-left" />
              </a>
            </div>

            {/* Socials */}
            <div className="contact-reveal opacity-0 flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Socials</span>
              <div className="flex items-center gap-3">
                {SOCIALS.map((s) => (
                    <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 hover:-translate-y-1"
                    >
                    {s.icon}
                    </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats/Facts in Contact */}
          <div className="contact-reveal opacity-0 border-t border-white/10 pt-10 mt-4">
             <div className="grid grid-cols-2 gap-10">
                <div>
                   <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Location</div>
                   <div className="text-white font-medium">Remote · Worldwide</div>
                </div>
                <div>
                   <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Availability</div>
                   <div className="text-white font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Open for new projects
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Decorative large text behind */}
      <div className="absolute -bottom-20 -right-20 font-display font-black text-[20vw] leading-none text-white/[0.02] select-none pointer-events-none uppercase">
          Contact
      </div>
    </section>
  );
}
