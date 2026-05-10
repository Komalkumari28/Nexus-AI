import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Menu, 
  Moon, 
  Sun, 
  Settings,
  Bell,
  LogOut,
  User as UserIcon,
  Search as SearchIcon,
  ChevronLeft,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export const Header: React.FC = () => {
  const { settings, setSidebarOpen, toggleTheme, conversations, currentConversationId } = useChatStore();
  const { user, isDemoMode, logoutMock } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentChat = conversations.find(c => c.id === currentConversationId);

  const handleLogout = async () => {
    if (isDemoMode) {
      logoutMock();
    } else {
      await signOut(auth);
    }
    window.location.reload();
  };

  return (
    <header className="h-20 bg-background/40 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-[60]">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setSidebarOpen(!settings.sidebarOpen)}
          className={cn(
            "p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300",
            !settings.sidebarOpen ? "text-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" : "text-zinc-500"
          )}
        >
          {settings.sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3">
            <motion.h1 
              key={currentChat?.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-black text-lg lg:text-xl tracking-tight text-white truncate max-w-[150px] lg:max-w-md"
            >
              {currentChat?.title || "Neural Session"}
            </motion.h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Tutor</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500/20" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Intelligence: Advanced-4.0</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Encrypted Session</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Interface */}
        <div className="relative hidden md:block">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-2"
              >
                <SearchIcon className="w-4 h-4 text-zinc-500 mr-2" />
                <input 
                  autoFocus
                  placeholder="Neural search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-zinc-700 font-bold"
                />
              </motion.div>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-2 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button 
            onClick={toggleTheme}
            className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white active:scale-90"
            title="Toggle Neural Theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white hidden sm:block" title="Notifications">
            <Bell className="w-5 h-5" />
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1 hover:bg-white/5 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-black shadow-lg ring-2 ring-white/5 group-hover:ring-primary/40 transition-all">
                {user?.email?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProfileMenu(false)}
                    className="fixed inset-0 z-10"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-64 bg-[#09090b] border border-white/5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 overflow-hidden"
                  >
                    <div className="p-6 pb-4 border-b border-white/5">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Connected Profile</p>
                      <p className="text-sm font-black text-white truncate">{user?.email}</p>
                      <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                        <Zap className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Quantum Tier</span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-zinc-400 hover:text-white">
                        <UserIcon className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Profile Settings</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-zinc-400 hover:text-white">
                        <Settings className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Neural Config</span>
                      </button>
                      <div className="h-[1px] bg-white/5 my-2" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl transition-all text-zinc-500 hover:text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
