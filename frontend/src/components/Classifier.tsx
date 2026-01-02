import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Send, Loader2, CheckCircle } from 'lucide-react';

const Classifier: React.FC = () => {
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
            const response = await axios.post('/api/v1/classify', { text });
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
                <div className="p-3 bg-royal rounded-xl shadow-lg shadow-royal/20">
                    <CheckCircle className="text-gold" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-royal tracking-tight">Case Classification</h2>
            </div>
            <p className="text-slate/60 mb-8 ml-16 max-w-2xl text-sm leading-relaxed">
                Powered by advanced <span className="text-royal font-bold underline underline-offset-4 decoration-gold/30">Natural Language Processing (NLP)</span> and a
                <span className="text-royal font-bold"> Voting Ensemble ML Model</span>. This system analyzes semantic nuances across
                textual data to categorize cases into Civil, Criminal, or Constitutional jurisdictions with forensic precision.
            </p>

            <div className="bg-white border border-gold/10 rounded-[2.5rem] p-10 shadow-2xl shadow-gold/5 backdrop-blur-sm transition-all hover:border-gold/30">
                <label className="block text-royal/40 text-xs font-black uppercase tracking-[0.2em] mb-4 ml-2">Case Transcription / Documents</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste the legal text here for automatic categorization..."
                    className="w-full h-72 bg-cream/50 border border-gold/10 rounded-3xl p-8 text-royal placeholder:text-royal/20 focus:outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold/30 transition-all resize-none mb-8 leading-relaxed text-lg"
                />

                <button
                    onClick={handlePredict}
                    disabled={loading || !text.trim()}
                    className="w-full bg-gradient-to-r from-royal via-royal to-burgundy hover:scale-[1.01] disabled:opacity-50 text-gold font-black py-5 px-8 rounded-3xl shadow-xl shadow-royal/20 flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                    {loading ? <Loader2 className="animate-spin text-gold" /> : <Send size={20} className="text-gold" />}
                    {loading ? 'Analyzing Legal Nuances...' : 'Execute Classification'}
                </button>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 p-8 bg-bg-forest border border-forest/20 rounded-3xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-forest rounded-full">
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <div className="text-forest font-bold text-lg tracking-tight">Jurisdiction Identified:</div>
                        </div>
                        <div className="bg-forest px-6 py-2 rounded-xl text-white font-black uppercase tracking-widest shadow-lg shadow-forest/20">
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

export default Classifier;
