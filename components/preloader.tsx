'use client';

import { motion, useAnimationControls } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(MorphSVGPlugin);
}

const MAGENTA = '#B20B63';

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playSfx = (type: 'bloom' | 'spin' | 'assemble' | 'bird') => {
  if (!audioCtx) return;
  try {
    const ctx = audioCtx;
    const t = ctx.currentTime;

    if (type === 'bloom') {
      [110, 164.81, 220, 277.18].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq + (Math.random() - 0.5) * 2;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.04, t + 1.0 + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 4.0);
        osc.start(t);
        osc.stop(t + 4.0);
      });
    } else if (type === 'spin') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 1.2);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, t);
      filter.frequency.exponentialRampToValueAtTime(2000, t + 1.2);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.5);
      gain.gain.linearRampToValueAtTime(0, t + 1.2);
      osc.start(t);
      osc.stop(t + 1.2);
    } else if (type === 'assemble') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
      osc.start(t);
      osc.stop(t + 1.5);
    } else if (type === 'bird') {
      [880, 1108.73, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.2 + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);
        osc.start(t);
        osc.stop(t + 3.0);
      });
    }
  } catch (e) { }
};

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [started, setStarted] = useState(true);
  const [visible, setVisible] = useState(true);
  const [complete, setComplete] = useState(false);
  const [phase, setPhase] = useState<'initial' | 'emerge' | 'discover' | 'assemble' | 'fold' | 'lock' | 'bird'>('initial');
  const controls = useAnimationControls();

  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    // Attempt to initialize audio on load (browsers may suppress this without a gesture)
    initAudio();

    const wait = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const sequence = async () => {
      await new Promise(requestAnimationFrame);

      // 0.0 - 0.5s: Anticipation
      await wait(500);

      // 0.5 - 1.4s: emerge (Six pieces appear)
      playSfx('bloom');
      controls.start('emerge');
      setPhase('emerge');
      await wait(900);

      // 1.4 - 2.4s: discover (Pieces orbit/discover)
      playSfx('spin');
      controls.start('discover');
      setPhase('discover');
      await wait(1000);

      // 2.4 - 3.0s: assemble (Rapid convergence)
      playSfx('assemble');
      controls.start('assemble');
      setPhase('assemble');
      await wait(600);

      // 3.0 - 4.1s: fold (Pieces fold/morph into bird planes)
      controls.start('fold');
      setPhase('fold');
      await wait(1100);

      // 4.1 - 4.6s: lock (Bird settles)
      controls.start('lock');
      setPhase('lock');
      await wait(500);

      // 4.1 - 4.6s: breathe (Bird breathes, life)
      controls.start('breathe');
      setPhase('bird'); // Tell PieceField it's done
      await wait(400);

      // 4.5 - 5.0s: brands
      playSfx('bird');
      controls.start('brands');
      await wait(500);

      // 5.0 - 5.4s: beyond
      controls.start('beyond');
      await wait(400);

      // 5.4 - 5.8s: tagline
      controls.start('tagline');
      await wait(400);

      // Reveal the real site before the bird leaves
      setComplete(true);
      await wait(60);

      // 5.8 - 6.7s: flight
      controls.start('flight');
      await wait(900);
      if (!cancelled) setVisible(false);
    };

    sequence();

    return () => {
      cancelled = true;
    };
  }, [controls, started]);

  if (!visible) return <>{children}</>;

  return (
    <>
      {complete && children}

      {!started && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black cursor-pointer"
          onClick={() => {
            initAudio();
            setStarted(true);
          }}
        >
          <div className="font-sans text-white/50 text-sm tracking-[0.3em] uppercase animate-pulse">Click to Enter</div>
        </div>
      )}

      <motion.div className="fixed inset-0 z-[999] overflow-hidden bg-black text-white pointer-events-none" initial="initial" animate={controls} variants={{ flight: { backgroundColor: "rgba(0,0,0,0)", transition: { duration: 0.7, ease: "easeInOut" } } }}>
        {/* ----------------------------------------------
          BACKGROUND
      ----------------------------------------------- */}

        <Ambient />

        {/* Petals are the first visual beat: they bloom, spiral inward,
            then disappear behind the bird as it assembles. */}

        <Noise />

        {/* Very subtle central light */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[55vw] w-[55vw] max-h-[800px] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(178,11,99,0.12) 0%, rgba(178,11,99,0.035) 35%, transparent 70%)',
          }}
          variants={{
            initial: {
              opacity: 0,
              scale: 0.7,
            },
            ambient: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              },
            },
            assemble: {
              opacity: 1,
              scale: 1,
            },
            lock: {
              opacity: 1,
              scale: 1.08,
              transition: {
                duration: 0.5,
              },
            },
            flight: {
              opacity: 0,
              scale: 1.35,
              transition: {
                duration: 0.9,
              },
            },
          }}
        />

        {/* ----------------------------------------------
          MAIN IDENTITY
      ----------------------------------------------- */}

        <motion.main
          className="
          absolute
          left-1/2 top-1/2
          w-[min(1180px,92vw)]
          -translate-x-1/2
          -translate-y-1/2
        "
          variants={{
            initial: {
              opacity: 1,
            },

            ambient: {
              opacity: 1,
            },

            flight: {
              opacity: 1,
              transition: { duration: 0.8 },
            },
          }}
        >
          <div
            className="
            flex
            items-center
            justify-center
            gap-[clamp(35px,6vw,110px)]
            max-md:flex-col
          "
          >
            {/* ------------------------------------------
              TYPOGRAPHY
          ------------------------------------------- */}

            <div
              className="
              order-2
              flex
              min-w-0
              flex-col
              items-start
              max-md:items-center
              max-md:text-center
              md:order-1
            "
            >
              <BrandName controls={controls} />
              <Beyond controls={controls} />
              <Tagline controls={controls} />
            </div>

            {/* ------------------------------------------
              BIRD
          ------------------------------------------- */}

            <motion.div layoutId="brand-bird" className="order-1 relative h-[clamp(210px,25vw,340px)] w-[clamp(210px,25vw,340px)] shrink-0 md:order-2">
              <PieceField phase={phase} />
              <PaperBird controls={controls} />
            </motion.div>
          </div>
        </motion.main>
      </motion.div>
    </>
  );
}

