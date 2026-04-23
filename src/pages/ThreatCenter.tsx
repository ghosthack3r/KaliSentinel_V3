import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Activity, ArrowRight, CheckCircle2, Search, Globe, ChevronRight, Terminal } from "lucide-react";
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function ThreatCenter() {
  const [intelQuery, setIntelQuery] = useState("");
  const [intelResult, setIntelResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchWebIntel = async () => {
    if (!intelQuery.trim()) return;
    setIsSearching(true);
    setIntelResult("> Initializing secure OSINT link...\n> Connecting to hive...\n");

    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: `Provide the latest threat intelligence or security news regarding: ${intelQuery}. Be concise, analytical, and cite sources if necessary. Output in a terminal-like text format.`,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      let fullText = "";
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          setIntelResult("> Initializing secure OSINT link...\n> Connecting to hive...\n" + fullText);
        }
      }
      if (!fullText) {
        setIntelResult(prev => prev + "> No actionable intel retrieved.");
      }
    } catch (e) {
      console.error(e);
      setIntelResult(prev => prev + "> Error establishing uplink. Check connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const threats = [
    {
      id: 1,
      title: "Suspicious Login Attempt Blocked",
      description: "AI Sentinel blocked an unrecognized login attempt to your Google account from an IP in Russia.",
      severity: "high",
      time: "2 hours ago",
      status: "mitigated",
      source: "CORE_FIREWALL"
    },
    {
      id: 2,
      title: "Phishing Link Detected in SMS",
      description: "Blocked navigation to a known phishing domain disguised as a USPS delivery notification.",
      severity: "medium",
      time: "Yesterday",
      status: "mitigated",
      source: "IDENTITY_DEFENSE"
    },
    {
      id: 3,
      title: "Outdated Browser Extension",
      description: "The extension 'Honey' has known vulnerabilities in your current version. Update recommended.",
      severity: "low",
      time: "2 days ago",
      status: "action_needed",
      source: "ENDPOINT_SCAN"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2332] pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-mono font-bold tracking-widest mb-2 text-[#0DF0E3] uppercase flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#00FF41]" /> THREAT_HUNTER
          </h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">AI-driven analysis of your security events.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 bg-[#00FF41]/10 text-[#00FF41] px-4 py-2 border border-[#00FF41]/30 shadow-[0_0_15px_rgba(0,255,65,0.15)] rounded">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Monitoring Active</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[2px] mb-4 text-[#0DF0E3]">Local Telemetry</h2>
            {threats.map((threat) => (
              <motion.div variants={itemVariants} key={threat.id} className={`p-5 bg-[#050B06] border-l-4 rounded border border-r-[#1A2332] border-t-[#1A2332] border-b-[#1A2332] hover:bg-[#00FF41]/5 transition-colors relative overflow-hidden ${
                threat.severity === 'high' ? 'border-l-[#FF003C] shadow-[inset_4px_0_0_rgba(255,0,60,0.5)]' : 
                threat.severity === 'medium' ? 'border-l-[#FFB800] shadow-[inset_4px_0_0_rgba(255,184,0,0.5)]' : 'border-l-[#0DF0E3] shadow-[inset_4px_0_0_rgba(13,240,227,0.5)]'
              }`}>
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00FF41 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                
                <div className="flex items-start justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <h3 className="font-mono font-bold text-[12px] text-white uppercase tracking-wider">{threat.title}</h3>
                  </div>
                  <Badge variant="outline" className={`text-[9px] font-mono uppercase font-bold tracking-widest rounded-sm ${
                    threat.status === 'mitigated' ? 'border-[#00FF41]/50 text-[#00FF41] bg-[#00FF41]/10 shadow-[0_0_5px_rgba(0,255,65,0.2)]' : 'border-[#FFB800]/50 text-[#FFB800] bg-[#FFB800]/10 shadow-[0_0_5px_rgba(255,184,0,0.2)]'
                  }`}>
                    {threat.status === 'mitigated' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Auto-Mitigated
                      </span>
                    ) : (
                      <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Action Needed</span>
                    )}
                  </Badge>
                </div>
                <p className="text-[11px] font-mono text-gray-400 mb-4 leading-relaxed max-w-2xl relative z-10">{threat.description}</p>
                <div className="flex items-center justify-between border-t border-[#1A2332] pt-3 relative z-10">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500 flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-[#0DF0E3]" /> {threat.time} • {threat.source}
                  </span>
                  {threat.status === 'action_needed' && (
                    <button className="text-[10px] font-mono uppercase tracking-widest text-[#FFB800] hover:text-white flex items-center gap-1 font-bold group transition-colors px-2 py-1 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-sm">
                      Resolve <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[2px] flex items-center gap-2 text-[#0DF0E3]">
              <Globe className="w-4 h-4 text-[#0DF0E3]" /> Global OSINT Intel
            </h2>
            <div className="bg-[#050B06] border border-[#1A2332] rounded p-5 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0DF0E3] to-transparent opacity-20" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4">Query live global threat databases using KALI's ground search link.</p>
              
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    value={intelQuery}
                    onChange={(e) => setIntelQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchWebIntel()}
                    placeholder="Search CVEs, malware families, IPs..." 
                    className="w-full bg-[#000000] border border-[#1A2332] font-mono text-[#00FF41] placeholder:text-gray-600 focus:placeholder:text-transparent text-[11px] px-10 py-2.5 rounded focus:outline-none focus:border-[#0DF0E3] transition-colors"
                  />
                </div>
                <button 
                  onClick={searchWebIntel}
                  disabled={!intelQuery.trim() || isSearching}
                  className="bg-[#00FF41]/10 hover:bg-[#00FF41]/20 border border-[#00FF41]/50 text-[#00FF41] px-5 py-2.5 rounded text-[10px] font-mono font-bold tracking-[0.2em] disabled:opacity-50 transition-colors shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                >
                  {isSearching ? 'LINKING...' : 'EXEC_QUERY'}
                </button>
              </div>

              <AnimatePresence>
                {intelResult && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 bg-[#000000] border-l-2 border-[#00FF41] rounded-sm">
                    <div className="flex items-center gap-2 mb-2 border-b border-[#1A2332] pb-2">
                       <Terminal className="w-3 h-3 text-[#00FF41]" />
                      <span className="text-[9px] font-mono font-bold text-[#00FF41] uppercase tracking-widest">
                        kali_intel_output.log
                      </span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-[11px] font-mono text-[#00FF41] leading-relaxed drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">
                      <p className="whitespace-pre-wrap">{intelResult}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="bg-[#050B06] border border-[#1A2332] rounded p-6 shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[2px] mb-4 text-[#0DF0E3] relative z-10">AI Analysis</h3>
            <p className="text-[11px] font-mono leading-relaxed text-gray-400 relative z-10">
              Your threat profile is currently <strong className="text-[#00FF41] font-bold drop-shadow-[0_0_5px_rgba(0,255,65,0.8)] px-1">LOW_RISK</strong>. 
              Most attacks targeting your devices are automated credential stuffing attempts, perfectly mitigated by the Core Firewall.
            </p>
            <div className="mt-6 pt-6 border-t border-[#1A2332] relative z-10">
              <h4 className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">Threats by Vector (30d)</h4>
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-300">Phishing</span>
                  <span className="text-[#0DF0E3]">12</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-300">Malware</span>
                  <span className="text-[#0DF0E3]">2</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-300">Network Scans</span>
                  <span className="text-[#0DF0E3]">145</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0DF0E3]/5 border border-[#0DF0E3]/30 rounded p-4 shadow-[0_0_15px_rgba(13,240,227,0.1)] relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0DF0E3]/50 to-transparent" />
            <p className="text-[10px] font-mono font-bold text-[#0DF0E3] mb-2 uppercase tracking-widest flex items-center gap-2">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 bg-[#0DF0E3] rounded-full shadow-[0_0_5px_#0DF0E3]" />
              KALI_SUGGESTION
            </p>
            <p className="text-[11px] font-mono text-gray-400 leading-relaxed uppercase">
              Notice: 2 accounts missing TOTP implementation. Enforcing Auth Matrix would increase system integrity by 4%.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
