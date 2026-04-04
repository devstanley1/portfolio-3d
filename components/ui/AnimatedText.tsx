'use client';

import { useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    (async () => {
      const { animate, stagger } = await import('animejs');
      const elements = Array.from(container.querySelectorAll('.letter')) as HTMLElement[];
      if (!elements.length) return;

      animate(elements, {
        translateY: [60, 0],
        opacity: [0, 1],
        delay: stagger(30, { start: delay }),
        ease: 'outExpo',
        duration: 1100,
      });
    })();
  }, [text, delay]);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`${className} flex flex-wrap`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden pb-[0.1em]">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className="letter inline-block opacity-0 origin-bottom"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