/* ======================================================
   AMBIENT
====================================================== */

function Ambient() {
  return (
    <motion.div
      className="absolute inset-0"
      variants={{
        initial: {
          opacity: 0,
        },

        ambient: {
          opacity: 1,
          transition: {
            duration: 0.6,
          },
        },

        assemble: {
          opacity: 1,
        },

        flight: {
          opacity: 0,
          transition: {
            duration: 0.8,
          },
        },
      }}
    >
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[1px]
          w-[1px]
          -translate-x-1/2
          -translate-y-1/2
          shadow-[0_0_180px_90px_rgba(178,11,99,0.05)]
        "
      />
    </motion.div>
  );
}

function Noise() {
  return (
    <div className="absolute inset-0 z-20 opacity-[0.035] mix-blend-screen">
      <svg className="h-full w-full">
        <filter id="preloaderNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>

        <rect
          width="100%"
          height="100%"
          filter="url(#preloaderNoise)"
        />
      </svg>
    </div>
  );
}


/* ======================================================
   SIX PETALS -> SVG MORPH -> BIRD
   ------------------------------------------------------
   No confetti, no particle field, no extra petals.
   Exactly six large petals are used throughout.
   Each one carries one of the bird's existing colors and
   morphs directly into a major bird plane using MorphSVG.
====================================================== */

const PETAL_COLORS = [
  '#FF8200', // orange
  '#FE3000', // red
  '#FE3070', // pink
  '#0F7FFF', // blue
  '#01BC87', // green
  '#017F87', // teal
];

type PiecePhase = 'initial' | 'emerge' | 'discover' | 'assemble' | 'fold' | 'lock' | 'bird';

type PieceMotion = {
  emerge: { x: number; y: number; rotate: number; scale: number; delay: number };
  discover: { x: number; y: number; rotate: number; scale: number };
};

