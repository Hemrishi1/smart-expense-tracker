import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "👋 Hi! I'm **SmartX AI**, your personal financial advisor. I have access to your real expense data. Ask me anything — spending analysis, saving tips, budget advice, and more!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    const historyForApi = messages.slice(1); // exclude the greeting
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chat', {
        message: userMessage.text,
        history: historyForApi,
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `⚠️ Error: ${error instanceof Error ? error.message : 'Unknown error. Check your API key in the server .env file.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text: string) => {
    // Simple markdown-like bold formatting
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  };

  const suggestions = [
    "Where am I spending the most?",
    "How can I save more money?",
    "Analyze my budget",
    "Give me a saving tip",
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          boxShadow: '0 0 30px rgba(124,58,237,0.5)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { opacity: 0, scale: 0, pointerEvents: 'none' } : { opacity: 1, scale: 1 }}
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15, 10, 40, 0.95)',
              border: '1px solid rgba(124,58,237,0.3)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(59,130,246,0.8))' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">SmartX AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-white/70 text-xs">Financial Advisor</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-1 ${
                      msg.role === 'user'
                        ? 'bg-violet-500/80'
                        : 'bg-blue-500/80'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-violet-600/80 text-white rounded-tr-sm'
                        : 'bg-white/10 text-white/90 rounded-tl-sm'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-500/80 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggestion chips - show only on first load */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-violet-500/40 text-white/70 hover:bg-violet-500/20 hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="p-3 shrink-0 flex gap-2 items-center"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your finances..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
