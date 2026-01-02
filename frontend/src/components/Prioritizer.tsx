import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/api';
import { Zap, Loader2, AlertTriangle } from 'lucide-react';

const Prioritizer: React.FC = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            case 'high': return 'bg-burgundy text-gold border-gold/30 shadow-burgundy/20';
            case 'medium': return 'bg-slate text-gold border-gold/20 shadow-slate/20';
            case 'low': return 'bg-cream text-royal border-gold/10 shadow-royal/5';
            default: return 'bg-royal text-gold';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-royal/10 border border-royal/20 rounded-xl shadow-lg">
                    <AlertTriangle className="text-royal" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-royal tracking-tight">Case Prioritization</h2>
            </div>
            <p className="text-slate/60 mb-8 ml-16 max-w-2xl text-sm leading-relaxed">
                Utilizing a <span className="text-royal font-bold">Stacking Regressor/Classifier Pipeline</span>, this module predicts
                case urgency by weighing multiple model outputs simultaneously. It processes historical patterns to identify High,
                Medium, and Low priority cases automatically based on encoded judicial markers.
            </p>

            <div className="bg-white border border-gold/10 rounded-[2.5rem] p-10 shadow-2xl shadow-gold/5 backdrop-blur-sm transition-all hover:border-gold/30">
                <label className="block text-royal/40 text-xs font-black uppercase tracking-[0.2em] mb-4 ml-2">Incident Details / Urgency Indicators</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste the case text here to determine processing priority..."
                    className="w-full h-72 bg-cream/50 border border-gold/10 rounded-3xl p-8 text-royal placeholder:text-royal/20 focus:outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold/30 transition-all resize-none mb-8 leading-relaxed text-lg"
                />

                <button
                    onClick={handlePredict}
                    disabled={loading || !text.trim()}
                    className="w-full bg-gradient-to-r from-royal via-royal to-burgundy hover:scale-[1.01] disabled:opacity-50 text-gold font-black py-5 px-8 rounded-3xl shadow-xl shadow-royal/20 flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                    {loading ? <Loader2 className="animate-spin text-gold" /> : <Zap size={20} className="text-gold" />}
                    {loading ? 'Evaluating Complexity & Risk...' : 'Assess Case Urgency'}
                </button>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-10 p-10 border border-gold/10 rounded-[2rem] bg-cream/30 flex flex-col items-center gap-6"
                    >
                        <div className="text-royal/40 text-xs font-black uppercase tracking-[0.3em]">Calculated Priority Level</div>
                        <div className={`px-12 py-4 rounded-2xl border font-black text-3xl uppercase tracking-tighter shadow-2xl ${getPriorityStyles(result)} transition-all animate-pulse`}>
                            {result}
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="mt-6 p-6 bg-bg-burgundy border border-burgundy/20 text-burgundy rounded-2xl text-center font-bold">
                        {error}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Prioritizer;