const PIECE_MOTION: PieceMotion[] = [
  // Piece 0: Top Right (Orange)
  {
    emerge: { x: -40, y: -60, rotate: -15, scale: 0.8, delay: 0.0 },
    discover: { x: 30, y: -40, rotate: 10, scale: 0.95 }
  },
  // Piece 1: Right (Red)
  {
    emerge: { x: 50, y: -20, rotate: 25, scale: 1.1, delay: 0.1 },
    discover: { x: 40, y: 30, rotate: 45, scale: 1.05 }
  },
  // Piece 2: Bottom Right (Pink)
  {
    emerge: { x: 30, y: 60, rotate: 60, scale: 0.9, delay: 0.2 },
    discover: { x: -20, y: 50, rotate: 80, scale: 0.95 }
  },
  // Piece 3: Bottom Left (Blue)
  {
    emerge: { x: -30, y: 50, rotate: 110, scale: 1.0, delay: 0.15 },
    discover: { x: -50, y: 10, rotate: 135, scale: 1.1 }
  },
  // Piece 4: Left (Green)
  {
    emerge: { x: -60, y: 10, rotate: 160, scale: 0.85, delay: 0.05 },
    discover: { x: -40, y: -30, rotate: 180, scale: 0.9 }
  },
  // Piece 5: Top Left (Teal)
  {
    emerge: { x: -20, y: -50, rotate: 200, scale: 1.15, delay: 0.25 },
    discover: { x: 10, y: -50, rotate: 220, scale: 1.0 }
  }
];

/*
 * These are the six destination planes of the existing bird.
 * The paths are deliberately taken from the actual bird artwork
 * rather than inventing a different bird silhouette.
 */
const MORPH_TARGETS = [
  // Orange back feather
  "M68,108 L70,113 L309,302 L323,323 L330,345 L332,389 L350,355 L348,339 L265,119 L211,102 L171,97 L107,99 Z",

  // Red inner fold
  "M266,121 L342,320 L350,350 L352,350 L385,284 L387,250 L379,218 L358,184 L334,160 L295,134 Z",

  // Pink upper wing
  "M230,25 L265,120 L307,141 L339,165 L367,197 L384,232 L388,253 L384,288 L350,353 L353,367 L423,219 L424,199 L419,177 L389,121 L352,82 L300,48 L257,31 Z",

  // Blue body
  "M513,232 L487,242 L438,269 L415,286 L392,310 L382,331 L374,357 L371,375 L372,405 L474,362 L495,349 L512,333 L526,311 L531,291 L529,264 Z",

  // Green beak
  "M462,167 L463,171 L480,188 L494,205 L512,231 L519,230 L523,227 L563,213 L567,213 L575,209 L603,202 L609,199 L615,199 L621,196 L630,195 L630,193 L625,191 L619,191 L596,184 L577,181 L567,177 L561,177 L541,171 L535,171 L525,167 L519,167 L512,164 L477,157 L468,154 Z",

  // Lower pink tail
  "M372,407 L351,416 L341,423 L340,428 L333,440 L330,449 L323,460 L323,463 L306,495 L282,547 L290,546 L295,543 L299,543 L348,522 L356,516 L358,516 L374,499 L382,481 L383,451 L379,432 L375,424 Z",
];

const EMBLEM_PATHS = [
  "M 332.0,292.0 C 280.0,220.0 310.0,130.0 332.0,120.0 C 354.0,130.0 384.0,220.0 332.0,292.0 Z",
  "M 332.0,292.0 C 368.4,211.0 461.3,191.9 481.0,206.0 C 483.3,230.1 420.4,301.0 332.0,292.0 Z",
  "M 332.0,292.0 C 420.4,283.0 483.3,353.9 481.0,378.0 C 461.3,392.1 368.4,373.0 332.0,292.0 Z",
  "M 332.0,292.0 C 384.0,364.0 354.0,454.0 332.0,464.0 C 310.0,454.0 280.0,364.0 332.0,292.0 Z",
  "M 332.0,292.0 C 295.6,373.0 202.7,392.1 183.0,378.0 C 180.7,353.9 243.6,283.0 332.0,292.0 Z",
  "M 332.0,292.0 C 243.6,301.0 180.7,230.1 183.0,206.0 C 202.7,191.9 295.6,211.0 332.0,292.0 Z"
];

