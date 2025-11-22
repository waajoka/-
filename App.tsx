
import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Typewriter } from './components/Typewriter';
import { Card } from './components/Card';
import { Note } from './types';
import { polishText, generateRandomThought } from './services/geminiService';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [topZIndex, setTopZIndex] = useState(10);

  const createNote = useCallback((text: string) => {
    setIsPrinting(true);

    // Delay creation slightly to simulate "processing"
    setTimeout(() => {
      const newNote: Note = {
        id: uuidv4(),
        text,
        date: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
        // Increased random range for X to create staggered look
        x: (Math.random() * 60) - 30, 
        // Slight vertical variation to feel more organic
        y: -160 + (Math.random() * 30 - 15), 
        // Increased rotation range for messy desk feel
        rotation: (Math.random() * 12) - 6, 
        zIndex: topZIndex + 1,
      };

      setTopZIndex(prev => prev + 1);
      setNotes(prev => [...prev, newNote]);
      setIsPrinting(false);
    }, 300);
  }, [topZIndex]);

  const handlePrint = (text: string) => {
    createNote(text);
  };

  const handleMagicPrint = async (text: string) => {
    setIsPrinting(true);
    const polished = await polishText(text);
    setIsPrinting(false);
    createNote(polished);
  };

  const handleGetRandom = async (): Promise<string> => {
     return await generateRandomThought();
  };

  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleFocus = (id: string) => {
    setTopZIndex(prev => prev + 1);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, zIndex: topZIndex + 1 } : n));
  };

  // 关键：当拖拽结束时更新状态，这样删除动画会在正确的位置发生
  const handleDragEnd = (id: string, x: number, y: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] flex flex-col items-center justify-end pb-6 relative overflow-hidden">
      
      {/* Header / Instructions */}
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-0 px-6">
        <h1 className="text-gray-400 font-bold tracking-[0.3em] text-xs uppercase mb-2">MEMO RITE</h1>
        <p className="text-gray-400 text-[11px] tracking-widest font-sans">为数字梦想家设计</p>
      </div>

      {/* Desk Area (Where cards live) */}
      {/* 修改：将 bottom 从 300px 提升到 380px，给下方机器留出更多不重叠的空间 */}
      <div className="absolute inset-0 bottom-[380px] flex items-end justify-center pointer-events-none">
        <div className="relative w-full max-w-md h-full pointer-events-auto">
           <AnimatePresence>
            {notes.map(note => (
              <div key={note.id} className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <Card 
                    note={note} 
                    onDelete={handleDelete} 
                    onFocus={handleFocus}
                    onDragEnd={handleDragEnd} 
                  />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* The Machine */}
      <div className="w-full px-4 z-50 mb-safe">
        <Typewriter 
          onPrint={handlePrint} 
          onMagicPrint={handleMagicPrint}
          onRandomText={handleGetRandom}
          isPrinting={isPrinting}
        />
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-safe-bottom w-full"></div>
    </div>
  );
};

export default App;
