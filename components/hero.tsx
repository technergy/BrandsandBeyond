'use client';

import { motion, useScroll, useTransform, useMotionValue } from 'motion/react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import l1 from '@/public/imgs/brands2024/1.jpg';
import l2 from '@/public/imgs/brands2024/2.jpg';
import l3 from '@/public/imgs/brands2024/3.jpg';
import l4 from '@/public/imgs/brands2024/4.jpg';
import l5 from '@/public/imgs/brands2024/5.jpg';
import l6 from '@/public/imgs/brands2024/6.jpg';

import r1 from '@/public/imgs/brands2025/1.jpg';
import r2 from '@/public/imgs/brands2025/2.jpg';
import r3 from '@/public/imgs/brands2025/3.jpg';
import r4 from '@/public/imgs/brands2025/4.jpg';
import r5 from '@/public/imgs/brands2025/5.jpg';
import r6 from '@/public/imgs/brands2025/6.jpg';

const leftCards = [
  { img: l1, tag: "The conversations" },
  { img: l2, tag: "The stage" },
  { img: l3, tag: "The audience" },
  { img: l4, tag: "The moment" },
  { img: l5, tag: "Together" },
  { img: l6, tag: "Ideas" },
];

const rightCards = [
  { img: r1, tag: "The people" },
  { img: r2, tag: "The room" },
  { img: r3, tag: "The energy" },
  { img: r4, tag: "The stage" },
  { img: r5, tag: "The future" },
  { img: r6, tag: "The ideas" },
];

function HeroColumn({ items, direction = "up", speed = 34, className = "", onHoverItem, year }: any) {
  const isUp = direction === "up";
  
  const variations = [
    "rotate-[-2deg] w-[84%]",
    "rotate-[1.5deg] w-[91%]",
    "rotate-[-1deg] w-[87%]",
    "rotate-[2.5deg] w-[94%]",
  ];

  return (
    <div className={`absolute top-0 w-[94%] md:w-[80%] flex flex-col will-change-transform pt-[90px] ${className}`}>
      <motion.div
        className="flex flex-col w-full"
        animate={{ y: isUp ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <motion.article
            key={i}
            onMouseEnter={() => onHoverItem(item.tag, year)}
            className={`
              relative flex-none
              h-[165px] md:h-[235px]
              p-[6px]
              shadow-[0_25px_60px_rgba(0,0,0,.45)]
              transition-all duration-500
              ${variations[i % variations.length]}
              ${i % 2 === 0 ? 'self-start' : 'self-end'}
              ${i > 0 ? '-mt-[10%]' : ''}
              ${i % 4 === 0 ? 'bg-brand-magenta' : 'bg-white'}
              hover:!z-50 z-10 group cursor-pointer
            `}
            whileHover={{ scale: 1.07, rotate: 0 }}
          >
            <div className="relative w-full h-full overflow-hidden bg-[#111]">
              <Image 
                src={item.img} 
                alt={item.tag} 
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="
                  object-cover
                  grayscale-[15%]
                  contrast-[1.08]
                  transition-transform
                  duration-[1200ms]
                  group-hover:scale-110
                  group-hover:grayscale-0
                " 
              />
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.08 }}
              />
            </div>
            
            {/* Metadata Label */}
              <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {year} / {String((i % items.length) + 1).padStart(2, '0')} {'\u2192'} {item.tag}
              </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [activeTag, setActiveTag] = useState("The future");
  const [activeYear, setActiveYear] = useState("2026");

  // Parallax
  const leftY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);

  // Mouse distortion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-500, 500], [4, -4]);
  const rotateY = useTransform(mouseX, [-500, 500], [-4, 4]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="h-[100svh] min-h-[700px] md:min-h-[720px] relative overflow-hidden text-white bg-[#0b0b16]"
      style={{ perspective: "1200px" }}
    >
      {/* LAYER 1: Background & Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none z-[0]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-brand-magenta/10 blur-[160px]" />
      </div>
      
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none z-[50] opacity-[0.055] mix-blend-screen">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"></rect>
        </svg>
      </div>

      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="absolute inset-0 w-full h-full">
        
        {/* LAYER 2: Giant Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[2]" style={{ transform: "translateZ(-50px)" }}>
          <span className="text-[18vw] font-black uppercase tracking-[-0.08em] text-white/[0.025] whitespace-nowrap">
            BEYOND
          </span>
        </div>

        {/* LAYER 3: Photographic Walls */}
        <motion.div 
          className="absolute inset-0 block md:grid md:grid-cols-[25%_50%_25%] gap-0 z-[5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.div style={{ y: leftY }} className="absolute md:relative w-[30%] md:w-full h-[75%] md:h-full top-[15%] md:top-0 left-[-5%] md:left-0 opacity-60 md:opacity-100 overflow-visible">
            <HeroColumn items={leftCards} direction="down" speed={45} className="md:items-end left-[3%] md:left-[10%] top-0 md:top-[-40%]" onHoverItem={(tag: string, year: string) => { setActiveTag(tag); setActiveYear(year); }} year="2024" />
          </motion.div>

          <div className="hidden md:block pointer-events-none" />

          <motion.div style={{ y: rightY }} className="absolute md:relative w-[30%] md:w-full h-[75%] md:h-full top-[15%] md:top-0 right-[-5%] md:right-0 opacity-60 md:opacity-100 overflow-visible">
            <HeroColumn items={rightCards} direction="up" speed={50} className="md:items-start right-[3%] md:left-[10%] top-0 md:top-[-10%]" onHoverItem={(tag: string, year: string) => { setActiveTag(tag); setActiveYear(year); }} year="2025" />
          </motion.div>
        </motion.div>

        {/* LAYER 4: Interactive Center Event Identity */}
        <div className="absolute inset-0 z-[15] pointer-events-none flex items-center justify-center text-center" style={{ transform: "translateZ(30px)" }}>
          <div className="relative pointer-events-auto">
            {/* Giant Translucent & */}
            <motion.div 
              className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-[32vw] md:text-[22vw] font-black leading-none text-brand-magenta/[0.06] pointer-events-none -z-10 select-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.0, ease: "easeOut" }}
            >
              &
            </motion.div>

            <h1 className="relative z-10 font-black uppercase tracking-[-0.07em] leading-[0.82]">
              <motion.span 
                className="block text-[clamp(52px,8vw,110px)] origin-bottom"
                initial={{ opacity: 0, y: 50, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Brands
              </motion.span>
              <motion.span 
                className="block text-[clamp(52px,8vw,110px)] text-transparent origin-bottom" 
                style={{ WebkitTextStroke: "1px rgba(255,255,255,.8)" }}
                initial={{ opacity: 0, y: 50, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                & Beyond
              </motion.span>
              <motion.span 
                className="block text-brand-magenta text-[clamp(70px,10vw,130px)] mt-2 origin-bottom"
                initial={{ opacity: 0, y: 50, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                2026
              </motion.span>
            </h1>

            

            
          </div>
        </div>

        {/* Vertical Labels */}
        <div 
          className="absolute left-4 top-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 z-[20] hidden md:block select-none pointer-events-none" 
          style={{ transform: "translate3d(0, -50%, 10px) rotate(180deg)", writingMode: "vertical-rl" }}
        >
          2024 - ARCHIVE
        </div>
        <div 
          className="absolute right-4 top-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 z-[20] hidden md:block select-none pointer-events-none" 
          style={{ transform: "translate3d(0, -50%, 10px)", writingMode: "vertical-rl" }}
        >
          2025 - EDITION
        </div>

        

      </motion.div>
    </section>
  );
}








