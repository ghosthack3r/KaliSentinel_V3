import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// --- DATA STRUCTURES ---
type PreviewKey = 'home' | 'draft_v1';

export default function DevLab() {
  const [currentPreview, setCurrentPreview] = useState<PreviewKey>('home');
  const navigate = useNavigate();

  const onExit = () => {
    navigate('/');
  };

  const renderPreviewBox = () => {
    switch (currentPreview) {
      case 'draft_v1':
        return <div className="p-20 text-center text-white font-mono">Your Draft UI Comes Here</div>;
      case 'home':
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#050608]">
            <Zap className="w-16 h-16 mb-4 text-purple-500 opacity-50" />
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest font-mono">Select a Draft</h2>
            <p className="max-w-md text-center text-sm font-mono">Select a variation from the left panel.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full h-[100dvh] bg-black text-white overflow-hidden font-sans">
      {/* LEFT NAVIGATION (15%) */}
      <div className="w-[15%] min-w-[240px] h-full bg-[#0a0c10] border-r border-[#1a1c23] flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <Zap className="w-4 h-4 text-purple-500" />
          <h1 className="text-xs font-bold uppercase tracking-widest font-mono">Dev Lab</h1>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <button 
            onClick={() => setCurrentPreview('draft_v1')}
            className={cn(
              "text-left px-4 py-3 rounded-lg text-sm transition-all font-mono",
              currentPreview === 'draft_v1' ? "bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "text-gray-400 hover:bg-white/5 border border-transparent"
            )}
          >
            Draft Variation
          </button>
        </div>

        <button onClick={onExit} className="mt-auto flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> EXIT LAB
        </button>
      </div>

      {/* RIGHT PREVIEW CANVAS (85%) */}
      <div className="flex-1 relative bg-black flex flex-col">
        {/* Mock Browser Header */}
        <div className="h-[40px] bg-[#1a1c23] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="mx-auto bg-[#0a0c10] text-[#788394] text-[10px] font-mono py-1 px-4 rounded border border-white/5 w-[300px] text-center flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" /> localhost:3000/{currentPreview}
          </div>
        </div>
        
        <div className="flex-1 w-full relative">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentPreview}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               className="h-full w-full"
             >
               {renderPreviewBox()}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