function PieceField({ phase }: { phase: PiecePhase }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const petalsRef = useRef<(SVGPathElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = petalsRef.current.filter(Boolean) as SVGPathElement[];

    // Kill the previous phase timeline cleanly.
    tlRef.current?.kill();

    if (phase === 'initial') {
      gsap.set(paths, {
        opacity: 0,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.2,
        transformOrigin: '50% 50%',
      });
      return;
    }

    if (phase === 'emerge') {
      const tl = gsap.timeline();
      tlRef.current = tl;

      paths.forEach((path, i) => {
        const p = PIECE_MOTION[i].emerge;
        tl.to(
          path,
          {
            opacity: 1,
            x: p.x,
            y: p.y,
            rotation: p.rotate,
            scale: p.scale,
            duration: 0.6,
            ease: 'power3.out',
          },
          i * 0.12
        );
      });
      return () => { tl.kill(); };
    }

    if (phase === 'discover') {
      const tl = gsap.timeline();
      tlRef.current = tl;

      paths.forEach((path, i) => {
        const p = PIECE_MOTION[i].discover;
        tl.to(
          path,
          {
            x: p.x,
            y: p.y,
            rotation: p.rotate,
            scale: p.scale,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          0
        );
      });
      return () => { tl.kill(); };
    }

    if (phase === 'assemble') {
      const tl = gsap.timeline();
      tlRef.current = tl;

      paths.forEach((path, i) => {
        tl.to(
          path,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.45,
            ease: 'back.out(1.5)',
          },
          i * 0.02
        );
      });
      return () => { tl.kill(); };
    }

    if (phase === 'fold') {
      const tl = gsap.timeline();
      tlRef.current = tl;

      paths.forEach((path, i) => {
        tl.to(
          path,
          {
            morphSVG: MORPH_TARGETS[i],
            duration: 0.8,
            ease: 'power3.inOut',
          },
          i * 0.05
        );
      });
      return () => { tl.kill(); };
    }

    if (phase === 'lock') {
      const tl = gsap.timeline();
      tlRef.current = tl;
      // Fade out the pieces quickly as PaperBird takes over
      tl.to(paths, { opacity: 0, duration: 0.1, ease: 'power2.out' }, 0);
      return () => { tl.kill(); };
    }
  }, [phase]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
      <svg
        ref={svgRef}
        viewBox="0 0 664 585"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <filter id="petalGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .42 0"
            />
          </filter>
        </defs>

        {PETAL_COLORS.map((color, i) => (
          <g key={`petal-${i}`}>
            <path
              ref={(el) => {
                petalsRef.current[i] = el;
              }}
              d={EMBLEM_PATHS[i]}
              fill={color}
              opacity="0"
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ================================================================
   PAPER BIRD
====================================================== */
function PaperBird({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      variants={{
        initial: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0 },
        lock: {
          x: 4,
          opacity: 1,
          y: -3,
          scale: 1.025,
          rotate: 0,
          transition: { type: 'spring', stiffness: 260, damping: 18, mass: 0.7 },
        },
        breathe: {
          x: [4, 7, 4],
          y: [-3, -7, -3],
          scale: [1.025, 1.035, 1.025],
          transition: { duration: 3.2, ease: 'easeInOut' },
        },
        flight: {
          x: ['0vw', '-8vw', '-22vw', '-45vw'],
          y: ['0vh', '3vh', '-12vh', '-43vh'],
          rotate: [0, 7, -12, -24],
          scale: [1, 1.02, 0.55, 0.075],
          opacity: [1, 1, 0.9, 0],
          transition: {
            duration: 1.35,
            ease: [0.12, 0.8, 0.2, 1],
            times: [0, 0.22, 0.68, 1],
          },
        },
      }}
    >
      {/* Atmospheric shadow beneath bird */}
      <motion.div
        className="absolute left-[45%] top-[57%] h-[35%] w-[35%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B20B63]/20 blur-[35px]"
        variants={{
          initial: { opacity: 0 },
          assemble: { opacity: 0.25, transition: { duration: 0.8 } },
          lock: { opacity: 0.45 },
          breathe: {
            opacity: [0.35, 0.5, 0.35],
            scale: [1, 1.08, 1],
            transition: { duration: 3.2, ease: 'easeInOut' },
          },
          flight: { opacity: 0, transition: { duration: 0.4 } },
        }}
      />

      <svg
        viewBox="0 0 664 585"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <filter id="birdShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ORANGE BACK FEATHER */}
        <PaperPiece controls={controls} angle={0} delay={0}>
          <path
            className="paper-shard-path"
            d="M68,108 L70,113 L309,302 L323,323 L330,345 L332,389 L350,355 L348,339 L265,119 L211,102 L171,97 L107,99 Z"
            fill="#FF8200"
          />
        </PaperPiece>

        {/* RED INNER FOLD */}
        <PaperPiece controls={controls} angle={45} delay={0.1}>
          <path
            className="paper-shard-path"
            d="M266,121 L342,320 L350,350 L352,350 L385,284 L387,250 L379,218 L358,184 L334,160 L295,134 Z"
            fill="#FE3000"
          />
        </PaperPiece>

        {/* PINK/MAGENTA UPPER WING */}
        <PaperPiece controls={controls} angle={90} delay={0.2}>
          <path
            className="paper-shard-path"
            d="M230,25 L265,120 L307,141 L339,165 L367,197 L384,232 L388,253 L384,288 L350,353 L353,367 L423,219 L424,199 L419,177 L389,121 L352,82 L300,48 L257,31 Z"
            fill="#FE3070"
          />
        </PaperPiece>

        {/* TEAL BEAK BLEND */}
        <PaperPiece controls={controls} angle={135} delay={0.3}>
          <path
            className="paper-shard-path"
            d="M463,170 L460,171 L453,185 L449,196 L429,235 L425,246 L419,256 L418,261 L408,279 L408,282 L398,302 L400,302 L418,284 L446,264 L483,244 L488,243 L492,240 L495,240 L501,236 L512,232 L509,225 L492,202 Z"
            fill="#017F87"
          />
        </PaperPiece>

        {/* GREEN BEAK */}
        <PaperPiece controls={controls} angle={180} delay={0.38}>
          <path
            className="paper-shard-path"
            d="M462,167 L463,171 L480,188 L494,205 L512,231 L519,230 L523,227 L563,213 L567,213 L575,209 L603,202 L609,199 L615,199 L621,196 L630,195 L630,193 L625,191 L619,191 L596,184 L577,181 L567,177 L561,177 L541,171 L535,171 L525,167 L519,167 L512,164 L477,157 L468,154 Z"
            fill="#01BC87"
          />
        </PaperPiece>

        {/* BLUE BODY (+ two thin slivers) */}
        <PaperPiece controls={controls} angle={225} delay={0.5}>
          <path
            className="paper-shard-path"
            fillRule="evenodd"
            d="M351,375 L349,375 L349,376 L347,378 L347,381 L346,382 L346,383 L344,385 L342,391 L340,393 L340,396 L339,397 L339,398 L337,400 L337,402 L333,408 L333,411 L331,413 L331,414 L330,415 L330,417 L328,419 L328,420 L326,423 L326,425 L323,430 L323,432 L321,434 L321,436 L323,436 L325,434 L326,434 L328,431 L330,431 L331,430 L331,429 L333,427 L334,427 L336,425 L339,424 L342,421 L342,420 L344,417 L344,413 L345,412 L345,410 L346,409 L346,407 L347,406 L347,404 L348,403 L348,396 L349,395 L349,391 L350,390 L350,384 L351,383 Z M513,232 L487,242 L438,269 L415,286 L392,310 L382,331 L374,357 L371,375 L372,405 L474,362 L495,349 L512,333 L526,311 L531,291 L529,264 Z M453,160 L450,160 L449,164 L446,169 L446,171 L443,175 L443,177 L439,184 L439,186 L437,188 L436,192 L434,194 L434,196 L432,198 L432,200 L429,205 L429,207 L426,211 L425,217 L424,218 L424,225 L423,226 L423,231 L422,232 L422,239 L421,240 L421,243 L419,247 L419,251 L415,260 L415,262 L417,262 L418,259 L420,257 L420,255 L423,250 L423,248 L427,242 L428,238 L430,236 L430,234 L433,229 L433,227 L436,223 L437,219 L440,215 L440,213 L444,206 L444,204 L446,202 L447,198 L449,196 L449,194 L454,185 L454,183 L456,181 L457,177 L461,171 L461,168 L459,167 Z"
            fill="#0F7FFF"
          />
        </PaperPiece>

        {/* NAVY SLIVER */}
        <PaperPiece controls={controls} angle={270} delay={0.58}>
          <path
            className="paper-shard-path"
            d="M423,223 L421,223 L415,234 L415,237 L351,371 L350,393 L343,420 L369,407 L372,407 L371,377 L375,352 L385,324 L402,294 L413,269 L420,247 L423,233 Z"
            fill="#0F3070"
          />
        </PaperPiece>

        {/* LOWER PINK TAIL */}
        <PaperPiece controls={controls} angle={315} delay={0.66}>
          <path
            className="paper-shard-path"
            d="M372,407 L351,416 L341,423 L340,428 L333,440 L330,449 L323,460 L323,463 L306,495 L282,547 L290,546 L295,543 L299,543 L348,522 L356,516 L358,516 L374,499 L382,481 L383,451 L379,432 L375,424 Z"
            fill="#FE3070"
          />
        </PaperPiece>
      </svg>
    </motion.div>
  );
}

/* ======================================================
   PAPER PIECE ANIMATION
====================================================== */

function PaperPiece({
  controls,
  children,
  delay,
  angle,
  className,
}: {
  controls: ReturnType<typeof useAnimationControls>;
  children: React.ReactNode;
  delay: number;
  angle: number;
  className?: string;
}) {
  return (
    <motion.g
      className={className}
      initial="initial"
      animate={controls}
      style={{ transformOrigin: '332px 292px' }}
      variants={{
        initial: { opacity: 0, rotate: angle - 90, scale: 0.05, x: 0, y: 0 },
        lock: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.22, ease: 'easeOut' },
        },
      }}
    >
      {children}
    </motion.g>
  );
}

/* ======================================================
   BRANDS
====================================================== */

function BrandName({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  const letters = 'brands'.split('');

  return (
    <div className="overflow-hidden">
      <motion.div
        className="
          flex
          whitespace-nowrap
          font-sans
          text-[clamp(4.5rem,9vw,8.5rem)]
          font-[800]
          leading-[0.78]
          tracking-[-0.075em]
        "
        style={{
          color: MAGENTA,
        }}
        variants={{
          initial: {
            opacity: 0,
          },

          ambient: {
            opacity: 0,
          },

          assemble: {
            opacity: 0,
          },

          lock: {
            opacity: 0,
          },

          brands: {
            opacity: 1,
            transition: {
              duration: 0.1,
            },
          },

          beyond: {
            opacity: 1,
          },

          tagline: {
            opacity: 1,
          },

          breathe: {
            opacity: 1,
          },

          flight: {
            x: -25,
            opacity: 0,
            transition: {
              duration: 0.45,
            },
          },
        }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={letter}
            initial={{ y: 80, opacity: 0 }}
            animate={controls}
            variants={{
              brands: {
                y: 0,
                opacity: 1,
                transition: {
                  delay: i * 0.045,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                },
              },

              flight: {
                y: 0,
                opacity: 0,
                transition: {
                  delay: i * 0.02,
                  duration: 0.3,
                },
              },
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

/* ======================================================
   & BEYOND
====================================================== */

function Beyond({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  const letters = '& BEYOND'.split('');

  return (
    <div className="mt-4 overflow-hidden">
      <motion.div
        className="
          flex
          whitespace-nowrap
          font-sans
          text-[clamp(1.3rem,2.8vw,2.5rem)]
          font-light
          uppercase
        "
        style={{
          color: MAGENTA,
        }}
        variants={{
          initial: {
            opacity: 0,
          },

          ambient: {
            opacity: 0,
          },

          assemble: {
            opacity: 0,
          },

          lock: {
            opacity: 0,
          },

          brands: {
            opacity: 0,
          },

          beyond: {
            opacity: 1,
            transition: {
              duration: 0.15,
            },
          },

          tagline: {
            opacity: 1,
          },

          breathe: {
            opacity: 1,
          },

          flight: {
            opacity: 0,
            x: -20,
            transition: {
              duration: 0.4,
            },
          },
        }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            className={letter === ' ' ? 'mr-4' : ''}
            initial={{
              opacity: 0,
              x: 20,
              letterSpacing: '0.25em',
            }}
            animate={controls}
            variants={{
              beyond: {
                opacity: 1,
                x: 0,
                letterSpacing: '0.12em',
                transition: {
                  delay: i * 0.055,
                  duration: 0.55,
                  ease: 'easeOut',
                },
              },

              flight: {
                opacity: 0,
                transition: {
                  duration: 0.25,
                },
              },
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

/* ======================================================
   TAGLINE
====================================================== */

function Tagline({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  return (
    <div className="mt-5 overflow-hidden">
      <motion.div
        className="
          whitespace-nowrap
          font-sans
          text-[clamp(0.65rem,1vw,0.82rem)]
          font-medium
          uppercase
          tracking-[0.28em]
        "
        style={{
          color: MAGENTA,
        }}
        variants={{
          initial: {
            opacity: 0,
            y: 14,
            clipPath: 'inset(0 100% 0 0)',
          },


          tagline: {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            transition: {
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            },
          },

          breathe: {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
          },

          flight: {
            opacity: 0,
            y: 8,
            transition: {
              duration: 0.35,
            },
          },
        }}
      >
        Shaping Tomorrow's Brandscape
      </motion.div>
    </div>
  );
}















