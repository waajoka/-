import React, { useState, useRef, useEffect } from 'react';
import { Shuffle, Trash2 } from 'lucide-react';
import { TypewriterProps } from '../types';

interface ExtendedTypewriterProps extends TypewriterProps {
    onRandomText?: () => Promise<string>;
}

export const Typewriter: React.FC<ExtendedTypewriterProps> = ({ onPrint, onMagicPrint, onRandomText, isPrinting }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePrint = () => {
    if (!text.trim() || isPrinting) return;
    onPrint(text);
    setText('');
    // Keep focus for continuous typing
    textareaRef.current?.focus();
  };

  const handleRandomClick = async () => {
    if (isPrinting) return;
    
    try {
        // Fetch random text (now instant from service)
        if (onRandomText) {
            const randomText = await onRandomText();
            setText(randomText);
            // Use timeout to ensure state update has processed before focusing/resizing might be needed
            setTimeout(() => {
                 textareaRef.current?.focus();
            }, 0);
        }
    } catch (e) {
        console.error(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  return (
    <div className="relative w-full max-w-md mx-auto z-50 perspective-1000">
      {/* The Machine Body - Compact and Refined */}
      <div 
        className="rounded-[2rem] p-4 pb-6 relative overflow-hidden transition-transform"
        style={{
          background: 'linear-gradient(180deg, #e6453a 0%, #c92a1e 100%)',
          boxShadow: `
            0 20px 40px -10px rgba(0,0,0,0.4),
            0 8px 12px -5px rgba(0,0,0,0.2),
            inset 0 2px 4px rgba(255,255,255,0.3),
            inset 0 -4px 8px rgba(0,0,0,0.2)
          `,
          borderBottom: '6px solid #8f1d15' // Reduced bottom bezel thickness
        }}
      >
        
        {/* Gloss Highlight */}
        <div className="absolute top-3 left-6 right-6 h-20 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-xl pointer-events-none"></div>

        {/* Brand Label - Reduced margin */}
        <div className="flex justify-center mb-4 pt-1 relative z-10">
           <div 
             className="px-4 py-1.5 rounded flex items-center space-x-2"
             style={{
               background: '#2a0805',
               boxShadow: '0 1px 2px rgba(255,255,255,0.1), inset 0 2px 4px rgba(0,0,0,0.5)',
               border: '1px solid #1a0403'
             }}
           >
              <div className="w-1.5 h-1.5 bg-[#ff3b30] rounded-full shadow-[0_0_6px_#ff3b30] animate-pulse"></div>
              <span className="text-[#d1d1d1] text-[10px] font-black tracking-[0.2em] font-sans text-shadow-sm">MEMO•RITE</span>
           </div>
        </div>

        {/* Screen Area (Input) - Compact */}
        <div 
            className="rounded-[1.2rem] p-2 mb-5 relative"
            style={{
                background: '#222',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1)'
            }}
        >
            <div 
                className="rounded-[0.8rem] p-4 min-h-[80px] flex flex-col relative overflow-hidden"
                style={{
                    backgroundColor: '#0a0a0a',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,1)'
                }}
            >
                {/* Scanline effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #ffffff 3px)' }}>
                </div>

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="在此输入内容..."
                    disabled={isPrinting}
                    className="w-full bg-transparent text-[#e0e0e0] font-typewriter text-base placeholder-gray-600 outline-none resize-none z-10 relative leading-relaxed"
                    rows={1}
                    style={{ caretColor: '#D93025' }}
                />
                
                <div className="mt-auto flex justify-end items-center space-x-3 z-10 pt-2">
                    <span className="text-gray-600 text-[9px] font-mono tracking-widest">{text.length}/120</span>
                </div>
            </div>
        </div>

        {/* Controls: Flatter, Less Bulky Buttons */}
        <div className="flex items-center justify-between mt-2 gap-4 px-1">
           
           {/* 1. Random Button */}
           <button 
             onClick={handleRandomClick}
             disabled={isPrinting}
             className="group relative transition-all outline-none select-none"
           >
              {/* Button Body - Reduced height (4.5rem -> 3.5rem) and shadow (10px -> 4px) */}
              <div 
                className="w-[3.5rem] h-[3.5rem] rounded-[1.2rem] flex items-center justify-center transition-all duration-100 group-active:translate-y-[3px] group-active:shadow-[0_1px_0_#1a0404]"
                style={{
                    background: 'linear-gradient(145deg, #4a0f0f, #2e0808)',
                    // Flatter shadow style
                    boxShadow: '0 4px 0 #1a0404, 0 8px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                 <Shuffle size={20} className="text-gray-200 opacity-80 group-hover:opacity-100 drop-shadow-md" />
              </div>
           </button>

           {/* 2. Delete Button */}
           <button 
             onClick={() => setText('')}
             disabled={text.length === 0}
             className="group relative transition-all outline-none select-none"
           >
              <div 
                className={`w-[3.5rem] h-[3.5rem] rounded-[1.2rem] flex items-center justify-center transition-all duration-100 group-active:translate-y-[3px] group-active:shadow-[0_1px_0_#1a0404] ${text.length === 0 ? 'opacity-60 grayscale' : 'opacity-100'}`}
                style={{
                    background: 'linear-gradient(145deg, #4a0f0f, #2e0808)',
                    boxShadow: '0 4px 0 #1a0404, 0 8px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                 <Trash2 size={20} className="text-gray-200 opacity-80 group-hover:opacity-100 drop-shadow-md" />
              </div>
           </button>

           {/* 3. Print Button (Action Key) */}
           <button 
             onClick={handlePrint}
             disabled={isPrinting || text.length === 0}
             className="flex-1 group relative transition-all outline-none select-none"
           >
              <div 
                className={`h-[3.5rem] rounded-[1.2rem] flex items-center justify-center font-black tracking-[0.2em] text-lg transition-all duration-100 group-active:translate-y-[3px]
                  ${text.length > 0 ? 'text-[#b02318]' : 'text-gray-400'}
                `}
                style={{
                    background: text.length > 0 
                        ? 'linear-gradient(180deg, #ffffff 0%, #e6e6e6 100%)' 
                        : 'linear-gradient(180deg, #e0e0e0 0%, #d4d4d4 100%)',
                    // Reduced shadow height
                    boxShadow: isPrinting 
                        ? '0 1px 0 #999' 
                        : (text.length > 0
                            ? '0 4px 0 #999, 0 8px 12px rgba(0,0,0,0.2), inset 0 1px 0 #fff'
                            : '0 4px 0 #888, inset 0 1px 0 rgba(255,255,255,0.5)'),
                    transform: isPrinting ? 'translateY(3px)' : 'translateY(0)',
                }}
              >
                 <span className="drop-shadow-sm">打印</span>
              </div>
           </button>

        </div>
      </div>
      
      {/* Machine Footer Shadow - Reduced */}
      <div className="absolute -bottom-4 left-12 right-12 h-6 bg-black/40 blur-xl rounded-full z-[-1]"></div>
    </div>
  );
};