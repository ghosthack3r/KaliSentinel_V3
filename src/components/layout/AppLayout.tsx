import { Outlet, Link, useLocation } from "react-router-dom";
import { Shield, Lock, KeyRound, Activity, Settings, Bell, Search, Terminal, Laptop, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../../contexts/SettingsContext";

export default function AppLayout() {
  const location = useLocation();
  const { theme, transitionType } = useSettings();

  const navItems = [
    { name: "Overview", path: "/", icon: Shield },
    { name: "Threats", path: "/threats", icon: Activity },
    { name: "Vault", path: "/vault", icon: Lock },
    { name: "Auth", path: "/auth", icon: KeyRound },
    { name: "Devices", path: "/devices", icon: Laptop },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const getTransitionMap = () => {
    switch (transitionType) {
      case "fade":
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
      case "slide":
        return { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -15 } };
      case "scale":
        return { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } };
      case "glitch":
        return {
          initial: { opacity: 0, filter: "brightness(2) blur(3px) hue-rotate(90deg)" },
          animate: { opacity: 1, filter: "brightness(1) blur(0px) hue-rotate(0deg)" },
          exit: { opacity: 0, filter: "brightness(3) blur(3px) hue-rotate(-90deg)" }
        };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    }
  };

  const animProps = getTransitionMap();

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-[240px] flex-col bg-card border-r border-border py-8 px-6 gap-10">
        <div className="flex items-center gap-3 font-mono font-bold text-lg tracking-wider text-[#00FF41]">
          <div className="w-8 h-8 border border-[#00FF41] rounded relative flex items-center justify-center bg-[#00FF41]/5 shrink-0">
            <Terminal className="w-4 h-4 text-[#00FF41] absolute" />
          </div>
          KALI_ROOT
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#0DF0E3]/70 mb-2">/usr/bin/defense</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded text-xs font-mono tracking-wide transition-all duration-200 relative overflow-hidden group shrink-0",
                  isActive
                    ? "bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 shadow-[inset_2px_0_0_#00FF41]"
                    : "text-gray-400 hover:bg-[#00FF41]/5 hover:text-[#00FF41]"
                )}
              >
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00FF41] shadow-[0_0_8px_#00FF41]" />
                )}
                <Icon className={cn("w-4 h-4 relative z-10 group-hover:scale-110 transition-transform shrink-0", isActive ? "text-[#00FF41]" : "text-gray-500")} />
                <span className="relative z-10 truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border shrink-0">
          <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded shrink-0 bg-background flex items-center justify-center border border-[#0DF0E3]/30">
              <span className="text-xs font-mono font-medium text-[#0DF0E3]">US</span>
            </div>
            <div className="flex flex-col font-mono min-w-0">
              <span className="text-xs font-medium text-gray-300 truncate">sysadmin</span>
              <span className="text-[10px] text-[#0DF0E3] flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#0DF0E3] animate-pulse shrink-0"></span>
                 Connected
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-[70px] shrink-0 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background relative z-10 shadow-sm">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent" />
          <div className="flex items-center gap-4 flex-1">
            <div className="w-8 h-8 md:hidden border border-[#00FF41] rounded relative flex items-center justify-center bg-[#00FF41]/5 shrink-0 mr-2">
              <Terminal className="w-4 h-4 text-[#00FF41] absolute" />
            </div>
            <h1 className="text-sm font-mono font-bold text-[#0DF0E3] tracking-wider truncate">
              {navItems.find((i) => i.path === location.pathname)?.name || "KALI SENTINEL CORE"}
            </h1>
            <div className="hidden lg:flex max-w-[400px] flex-1 h-9 bg-card border border-border rounded px-3 text-[12px] text-muted-foreground items-center gap-2 ml-4 focus-within:border-[#0DF0E3]/50 transition-colors font-mono">
              <Search className="w-3.5 h-3.5 text-[#0DF0E3] shrink-0" />
              <input type="text" placeholder="grep search network & vault..." className="min-w-0 bg-transparent border-none outline-none flex-1 text-[#00FF41] placeholder:text-gray-600 focus:placeholder:text-transparent" />
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Link to="/dev-lab" className="px-3 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/30 rounded text-[10px] font-mono font-bold hidden sm:flex items-center gap-2 hover:bg-purple-500/20 transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Zap className="w-3 h-3" />
              DEV_LAB
            </Link>
            <span className="px-3 py-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 rounded text-[10px] font-mono font-bold hidden sm:flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,65,0.1)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping shrink-0" />
              NODE_SECURE
            </span>
            <button className="relative p-2 text-gray-400 hover:text-[#00FF41] transition-colors group">
              <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full shadow-[0_0_8px_#FF003C] animate-pulse flex items-center justify-center"><span className="w-1 h-1 bg-white rounded-full"></span></span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={cn("flex-1 min-h-0 overflow-x-hidden relative flex flex-col custom-scrollbar", location.pathname !== "/" ? "overflow-y-auto p-4 md:p-8" : "p-4 md:p-6")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={animProps.initial}
              animate={animProps.animate}
              exit={animProps.exit}
              transition={{ duration: transitionType === 'glitch' ? 0.2 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full mx-auto flex-1 min-h-0 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Nav (Bottom) */}
        <nav className="md:hidden shrink-0 border-t border-border bg-card flex items-center justify-evenly py-2 px-1 pb-safe relative z-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg min-w-[56px]",
                  isActive ? "text-[#00FF41] bg-[#00FF41]/10" : "text-gray-500 hover:text-[#00FF41]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-mono truncate w-full text-center">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
