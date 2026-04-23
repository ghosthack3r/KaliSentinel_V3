import { Progress } from "@/components/ui/progress";
import { KeyRound, Plus, RefreshCw, Fingerprint } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Authenticator() {
  const [progress, setProgress] = useState(100);
  const [tokens, setTokens] = useState<any[]>([]);

  // Simulate TOTP countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          // Trigger a fake code refresh when reaching 0
          setTokens(currentTokens => currentTokens.map(t => ({
            ...t, 
            code: `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}` 
          })));
          return 100;
        }
        return prev - (100 / 30);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(collection(db, "authenticator"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Generate a random visual code for now since we don't have a real TOTP secret generator
        code: `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`
      }));
      setTokens(items);
    });

    return () => unsubscribe();
  }, []);

  const injectSeed = async () => {
    if (!auth.currentUser) return;
    const issuer = window.prompt("Enter Service Node / Issuer:");
    if (!issuer) return;
    const account = window.prompt("Enter Account Identifier:");

    await addDoc(collection(db, "authenticator"), {
      userId: auth.currentUser.uid,
      issuer: issuer,
      account: account || "admin",
      createdAt: serverTimestamp()
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2332] pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-mono font-bold tracking-widest mb-2 text-[#0DF0E3] uppercase flex items-center gap-3">
            <Fingerprint className="w-6 h-6 text-[#00FF41]" /> AUTH_MATRIX
          </h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Encrypted TOTP Key Generation Node.</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
          onClick={injectSeed}
          className="bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> INJECT SEED
        </motion.button>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <motion.div variants={itemVariants} key={token.id} className="bg-[#050B06] border border-[#1A2332] rounded p-6 hover:border-[#0DF0E3]/50 transition-all group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(13,240,227,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#00FF41 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0DF0E3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#0A0E14] border border-[#1A2332] flex items-center justify-center group-hover:border-[#0DF0E3]/50 transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <motion.div 
                    initial={{ rotate: -90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <KeyRound className="w-5 h-5 text-gray-500 group-hover:text-[#0DF0E3] transition-colors" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-[12px] text-white uppercase tracking-wider">{token.issuer}</h3>
                  <p className="text-[10px] text-[#00FF41] font-mono opacity-80">{token.account}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono font-bold tracking-[0.2em] text-[#0DF0E3] drop-shadow-[0_0_5px_rgba(13,240,227,0.3)] group-hover:text-[#00FF41] group-hover:drop-shadow-[0_0_5px_rgba(0,255,65,0.5)] transition-colors">{token.code}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(token.code.replace(' ', ''))}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-[#00FF41] transition-all bg-[#0A0E14] border border-[#1A2332] rounded"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <Progress value={progress} className="h-0.5 bg-[#1A2332] [&>div]:bg-[#00FF41] [&>div]:shadow-[0_0_5px_#00FF41] [&>div]:transition-all [&>div]:duration-1000 [&>div]:ease-linear" />
            </div>
          </motion.div>
        ))}
        {tokens.length === 0 && (
           <div className="col-span-full py-16 text-center text-gray-500 font-mono tracking-widest text-sm uppercase">
             Matrix Empty. Awaiting Seed Injection.
           </div>
        )}
      </motion.div>
    </div>
  );
}
