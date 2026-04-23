import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface DevTerminalModalProps {
  onClose: () => void;
}

export function DevTerminalModal({ onClose }: DevTerminalModalProps) {
  const [history, setHistory] = useState<string[]>([
    "KALI OS v8.2.1-DEV (tty1)",
    "GhostHack3r authenticated.",
    "Type 'help' for a list of commands."
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, `ghosthack3r@kali:~$ ${trimmed}`]);
    
    const lowerCmd = trimmed.toLowerCase();
    
    if (lowerCmd === "clear") {
      setHistory([]);
    } else if (lowerCmd === "help") {
      setHistory(prev => [...prev, "Available commands:", "  clear  - Clear terminal output", "  exit   - Close dev terminal", "  whoami - Print current user"]);
    } else if (lowerCmd === "exit") {
      setHistory(prev => [...prev, "Logging out..."]);
      setTimeout(onClose, 500);
    } else if (lowerCmd === "whoami") {
      setHistory(prev => [...prev, "ghosthack3r"]);
    } else {
      setHistory(prev => [...prev, `bash: ${trimmed}: command not found`]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-[#050505] border border-[#333] shadow-2xl flex flex-col font-mono text-[13px] overflow-hidden transition-all duration-300 ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[70vh] rounded-lg'}`}
      >
        {/* Terminal Header */}
        <div className="h-8 bg-[#111] flex items-center justify-between px-3 border-b border-[#333] shrink-0">
          <div className="text-gray-400 text-xs tracking-wider">ghosthack3r@kali: ~ (Dev Terminal)</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMaximized(!isMaximized)} className="text-gray-500 hover:text-white transition-colors">
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto text-[#00FF41] bg-transparent custom-scrollbar flex flex-col gap-1">
          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
          <div className="flex items-center mt-1">
            <span className="text-[#00FF41] mr-2">ghosthack3r@kali:~$</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCommand(input);
                  setInput("");
                }
              }}
              className="flex-1 bg-transparent text-[#00FF41] outline-none caret-[#00FF41]"
              autoFocus
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <div ref={endRef} />
        </div>
      </motion.div>
    </div>
  );
}
