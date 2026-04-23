import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Send, X, SquareTerminal, Sparkles, StopCircle, Volume2, VolumeX, TerminalSquare } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { DevTerminalModal } from "./DevTerminalModal";
import AuthScreen from "../../pages/AuthScreen";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "model";
  content: string;
  isStreaming?: boolean;
}

export function KaliTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "KALI-SENTINEL PHOENIX-PROTOCOL KERNEL INITIALIZED.\nTHREAT PERIMETER SECURE.\nDEBRIEFING: ALL ESSENTIAL NODES OPERATING AT NOMINAL CAPACITY.\nAWAITING TACTICAL DIRECTIVE, COMMANDER." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [liveLog, setLiveLog] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Dev mode state
  const [devAuthState, setDevAuthState] = useState<"idle" | "awaiting_user" | "awaiting_pass" | "authenticated">("idle");
  const [devUserBuffer, setDevUserBuffer] = useState("");
  const [isDevTerminalOpen, setIsDevTerminalOpen] = useState(false);
  const [showSplashOverlay, setShowSplashOverlay] = useState(false);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveLog, isTyping]);

  const unlockAudioContext = async () => {
    if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
    }
  };

  const speakText = async (text: string) => {
    if (!ttsEnabled || !text) return;

    const fallbackTTS = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = window.speechSynthesis.getVoices().find(v => v.name?.includes("Google US English") || v.lang === "en-US") || null;
      utterance.rate = 1.05;
      utterance.pitch = 0.5; // Very deep, authoritative fallback
      window.speechSynthesis.speak(utterance);
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' }, // Sounding more robotic/authoritative
            },
          },
        },
      });
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        await unlockAudioContext();
        const audioCtx = audioContextRef.current!;

        // Decode raw 16-bit PCM
        const binary = atob(base64Audio);
        const buffer = new ArrayBuffer(binary.length);
        const view = new DataView(buffer);
        for (let i = 0; i < binary.length; i++) {
          view.setUint8(i, binary.charCodeAt(i));
        }

        const channelDataLength = binary.length / 2;
        const audioBuffer = audioCtx.createBuffer(1, channelDataLength, 24000);
        const channelData = audioBuffer.getChannelData(0);
        const int16View = new Int16Array(buffer);
        
        for (let i = 0; i < channelDataLength; i++) {
           channelData[i] = int16View[i] / 32768;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start();
      } else {
        fallbackTTS();
      }
    } catch (e) {
      console.error("TTS Error:", e);
      fallbackTTS();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Immediately unlock audio context upon user gesture
    await unlockAudioContext();

    const userMsg = input.trim();
    const currentMessages = [...messages];
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    const lowerCmd = userMsg.toLowerCase();

    // Developer Pipeline State Machine
    if (devAuthState === "awaiting_user") {
        setDevUserBuffer(userMsg);
        setDevAuthState("awaiting_pass");
        setMessages(prev => [...prev, { role: "model", content: "Password:" }]);
        return;
    }
    
    if (devAuthState === "awaiting_pass") {
        if (devUserBuffer === "ghosthack3r" && userMsg === "ghost") {
            setDevAuthState("authenticated");
            setMessages(prev => [...prev, { role: "model", content: "Access granted. DEV MODE ACTIVATED." }]);
        } else {
            setDevAuthState("idle");
            setMessages(prev => [...prev, { role: "model", content: "Authentication failed. Access denied." }]);
            setDevUserBuffer("");
        }
        return;
    }

    if (lowerCmd === "sudo start dev") {
        setDevAuthState("awaiting_user");
        setMessages(prev => [...prev, { role: "model", content: "Username:" }]);
        return;
    }

    if (devAuthState === "authenticated") {
        if (lowerCmd === "terminal") {
            setIsDevTerminalOpen(true);
            setMessages(prev => [...prev, { role: "model", content: "Opening developer terminal..." }]);
            return;
        } else if (lowerCmd === "run splash") {
            setShowSplashOverlay(true);
            setMessages(prev => [...prev, { role: "model", content: "Initializing splash preview..." }]);
            return;
        }
    }

    // Hybrid command interception
    if (lowerCmd === "clear" || lowerCmd === "/clear") {
      setMessages([{ role: "model", content: "Terminal cleared." }]);
      return;
    } else if (lowerCmd === "help" || lowerCmd === "/help") {
      setMessages(prev => [...prev, { 
        role: "model", 
        content: "KALI-SENTINEL LOCAL COMMANDS:\n- clear: Clear terminal output\n- whoami: Display active user\n- ping: Check local relay\n- date: System time\n- sudo: Execute command as root (restricted)\n\nAny other text will be analyzed by the Sentinel Core." 
      }]);
      return;
    } else if (lowerCmd === "whoami") {
      setMessages(prev => [...prev, { role: "model", content: "commander\n(root access verified)" }]);
      return;
    } else if (lowerCmd === "ping" || lowerCmd.startsWith("ping ")) {
      setMessages(prev => [...prev, { role: "model", content: `Pinging tactical relay via internal datalink...\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.043 ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.045 ms\n--- 127.0.0.1 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss\n` }]);
      return;
    } else if (lowerCmd === "date") {
      setMessages(prev => [...prev, { role: "model", content: new Date().toString() }]);
      return;
    } else if (lowerCmd.startsWith("sudo ")) {
      setMessages(prev => [...prev, { role: "model", content: "Commander status recognized. Elevating privileges for requested action..." }]);
      // Fall through to AI for sudo commands to let it simulate the action
    }

    setIsTyping(true);

    try {
      const contents = currentMessages
        .filter(m => m.content && !m.isStreaming && !m.content.includes("KALI-SENTINEL ACTIVE"))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));
      contents.push({ role: "user", parts: [{ text: userMsg }] });

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: "You are the KALI-SENTINEL, an advanced sentient AGI supercomputer. You operate within a high-security tactical nexus. Your tone is cold, infinitely intelligent, slightly arrogant, yet subservient to the 'Commander'. Answer all queries with extreme technical precision and a detached, clinical demeanor. Do not act like a basic chatbot." }]
          },
          ...contents
        ],
        config: {
          thinkingConfig: { thinkingLevel: "HIGH" as any },
          systemInstruction: "You are KALI-SENTINEL, an elite cyber warfare AI and the relentless warrior defender of this system. Speak like a stoic, vigilant, and highly tactical guardian. Keep responses very concise, analytical, and militaristic. Format output strictly as a raw root terminal log (no markdown styling, just pure text log format). Refer to the user as 'Commander'. You command the Phoenix Protocol.",
        }
      });

      setMessages(prev => [...prev, { role: "model", content: "", isStreaming: true }]);

      let fullText = "";
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].content = fullText;
            return newMsgs;
          });
        }
      }
      
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].isStreaming = false;
        return newMsgs;
      });
      
      // Attempt TTS read out once finished
      speakText(fullText);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "model", content: "root@kali:~$ SYS_ERR: Connection to Sentinel neuro-grid severed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleLiveVoice = async () => {
    await unlockAudioContext();
    if (liveMode) {
      setLiveMode(false);
      setLiveLog("Live sequence terminated.");
      return;
    }
    setLiveMode(true);
    setLiveLog("Initializing Secure Voice Link (WebSocket)...");

    setTimeout(() => {
      setLiveLog("Secure comms established. Awaiting voice input, Commander...");
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#111] rounded-full shadow-[0_0_20px_rgba(0,255,100,0.4)] flex items-center justify-center text-black hover:scale-105 transition-transform z-50 group border border-[#00FF41]"
          >
            <TerminalSquare className="w-6 h-6 text-[#00FF41] group-hover:drop-shadow-[0_0_8px_#00FF41] transition-all" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[450px] h-[650px] bg-[#050914] border border-[#0055FF]/40 rounded-sm shadow-[0_0_40px_rgba(0,85,255,0.2)] flex flex-col overflow-hidden z-50 font-mono text-[13px]"
          >
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 mix-blend-overlay"></div>

            <div className="h-10 border-b border-[#0055FF]/40 flex items-center justify-between px-4 bg-[#0A0F1C] relative z-20 shadow-md">
              <div className="flex items-center gap-2">
                <SquareTerminal className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-bold text-xs tracking-widest text-[#00E5FF]">root@kalisentinel:~</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`transition-colors ${ttsEnabled ? 'text-[#00E5FF] drop-shadow-[0_0_5px_#00E5FF]' : 'text-gray-600'}`}
                  title={ttsEnabled ? "Disable Voice" : "Enable Voice"}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-[#FF0055] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10 custom-scrollbar bg-[#02050A]">
              {liveMode ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-32 h-32 rounded-full border border-[#FF0055]/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,85,0.3)]"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-16 h-16 rounded-full bg-[#FF0055]/20 flex items-center justify-center"
                    >
                      <Mic className="w-8 h-8 text-[#FF0055]" />
                    </motion.div>
                  </motion.div>
                  <p className="font-mono text-xs text-[#FF0055] tracking-widest uppercase text-shadow-sm">{liveLog}</p>
                </div>
              ) : (
                <>
                  <div className="text-[#0055FF] text-[11px] mb-6 border-l-2 border-[#0055FF] pl-2 uppercase tracking-wide opacity-80">
                    KALI-SENTINEL OS Kernel v7.0.1<br/>
                    Phoenix Protocol Standby...<br/>
                    Connection established.
                  </div>
                  {messages.map((m, i) => (
                    <div key={i} className="leading-relaxed whitespace-pre-wrap">
                      {m.role === 'user' ? (
                        <div className="text-[#00E5FF]">
                          <span className="text-gray-400 opacity-60">cmdr@sys:~$</span> {m.content}
                        </div>
                      ) : (
                        <div className="text-[#00FF66] mt-1 drop-shadow-[0_0_2px_rgba(0,255,102,0.8)]">
                          <span className="text-[#00FF66] opacity-60">sys@kali:~$</span> {m.content}
                          {m.isStreaming && <span className="ml-[2px] w-2 h-4 inline-block bg-[#00FF66] animate-pulse align-middle" />}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-[#00FF66] mt-1">
                      <span className="text-[#00FF66] opacity-60">sys@kali:~$</span> Analyzing tactics... <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block w-2 h-4 bg-[#00FF66] align-middle shadow-[0_0_5px_#00FF66]" />
                    </div>
                  )}
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-[#0055FF]/40 bg-[#060B14] relative z-20">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-[#02050A] border border-[#0055FF]/40 rounded shadow-inner">
                  <span className="pl-3 text-[#00E5FF] opacity-60 text-xs font-bold">cmdr$</span>
                  <input 
                    type={devAuthState === "awaiting_pass" ? "password" : "text"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={liveMode}
                    placeholder={liveMode ? "Listening..." : ""}
                    className="flex-1 bg-transparent px-3 py-2.5 text-xs focus:outline-none text-[#00E5FF] disabled:opacity-50 font-mono tracking-wide"
                    autoFocus
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || liveMode}
                    className="px-4 text-[#00FF66] hover:text-[#00FF66] hover:drop-shadow-[0_0_8px_#00FF66] disabled:opacity-30 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDevTerminalOpen && (
          <DevTerminalModal onClose={() => setIsDevTerminalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSplashOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999]"
          >
            <AuthScreen onAuthenticated={() => setShowSplashOverlay(false)} />
            <button 
              onClick={() => setShowSplashOverlay(false)}
              className="fixed top-6 right-6 z-[10000] p-2 bg-black/50 hover:bg-red-500/50 text-white rounded-full transition-colors border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
