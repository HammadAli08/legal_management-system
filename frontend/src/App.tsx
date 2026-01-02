import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, AlertTriangle, MessageSquare, Home, ChevronRight, Gavel } from 'lucide-react';
import Classifier from './components/Classifier';
import Prioritizer from './components/Prioritizer';
import Chat from './components/Chat';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'classify' | 'prioritize' | 'chat'>('home');

    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'classify', label: 'Case Classification', icon: Scale },
        { id: 'prioritize', label: 'Case Prioritization', icon: AlertTriangle },
        { id: 'chat', label: 'Legal Assistant', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-cream text-slate font-serif overflow-hidden">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                className="w-64 bg-royal flex flex-col p-6 shadow-2xl z-20"
            >
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-gold/20 rounded-lg">
                        <Gavel className="text-gold w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-cream">Legal toolkit</h1>
                </div>

                <nav className="flex-1 space-y-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-gold to-[#F4D03F] text-royal shadow-lg translate-x-1'
                                : 'hover:bg-gold/10 text-cream/70 hover:text-gold'
                                }`}
                        >
                            <tab.icon size={20} className={activeTab === tab.id ? 'text-royal' : 'group-hover:text-gold'} />
                            <span className="font-bold">{tab.label}</span>
                            {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-cream/10">
                    <p className="text-[10px] text-cream/40 text-center uppercase tracking-[0.2em] font-bold">
                        Excellence in Jurisprudence
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-cream p-10 relative custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'home' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="mb-12">
                                <h2 className="text-5xl font-bold mb-6 text-royal tracking-tight">AI-Powered Legal Case Management System</h2>
                                <p className="text-xl text-slate/70 leading-relaxed max-w-3xl">
                                    Revolutionizing legal workflows with forensic precision. Our AI-powered toolkit streamlines case classification, determines urgency with predictive modeling, and provides context-aware legal research assistance.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                {[
                                    { title: "Classification", desc: "Categorize cases into Jurisdictions with extreme accuracy.", color: "bg-white border-gold/20", icon: Scale },
                                    { title: "Prioritization", desc: "Identify high-urgency cases using stacking pipelines.", color: "bg-white border-gold/20", icon: AlertTriangle },
                                    { title: "RAG Assistant", desc: "Chat with 4000+ verified legal precedents.", color: "bg-white border-gold/20", icon: MessageSquare }
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, borderColor: '#D4AF37', boxShadow: '0 20px 25px -5px rgba(212, 175, 55, 0.1)' }}
                                        className={`${feature.color} border p-8 rounded-3xl cursor-pointer transition-all bg-white shadow-sm flex flex-col items-center text-center`}
                                        onClick={() => setActiveTab(['classify', 'prioritize', 'chat'][i] as any)}
                                    >
                                        <div className="p-4 bg-royal/5 rounded-2xl mb-4 text-royal">
                                            <feature.icon size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-royal">{feature.title}</h3>
                                        <p className="text-slate/60 text-sm leading-relaxed">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Teammates Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-12 p-10 border border-gold/20 bg-white rounded-[2.5rem] shadow-xl shadow-gold/5"
                            >
                                <h3 className="text-xl font-bold text-royal mb-8 flex items-center gap-4">
                                    <span className="w-12 h-[2px] bg-gold"></span>
                                    Development Team
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
                                    {[
                                        { name: "Hammad Ali Tahir", detail: "University of Education Lahore" },
                                        { name: "Muhammad Usama Sharaf", detail: "Data Scientist at Algo" },
                                        { name: "Madiha Farman", detail: "Kohat University of Science and Technology" },
                                        { name: "Muhammad Zeeshan", detail: "Leads University Lahore" }
                                    ].map((member, i) => (
                                        <div key={i} className="flex flex-col group">
                                            <span className="font-bold text-royal text-lg flex items-center gap-3 transition-colors group-hover:text-gold">
                                                {member.name}
                                            </span>
                                            <span className="text-slate/50 text-sm mt-1">{member.detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'classify' && <Classifier key="classify" />}
                    {activeTab === 'prioritize' && <Prioritizer key="prioritize" />}
                    {activeTab === 'chat' && <Chat key="chat" />}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default App;
