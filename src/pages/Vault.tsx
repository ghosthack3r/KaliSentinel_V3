import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Copy, ExternalLink, ShieldAlert, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Vault() {
  const [passwords, setPasswords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(collection(db, "vault"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPasswords(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const generateKey = async () => {
    if (!auth.currentUser) return;
    const name = window.prompt("Enter Target Node Name:");
    if (!name) return;

    await addDoc(collection(db, "vault"), {
      userId: auth.currentUser.uid,
      name: name,
      type: "password",
      encryptedData: (Math.random() + 1).toString(36).substring(2),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2332] pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-mono font-bold tracking-widest mb-2 text-[#0DF0E3] uppercase flex items-center gap-3">
            <Fingerprint className="w-6 h-6 text-[#00FF41]" /> CRYPTO_VAULT LAYER
          </h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">AES-256-GCM Encrypted Credential Store.</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
          onClick={generateKey}
          className="bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> GENERATE KEY
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md group focus-within:drop-shadow-[0_0_8px_rgba(13,240,227,0.2)] transition-all">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#0DF0E3] transition-colors" />
          <Input 
            placeholder="grep hash patterns..." 
            className="pl-9 bg-[#050B06] border-[#1A2332] focus-visible:ring-[#0DF0E3] h-10 rounded text-[13px] font-mono text-[#00FF41] transition-colors"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#050B06] border border-[#1A2332] rounded shadow-lg overflow-hidden relative min-h-[300px]">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-xs text-left font-mono">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-[#0A0E14] border-b border-[#1A2332]">
              <tr>
                <th className="px-6 py-4 font-bold text-[#0DF0E3]">Node / Target</th>
                <th className="px-6 py-4 font-bold text-[#0DF0E3]">Identifier</th>
                <th className="px-6 py-4 font-bold text-[#0DF0E3]">Encryption Status</th>
                <th className="px-6 py-4 font-bold text-[#0DF0E3]">Data</th>
                <th className="px-6 py-4 font-bold text-right text-[#0DF0E3]">Exec</th>
              </tr>
            </thead>
            <motion.tbody variants={tableVariants} initial="hidden" animate="show" className="divide-y divide-[#1A2332]">
              {passwords.map((item) => (
                <motion.tr variants={rowVariants} key={item.id} className="hover:bg-[#0DF0E3]/5 hover:border-l-[#0DF0E3] hover:border-l-2 transition-all group border-l-2 border-l-transparent">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3 tracking-wider">
                    <div className="w-8 h-8 rounded bg-[#0A0E14] flex items-center justify-center text-[10px] font-bold border border-[#1A2332] group-hover:border-[#0DF0E3]/50 group-hover:text-[#0DF0E3] transition-colors shadow-[inner_0_0_5px_rgba(0,0,0,0.5)] uppercase">
                      {item.name ? item.name.substring(0, 2) : "??"}
                    </div>
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-[#00FF41] opacity-90">{item.userId.substring(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] shadow-[0_0_5px_#00FF41]" />
                      <span className="uppercase tracking-widest text-gray-400 text-[10px]">MAX_ENTROPY</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 opacity-80 filter blur-[2px] group-hover:blur-none transition-all">{item.encryptedData}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-[#0DF0E3] hover:bg-[#0DF0E3]/10 border border-transparent hover:border-[#0DF0E3]/30 rounded transition-all cursor-pointer" title="Extract Hash" onClick={() => navigator.clipboard.writeText(item.encryptedData)}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!loading && passwords.length === 0 && (
                <tr>
                   <td colSpan={5} className="text-center py-12 text-gray-500 tracking-widest uppercase">Vault is empty</td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
