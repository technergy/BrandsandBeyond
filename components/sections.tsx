'use client';

import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import Image from 'next/image';
import { AnimatedNumber, SvgButton } from './ui';
import React, { useRef } from 'react';

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 45, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.75, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const RevealHeading = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ y: 65, opacity: 0, clipPath: "inset(18% 0 0 0)" }}
    whileInView={{ y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)" }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);



// 3D Card effect component
function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useMotionTemplate`${mouseY}deg`;
  const rotateY = useMotionTemplate`${mouseX}deg`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 25;
    const y = -(clientY - top - height / 2) / 25;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative hover:shadow-[0_24px_55px_rgba(24,20,50,0.18)] transition-shadow duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Wrapper for all sections to slide up
const MotionSection = ({ children, id = "", className = "" }: { children: React.ReactNode, id?: string, className?: string }) => (
  <motion.section
    id={id}
    className={className}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-5%" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.section>
);

export function Story() {
  return (
    <MotionSection id="story" className="py-[75px] md:py-[110px] px-[6vw] md:px-[7vw] bg-brand-cream relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[8vw] items-center">
        <FadeUp>
          
          <RevealHeading>
            <h2 className="font-bold text-[clamp(42px,6vw,80px)] leading-[1.05] tracking-tight uppercase my-[18px]">
              Empowering<br/><span className="text-brand-magenta">brands</span><br/>for what&apos;s <span className="text-[#2935a8]">next.</span>
            </h2>
          </RevealHeading>
          <p className="font-sans text-[14px] md:text-[15px] leading-[1.8] max-w-[480px] text-[#555663]">
            A platform for bold ideas, meaningful conversations and the people shaping a more innovative, inclusive and impactful tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-[12px] mt-[35px] max-w-[400px]">
            <a href="#people" className="font-sans text-[11px] md:text-[13px] font-bold uppercase tracking-widest py-[14px] px-[24px] rounded-none border border-brand-magenta bg-brand-magenta text-white hover:bg-brand-pink hover:border-brand-pink transition-colors text-center">
              Explore speakers
            </a>
            <a href="#experience" className="font-sans text-[11px] md:text-[13px] font-bold uppercase tracking-widest py-[14px] px-[24px] rounded-none border border-[#222] hover:bg-[#222] hover:text-white transition-colors text-center">
              Explore sessions
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <TiltCard className="h-[320px] bg-[#11152d] rounded-none overflow-hidden group cursor-pointer shadow-lg border border-white/10">
            <Image unoptimized src="https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" alt="Event video" fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0b1b]/65 via-transparent" />
            <motion.div 
              className="absolute left-[20px] bottom-[18px] w-[50px] h-[50px] rounded-none bg-brand-magenta flex items-center justify-center text-[15px] text-white z-10 border border-brand-pink"
              whileHover={{ scale: 1.1, backgroundColor: "var(--color-brand-pink)" }}
            >
              {'\u25B6'}
            </motion.div>
          </TiltCard>
        </FadeUp>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[#d4d1cb] mt-[50px] md:mt-[85px] pt-[24px] gap-[20px]">
        <FadeUp delay={0.1} className="flex flex-col"><AnimatedNumber value={10} suffix="+" /><span className="font-sans font-bold text-[11px] tracking-widest uppercase text-[#777]">Speakers</span></FadeUp>
        <FadeUp delay={0.2} className="flex flex-col"><AnimatedNumber value={10} suffix="+" /><span className="font-sans font-bold text-[11px] tracking-widest uppercase text-[#777]">Sessions</span></FadeUp>
        <FadeUp delay={0.3} className="flex flex-col"><AnimatedNumber value={20} suffix="+" /><span className="font-sans font-bold text-[11px] tracking-widest uppercase text-[#777]">Sponsors</span></FadeUp>
        <FadeUp delay={0.4} className="flex flex-col"><AnimatedNumber value={500} suffix="+" /><span className="font-sans font-bold text-[11px] tracking-widest uppercase text-[#777]">Delegates</span></FadeUp>
      </div>
    </MotionSection>
  );
}

const speakers = [
  { img: "https://images.pexels.com/photos/30133734/pexels-photo-30133734.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Keynote Voice", role: "Brand Leader" },
  { img: "https://images.pexels.com/photos/37409445/pexels-photo-37409445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Creative Voice", role: "Creative Director" },
  { img: "https://images.pexels.com/photos/4872060/pexels-photo-4872060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Growth Voice", role: "Business Leader" },
  { img: "https://images.pexels.com/photos/26820703/pexels-photo-26820703.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Future Voice", role: "Strategist" },
  { img: "https://images.pexels.com/photos/29995605/pexels-photo-29995605.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Culture Voice", role: "Founder" },
  { img: "https://images.pexels.com/photos/9623645/pexels-photo-9623645.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Impact Voice", role: "Entrepreneur" },
];

const advisors = [
  { img: "https://images.pexels.com/photos/28943400/pexels-photo-28943400.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Advisor One", role: "Industry" },
  { img: "https://images.pexels.com/photos/27086761/pexels-photo-27086761.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Advisor Two", role: "Brand" },
  { img: "https://images.pexels.com/photos/7580763/pexels-photo-7580763.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Panel One", role: "Leadership" },
  { img: "https://images.pexels.com/photos/27086922/pexels-photo-27086922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Panel Two", role: "Innovation" },
  { img: "https://images.pexels.com/photos/29086752/pexels-photo-29086752.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Panel Three", role: "Culture" },
  { img: "https://images.pexels.com/photos/6326324/pexels-photo-6326324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", name: "Panel Four", role: "Growth" },
];

export function People() {
  return (
    <MotionSection id="people" className="py-[75px] md:py-[110px] px-[6vw] md:px-[7vw] bg-[linear-gradient(145deg,#15164a,#252071_60%,#411c5d)] text-white relative overflow-hidden">
      <div className="absolute w-[70vw] h-[70vw] border border-brand-cyan/15 rounded-none -left-[25vw] -top-[10vw] rotate-45" />
      
      <div className="relative text-center mb-[65px]">
        
        <RevealHeading>
          <h2 className="font-bold text-[clamp(46px,7vw,85px)] leading-[1] tracking-tight uppercase m-0">
            People<br/>who move.
          </h2>
        </RevealHeading>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[60px] max-w-[1050px] mx-auto">
        <div>
          <h3 className="font-sans text-[15px] md:text-[17px] font-bold tracking-widest uppercase border-b border-white/18 pb-[10px] m-0 mb-[22px]">
            Speakers <span className="text-brand-pink">2026</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px]">
            {speakers.map((person, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <motion.div 
                  className="bg-[#f7f5ef] rounded-none text-[#141525] p-[10px_10px_18px] text-center cursor-pointer shadow-none hover:shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                  whileHover={{ y: -8, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-full aspect-square relative overflow-hidden mb-3 rounded-none">
                    <Image unoptimized src={person.img} alt={person.name} fill className="object-cover grayscale-[0.8]" referrerPolicy="no-referrer" />
                  </div>
                  <b className="block font-bold text-[12px] md:text-[13px] uppercase tracking-tight leading-tight">{person.name}</b>
                  <small className="text-[10px] text-[#7a7b84] font-sans block mt-1 leading-tight">{person.role}</small>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-sans text-[15px] md:text-[17px] font-bold tracking-widest uppercase border-b border-white/18 pb-[10px] m-0 mb-[22px]">
            Advisors <span className="text-brand-pink">+ Panels</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px]">
            {advisors.map((person, i) => (
              <FadeUp key={i} delay={0.2 + (i * 0.05)}>
                <motion.div 
                  className="bg-[#f7f5ef] rounded-none text-[#141525] p-[10px_10px_18px] text-center cursor-pointer shadow-none hover:shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                  whileHover={{ y: -8, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-full aspect-square relative overflow-hidden mb-3 rounded-none">
                    <Image unoptimized src={person.img} alt={person.name} fill className="object-cover grayscale-[0.8]" referrerPolicy="no-referrer" />
                  </div>
                  <b className="block font-bold text-[12px] md:text-[13px] uppercase tracking-tight leading-tight">{person.name}</b>
                  <small className="text-[10px] text-[#7a7b84] font-sans block mt-1 leading-tight">{person.role}</small>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

export function Experience() {
  return (
    <MotionSection id="experience" className="bg-white text-brand-ink px-[6vw] md:px-[7vw]">
      {/* Feature 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[8vw] items-center py-[80px] border-b border-[#ddd]">
        <FadeUp>
          
          <RevealHeading><h3 className="font-bold text-[clamp(36px,5vw,52px)] leading-[1.1] uppercase tracking-tight my-[12px]">Ideas that<br/>leave a mark.</h3></RevealHeading>
          <p className="font-sans text-[14px] md:text-[15px] leading-[1.8] text-[#666] max-w-[470px]">
            Move beyond passive listening. Meet the people behind the ideas, challenge assumptions and build conversations that continue after the event.
          </p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <TiltCard className="h-[330px] rounded-none overflow-hidden relative group">
            <div className="absolute inset-[16px] border border-white/55 rounded-none z-[2] pointer-events-none" />
            <Image unoptimized src="https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" alt="Stage" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
            <motion.div 
              className="absolute z-[3] right-[18px] bottom-[18px] w-[100px] h-[100px] rounded-none bg-brand-yellow text-[#111] font-sans font-bold text-[13px] text-center flex flex-col justify-center leading-tight shadow-lg"
              animate={{ y: [-8, 8], rotate: [-12, -4] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", repeatType: "reverse" }}
            >
              CONNECT<br/>CREATE<br/>MOVE
            </motion.div>
          </TiltCard>
        </FadeUp>
      </div>

      {/* Feature 2 (Reversed on md) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[8vw] items-center py-[80px] border-b border-[#ddd]">
        <FadeUp delay={0.2} className="order-2 md:order-1">
          <TiltCard className="h-[330px] rounded-none overflow-hidden relative group">
            <div className="absolute inset-[16px] border border-white/55 rounded-none z-[2] pointer-events-none" />
            <Image unoptimized src="https://images.pexels.com/photos/9850083/pexels-photo-9850083.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" alt="Masterclass" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
            <motion.div 
              className="absolute z-[3] right-[18px] bottom-[18px] w-[100px] h-[100px] rounded-none bg-brand-cyan text-[#111] font-sans font-bold text-[13px] text-center flex flex-col justify-center leading-tight shadow-lg"
              animate={{ y: [-8, 8], rotate: [-12, -4] }}
              transition={{ repeat: Infinity, duration: 3.15, ease: "easeInOut", repeatType: "reverse", delay: 0.5 }}
            >
              LEARN<br/>BUILD<br/>APPLY
            </motion.div>
          </TiltCard>
        </FadeUp>
        <FadeUp className="order-1 md:order-2">
          
          <RevealHeading><h3 className="font-bold text-[clamp(36px,5vw,52px)] leading-[1.1] uppercase tracking-tight my-[12px]">Go deeper.<br/>Make it real.</h3></RevealHeading>
          <p className="font-sans text-[14px] md:text-[15px] leading-[1.8] text-[#666] max-w-[470px]">
            Focused sessions designed around practical knowledge, sharp perspectives and useful takeaways for the people building brands.
          </p>
        </FadeUp>
      </div>

      {/* Feature 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[8vw] items-center py-[80px]">
        <FadeUp>
          
          <RevealHeading><h3 className="font-bold text-[clamp(36px,5vw,52px)] leading-[1.1] uppercase tracking-tight my-[12px]">Ideas have<br/>a rhythm.</h3></RevealHeading>
          <p className="font-sans text-[14px] md:text-[15px] leading-[1.8] text-[#666] max-w-[470px]">
            A more human event experience: music, culture and unexpected moments woven between conversations.
          </p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <TiltCard className="h-[330px] rounded-none overflow-hidden relative group">
            <div className="absolute inset-[16px] border border-white/55 rounded-none z-[2] pointer-events-none" />
            <Image unoptimized src="https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" alt="Music" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
            <motion.div 
              className="absolute z-[3] right-[18px] bottom-[18px] w-[100px] h-[100px] rounded-none bg-brand-magenta text-white font-sans font-bold text-[13px] text-center flex flex-col justify-center leading-tight shadow-lg"
              animate={{ y: [-8, 8], rotate: [-12, -4] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", repeatType: "reverse", delay: 1 }}
            >
              FEEL<br/>THE<br/>MOMENT
            </motion.div>
          </TiltCard>
        </FadeUp>
      </div>
    </MotionSection>
  );
}

export function Audience() {
  const chips = ["Brand Leaders", "Marketing Teams", "Creative Directors", "Founders", "Entrepreneurs", "Strategists", "Product Leaders", "Young Professionals"];
  
  return (
    <MotionSection className="bg-[linear-gradient(135deg,#b91693,#e42eb3)] text-white text-center py-[100px] px-[7vw] relative overflow-hidden">
      
      <RevealHeading>
        <h2 className="font-bold text-[clamp(36px,6vw,60px)] leading-[1] uppercase tracking-tight my-[15px] mb-[35px]">
          Built for people<br/>who move.
        </h2>
      </RevealHeading>
      <div className="flex flex-wrap justify-center gap-[8px] max-w-[850px] mx-auto">
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ y: 22, opacity: 0, scale: 0.92 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.055, type: "spring", bounce: 0.4 }}
            whileHover={{ y: -3, backgroundColor: "#ffffff", color: "var(--color-brand-purple)" }}
            className="border border-white/65 rounded-none py-[10px] px-[16px] font-sans font-bold text-[12px] uppercase tracking-widest cursor-pointer transition-colors duration-300"
          >
            {chip}
          </motion.span>
        ))}
      </div>
    </MotionSection>
  );
}

export function Schedule() {
  const schedule = [
    { time: "09:00", session: "Registration & Networking", track: "Community" },
    { time: "10:00", session: "Opening Keynote", track: "Ideas" },
    { time: "11:30", session: "Brand Transformation", track: "Brands" },
    { time: "13:00", session: "Lunch & Connections", track: "Community" },
    { time: "14:30", session: "Masterclass Sessions", track: "Deep Dive" },
    { time: "16:30", session: "Panel: What's Next?", track: "Future" },
  ];

  return (
    <MotionSection className="bg-brand-cream py-[75px] md:py-[110px] px-[6vw] md:px-[7vw]">
      
      <RevealHeading>
        <h2 className="font-bold text-[clamp(42px,5vw,56px)] uppercase leading-[1] tracking-tight my-[15px] mb-[45px]">
          Two days.<br/>One movement.
        </h2>
      </RevealHeading>
      <div className="max-w-[950px] mx-auto border border-[#ddd] bg-white">
        <div className="grid grid-cols-[1fr_2fr_1fr] p-[14px_18px] border-b border-[#e2e2e2] font-sans font-bold text-[12px] bg-brand-purple text-white uppercase tracking-widest">
          <div>Time</div><div>Session</div><div>Track</div>
        </div>
        {schedule.map((row, i) => (
          <FadeUp key={i} delay={i * 0.05}>
            <div className="grid grid-cols-[1fr_2fr_1fr] p-[14px_18px] border-b border-[#e2e2e2] font-sans text-[13px] hover:bg-[#fafafa] transition-colors last:border-b-0">
              <div className="flex items-center text-[#555]">{row.time}</div>
              <div className="font-bold flex items-center text-[14px] md:text-[15px]">{row.session}</div>
              <div className="text-[#888] flex items-center uppercase tracking-widest text-[11px] font-bold">{row.track}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </MotionSection>
  );
}

export function Packages() {
  return (
    <MotionSection id="packages" className="bg-white py-[75px] md:py-[110px] px-[6vw] md:px-[7vw]">
      
      <RevealHeading>
        <h2 className="font-bold text-[clamp(42px,5vw,56px)] uppercase leading-[1] tracking-tight my-[15px] mb-[45px]">
          Choose your<br/>way in.
        </h2>
      </RevealHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        <FadeUp delay={0.1}>
          <motion.div 
            className="p-[40px_30px] rounded-none relative overflow-hidden bg-[#ff9b00] text-white shadow-transparent cursor-pointer border border-[#ff9b00]"
            whileHover={{ y: -9, rotate: -0.5, boxShadow: "0 22px 45px rgba(255,155,0,0.3)" }}
          >
            <h3 className="font-bold text-[31px] uppercase m-0 tracking-tight">Standard</h3>
            <div className="font-sans text-[42px] font-bold my-[25px]">NPR 18,000</div>
            <p className="font-sans text-[14px] md:text-[15px] leading-[1.6] opacity-90 mb-[30px]">Full event access, sessions, networking and delegate materials.</p>
            <SvgButton href="#" variant="outline" outlineColorClass="text-white group-hover:text-white" outlineHoverTextColor="group-hover:text-[#ff9b00]" className="mt-[15px]">Register &#9654;</SvgButton>
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <motion.div 
            className="p-[40px_30px] rounded-none relative overflow-hidden bg-[#14b97b] text-white shadow-transparent cursor-pointer border border-[#14b97b]"
            whileHover={{ y: -9, rotate: -0.5, boxShadow: "0 22px 45px rgba(20,185,123,0.3)" }}
          >
            <h3 className="font-bold text-[31px] uppercase m-0 tracking-tight">Premium</h3>
            <div className="font-sans text-[42px] font-bold my-[25px]">NPR 24,000</div>
            <p className="font-sans text-[14px] md:text-[15px] leading-[1.6] opacity-90 mb-[30px]">Priority seating, premium networking access and additional experiences.</p>
            <SvgButton href="#" variant="outline" shape={2} outlineColorClass="text-white group-hover:text-white" outlineHoverTextColor="group-hover:text-[#14b97b]" className="mt-[15px]">Register &#9654;</SvgButton>
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <motion.div 
            className="p-[40px_30px] rounded-none relative overflow-hidden bg-[#2782e7] text-white shadow-transparent cursor-pointer border border-[#2782e7]"
            whileHover={{ y: -9, rotate: -0.5, boxShadow: "0 22px 45px rgba(39,130,231,0.3)" }}
          >
            <h3 className="font-bold text-[31px] uppercase m-0 tracking-tight">VIP</h3>
            <div className="font-sans text-[42px] font-bold my-[25px]">NPR 35,000</div>
            <p className="font-sans text-[14px] md:text-[15px] leading-[1.6] opacity-90 mb-[30px]">VIP access, premium hospitality and high-level networking opportunities.</p>
            <SvgButton href="#" variant="outline" shape={3} outlineColorClass="text-white group-hover:text-white" outlineHoverTextColor="group-hover:text-[#2782e7]" className="mt-[15px]">Register &#9654;</SvgButton>
          </motion.div>
        </FadeUp>
      </div>
    </MotionSection>
  );
}





