import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScanFace, Mic, Fingerprint, ShieldCheck, Power, AlertTriangle, Cloud } from "lucide-react";
import { auth } from "../firebase"; // we'll need to create this file
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [step, setStep] = useState<"boot" | "awaiting_user" | "authenticating" | "auth_failed" | "success">("boot");
  const [failMessage, setFailMessage] = useState("");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const bootLogsContainerRef = useRef<HTMLDivElement>(null);

  const initialLogs = [
    "INIT: Phoenix Protocol Kernel v7.0.1-secure",
    "Mounting /dev/root (ext4) readonly...",
    "VFS: Mounted root filesystem.",
    "Loading security modules: AppArmor, SECCOMP, SELinux...",
    "Starting system logger... [OK]",
    "Initializing Neural Threat Inference Engine... [OK]",
    "Checking filesystems... /dev/nvme0n1p2: clean.",
    "Loading kernel driver: xhci_hcd, nvme, tcp_bbr...",
    "Bridging to secure cloud relay [wss://api.phoenix.net]... Connected.",
    "Synchronizing threat intelligence database... 1,024,892 signatures loaded.",
    "Starting KALI-SENTINEL Guardian Process... [ACTIVE]",
    "Encrypting volatile memory sectors... Done.",
    "SYS_OK: Phoenix Protocol Armed. All modules loaded.",
    "Awaiting Core Commander Biometric Authentication..."
  ];

  useEffect(() => {
    if (step === "boot") {
      let index = 0;
      const interval = setInterval(() => {
        setBootLogs((prev) => [...prev, initialLogs[index]]);
        index++;
        
        if (bootLogsContainerRef.current) {
            bootLogsContainerRef.current.scrollTop = bootLogsContainerRef.current.scrollHeight;
        }

        if (index >= initialLogs.length) {
          clearInterval(interval);
          setTimeout(() => setStep("awaiting_user"), 1000);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleHardcoreAuth = async () => {
    setStep("authenticating");
    try {
      // 1. Hardware WebAuthn Layer (Passkey / Windows Hello / Touch ID)
      if (window.PublicKeyCredential) {
        const challenge = new Uint8Array(32);
        crypto.getRandomValues(challenge);
        const userId = new Uint8Array(16);
        crypto.getRandomValues(userId);

        await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "Kali Sentinel Core", id: window.location.hostname },
            user: {
              id: userId,
              name: "admin@kalisentinel.local",
              displayName: "Kali Administrator"
            },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }],
            authenticatorSelection: { userVerification: "preferred" },
            timeout: 60000
          }
        });
      } else {
        throw new Error("WebAuthn API not supported in this environment");
      }

      await proceedToCloudAuth();
    } catch (e: any) {
      console.error("Hardware Auth Failed", e);
      let errMsg = e.message || "Hardware token rejected. Secure enclave isolated.";
      // Friendly message for iframe constraint
      if (errMsg.includes("NotAllowedError") || errMsg.includes("cross-origin")) {
        errMsg = "BIOMETRIC BLOCKED IN SANDBOX (IFRAME). OPEN IN NEW TAB OR USE OVERRIDE.";
      }
      setFailMessage(errMsg);
      setStep("auth_failed");
    }
  };

  const proceedToCloudAuth = async () => {
    setStep("authenticating");
    try {
      // 2. Cloud Identity Layer (Firebase Auth)
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      setStep("success");
      setTimeout(() => onAuthenticated(), 2000);
    } catch (e: any) {
      console.error("Cloud Auth Failed", e);
      setFailMessage(e.message || "Cloud identity rejected.");
      setStep("auth_failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000] z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.03)_0%,transparent_70%)]" />

      {step === "boot" && (
        <div className="absolute inset-0 p-8 pt-12 md:p-16">
          <div ref={bootLogsContainerRef} className="h-full w-full max-w-4xl font-mono text-[11px] md:text-sm text-[#00FF41] leading-tight overflow-y-hidden text-shadow-md">
            {bootLogs.map((log, i) => (
              <div key={i} className={`${log?.includes("SYS_OK") ? "text-[#00FF41] font-bold" : "text-gray-400"} mb-1`}>
                <span className="text-gray-600">[{`${(Math.random() * 2 + 1).toFixed(6)}`}]</span> {log}
              </div>
            ))}
            <div className="animate-pulse w-2 h-4 bg-[#00FF41] mt-2 inline-block"></div>
          </div>
        </div>
      )}

      {step !== "boot" && (
        <div className="relative text-center space-y-8 flex flex-col items-center">
          <div className="w-[120px] h-[120px] relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              {step === "awaiting_user" && (
                <motion.div
                  key="awaiting"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-[#00FF41]/50 rounded-full"
                  />
                  <button 
                    onClick={handleHardcoreAuth}
                    className="w-full h-full rounded-full flex items-center justify-center bg-[#00FF41]/10 hover:bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] transition-all cursor-pointer group shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)]"
                  >
                     <Power className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === "authenticating" && (
                <motion.div
                  key="authenticating"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-[#FFB800] rounded-full opacity-40"
                  />
                  <Fingerprint className="w-16 h-16 text-[#FFB800] animate-pulse" />
                </motion.div>
              )}

              {step === "auth_failed" && (
                <motion.div
                  key="auth_failed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-[#FF003C] rounded-full opacity-40"
                  />
                  <AlertTriangle className="w-16 h-16 text-[#FF003C]" />
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-transparent"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <ShieldCheck className="w-20 h-20 text-[#00FF41] drop-shadow-[0_0_15px_#00FF41]" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-12 w-64">
            <AnimatePresence mode="wait">
              {step === "awaiting_user" && (
                <motion.div key="text-awaiting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-xl font-mono text-[#00FF41] mb-1">SYSTEM LOCKED</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Awaiting Identity Verification</p>
                </motion.div>
              )}
              {step === "authenticating" && (
                <motion.div key="text-authenticating" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-xl font-mono text-[#FFB800] mb-1">HARDWARE AUTH</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Requesting Secure Enclave...</p>
                </motion.div>
              )}
              {step === "auth_failed" && (
                <motion.div key="text-failed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                  <h2 className="text-xl font-mono text-[#FF003C] mb-1">ACCESS DENIED</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest max-w-[280px] break-words mb-4">{failMessage}</p>
                  <div className="flex items-center gap-3 w-[300px]">
                     <button
                       onClick={() => setStep("awaiting_user")}
                       className="flex-1 py-2 bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF003C] font-mono text-[10px] tracking-widest uppercase rounded hover:bg-[#FF003C]/20 transition-colors"
                     >
                        Retry
                     </button>
                     <button
                       onClick={proceedToCloudAuth}
                       className="flex-1 py-2 bg-[#0DF0E3]/10 border border-[#0DF0E3]/30 text-[#0DF0E3] font-mono text-[10px] tracking-widest uppercase rounded hover:bg-[#0DF0E3]/20 transition-colors flex items-center justify-center gap-1.5"
                     >
                       <Cloud className="w-3 h-3" /> Override
                     </button>
                  </div>
                </motion.div>
              )}
              {step === "success" && (
                <motion.div key="text-success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-xl font-mono text-[#00FF41] mb-1">ACCESS GRANTED</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Decrypting partition...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
