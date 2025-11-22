
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Note } from '../types';

interface CardProps {
  note: Note;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

// Canvas-based disintegration effect optimized for performance
const DisintegrationEffect: React.FC<{
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  width: number;
  height: number;
}> = ({ x, y, rotation, zIndex, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const PADDING = 60; 
    const canvasWidth = width + PADDING * 2;
    const canvasHeight = height + PADDING * 2;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Optimization: Sample pixels instead of filling every single one.
    // A gap of 3 reduces particle count by factor of 9, eliminating lag.
    const GAP = 3; 
    const PARTICLE_SIZE = 1.5; // Slightly larger than 1px for visibility with lower density

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];

    // Generate particles ONLY within the card area
    for (let i = 0; i < width; i += GAP) {
      for (let j = 0; j < height; j += GAP) {
        // Add some randomness to position so it doesn't look like a perfect grid
        const offsetX = (Math.random() - 0.5) * GAP;
        const offsetY = (Math.random() - 0.5) * GAP;

        particles.push({
          x: PADDING + i + offsetX,
          y: PADDING + j + offsetY,
          // Physics: Explosive but contained
          vx: (Math.random() - 0.5) * 4, 
          vy: (Math.random() - 0.5) * 4, 
          alpha: 1,
          // Random decay for organic fading
          decay: Math.random() * 0.03 + 0.015 
        });
      }
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      let active = false;

      ctx.fillStyle = '#111827'; // Tailwind gray-900

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;
        active = true;

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          // Draw particle
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(p.x, p.y, PARTICLE_SIZE, PARTICLE_SIZE);
        }
      }

      if (active) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [width, height]);

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        left: x - 60, 
        top: y - 60,
        width: width + 120, 
        height: height + 120,
        transform: `rotate(${rotation}deg)`,
        zIndex: zIndex + 100
      }}
    >
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export const Card: React.FC<CardProps> = ({ note, onDelete, onFocus, onDragEnd }) => {
  const [isShredding, setIsShredding] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // Store dimensions to pass to the disintegration effect
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  // Measure the actual height of the card based on text content
  useLayoutEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
    }
  }, [note.text]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShredding(true);
    // Wait for animation to finish visually before removing component
    setTimeout(() => {
      onDelete(note.id);
    }, 800); 
  };

  return (
    <div className="absolute w-[280px] sm:w-[300px] pointer-events-none">
      {!isShredding ? (
        <motion.div
            layoutId={note.id}
            key="card-active"
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ 
              y: note.y, 
              x: note.x, 
              opacity: 1, 
              scale: 1,
              rotate: note.rotation,
              zIndex: note.zIndex
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              mass: 1.5,
            }}
            drag
            dragMomentum={false}
            onDragStart={() => onFocus(note.id)}
            onDragEnd={(e, info) => {
               onDragEnd(note.id, note.x + info.offset.x, note.y + info.offset.y);
            }}
            whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 100 }}
            className="relative w-full cursor-grab touch-none group pointer-events-auto"
          >
            <div 
              ref={cardRef}
              className="relative w-full bg-white text-gray-900 rounded-lg overflow-hidden flex flex-col"
              style={{ 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.02)',
              }}
            >
              {/* Top Deco Line */}
              <div className="h-1 w-full bg-gray-100 flex shrink-0">
                  <div className="w-1/3 h-full bg-gray-800"></div>
              </div>

              {/* Close Button */}
              <button 
                onClick={handleDeleteClick}
                className="absolute top-3 right-3 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center z-50 shadow-md hover:scale-110 hover:bg-gray-900 transition-all duration-200"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <X size={12} strokeWidth={3} />
              </button>

              <div className="p-6 flex flex-col">
                {/* Header Meta */}
                <div className="flex justify-between items-end mb-4 border-b border-dashed border-gray-200 pb-3">
                  <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">Ref. ID</span>
                      <span className="text-[10px] font-bold text-gray-800 font-mono tracking-wider">#{note.id.slice(0, 6).toUpperCase()}</span>
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono">
                      MEMO-RITE™
                  </div>
                </div>

                {/* Content - Dynamic Height */}
                <div className="font-typewriter min-h-[60px] text-[15px] leading-[1.8] font-medium text-gray-800 whitespace-pre-wrap tracking-wide selection:bg-gray-200">
                  {note.text}
                </div>

                {/* Footer - Compact */}
                <div className="mt-6 pt-2 flex justify-between items-center">
                   <div className="flex flex-col">
                      <span className="text-[8px] text-gray-400 uppercase tracking-widest mb-1">Created At</span>
                      <div className="text-[10px] text-gray-600 font-typewriter font-bold">
                          {note.date}
                      </div>
                   </div>
                   <div className="flex items-center space-x-1 opacity-30">
                      <div className="w-1 h-4 bg-black"></div>
                      <div className="w-[2px] h-4 bg-black"></div>
                      <div className="w-3 h-4 bg-black"></div>
                      <div className="w-[1px] h-4 bg-black"></div>
                      <div className="w-2 h-4 bg-black"></div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
      ) : (
        <DisintegrationEffect 
           x={note.x} 
           y={note.y} 
           rotation={note.rotation} 
           zIndex={note.zIndex} 
           width={dimensions.width}
           height={dimensions.height}
        />
      )}
    </div>
  );
};
