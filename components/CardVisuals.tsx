
import React, { useMemo } from 'react';
import type { Deck } from '../types';
import { getCardDisplayName } from '../data/tarotData';

interface CardVisualProps {
  cardName: string;
  deck: Deck;
  isReversed?: boolean;
}

interface CardBackProps {
  deck: Deck;
  position?: string;
}

// --- Generative Utilities ---

class Random {
  private seed: number;
  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        const char = seedStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    this.seed = Math.abs(hash);
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min: number, max: number) {
      return min + this.next() * (max - min);
  }

  // Box-Muller transform for normal distribution
  normal() {
      let u = 0, v = 0;
      while(u === 0) u = this.next(); 
      while(v === 0) v = this.next();
      return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }
}

// --- Generative Components ---

const Harmonograph: React.FC<{ rng: Random, opacity: number }> = ({ rng, opacity }) => {
    // Harmonograph parameters (simulating 2-4 pendulums)
    const f1 = Math.floor(rng.range(1, 4));
    const f2 = Math.floor(rng.range(1, 4));
    const f3 = Math.floor(rng.range(1, 4));
    const f4 = Math.floor(rng.range(1, 4));
    
    const p1 = rng.range(0, Math.PI * 2);
    const p2 = rng.range(0, Math.PI * 2);
    const p3 = rng.range(0, Math.PI * 2);
    const p4 = rng.range(0, Math.PI * 2);
    
    const d1 = rng.range(0.001, 0.005);
    const d2 = rng.range(0.001, 0.005);
    const d3 = rng.range(0.001, 0.005);
    const d4 = rng.range(0.001, 0.005);
    
    const points: string[] = [];
    const steps = 800; // Resolution
    const scale = 40;
    
    for(let t = 0; t < 100; t += 0.1) {
        const x = scale * Math.sin(f1 * t + p1) * Math.exp(-d1 * t) + scale * Math.sin(f2 * t + p2) * Math.exp(-d2 * t);
        const y = scale * Math.sin(f3 * t + p3) * Math.exp(-d3 * t) + scale * Math.sin(f4 * t + p4) * Math.exp(-d4 * t);
        points.push(`${50 + x},${50 + y}`);
    }

    return (
        <polyline 
            points={points.join(' ')} 
            fill="none" 
            stroke="white" 
            strokeWidth="0.3" 
            strokeOpacity={opacity} 
        />
    );
};

const FlowField: React.FC<{ rng: Random, type: 'up' | 'wavy' }> = ({ rng, type }) => {
    const lines: React.ReactNode[] = [];
    const numLines = 60;
    
    for(let i=0; i<numLines; i++) {
        const startX = rng.range(10, 90);
        const startY = type === 'up' ? 90 : rng.range(20, 80);
        let d = `M ${startX} ${startY}`;
        let x = startX;
        let y = startY;
        
        const length = rng.range(20, 60);
        for(let j=0; j<length; j++) {
            // Flow logic
            const angle = (x / 100) * Math.PI * 4 + (y / 100) * Math.PI;
            const noise = rng.range(-0.5, 0.5);
            
            if (type === 'up') {
                // Tendency to go up (Impulses)
                y -= 1;
                x += Math.sin(y * 0.1) * 0.5 + noise;
            } else {
                // Wavy horizontal (Currents)
                x += 1;
                y += Math.sin(x * 0.2) * 1.5 + noise * 0.2;
            }
            d += ` L ${x} ${y}`;
        }
        
        lines.push(
            <path key={i} d={d} fill="none" stroke="white" strokeWidth={rng.range(0.1, 0.5)} strokeOpacity={rng.range(0.2, 0.6)} />
        );
    }
    return <>{lines}</>;
};

