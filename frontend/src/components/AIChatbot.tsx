import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, Bot, User, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithSahayak, ChatMessage } from '../services/aiService';

const STARTER_PROMPTS = [
  'Tell me about Madhubani painting',
  'What are the classical dances of India?',
  'Recommend a heritage workshop for beginners',
  'Which crafts are from Rajasthan?',
];

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text: string) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await chatWithSahayak(userText, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'I apologize — I am temporarily unavailable. Please try again in a moment.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="sahayak-chatbot-trigger"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-105 transition-all duration-300 font-bold text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Sahayak AI</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-[#060A12]" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[370px] bg-[#0D1322] border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/60 flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[560px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/5 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="font-serif-heritage text-sm font-bold text-amber-100">Sahayak</p>
                <p className="text-[10px] text-amber-400/80 font-mono">AI Cultural Guide · Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(p => !p)}
                className="text-amber-400/60 hover:text-amber-300 p-1 rounded-lg transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                className="text-amber-400/60 hover:text-rose-400 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-amber-500/20">

                {/* Welcome State */}
                {messages.length === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-black" />
                      </div>
                      <div className="bg-[#131B2E] border border-amber-500/15 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[85%]">
                        <p className="text-xs text-amber-100/90 leading-relaxed">
                          Namaste! 🙏 I'm <strong className="text-amber-300">Sahayak</strong>, your AI guide to India's rich cultural heritage. Ask me about art forms, crafts, dances, monuments, artisans, or workshops!
                        </p>
                      </div>
                    </div>

                    <div className="pl-9 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-amber-500/60 font-bold">Try asking:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {STARTER_PROMPTS.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(prompt)}
                            className="text-[10px] px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition-colors text-left"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message List */}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      msg.role === 'user'
                        ? 'bg-amber-400/20 border border-amber-400/30'
                        : 'bg-gradient-to-br from-amber-500 to-orange-600'
                    }`}>
                      {msg.role === 'user'
                        ? <User className="w-3.5 h-3.5 text-amber-300" />
                        : <Bot className="w-3.5 h-3.5 text-black" />
                      }
                    </div>
                    <div className={`px-3.5 py-2.5 rounded-2xl max-w-[82%] ${
                      msg.role === 'user'
                        ? 'bg-amber-500/15 border border-amber-500/20 rounded-tr-none text-amber-100'
                        : 'bg-[#131B2E] border border-amber-500/15 rounded-tl-none text-amber-100/90'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="text-xs leading-relaxed prose-chat">
                          <ReactMarkdown
                            components={{
                              p:      ({ children }) => <p className="mb-1.5 last:mb-0 text-xs leading-relaxed">{children}</p>,
                              strong: ({ children }) => <strong className="text-amber-300 font-semibold">{children}</strong>,
                              em:     ({ children }) => <em className="text-amber-200/80 italic">{children}</em>,
                              ul:     ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1.5 text-xs">{children}</ul>,
                              ol:     ({ children }) => <ol className="list-decimal list-inside space-y-0.5 my-1.5 text-xs">{children}</ol>,
                              li:     ({ children }) => <li className="text-amber-100/90 text-xs">{children}</li>,
                              h1:     ({ children }) => <p className="text-sm font-bold text-amber-300 mb-1">{children}</p>,
                              h2:     ({ children }) => <p className="text-xs font-bold text-amber-300 mb-1">{children}</p>,
                              h3:     ({ children }) => <p className="text-xs font-semibold text-amber-200 mb-0.5">{children}</p>,
                              code:   ({ children }) => <code className="bg-amber-500/10 text-amber-300 px-1 rounded text-[10px] font-mono">{children}</code>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-black" />
                    </div>
                    <div className="bg-[#131B2E] border border-amber-500/15 rounded-2xl rounded-tl-none px-3.5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        <span className="text-xs text-amber-400/70 font-mono">Sahayak is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-amber-500/15 flex-shrink-0">
                <div className="flex items-center gap-2 bg-[#0A0F1C] border border-amber-500/25 rounded-xl px-3 py-2 focus-within:border-amber-400/60 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about Indian culture..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-xs text-amber-100 placeholder-amber-400/40 outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-7 h-7 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-black transition-all disabled:opacity-40 hover:scale-105 flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[9px] text-amber-400/30 text-center mt-1.5">Powered by Groq · Riwayat AI</p>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatbot;
