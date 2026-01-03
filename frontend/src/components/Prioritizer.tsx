import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/api';
import { Zap, Loader2, AlertTriangle } from 'lucide-react';

const Prioritizer: React.FC = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handlePredict = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await api.post('/api/v1/prioritize', { text });
            setResult(response.data.priority);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to prioritize case.');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-burgundy dark:bg-burgundy/80 text-gold dark:text-dark-text border-gold/30 dark:border-burgundy/30 shadow-burgundy/40 scale-105';
            case 'medium': return 'bg-slate dark:bg-dark-secondary text-gold dark:text-dark-text border-gold/20 dark:border-dark-border shadow-slate/20';
            case 'low': return 'bg-cream dark:bg-dark-primary text-royal dark:text-dark-text border-gold/10 dark:border-dark-border shadow-royal/5';
            default: return 'bg-royal dark:bg-dark-accent text-gold dark:text-dark-primary';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-royal/10 dark:bg-dark-accent/10 border border-royal/20 dark:border-dark-accent/20 rounded-xl shadow-lg transition-all">
                    <AlertTriangle className="text-royal dark:text-dark-accent" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-royal dark:text-cream tracking-tight">Case Prioritization</h2>
            </div>
            <p className="text-slate/60 dark:text-dark-text/60 mb-8 ml-16 max-w-2xl text-sm leading-relaxed">
                Utilizing a <span className="text-royal dark:text-dark-accent font-bold">Stacking Regressor/Classifier Pipeline</span>, this module predicts
                case urgency by weighing multiple model outputs simultaneously. It processes historical patterns to identify High,
                Medium, and Low priority cases automatically based on encoded judicial markers.
            </p>

            <div className="bg-white dark:bg-dark-secondary border border-gold/10 dark:border-dark-border rounded-[2.5rem] p-10 shadow-2xl shadow-gold/5 dark:shadow-black/20 backdrop-blur-sm transition-all hover:border-gold/30 dark:hover:border-dark-accent/30">
                <label className="block text-royal/40 dark:text-dark-text/40 text-xs font-black uppercase tracking-[0.2em] mb-4 ml-2">Incident Details / Urgency Indicators</label>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handlePredict();
                        }
                    }}
                    placeholder="Paste the case text here to determine processing priority..."
                    className="w-full min-h-[120px] bg-cream/50 dark:bg-dark-primary/50 border border-gold/10 dark:border-dark-border rounded-3xl p-8 text-royal dark:text-dark-text placeholder:text-royal/20 dark:placeholder:text-dark-text/20 focus:outline-none focus:ring-4 focus:ring-gold/10 dark:focus:ring-dark-accent/10 focus:border-gold/30 dark:focus:border-dark-accent/30 transition-all resize-none mb-8 leading-relaxed text-lg overflow-hidden"
                />

                <button
                    onClick={handlePredict}
                    disabled={loading || !text.trim()}
                    className="w-full bg-gradient-to-r from-royal via-royal to-burgundy dark:from-dark-accent dark:via-dark-accent dark:to-dark-accent hover:scale-[1.01] disabled:opacity-50 text-gold dark:text-dark-primary font-black py-5 px-8 rounded-3xl shadow-xl shadow-royal/20 dark:shadow-dark-accent/20 flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                    {loading ? <Loader2 className="animate-spin text-gold dark:text-dark-primary" /> : <Zap size={20} className="text-gold dark:text-dark-primary" />}
                    {loading ? 'Evaluating Complexity & Risk...' : 'Assess Case Urgency'}
                </button>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-10 p-10 border border-gold/10 dark:border-dark-border rounded-[2rem] bg-cream/30 dark:bg-dark-primary/30 flex flex-col items-center gap-6"
                    >
                        <div className="text-royal/40 dark:text-dark-text/40 text-xs font-black uppercase tracking-[0.3em]">Calculated Priority Level</div>
                        <div className={`px-12 py-6 rounded-2xl border font-cinzel font-black text-4xl uppercase tracking-[0.15em] shadow-2xl ${getPriorityStyles(result)} transition-all animate-pulse flex items-center justify-center`}>
                            {result}
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="mt-6 p-6 bg-bg-burgundy dark:bg-burgundy/10 border border-burgundy/20 dark:border-burgundy/30 text-burgundy dark:text-red-400 rounded-2xl text-center font-bold">
                        {error}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Prioritizer;
