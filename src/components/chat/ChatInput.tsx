import React, { useRef, useEffect, useState } from 'react';
import { 
  Plus, 
  Paperclip, 
  Mic, 
  ArrowUp,
  X,
  FileIcon,
  StopCircle,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<any>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setAttachments(prev => [...prev, ...files]);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => [...prev, 'file']);
      }
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(t => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    if (recordingTime > 1) {
      setInput(prev => prev + (prev ? " " : "") + "Transcribed voice input analysis...");
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((input.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(input.trim(), attachments);
      setInput("");
      setAttachments([]);
      setPreviews([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  return (
    <div className="p-4 lg:p-10 bg-gradient-to-t from-background via-background/90 to-transparent relative z-10">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Attachment Previews */}
        <AnimatePresence>
          {previews.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="flex flex-wrap gap-3 mb-4 px-2"
            >
              {previews.map((preview, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl"
                >
                  {preview === 'file' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                      <FileIcon className="w-8 h-8 text-primary" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 truncate w-full text-center">
                        {attachments[i]?.name}
                      </span>
                    </div>
                  ) : (
                    <img src={preview} alt="upload" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  )}
                  <button 
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="absolute top-1 right-1 p-1 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form 
          onSubmit={handleSubmit}
          className={cn(
            "relative flex flex-col gap-2 p-2 rounded-3xl border bg-background/50 backdrop-blur-3xl transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
            disabled 
              ? "opacity-50 pointer-events-none grayscale" 
              : "border-white/10 hover:border-white/20 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5"
          )}
        >
          <div className="flex items-start gap-2">
            {isRecording ? (
              <div className="flex-1 flex items-center gap-4 py-3 px-6 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-sm font-black text-red-500 uppercase tracking-widest">Recording Audio</span>
                </div>
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-full bg-red-500"
                  />
                </div>
                <span className="text-xs font-mono text-zinc-500 tabular-nums">
                  0:{recordingTime.toString().padStart(2, '0')}
                </span>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={attachments.length > 0 ? "Add a description for your files..." : "Neural query interface initialized. Ask anything..."}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-sm lg:text-base text-foreground placeholder:text-muted-foreground/40 leading-relaxed font-medium"
                disabled={disabled}
              />
            )}
          </div>

          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                multiple 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                title="Attach Files" 
                className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <button 
                type="button" 
                onClick={isRecording ? stopRecording : startRecording}
                title={isRecording ? "Stop Recording" : "Voice Input"} 
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  isRecording ? "bg-red-500/10 text-red-500 animate-pulse" : "hover:bg-white/5 text-zinc-500 hover:text-white"
                )}
              >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="h-4 w-[1px] bg-white/5 mx-1" />
              
              <button type="button" className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {disabled && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-[9px] text-zinc-500 font-black uppercase tracking-widest border border-white/5">
                <span>Enter to Process</span>
              </div>
              <button
                type="submit"
                disabled={(!input.trim() && attachments.length === 0) || disabled || isRecording}
                className={cn(
                  "w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 shadow-xl",
                  (input.trim() || attachments.length > 0)
                    ? "bg-white text-black hover:scale-105 active:scale-95" 
                    : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
                )}
              >
                <ArrowUp className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>
        </form>
        
        <p className="text-[10px] text-center text-zinc-600 mt-4 font-black uppercase tracking-[0.2em] opacity-40">
          Nexus AI • Production Architecture v4.0 • Neural Processing Active
        </p>
      </div>
    </div>
  );
};
