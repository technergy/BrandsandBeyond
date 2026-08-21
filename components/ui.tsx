'use client';

import { motion, useScroll, useTransform, useInView, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export function SvgButton({ 
  children, href, onClick, className = '', variant = 'primary', shape = 1,
  colorClass = 'text-brand-magenta group-hover:text-brand-pink',
  outlineColorClass = 'text-white/65 group-hover:text-white',
  outlineHoverTextColor = 'group-hover:text-black'
}: any) {
  const isOutline = variant === 'outline';
  
  let mainPath, lines;
  if (shape === 1) {
    mainPath = "M 8 0 L 100 0 L 100 80 L 92 100 L 0 100 L 0 20 Z";
    lines = (
      <>
        <path d="M 8 0 L 8 20 L 0 20" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
        <path d="M 100 80 L 92 80 L 92 100" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
      </>
    );
  } else if (shape === 2) {
    mainPath = "M 0 0 L 92 0 L 100 20 L 100 100 L 8 100 L 0 80 Z";
    lines = (
      <>
        <path d="M 92 0 L 92 20 L 100 20" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
        <path d="M 0 80 L 8 80 L 8 100" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
      </>
    );
  } else {
    mainPath = "M 15 0 L 85 0 L 100 15 L 100 85 L 85 100 L 15 100 L 0 85 L 0 15 Z"; 
    lines = (
      <>
        <path d="M 15 0 L 15 15 L 0 15" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
        <path d="M 85 0 L 85 15 L 100 15" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
        <path d="M 100 85 L 85 85 L 85 100" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
        <path d="M 0 85 L 15 85 L 15 100" fill="transparent" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="opacity-50" />
      </>
    );
  }

  const content = (
    <div className={`relative inline-flex items-center justify-center group cursor-pointer ${className}`}>
      <svg className={`absolute inset-0 w-full h-full transition-colors duration-300 ${isOutline ? outlineColorClass : colorClass}`} preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d={mainPath} fill={isOutline ? 'transparent' : 'currentColor'} stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {lines}
      </svg>
      <span className={`relative z-10 font-cond font-bold text-[11px] tracking-widest uppercase px-[22px] py-[12px] whitespace-nowrap transition-colors duration-300 ${isOutline ? `text-current ${outlineHoverTextColor}` : 'text-white'}`}>
        {children}
      </span>
      {isOutline && (
        <svg className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d={mainPath} fill="currentColor" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  );

  if (href) {
    return <a href={href} onClick={onClick} className="inline-block">{content}</a>;
  }
  return <button onClick={onClick} className="inline-block">{content}</button>;
}

export function Navbar() {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,    [0, 50],
    ['rgba(15,16,38,0.65)', 'rgba(15,16,38,0.95)']
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ['blur(8px)', 'blur(16px)']
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ['1px solid rgba(255,255,255,0.08)', '1px solid rgba(255,255,255,0.15)']
  );

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      style={{ background, backdropFilter, borderBottom }}
      className="fixed z-[100] top-0 left-0 w-full h-[72px] md:h-[84px] flex items-center justify-between px-4 md:px-[4vw] text-white"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Link href="#" className="shrink-0 flex items-center">
        <div className="h-10 md:h-12 flex items-center"><img src="/logo.png" alt="Brands & Beyond" className="h-full w-auto object-contain" /></div>
      </Link>
      <nav className="hidden md:flex gap-[22px] items-center font-cond text-[11px] font-bold uppercase tracking-widest">
        {['story', 'people', 'experience', 'packages'].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => scrollTo(e, id)}
            className="opacity-80 hover:opacity-100 hover:text-brand-yellow transition-all duration-300"
          >
            {id === 'story' ? 'About' : id === 'people' ? 'Speakers' : id === 'experience' ? 'Sessions' : 'Tickets'}
          </a>
        ))}
      </nav>
      <div className="flex gap-[7px] shrink-0">

        <SvgButton href="#packages" onClick={(e: any) => scrollTo(e, 'packages')} variant="primary">
          Register
        </SvgButton>
      </div>
    </motion.header>
  );
}

  export function Ticker() {
  return (
    <div className="h-12 bg-brand-magenta text-white flex items-center overflow-hidden font-cond font-bold text-[12px] tracking-widest uppercase">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="whitespace-nowrap px-8">Ideas today</span>
            <span className="text-brand-yellow font-sans pt-[2px]">{'\u2726'}</span>
            <span className="whitespace-nowrap px-8">Impact tomorrow</span>
            <span className="text-brand-yellow font-sans pt-[2px]">{'\u2726'}</span>
            <span className="whitespace-nowrap px-8">Brands & Beyond</span>
            <span className="text-brand-yellow font-sans pt-[2px]">{'\u2726'}</span>
            <span className="whitespace-nowrap px-8">Kathmandu</span>
            <span className="text-brand-yellow font-sans pt-[2px]">{'\u2726'}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function AnimatedNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => Math.round(current) + suffix);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return <motion.b ref={ref} className="block font-cond font-bold text-[50px] tracking-tight">{display}</motion.b>;
}

export function Footer() {
  return (
    <footer className="bg-[#111226] text-white pt-[70px] px-[7vw] pb-[30px] rounded-none mt-0">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-[50px]">
        <div>
          <Link href="#" className="block mb-4">
            <img src="/logo.png" alt="Brands & Beyond" className="h-10 md:h-12 w-auto" />
          </Link>
          <p className="text-[12px] text-[#9a9ba7] leading-[1.7] max-w-[350px] font-sans">
            A platform for bold ideas, meaningful connections and the people shaping a stronger tomorrow.
          </p>
        </div>
        <div>
          <h4 className="font-cond text-[13px] font-bold uppercase tracking-widest text-brand-yellow mb-4">Explore</h4>
          {['About', 'Speakers', 'Sessions', 'Tickets'].map((item) => (
            <Link key={item} href={`#`} className="block font-sans text-[13px] my-[10px] text-[#d6d6dc] hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <div>
          <h4 className="font-cond text-[13px] font-bold uppercase tracking-widest text-brand-yellow mb-4">Connect</h4>
          {['Instagram', 'LinkedIn', 'Facebook', 'Contact us'].map((item) => (
            <Link key={item} href={`#`} className="block font-sans text-[13px] my-[10px] text-[#d6d6dc] hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-[#292a3c] mt-[50px] pt-[20px] text-[11px] text-[#737481] flex flex-col md:flex-row justify-between gap-4 font-sans">
        <span>&copy; 2026 Brands & Beyond</span>
        <span>4-5 September &mdash; The Plaza, Lalitpur</span>
      </div>
    </footer>
  );






}



