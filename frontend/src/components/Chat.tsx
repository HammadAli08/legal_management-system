import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';
import { MessageSquare, Send, Loader2, BookOpen, ChevronDown, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: { content: string }[];
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [expandedSource, setExpandedSource] = useState<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await api.post('/api/v1/chat', {
                message: input,
                history
            });

            const assistantMsg: Message = {
                role: 'assistant',
                content: response.data.answer,
                sources: response.data.sources
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err: any) {
            const errorMsg: Message = {
                role: 'assistant',
                content: 'I apologize, but I encountered an error while researching your request.'
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-0">
                <div className="p-3 bg-royal rounded-xl shadow-lg shadow-royal/20">
                    <MessageSquare className="text-gold" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-royal leading-tight tracking-tight">Legal Research Assistant</h2>
                    <p className="text-gold font-bold text-[10px] uppercase tracking-[0.2em]">Context-Aware Precedent Analysis</p>
                </div>
            </div>
            <p className="text-slate/40 mb-8 mt-4 text-xs leading-relaxed max-w-3xl border-l border-gold/30 pl-4 py-1">
                Developed using a massive repository of <span className="text-royal font-bold">4000+ Supreme Court Judgments</span>.
                The system employs <span className="text-royal font-bold">Retrieval Augmented Generation (RAG)</span> with a
                <span className="text-royal font-serif italic text-sm"> Cross-Encoder Reranker Retriever</span>, ensuring that only the most legally relevant
                precedents are synthesized for judicial research.
            </p>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 mt-20">
                        <BookOpen size={80} className="mb-6 text-royal" />
                        <p className="text-2xl font-bold text-royal">Initiate Judicial Inquiry...</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-10 h-10 rounded-full bg-royal flex items-center justify-center shrink-0 shadow-lg">
                                <Bot size={20} className="text-gold" />
                            </div>
                        )}

                        <div className={`max-w-[85%] space-y-4`}>
                            <div className={`p-8 rounded-[2rem] shadow-xl prose max-w-none shadow-royal/5 ${msg.role === 'user'
                                ? 'bg-bg-burgundy text-burgundy rounded-tr-none border border-burgundy/10'
                                : 'bg-bg-forest text-forest rounded-tl-none border border-forest/10 leading-relaxed'
                                }`}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => <p className="mb-4 last:mb-0 text-lg leading-relaxed">{children}</p>,
                                        strong: ({ children }) => <strong className={`font-bold ${msg.role === 'user' ? 'text-burgundy' : 'text-forest'}`}>{children}</strong>,
                                        ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
                                        li: ({ children }) => <li className="opacity-90">{children}</li>,
                                        h4: ({ children }) => <h4 className={`text-xl font-bold mt-6 mb-2 ${msg.role === 'user' ? 'text-burgundy' : 'text-forest'}`}>{children}</h4>,
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>

                            {msg.sources && msg.sources.length > 0 && (
                                <div className="space-y-2 ml-4">
                                    <p className="text-[10px] text-royal/40 uppercase tracking-[0.2em] font-black">Relevant Authorities</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {msg.sources.map((source, sIdx) => (
                                            <div key={sIdx} className="bg-bg-blue border border-royal/5 rounded-2xl overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() => setExpandedSource(expandedSource === sIdx ? null : sIdx)}
                                                    className="w-full px-5 py-3 flex items-center justify-between text-xs text-royal font-bold hover:bg-royal/5 transition-all"
                                                >
                                                    <span className="truncate text-royal">Judicial Source #{sIdx + 1}</span>
                                                    <ChevronDown size={14} className={`text-royal transition-transform ${expandedSource === sIdx ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {expandedSource === sIdx && (
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: 'auto' }}
                                                            exit={{ height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-6 pb-6 pt-2 text-sm text-royal/70 italic leading-relaxed border-t border-royal/5">
                                                                {source.content}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center shrink-0 shadow-lg">
                                <User size={20} className="text-gold" />
                            </div>
                        )}
                    </motion.div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-royal flex items-center justify-center shrink-0 animate-pulse">
                            <Bot size={20} className="text-gold" />
                        </div>
                        <div className="bg-bg-forest border border-forest/10 p-6 rounded-3xl rounded-tl-none shadow-lg">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-forest rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-forest rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-forest rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border border-gold/20 rounded-[2.5rem] p-3 flex items-center gap-3 focus-within:ring-4 focus-within:ring-gold/10 transition-all shadow-2xl shadow-gold/5">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Submit your judicial inquiry here..."
                    className="flex-1 bg-transparent border-none focus:ring-0 px-8 py-5 text-royal font-medium placeholder:text-royal/20 text-lg"
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-royal to-burgundy hover:scale-105 active:scale-95 text-gold p-5 rounded-3xl shadow-xl shadow-royal/20 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin text-gold" size={24} /> : <Send size={24} className="text-gold" />}
                </button>
            </div>
        </div>
    );
};

export default Chat;