const GeometricField: React.FC<{ rng: Random }> = ({ rng }) => {
    const elements: React.ReactNode[] = [];
    const count = 15;
    
    // Recursive circles or squares (Forms/Pentacles)
    for(let i=0; i<count; i++) {
        const r = rng.range(5, 45);
        const cx = 50 + rng.normal() * 5;
        const cy = 50 + rng.normal() * 5;
        
        elements.push(
            <circle key={`c-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth="0.2" strokeOpacity={rng.range(0.1, 0.4)} />
        );
        
        // Add orbital dots
        const orbitalSteps = Math.floor(rng.range(3, 12));
        for(let j=0; j<orbitalSteps; j++) {
            const angle = (j / orbitalSteps) * Math.PI * 2;
            const ox = cx + Math.cos(angle) * r;
            const oy = cy + Math.sin(angle) * r;
            elements.push(
                <circle key={`d-${i}-${j}`} cx={ox} cy={oy} r={0.5} fill="white" fillOpacity={0.4} />
            )
        }
    }
    return <>{elements}</>;
};

const GlitchField: React.FC<{ rng: Random }> = ({ rng }) => {
    const elements: React.ReactNode[] = [];
    const count = 40;
    
    // Vertical scanning lines (Signals/Swords)
    for(let i=0; i<count; i++) {
        const x = rng.range(10, 90);
        const y1 = rng.range(10, 40);
        const y2 = rng.range(60, 90);
        
        elements.push(
             <line key={`l-${i}`} x1={x} y1={y1} x2={x} y2={y2} stroke="white" strokeWidth={rng.range(0.1, 0.8)} strokeOpacity={rng.range(0.1, 0.5)} />
        );
        
        // Horizontal interference
        if (rng.next() > 0.7) {
             const y = rng.range(10, 90);
             const w = rng.range(2, 10);
             elements.push(
                 <line key={`h-${i}`} x1={x-w} y1={y} x2={x+w} y2={y} stroke="white" strokeWidth="0.2" strokeOpacity={0.3} />
             )
        }
    }
    return <>{elements}</>;
};


const EchoCardArt: React.FC<{ standardName: string; seedStr: string }> = ({ standardName, seedStr }) => {
  const rng = useMemo(() => new Random(seedStr), [seedStr]);
  
  // Determine Archetype
  let type: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles' = 'major';
  if (standardName.includes('Wands')) type = 'wands';
  else if (standardName.includes('Cups')) type = 'cups';
  else if (standardName.includes('Swords')) type = 'swords';
  else if (standardName.includes('Pentacles')) type = 'pentacles';
  
  // Unique ID for filters
  const filterId = `noise-${seedStr.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505]">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
                {/* 
                  The "Stipple" Effect:
                  1. Generate Fractal Noise (Turbulence)
                  2. Use the noise to displace the pixels of the source graphic.
                  This breaks clean lines into chalky, sandy textures.
                */}
                <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                    <feComposite operator="in" in="SourceGraphic" in2="noise" result="composite" />
                </filter>
                
                <radialGradient id={`grad-${filterId}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </radialGradient>
            </defs>
            
            {/* Background Atmosphere */}
            <rect width="100%" height="100%" fill={`url(#grad-${filterId})`} />
            
            {/* Generative Content with Stipple Filter */}
            <g filter={`url(#${filterId})`}>
                {type === 'major' && (
                    <>
                       {/* Layer multiple harmonographs for complexity */}
                       <Harmonograph rng={rng} opacity={0.5} />
                       <Harmonograph rng={rng} opacity={0.3} />
                       <circle cx="50" cy="50" r={rng.range(10, 30)} fill="none" stroke="white" strokeWidth="0.1" strokeOpacity="0.2" />
                    </>
                )}
                
                {type === 'wands' && <FlowField rng={rng} type="up" />}
                
                {type === 'cups' && <FlowField rng={rng} type="wavy" />}
                
                {type === 'swords' && <GlitchField rng={rng} />}
                
                {type === 'pentacles' && <GeometricField rng={rng} />}
            </g>
            
            {/* Subtle Vignette Overlay via SVG */}
            <rect width="100%" height="100%" fill="url(#vignette)" style={{ mixBlendMode: 'multiply' }} opacity="0.8"/>
            <defs>
                 <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
                    <stop offset="60%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="1" />
                </radialGradient>
            </defs>
        </svg>
    </div>
  );
};

export const EchoCardFace: React.FC<{ displayName: string; standardName: string; isReversed: boolean }> = ({ displayName, standardName, isReversed }) => {
  // Typographic processing for standard names
  let prefix = "";
  let mainTitle = displayName;
  
  if (displayName.startsWith("The ")) {
      prefix = "THE";
      mainTitle = displayName.substring(4);
  } else if (displayName.includes(" of ")) {
      const parts = displayName.split(" of ");
      prefix = parts[0] + " OF";
      mainTitle = parts[1];
  } else if (displayName === "Wheel of Fortune") {
      prefix = "WHEEL OF";
      mainTitle = "FORTUNE";
  }

  return (
    <div className={`w-full h-full bg-[#050505] relative overflow-hidden rounded-lg shadow-2xl ${isReversed ? 'transform rotate-180' : ''}`}>
       
       {/* Generative Visual Layer */}
       <div className="absolute inset-0 z-0 opacity-80">
          <EchoCardArt standardName={standardName} seedStr={displayName} />
       </div>
       
       {/* Floating Typography Layer */}
       <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none p-4">
            <div className="flex flex-col items-center justify-center text-center mix-blend-screen">
                {prefix && (
                    <span className="font-serif text-white/60 text-xs md:text-sm tracking-[0.5em] mb-2">{prefix.toUpperCase()}</span>
                )}
                <h2 className="font-serif-brand text-white text-2xl md:text-4xl tracking-[0.2em] leading-tight drop-shadow-lg">
                    {mainTitle.toUpperCase()}
                </h2>
            </div>

            {isReversed && (
                 <div className="absolute bottom-8 w-full flex justify-center">
                    <span className="text-xs text-white/70 uppercase tracking-[0.2em] border border-white/20 px-3 py-1 rounded-full">Reversed</span>
                 </div>
            )}
       </div>
       
       {/* Outer Border (Subtle) */}
       <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none"></div>
    </div>
  );
};

export const EchoCardBack: React.FC<{ position?: string }> = ({ position }) => (
    <div className="w-full h-full bg-[#080808] rounded-lg border border-gray-800/50 relative overflow-hidden flex flex-col items-center justify-center group">
        
        {/* Background Noise Texture */}
        <div className="absolute inset-0 opacity-30">
             <svg width="100%" height="100%">
                <filter id="backNoise">
                    <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" stitchTiles="stitch"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#backNoise)" opacity="0.5"/>
             </svg>
        </div>

        {/* Minimalist Sacred Geometry Back */}
        <div className="relative z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
             <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="1">
                 <circle cx="50" cy="50" r="40" strokeOpacity="0.5" strokeDasharray="2 4" />
                 <circle cx="50" cy="50" r="25" strokeOpacity="0.8" />
                 <path d="M50 10 L50 90 M10 50 L90 50" strokeOpacity="0.3" />
                 <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" strokeOpacity="0.5" />
             </svg>
        </div>

        {position && (
            <div className="absolute bottom-6 w-full flex justify-center z-20">
                <p className="text-gray-400 font-serif text-[10px] uppercase tracking-[0.2em]">{position}</p>
            </div>
        )}
    </div>
);

export const CardVisual: React.FC<CardVisualProps> = ({ cardName, deck, isReversed = false }) => {
  const displayName = getCardDisplayName(cardName, deck);
  
  // App now uses Echo aesthetic globally.
  // We can still support deck-specific image overrides if they exist in the future,
  // but for now we default to the generated art.
  
  return (
    <div className="w-full h-full rounded-lg shadow-md flex flex-col justify-between items-center overflow-hidden relative bg-transparent shadow-none">
        <EchoCardFace displayName={displayName} standardName={cardName} isReversed={isReversed} />
    </div>
  );
};

export const CardBack: React.FC<CardBackProps> = ({ deck, position }) => {
    return <EchoCardBack position={position} />;
};
