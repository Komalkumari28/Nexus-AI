import React, { useRef, useEffect } from 'react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { useChatStore } from '../store/useChatStore';
import { simulateStreamingResponse } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  FileText, 
  LayoutList,
  BrainCircuit,
  Zap,
  ArrowRight,
  Terminal,
  Globe,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

export const ChatWorkspace: React.FC = () => {
  const { 
    conversations, 
    currentConversationId, 
    addMessage, 
    updateLastMessage,
    isGenerating,
    setIsGenerating
  } = useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentChat = conversations.find(c => c.id === currentConversationId);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  // Improved auto-scroll logic
  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timer);
  }, [currentChat?.messages.length, currentChat?.messages[currentChat?.messages.length - 1]?.content]);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!currentConversationId || isGenerating || (!content.trim() && !attachments?.length)) return;

    // 1. Add User Message
    const userMessageContent = attachments?.length 
      ? `${content}\n\n[Attachments: ${attachments.map(f => f.name).join(', ')}]`
      : content;

    addMessage(currentConversationId, {
      role: "user",
      content: userMessageContent,
    });

    // 2. Add Assistant Message (Empty)
    addMessage(currentConversationId, {
      role: "assistant",
      content: "",
      metadata: { isStreaming: true }
    });

    setIsGenerating(true);

    try {
      // 3. Trigger Streaming
      const prompt = attachments?.length 
        ? `I've uploaded ${attachments.length} files. Please analyze them and answer: ${content}`
        : content;

      await simulateStreamingResponse(prompt, (chunk) => {
        updateLastMessage(currentConversationId, chunk, true);
      });
      
      // 4. Finalize Message
      const finalizedChat = useChatStore.getState().conversations.find(c => c.id === currentConversationId);
      const lastMsg = finalizedChat?.messages.slice(-1)[0];
      if (lastMsg) {
        updateLastMessage(currentConversationId, lastMsg.content, false);
      }
    } catch (error) {
      console.error("Processing error:", error);
      updateLastMessage(currentConversationId, "I'm sorry, I encountered an error processing that request. Please check your neural connection and try again.", false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentChat || currentChat.messages.length < 2 || isGenerating) return;
    
    // Find last user prompt
    const messages = [...currentChat.messages];
    const lastUserIndex = messages.map(m => m.role).lastIndexOf('user');
    
    if (lastUserIndex !== -1) {
      const lastUserPrompt = messages[lastUserIndex].content;
      
      // If the last message is assistant, we remove it before regenerating
      // Actually, my handleSendMessage just adds a new one, which is fine for a simple "regenerate" feel.
      // But for a true regenerate, we should ideally replace the last assistant response.
      // For now, let's just trigger a new one.
      handleSendMessage(lastUserPrompt);
    }
  };

  const protocols = [
    { id: 'beginner', label: 'Explain Like Beginner', icon: <GraduationCap className="w-5 h-5" />, prompt: 'Explain the following in simple terms for a beginner: ', color: 'bg-blue-500' },
    { id: 'example', label: 'Show Code Example', icon: <Terminal className="w-5 h-5" />, prompt: 'Provide a complete, practical code example of: ', color: 'bg-emerald-500' },
    { id: 'interview', label: 'Interview Prep', icon: <FileText className="w-5 h-5" />, prompt: 'What are the most common technical interview questions about: ', color: 'bg-purple-500' },
    { id: 'summarize', label: 'Summarize Topic', icon: <LayoutList className="w-5 h-5" />, prompt: 'Summarize the key takeaways and core concepts of: ', color: 'bg-orange-500' },
  ];

  const quickTopics = [
    { text: "Docker Architecture", icon: <Zap className="w-3.5 h-3.5" /> },
    { text: "React v19 Features", icon: <Globe className="w-3.5 h-3.5" /> },
    { text: "System Design Basics", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { text: "Next.js 15 App Router", icon: <BrainCircuit className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#020203] text-zinc-100 overflow-hidden font-sans selection:bg-primary/30">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative min-w-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b33,_transparent)]">
        <Header />
        
        <div className="flex-1 overflow-hidden relative">
          <div 
            ref={scrollRef}
            className="h-full overflow-y-auto px-4 lg:px-8 py-4 no-scrollbar scroll-smooth"
          >
            <div className="max-w-4xl mx-auto pb-40">
              {currentChat?.messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="min-h-[70vh] flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="relative mb-10 group">
                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-2xl border border-white/20 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Zap className="w-12 h-12 text-white fill-white/20" />
                    </div>
                  </div>
                  
                  <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
                    Nexus <span className="text-primary">Learning</span> Interface
                  </h2>
                  <p className="text-zinc-500 max-w-lg mb-12 text-sm lg:text-base font-medium">
                    Master any technical topic with accelerated AI-guided learning protocols.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
                    {protocols.map((action) => (
                      <button 
                        key={action.id}
                        onClick={() => handleSendMessage(action.prompt)}
                        className="group relative p-6 rounded-3xl border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-primary/30 text-left transition-all duration-300 flex items-center gap-5 overflow-hidden"
                      >
                        <div className={cn("p-3 rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", action.color)}>
                          {action.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm mb-1 text-white group-hover:text-primary transition-colors">{action.label}</div>
                          <div className="text-[11px] text-zinc-500 font-medium truncate">Initialize custom cognitive protocol.</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-12 flex flex-wrap justify-center gap-3">
                    {quickTopics.map((topic) => (
                      <button
                        key={topic.text}
                        onClick={() => handleSendMessage("Tell me about " + topic.text)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-zinc-400 hover:text-white transition-all border border-white/5"
                      >
                        {topic.icon}
                        {topic.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4 pt-4">
                  <AnimatePresence mode="popLayout">
                    {currentChat?.messages.map((msg) => (
                      <ChatMessage 
                        key={msg.id} 
                        message={msg} 
                        onRegenerate={handleRegenerate}
                      />
                    ))}
                  </AnimatePresence>
                  
                  {/* Floating Context Toolbar */}
                  {!isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4"
                    >
                      <div className="flex-shrink-0 px-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest border-r border-white/5 mr-2">
                        Deep Dive Protocols
                      </div>
                      {protocols.map((p) => {
                        // Intelligent topic detection for protocol buttons
                        const lastMsg = currentChat?.messages.slice(-2)[0]?.content.toLowerCase() || "";
                        let detectedTopic = currentChat?.title.toLowerCase() || "";
                        
                        // Try to find a specific topic in the history if title is generic
                        if (detectedTopic.includes("session") || detectedTopic.includes("neural")) {
                          for (const t of ["react", "docker", "next.js", "devops", "cloud", "ai", "dsa", "cybersecurity"]) {
                            if (lastMsg.includes(t)) {
                              detectedTopic = t;
                              break;
                            }
                          }
                        }

                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSendMessage(`${p.id} ${detectedTopic}`)}
                            className="flex-shrink-0 px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-[10px] font-bold text-zinc-500 hover:text-white hover:border-primary/40 transition-all uppercase tracking-wider"
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isGenerating} />
      </main>
    </div>
  );
};
