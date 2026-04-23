import { Monitor, Smartphone, Watch, Server, Plus, ShieldCheck, AlertTriangle, Fingerprint, Activity, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";

export default function Devices() {
  const [devices, setDevices] = useState([
    { 
      id: "D-882", 
      name: "Kali-Surface-Go", 
      type: "laptop", 
      os: "Windows 11 SecCore", 
      ip: "10.0.0.12", 
      status: "secure", 
      lastSync: "Just now", 
      icon: Monitor 
    },
    { 
      id: "D-194", 
      name: "Pixel_Crypt_Node", 
      type: "mobile", 
      os: "GrapheneOS", 
      ip: "10.0.0.45", 
      status: "secure", 
      lastSync: "2 mins ago", 
      icon: Smartphone 
    },
    { 
      id: "D-991", 
      name: "Hive-Cluster-Alpha", 
      type: "server", 
      os: "Kali Linux", 
      ip: "192.168.1.100", 
      status: "warning", 
      lastSync: "1 hour ago",
      warningText: "Kernel patch pending", 
      icon: Server 
    },
    { 
      id: "D-004", 
      name: "Biometric_Sync_Band", 
      type: "wearable", 
      os: "FreeRTOS", 
      ip: "Bluetooth LE", 
      status: "secure", 
      lastSync: "15 mins ago", 
      icon: Watch 
    },
  ]);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: "", type: "laptop", os: "", ip: "", hasBiometrics: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.os || !newDevice.ip) return;

    const iconMap: Record<string, any> = {
      laptop: Monitor,
      mobile: Smartphone,
      server: Server,
      wearable: Watch,
    };

    setDevices(prev => [{
      id: `D-${Math.floor(Math.random() * 900) + 100}`,
      name: newDevice.name,
      type: newDevice.type,
      os: newDevice.os,
      ip: newDevice.ip,
      status: "secure",
      lastSync: "Just now",
      icon: iconMap[newDevice.type] || Monitor,
      biometric: newDevice.hasBiometrics
    }, ...prev]);

    setIsEnrollModalOpen(false);
    setNewDevice({ name: "", type: "laptop", os: "", ip: "", hasBiometrics: true });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2332] pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-mono font-bold tracking-widest mb-2 text-[#0DF0E3] uppercase flex items-center gap-3">
            <Monitor className="w-6 h-6 text-[#00FF41]" /> DECENTRALIZED_FLEET
          </h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Hardware Node Enrollment and Management.</p>
        </motion.div>
        <div className="flex items-center gap-3">
           <motion.button 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             className="bg-[#FF0055]/10 border border-[#FF0055]/50 text-[#FF0055] hover:bg-[#FF0055]/20 hover:shadow-[0_0_15px_rgba(255,0,85,0.6)] px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer group"
           >
             <AlertTriangle className="w-4 h-4 group-hover:animate-ping" /> PHOENIX PROTOCOL
           </motion.button>
           <motion.button 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             onClick={() => setIsEnrollModalOpen(true)}
             className="bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
           >
             <Plus className="w-4 h-4" /> ENROLL DEVICE
           </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => {
              const Icon = device.icon;
              const isWarning = device.status === 'warning';
              return (
                <motion.div 
                  key={device.id} 
                  variants={itemVariants}
                  className={`bg-[#050B06] border rounded p-5 relative overflow-hidden group transition-all hover:shadow-lg ${isWarning ? 'border-[#FFB800]/50 hover:shadow-[0_0_20px_rgba(255,184,0,0.15)]' : 'border-[#1A2332] hover:border-[#0DF0E3]/50 hover:shadow-[0_0_20px_rgba(13,240,227,0.1)]'}`}
                >
                  <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#00FF41 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded bg-[#0A0E14] border flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] transition-colors ${isWarning ? 'border-[#FFB800]/50 text-[#FFB800]' : 'border-[#1A2332] text-gray-400 group-hover:border-[#0DF0E3]/50 group-hover:text-[#0DF0E3]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-[12px] text-white uppercase tracking-wider">{device.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">{device.id}</p>
                      </div>
                    </div>
                    {isWarning ? (
                      <Badge variant="outline" className="border-[#FFB800]/50 text-[#FFB800] bg-[#FFB800]/10 text-[9px] uppercase tracking-widest font-mono animate-pulse">
                        <AlertTriangle className="w-3 h-3 mr-1" /> WARN
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-[#00FF41]/50 text-[#00FF41] bg-[#00FF41]/10 text-[9px] uppercase tracking-widest font-mono shadow-[0_0_5px_rgba(0,255,65,0.2)]">
                        <ShieldCheck className="w-3 h-3 mr-1" /> SECURE
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 relative z-10 font-mono text-[11px] mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 uppercase tracking-widest">OS</span>
                      <span className="text-[#0DF0E3] font-bold">{device.os}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 uppercase tracking-widest">IP_ADDR</span>
                      <span className="text-[#0DF0E3]">{device.ip}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 uppercase tracking-widest">LAST_SYNC</span>
                      <span className="text-gray-400">{device.lastSync}</span>
                    </div>
                  </div>

                    <div className="pt-3 border-t border-[#1A2332] relative z-10 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-[#00FF41] uppercase tracking-widest font-mono opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Fingerprint className="w-3 h-3" /> E2E_VERIFIED
                        </span>
                        {isWarning && device.warningText && (
                           <span className="text-[9px] text-[#FFB800] uppercase font-mono tracking-wider">{device.warningText}</span>
                        )}
                      </div>
                      {isWarning && (
                        <div className="flex mt-2">
                           <button className="w-full py-1.5 bg-[#FFB800]/10 hover:bg-[#FFB800]/20 border border-[#FFB800]/30 hover:border-[#FFB800]/60 text-[#FFB800] text-[9px] font-mono font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_10px_rgba(255,184,0,0.1)]">
                             INITIALIZE PATCH
                           </button>
                        </div>
                      )}
                    </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
          <div className="bg-[#050B06] border border-[#1A2332] rounded p-6 shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[2px] mb-4 text-[#0DF0E3] relative z-10 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0DF0E3]" /> FLEET_TELEMETRY
            </h3>
            
            <div className="space-y-4 font-mono relative z-10">
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  <span>Trust Score</span>
                  <span className="text-[#00FF41]">92%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1A2332] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF41] w-[92%] shadow-[0_0_10px_#00FF41]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  <span>Patch Compliance</span>
                  <span className="text-[#FFB800]">75%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1A2332] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFB800] w-[75%] shadow-[0_0_10px_#FFB800]" />
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono leading-relaxed text-gray-400 relative z-10 mt-6 pt-4 border-t border-[#1A2332]">
              All essential nodes are verified. Device <span className="text-[#FFB800]">D-991</span> requires immediate package upgrades to maintain 100% compliance.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {isEnrollModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(0,255,65,0.05)]"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#050B06] border border-[#00FF41]/40 rounded shadow-[0_0_30px_rgba(0,255,65,0.15)] font-mono overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#00FF41]/30 bg-[#0A0E14]">
                <h2 className="text-sm font-bold text-[#0DF0E3] tracking-widest flex items-center gap-2 uppercase">
                  <Plus className="w-4 h-4" /> Node Enrollment
                </h2>
                <button 
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="p-1 hover:bg-[#0DF0E3]/10 rounded transition-colors text-gray-400 hover:text-[#0DF0E3] pointer-events-auto cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleEnroll} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">Device Name</label>
                  <input 
                    required 
                    type="text"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                    placeholder="e.g. Gamma_Node_02"
                    className="w-full bg-[#0A0E14] border border-[#1A2332] focus:border-[#0DF0E3] rounded p-2 text-xs text-[#00FF41] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">Device Type</label>
                  <select 
                    value={newDevice.type}
                    onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                    className="w-full bg-[#0A0E14] border border-[#1A2332] focus:border-[#0DF0E3] rounded p-2 text-xs text-[#00FF41] outline-none transition-colors appearance-none"
                  >
                    <option value="laptop">Laptop / Workstation</option>
                    <option value="server">Server / Cluster</option>
                    <option value="mobile">Mobile / Tablet</option>
                    <option value="wearable">Wearable / IOT</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">Operating System</label>
                  <input 
                    required
                    type="text"
                    value={newDevice.os}
                    onChange={(e) => setNewDevice({...newDevice, os: e.target.value})}
                    placeholder="e.g. Kali Linux, FreeBSD"
                    className="w-full bg-[#0A0E14] border border-[#1A2332] focus:border-[#0DF0E3] rounded p-2 text-xs text-[#00FF41] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">IP / Interface Binding</label>
                  <input 
                    required
                    type="text"
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
                    placeholder="192.168.1.1 or wlan0"
                    className="w-full bg-[#0A0E14] border border-[#1A2332] focus:border-[#0DF0E3] rounded p-2 text-xs text-[#00FF41] outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={newDevice.hasBiometrics}
                        onChange={(e) => setNewDevice({...newDevice, hasBiometrics: e.target.checked})}
                        className="sr-only" 
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${newDevice.hasBiometrics ? 'bg-[#00FF41]/20 border-[#00FF41]' : 'bg-[#0A0E14] border-[#1A2332] group-hover:border-[#0DF0E3]/50'}`}>
                        {newDevice.hasBiometrics && <div className="w-2 h-2 bg-[#00FF41] rounded-sm" />}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-300 uppercase tracking-widest flex items-center gap-2">
                      <Fingerprint className={`w-3.5 h-3.5 ${newDevice.hasBiometrics ? 'text-[#00FF41]' : 'text-gray-500'}`} />
                      Require Biometric Sync
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#1A2332] flex justify-end gap-3 mt-4">
                   <button 
                     type="button"
                     onClick={() => setIsEnrollModalOpen(false)}
                     className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all rounded"
                   >
                     Initialize Node
                   </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
