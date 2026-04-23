import { Shield, Fingerprint, Bell, HardDrive, Wifi, RefreshCw, Palette, Save, Undo } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../contexts/SettingsContext";

const DEFAULT_SECTIONS = [
  {
    title: "Core Defense Engine",
    icon: Shield,
    options: [
      { name: "Predictive Heuristics", description: "Use AI to block zero-day threats", enabled: true },
      { name: "Aggressive Traffic Filtering", description: "Block connections from low-reputation nodes", enabled: true },
      { name: "Deep Mesh Inspection", description: "Analyze encrypted payloads", enabled: false },
    ]
  },
  {
    title: "Biometric Matrix",
    icon: Fingerprint,
    options: [
      { name: "Strict Facial Verification", description: "Require 3D geometry match", enabled: true },
      { name: "Voice Phosphor Print", description: "Analyze vocal micro-tremors", enabled: false },
      { name: "Continuous Authentication", description: "Background validation", enabled: true },
    ]
  },
  {
    title: "Network Telemetry",
    icon: Wifi,
    options: [
      { name: "Share Anonymized Data", description: "Contribute to global hive intelligence", enabled: false },
      { name: "Local Log Retention", description: "Keep logs for 30 days", enabled: true },
      { name: "Terminal Auditing", description: "Log all terminal commands", enabled: true },
    ]
  }
];

export default function Settings() {
  const { theme, setTheme, transitionType, setTransitionType } = useSettings();
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem("hive-engine-settings");
    return saved ? JSON.parse(saved) : DEFAULT_SECTIONS;
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Optionally alert unsaved changes here, but we will just manual save for now.
  }, [sections]);

  const toggleOption = (sectionIdx: number, optionIdx: number) => {
    const newSections = [...sections];
    newSections[sectionIdx].options[optionIdx].enabled = !newSections[sectionIdx].options[optionIdx].enabled;
    setSections(newSections);
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem("hive-engine-settings", JSON.stringify(sections));
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const handleRevert = () => {
    setSections(DEFAULT_SECTIONS);
    setTheme('green');
    setTransitionType('fade');
    localStorage.removeItem("hive-engine-settings");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2332] pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-mono font-bold tracking-widest mb-2 text-[#0DF0E3] uppercase flex items-center gap-3">
            <HardDrive className="w-6 h-6 text-[#00FF41]" /> SYSTEM_CONFIG
          </h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Core parameter adjustments.</p>
        </motion.div>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={section.title} 
            className="bg-[#050B06] border border-[#1A2332] rounded p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
             <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-[#1A2332] pb-4">
              <section.icon className="w-5 h-5 text-[#0DF0E3]" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-[2px] text-[#0DF0E3]">{section.title}</h2>
            </div>

            <div className="space-y-4 relative z-10">
              {section.options.map((opt, optIdx) => (
                <div key={opt.name} className="flex items-center justify-between py-2 group hover:bg-[#00FF41]/5 px-2 rounded -mx-2 transition-colors">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white tracking-wider">{opt.name}</h3>
                    <p className="text-[10px] font-mono text-gray-500 mt-1">{opt.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleOption(idx, optIdx)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${opt.enabled ? 'bg-[#00FF41]' : 'bg-[#1A2332]'} shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] cursor-pointer`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${opt.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Global UI Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#050B06] border border-[#1A2332] rounded p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-[#1A2332] pb-4">
            <Palette className="w-5 h-5 text-[#0DF0E3]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-[2px] text-[#0DF0E3]">UI Customization</h2>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Theme Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-white tracking-wider">Accent Theme</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {(['green', 'blue', 'amber', 'rose'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded text-xs font-mono border transition-all uppercase tracking-wider ${theme === t ? 'bg-[#0DF0E3]/20 border-[#0DF0E3] text-[#0DF0E3] shadow-[0_0_10px_rgba(13,240,227,0.3)]' : 'bg-[#1A2332]/50 border-[#1A2332] text-gray-400 hover:border-gray-500 hover:text-gray-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Transition Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-white tracking-wider">Page Transition</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {(['fade', 'slide', 'scale', 'glitch'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setTransitionType(type)}
                    className={`px-4 py-2 rounded text-xs font-mono border transition-all uppercase tracking-wider ${transitionType === type ? 'bg-[#00FF41]/20 border-[#00FF41] text-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.3)]' : 'bg-[#1A2332]/50 border-[#1A2332] text-gray-400 hover:border-gray-500 hover:text-gray-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Bar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-[90px] md:bottom-12 left-1/2 -translate-x-1/2 z-40 bg-[#050B06]/90 backdrop-blur-md border border-[#1A2332] p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2"
      >
        <button 
          onClick={handleRevert}
          className="bg-transparent hover:bg-destructive/10 text-gray-400 hover:text-destructive px-4 py-2 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
        >
          <Undo className="w-4 h-4" /> REVERT
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/20 px-6 py-2 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${isSaving ? 'animate-pulse opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]'}`}
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'COMMITTING...' : 'SAVE CONFIG'}
        </button>
      </motion.div>
    </div>
  );
}
