import React, { useState } from 'react';
import type { Message } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown,
  Terminal,
  Info,
  AlertTriangle,
  Cpu,
  Sparkles,
  Share2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate }) => {
  const isAssistant = message.role === "assistant";
  const { settings } = useChatStore();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDarkMode = settings.theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "group flex w-full gap-4 lg:gap-6 p-5 lg:p-8 rounded-[2rem] transition-all duration-500",
        isAssistant ? "bg-white/[0.03] border border-white/5" : "bg-transparent"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-2xl transition-all duration-300 group-hover:scale-105",
          isAssistant 
            ? "bg-white text-black" 
            : "bg-primary text-white"
        )}>
          {isAssistant ? <Cpu className="w-5 h-5" /> : "KD"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 overflow-hidden min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em]",
              isAssistant ? "text-primary" : "text-zinc-500"
            )}>
              {isAssistant ? "Neural Interface" : "You"}
            </span>
            {isAssistant && message.metadata?.isStreaming && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-1 h-1 rounded-full bg-primary animate-ping" />
                <span className="text-[8px] font-black text-primary uppercase tracking-widest animate-pulse">Syncing</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-zinc-700 tabular-nums">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className={cn(
          "prose prose-sm lg:prose-base dark:prose-invert max-w-none break-words leading-relaxed",
          "prose-p:text-zinc-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight",
          "prose-strong:text-white prose-strong:font-black prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
          !isAssistant && "text-zinc-100"
        )}>
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !className;
                
                if (isInline) {
                  return <code {...props}>{children}</code>;
                }

                return (
                  <div className="relative group/code my-6 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#09090b]">
                    <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-900/50 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                          {match ? match[1] : 'code'}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(String(children))}
                        className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-white/5 rounded-lg transition-all text-zinc-500 hover:text-white"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={isDarkMode ? atomDark : oneLight}
                      language={match ? match[1] : 'text'}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        fontSize: '0.85rem',
                        lineHeight: '1.6',
                        background: 'transparent',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              },
              blockquote({ children }) {
                const content = React.Children.toArray(children)[0] as any;
                const text = content?.props?.children?.[0];
                
                if (typeof text === 'string' && text.startsWith('[!')) {
                  const type = text.match(/\[!(.*?)\]/)?.[1]?.toLowerCase();
                  const iconMap: Record<string, any> = {
                    tip: <Sparkles className="w-5 h-5 text-yellow-500" />,
                    warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
                    info: <Info className="w-5 h-5 text-blue-500" />,
                    terminal: <Terminal className="w-5 h-5 text-primary" />,
                  };

                  return (
                    <div className="my-6 p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{iconMap[type || 'info']}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{type}</div>
                        <div className="text-sm font-medium text-zinc-400 leading-relaxed italic">
                          {React.Children.map(children, (child: any) => {
                            if (child?.props?.children?.[0] === text) {
                              return {
                                ...child,
                                props: {
                                  ...child.props,
                                  children: [text.replace(/\[!.*?\]\s*/, ''), ...child.props.children.slice(1)]
                                }
                              };
                            }
                            return child;
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }
                return <blockquote className="border-l-4 border-primary/20 pl-6 italic my-6 text-zinc-500">{children}</blockquote>;
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Footer Actions */}
        {isAssistant && !message.metadata?.isStreaming && (
          <div className="flex items-center gap-1 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={() => copyToClipboard(message.content)}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-all flex items-center gap-2"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={onRegenerate}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-all flex items-center gap-2"
              title="Regenerate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-white/5 mx-2" />
            <button 
              onClick={() => setLiked(true)}
              className={cn("p-2 hover:bg-white/5 rounded-lg transition-all", liked === true ? "text-green-500" : "text-zinc-600 hover:text-green-500")}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setLiked(false)}
              className={cn("p-2 hover:bg-white/5 rounded-lg transition-all", liked === false ? "text-red-500" : "text-zinc-600 hover:text-red-500")}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 ml-auto hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-all">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
