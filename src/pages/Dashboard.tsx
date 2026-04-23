import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Smartphone, Globe, Lock, Cpu, Terminal, Maximize2, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

function AnimatedCount({ value, duration = 2 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function Dashboard() {
  const [logs, setLogs] = useState([
    { id: 1, time: "Just now", action: "> [FIREWALL] block in on eth0: TCP 192.168.0.45:443 -> 10.0.0.8:22 [DROPPED]", type: "network" },
    { id: 2, time: "2 mins ago", action: "> [HEIMDAL] evaluating heuristic signature for /tmp/kdevtmpfsi ... [CLEAN]", type: "sys" },
    { id: 3, time: "15 mins ago", action: "> [SSH] accepted publickey for root from 10.0.0.2 port 54316 ssh2", type: "auth" },
  ]);

  const [chartData, setChartData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ time: i, value: 10 + Math.random() * 20 }))
  );
  
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTacticsOpen, setIsTacticsOpen] = useState(false);

  const [systemIntegrity, setSystemIntegrity] = useState(98);

  const [newsTicker, setNewsTicker] = useState([
    "APT29 identified probing financial sector perimeter defenses.",
    "Zero-day advisory for OpenSSL 3.x circulated on darknet.",
    "Ransomware gang 'ALPHV' leaks gigabytes of international telecom data.",
    "Botnet 'Mirai-X' activity spiking globally across IoT devices.",
    "Interpol coordinating takedown of rogue bulletproof hosting providers."
  ]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsTicker.length);
    }, 8000);
    return () => clearInterval(newsInterval);
  }, [newsTicker]);

  useEffect(() => {
    const mockEvents = [
      { action: "> [IDS] detected CVE-2021-44228 exploit attempt from 45.33.x.x ... [DROPPED]", type: "network" },
      { action: "> [AUTH] failed password for invalid user admin from 118.25.x.x port 3491", type: "auth" },
      { action: "> [DNS] intercepting malicious DNS request for c2-domain.xyz ... [PURGED]", type: "privacy" },
      { action: "> [SYS] kernel audit: zero-day sandbox environment initialized on PID 4410", type: "scan" },
      { action: "> [NET] anomalous traffic volume detected on port 6379, rate limiting applied", type: "active" },
      { action: "> [KALI] compiling threat intel from advanced persistent threat DB ... [SYNCHED]", type: "system" }
    ];

    const eventInterval = setInterval(() => {
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      setLogs((prev) => [
        { id: Date.now(), time: "Just now", action: randomEvent.action, type: randomEvent.type },
        ...prev.map(l => ({ ...l, time: l.time === "Just now" ? "1 min ago" : l.time })).slice(0, 50)
      ]);
    }, 4500);

    const chartInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          // Assuming CPU value provides a nice visual bump
          setChartData(prev => [
            ...prev.slice(1).map((point, index) => ({ ...point, time: index })),
            { time: 19, value: data.cpu }
          ]);
          setSystemIntegrity(Math.max(10, Math.floor(100 - (data.cpu / 2) - (data.memoryUsage / 3))));
        }
      } catch (e) {
        setChartData(prev => [
          ...prev.slice(1).map((point, index) => ({ ...point, time: index })),
          { time: 19, value: 5 } // Fallback to flatline if no connection
        ]);
      }
    }, 1500);

    return () => {
      clearInterval(eventInterval);
      clearInterval(chartInterval);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col gap-3 pb-2 overflow-hidden">
      {/* Quick Tactics (Collapsible) */}
      <div className="shrink-0 bg-[#050B06] border border-[#0055FF]/30 rounded shadow-[0_0_15px_rgba(0,85,255,0.05)] overflow-hidden">
        <button 
          onClick={() => setIsTacticsOpen(!isTacticsOpen)}
          className="w-full p-3 flex items-center justify-between hover:bg-[#0055FF]/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[2px] text-[#00E5FF]">
            <Cpu className="w-4 h-4" /> QUICK TACTICS
          </div>
          <div className="text-[#00E5FF]">
            {isTacticsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        <AnimatePresence>
          {isTacticsOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-4 origin-top"
            >
              <div className="flex gap-3 font-mono text-[11px] uppercase tracking-widest text-[#00E5FF] overflow-x-auto custom-scrollbar pt-2">
                <button className="flex-1 whitespace-nowrap min-w-fit items-center justify-center py-2 px-4 bg-[#0A0F1C] border border-[#0055FF]/40 rounded hover:bg-[#00E5FF]/10 hover:border-[#00E5FF] transition-all cursor-pointer group flex gap-3">
                  <span>Run Deep Scan</span>
                  <motion.div className="w-2 h-2 rounded-full bg-[#00E5FF] group-hover:scale-150 transition-transform" />
                </button>
                <button className="flex-1 whitespace-nowrap min-w-fit items-center justify-center py-2 px-4 bg-[#0A0F1C] border border-[#0055FF]/40 rounded hover:bg-[#00E5FF]/10 hover:border-[#00E5FF] transition-all cursor-pointer group flex gap-3">
                  <span>Isolate Network</span>
                  <motion.div className="w-2 h-2 rounded-full bg-[#FF0055] group-hover:scale-150 transition-transform" />
                </button>
                <button className="flex-1 whitespace-nowrap min-w-fit items-center justify-center py-2 px-4 bg-[#0A0F1C] border border-[#0055FF]/40 rounded hover:bg-[#00E5FF]/10 hover:border-[#00E5FF] transition-all cursor-pointer group flex gap-3">
                  <span>Audit Logs</span>
                  <motion.div className="w-2 h-2 rounded-full bg-[#FFB800] group-hover:scale-150 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero / Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 shrink-0">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="bg-[#050B06] border border-[#00FF41]/30 rounded-lg p-4 py-8 md:p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_20px_rgba(0,255,65,0.05)]"
        >
          {/* Hacker grid background */}
          <div className="absolute inset-0 opacity-[0.03] transition-opacity duration-1000 group-hover:opacity-10" style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative w-[140px] h-[140px] flex justify-center items-center mb-2">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="64" fill="transparent" stroke="#1F2229" strokeWidth="6" />
              <motion.circle 
                cx="70" cy="70" r="64" fill="transparent" stroke="#00FF41" strokeWidth="6"
                strokeDasharray={2 * Math.PI * 64}
                initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 64) * (1 - 0.98) }}
                transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0px 0px 10px rgba(0,255,65, 0.8))' }}
              />
            </svg>
            <div className="w-[105px] h-[105px] rounded-full bg-[#000000] border border-[#00FF41]/40 flex flex-col items-center justify-center relative z-10 shadow-[inset_0_0_20px_rgba(0,255,65,0.2)]">
              <span className="text-4xl font-mono font-bold leading-none text-[#00FF41] text-shadow-md">
                <AnimatedCount value={systemIntegrity} duration={1} />
              </span>
              <span className="text-[8px] text-[#00FF41]/70 uppercase font-mono tracking-widest mt-1 relative flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_8px_#00FF41]" />
                SYS_INTEGRITY
              </span>
            </div>
            {/* Subtle rotating inner accents */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute w-[120px] h-[120px] rounded-full border-2 border-transparent border-t-[#0DF0E3]/40 border-b-[#00FF41]/40 mix-blend-screen pointer-events-none"
            />
          </div>

          <h2 className="text-sm font-mono font-semibold mb-2 relative z-10 flex items-center gap-2 text-[#0DF0E3]">
            <Cpu className="w-4 h-4" /> KERNEL PROTECTION ACTIVE
          </h2>
          <p className="text-[12px] font-mono text-gray-400 text-center max-w-sm relative z-10">
            SYSTEM ROOT IS SECURE. I/O TRAFFIC FILTERING NOMINAL. 
            AI CORE INTERCEPTED <span className="text-[#00FF41]"><AnimatedCount value={3} duration={1}/></span> ATTACKS IN LAST 24H.
          </p>
        </motion.div>

        <div className="grid grid-rows-2 gap-4">
          <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
             className="bg-[#050B06] border border-[#00FF41]/20 rounded-lg p-5 flex flex-col justify-between hover:border-[#00FF41]/50 transition-all shadow-md relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between z-10">
              <div>
                <h3 className="text-xs font-mono font-semibold mb-1 text-[#0DF0E3] uppercase tracking-wider">Net_Traffic</h3>
                <p className="text-2xl font-mono font-bold text-[#00FF41]">ENCRYPTED</p>
              </div>
              <div className="text-right font-mono">
                <p className="text-[10px] text-gray-500 uppercase">Packets Filtered</p>
                <p className="text-xs text-[#00FF41]"><AnimatedCount value={14209} duration={2.5} /></p>
              </div>
            </div>
            {/* Hacker Live Graph */}
            <div className="absolute inset-x-0 bottom-0 top-1/3 opacity-40 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF41" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="step" dataKey="value" stroke="#00FF41" strokeWidth={1} fillOpacity={1} fill="url(#colorGreen)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
             className="bg-[#050B06] border border-[#FFB800]/20 rounded-lg p-5 flex items-center justify-between hover:border-[#FFB800]/50 transition-all shadow-md relative overflow-hidden"
          >
            <div>
              <h3 className="text-xs font-mono font-semibold mb-1 text-[#FFB800] uppercase tracking-wider">Vault_Status</h3>
              <p className="text-2xl font-mono font-bold text-[#FFB800]"><AnimatedCount value={88} duration={1.5} />%</p>
            </div>
            <div className="text-right flex flex-col gap-1 items-end font-mono">
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-[#FFB800]/50 text-[#FFB800] bg-[#FFB800]/10 rounded shadow-[0_0_5px_rgba(255,184,0,0.3)] animate-pulse">Audit Req</span>
              <p className="text-[11px] text-gray-400">Keys: <AnimatedCount value={248} /></p>
              <p className="text-[11px] text-gray-400">OTP: <AnimatedCount value={12} /></p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modules Overview */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="shrink-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div variants={itemVariants} className="bg-[#0A0E14] border border-[#1A2332] p-4 rounded group shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#050B06] hover:border-[#0DF0E3]/40">
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-5 h-5 text-[#0DF0E3] group-hover:drop-shadow-[0_0_5px_#0DF0E3]" />
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#0DF0E3]">Active (Global)</span>
            </div>
            <h3 className="text-[13px] font-mono text-white mb-1">Defense_Net</h3>
            <p className="text-[10px] text-gray-500 font-mono">BGP Hijacking / DDoS Monitored</p>
            <div className="h-0.5 w-full bg-[#1A2332] mt-4 relative overflow-hidden">
              <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-[#0DF0E3]" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#0A0E14] border border-[#1A2332] p-4 rounded group shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#050B06] hover:border-[#00FF41]/40">
            <div className="flex items-center justify-between mb-4">
              <Lock className="w-5 h-5 text-[#0DF0E3] group-hover:drop-shadow-[0_0_5px_#00FF41]" />
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#00FF41]">Locked</span>
            </div>
            <h3 className="text-[13px] font-mono text-white mb-1">Crypto_Vault</h3>
            <p className="text-[10px] text-gray-500 font-mono">AES-256-GCM / 2FA</p>
            <div className="h-0.5 w-full bg-[#00FF41] mt-4 shadow-[0_0_5px_#00FF41]"></div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#0A0E14] border border-[#1A2332] p-4 rounded group shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#1A0A1A] hover:border-[#B000FF]/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <Smartphone className="w-5 h-5 text-[#B000FF] group-hover:drop-shadow-[0_0_5px_#B000FF]" />
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#B000FF]">Sync: 3</span>
            </div>
            <h3 className="text-[13px] font-mono text-white mb-1 relative z-10">Hardware Keys</h3>
            <p className="text-[10px] text-gray-500 font-mono relative z-10">NFC / BT / USB Tokens</p>
            <div className="h-0.5 w-full bg-[#B000FF] mt-4 relative z-10 shadow-[0_0_5px_#B000FF]"></div>
          </motion.div>

          {/* Alarm Card */}
          <motion.div variants={itemVariants} className="bg-[#0A0E14] border border-[#FF0055]/30 p-4 rounded group shadow-[0_0_20px_rgba(255,0,85,0.15)] transition-all hover:bg-[#1A050A] hover:border-[#FF0055]/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#FF0055]/5 animate-pulse mix-blend-overlay"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <AlertTriangle className="w-5 h-5 text-[#FF0055] animate-bounce" />
              <div className="relative">
                 <span className="absolute inset-0 bg-[#FF0055] animate-ping opacity-50 rounded"></span>
                 <span className="text-[9px] uppercase font-mono tracking-widest text-[#FF0055] bg-[#FF0055]/10 border border-[#FF0055]/50 px-1.5 py-0.5 relative shadow-[0_0_8px_rgba(255,0,85,0.5)]">Code Red</span>
              </div>
            </div>
            <h3 className="text-[13px] font-mono text-white mb-1 relative z-10">Iden_Risk</h3>
            <p className="text-[10px] text-gray-500 font-mono relative z-10">1 Breach Pending</p>
            <div className="h-0.5 w-full bg-[#FF0055] mt-4 relative z-10 shadow-[0_0_10px_#FF0055]"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Cyber News Feed */ }
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#070A11] border-y border-[#0DF0E3]/20 py-2 px-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] shrink-0 flex items-center overflow-hidden">
         <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-[#0DF0E3] shrink-0 mr-4 border-r border-[#0DF0E3]/30 pr-4">INTEL_FEED ::</span>
         <AnimatePresence mode="wait">
            <motion.p 
              key={currentNewsIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-[11px] font-mono uppercase tracking-widest text-gray-400 truncate"
            >
               {newsTicker[currentNewsIndex]}
            </motion.p>
         </AnimatePresence>
      </motion.div>

      {/* Live AI Activity - Hacker Terminal Style */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex-1 min-h-0 flex flex-col relative shrink">
        <div className="flex items-center justify-between mb-2 border-b border-[#1A2332] pb-2 shrink-0">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest px-2 py-1 bg-[#1A2332] text-white inline-flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00FF41]" />
              phoenix_event_log.sh
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsLogModalOpen(true)}
                className="px-2 py-1 bg-[#1A2332] hover:bg-[#00FF41]/20 border border-transparent hover:border-[#00FF41]/40 transition-colors text-white text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5 rounded-sm cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" /> View Log
              </button>
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#00FF41] border border-[#00FF41]/30 px-2 py-0.5 bg-[#00FF41]/5">
                TAILING LOGS
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-3 bg-[#00FF41]" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-[#050914] border-l-4 border-[#00FF41] rounded shadow-lg overflow-hidden font-mono text-xs flex-1 relative pointer-events-none"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'}}
          >
            <div className="p-2 md:p-4 space-y-1">
              <AnimatePresence initial={false}>
                {logs.slice(0, 6).map((log, index) => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, x: -10, y: -10, height: 0 }}
                    animate={{ opacity: Math.max(0.15, 1 - (index * 0.12)), x: 0, y: 0, height: "auto" }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 py-0.5"
                  >
                    <span className="w-24 shrink-0 text-[#0DF0E3] opacity-60">[{log.time}]</span>
                    <span className={`flex-1 ${log.action?.includes('DROPPED') || log.action?.includes('PURGED') ? 'text-[#FFB800]' : log.action?.includes('CLEAN') ? 'text-[#0DF0E3]' : 'text-[#00FF41]'}`}>
                      {log.action}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      {/* Full Log Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(0,255,65,0.05)]"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl h-[80vh] flex flex-col bg-[#050B06] border border-[#00FF41]/40 rounded shadow-[0_0_30px_rgba(0,255,65,0.15)] font-mono overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#00FF41]/30 bg-[#0A0E14]">
                <h2 className="text-sm font-bold text-[#0DF0E3] tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> KALI_FULL_SYS_LOG.LOG
                </h2>
                <button 
                  onClick={() => setIsLogModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-[#00FF41] pointer-events-auto cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar text-xs space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 hover:bg-[#1A2332]/50 py-1 cursor-crosshair">
                    <span className="w-24 shrink-0 text-[#0DF0E3] opacity-60">[{log.time}]</span>
                    <span className={`flex-1 ${log.action?.includes('DROPPED') || log.action?.includes('PURGED') ? 'text-[#FFB800]' : log.action?.includes('CLEAN') ? 'text-[#0DF0E3]' : 'text-[#00FF41]'}`}>
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
