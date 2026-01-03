import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/api';
import { Send, Loader2, CheckCircle } from 'lucide-react';

const Classifier: React.FC = () => {
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
            const response = await api.post('/api/v1/classify', { text });
            setResult(response.data.category);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to classify case.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-royal dark:bg-dark-accent rounded-xl shadow-lg shadow-royal/20 dark:shadow-dark-accent/20 transition-all">
                    <CheckCircle className="text-gold dark:text-dark-primary" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-royal dark:text-cream tracking-tight">Case Classification</h2>
            </div>
            <p className="text-slate/60 dark:text-dark-text/60 mb-8 ml-16 max-w-2xl text-sm leading-relaxed">
                Powered by advanced <span className="text-royal dark:text-dark-accent font-bold underline underline-offset-4 decoration-gold/30 dark:decoration-dark-accent/30">Natural Language Processing (NLP)</span> and a
                <span className="text-royal dark:text-dark-accent font-bold"> Voting Ensemble ML Model</span>. This system analyzes semantic nuances across
                textual data to categorize cases into Civil, Criminal, or Constitutional jurisdictions with forensic precision.
            </p>

            <div className="bg-white dark:bg-dark-secondary border border-gold/10 dark:border-dark-border rounded-[2.5rem] p-10 shadow-2xl shadow-gold/5 dark:shadow-black/20 backdrop-blur-sm transition-all hover:border-gold/30 dark:hover:border-dark-accent/30">
                <label className="block text-royal/40 dark:text-dark-text/40 text-xs font-black uppercase tracking-[0.2em] mb-4 ml-2">Case Transcription / Documents</label>
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
                    placeholder="Paste the legal text here for automatic categorization..."
                    className="w-full min-h-[120px] bg-cream/50 dark:bg-dark-primary/50 border border-gold/10 dark:border-dark-border rounded-3xl p-8 text-royal dark:text-dark-text placeholder:text-royal/20 dark:placeholder:text-dark-text/20 focus:outline-none focus:ring-4 focus:ring-gold/10 dark:focus:ring-dark-accent/10 focus:border-gold/30 dark:focus:border-dark-accent/30 transition-all resize-none mb-8 leading-relaxed text-lg overflow-hidden"
                />

                <button
                    onClick={handlePredict}
                    disabled={loading || !text.trim()}
                    className="w-full bg-gradient-to-r from-royal via-royal to-burgundy dark:from-dark-accent dark:via-dark-accent dark:to-dark-accent hover:scale-[1.01] disabled:opacity-50 text-gold dark:text-dark-primary font-black py-5 px-8 rounded-3xl shadow-xl shadow-royal/20 dark:shadow-dark-accent/20 flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                    {loading ? <Loader2 className="animate-spin text-gold dark:text-dark-primary" /> : <Send size={20} className="text-gold dark:text-dark-primary" />}
                    {loading ? 'Analyzing Legal Nuances...' : 'Execute Classification'}
                </button>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 p-8 bg-bg-forest dark:bg-dark-success/10 border border-forest/20 dark:border-dark-success/20 rounded-3xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-forest dark:bg-dark-success rounded-full">
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <div className="text-forest dark:text-dark-success font-bold text-lg tracking-tight">Jurisdiction Identified:</div>
                        </div>
                        <div className="bg-forest dark:bg-dark-success px-6 py-2 rounded-xl text-white font-black uppercase tracking-widest shadow-lg shadow-forest/20 dark:shadow-dark-success/20">
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

export default Classifier;
