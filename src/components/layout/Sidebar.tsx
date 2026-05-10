import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Plus, 
  MessageSquare, 
  History, 
  Search,
  ChevronLeft,
  Trash2,
  Edit2,
  LogOut,
  Sparkles,
  Command,
  LayoutGrid,
  Zap,
  Globe,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const Logo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative w-9 h-9 flex-shrink-0">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary via-indigo-400 to-blue-400 opacity-20 blur-lg group-hover:opacity-40 transition-opacity"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary to-blue-500 shadow-lg flex items-center justify-center border border-white/20">
        <Zap className="w-5 h-5 text-white fill-white/20" />
      </div>
    </div>
    <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 truncate">
      NEXUS<span className="text-primary ml-1">AI</span>
    </span>
  </div>
);

export const Sidebar: React.FC = () => {
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation, 
    createConversation,
    deleteConversation,
    renameConversation,
    settings,
    setSidebarOpen
  } = useChatStore();
  
  const { user, isDemoMode, logoutMock } = useAuthStore();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const isOpen = settings.sidebarOpen;

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle);
    }
    setEditingId(null);
  };

  const handleLogout = async () => {
    if (isDemoMode) {
      logoutMock();
    } else {
      await signOut(auth);
    }
    window.location.reload();
  };

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createConversation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createConversation]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 320 : 0, 
          x: isOpen ? 0 : -320
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative h-full bg-[#09090b] border-r border-white/5 flex flex-col z-50 transition-colors duration-500",
          !isOpen && "border-none"
        )}
      >
        {/* Header - Fixed Height */}
        <div className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-[#09090b]">
          <Logo />
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col py-6">
          {/* New Chat Button */}
          <div className="px-4 mb-6">
            <button
              onClick={() => createConversation()}
              className="group relative w-full flex items-center gap-3 px-4 py-3.5 bg-white text-black rounded-2xl hover:bg-zinc-100 transition-all font-black shadow-xl active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span className="flex-1 text-left text-xs uppercase tracking-widest">New Learning session</span>
              <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/5 text-[8px] font-black">
                <Command className="w-2.5 h-2.5" />
                <span>N</span>
              </div>
            </button>
          </div>

          {/* Search */}
          <div className="px-4 mb-6">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Neural history search..."
                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold text-zinc-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all placeholder:text-zinc-700 uppercase tracking-widest"
              />
            </div>
          </div>

          {/* List Sections */}
          <div className="flex-1 space-y-8">
            <div className="px-2">
              <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                  <History className="w-3 h-3" />
                  <span>Recent History</span>
                </div>
                <span className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-md font-bold tabular-nums">{conversations.length}</span>
              </div>
              
              <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {filteredConversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border border-transparent relative",
                        currentConversationId === conv.id 
                          ? "bg-zinc-900 border-white/5 text-white font-bold" 
                          : "hover:bg-zinc-900/40 text-zinc-500 hover:text-zinc-300"
                      )}
                      onClick={() => {
                        setCurrentConversation(conv.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                    >
                      <MessageSquare className={cn(
                        "w-4 h-4 flex-shrink-0 transition-colors",
                        currentConversationId === conv.id ? "text-primary" : "text-zinc-700 group-hover:text-zinc-500"
                      )} />

                      <div className="flex-1 min-w-0">
                        {editingId === conv.id ? (
                          <input 
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveEdit(conv.id)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveEdit(conv.id)}
                            className="bg-zinc-800 border-none rounded px-2 py-0.5 text-xs w-full outline-none text-white"
                            onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <p className="truncate text-xs tracking-tight">{conv.title}</p>
                        )}
                      </div>

                      <div className="flex opacity-0 group-hover:opacity-100 transition-all gap-1 ml-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(conv.id, conv.title);
                          }}
                          className="p-1 hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conv.id);
                          }}
                          className="p-1 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="px-2">
              <div className="px-4 mb-4 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Resource Engine</div>
              <div className="grid grid-cols-1 gap-1 px-2">
                {[
                  { name: 'Knowledge Graph', icon: <Globe className="w-3.5 h-3.5" /> },
                  { name: 'System Core', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                  { name: 'Security Vault', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                  { name: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> }
                ].map(item => (
                  <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900/40 cursor-pointer transition-all group text-zinc-500 hover:text-zinc-300">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900/50 flex items-center justify-center group-hover:text-primary transition-colors border border-white/5">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Profile - Fixed Height */}
        <div className="h-24 flex-shrink-0 p-4 border-t border-white/5 bg-[#09090b]">
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-white/5 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#09090b]" />
            </div>
            <div className="flex-1 overflow-hidden relative z-10">
              <p className="text-xs font-black text-white truncate">{user?.email?.split('@')[0]}</p>
              <div className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-primary" />
                <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">Quantum Tier</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 relative z-10"
              title="Terminate Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
