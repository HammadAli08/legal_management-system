import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, AlertTriangle, MessageSquare, Home, ChevronRight, ChevronLeft, Gavel, Sun, Moon } from 'lucide-react';
import Classifier from './components/Classifier';
import Prioritizer from './components/Prioritizer';
import Chat from './components/Chat';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'classify' | 'prioritize' | 'chat'>('home');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'classify', label: 'Case Classification', icon: Scale },
        { id: 'prioritize', label: 'Case Prioritization', icon: AlertTriangle },
        { id: 'chat', label: 'Legal Assistant', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-cream dark:bg-dark-primary text-slate dark:text-dark-text font-serif overflow-hidden">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -250 }}
                animate={{
                    x: 0,
                    width: isSidebarCollapsed ? 84 : 256
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-royal dark:bg-dark-secondary flex flex-col p-4 shadow-2xl z-20 border-r border-cream/10 dark:border-dark-border"
            >
                <div className="flex items-center justify-between mb-10 px-2">
                    <AnimatePresence mode="wait">
                        {!isSidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                            >
                                <div className="p-2 bg-gold/20 rounded-lg shrink-0">
                                    <Gavel className="text-gold w-6 h-6" />
                                </div>
                                <h1 className="text-xl font-bold tracking-tight text-cream">Legal toolkit</h1>
                            </motion.div>
                        )}
                        {isSidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex justify-center w-full"
                            >
                                <div className="p-2 bg-gold/20 rounded-lg">
                                    <Gavel className="text-gold w-6 h-6" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isSidebarCollapsed && (
                        <button
                            onClick={() => setIsSidebarCollapsed(true)}
                            className="p-2 hover:bg-white/10 rounded-full text-cream/70 hover:text-gold transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                </div>

                {isSidebarCollapsed && (
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => setIsSidebarCollapsed(false)}
                            className="p-2 hover:bg-white/10 rounded-full text-cream/70 hover:text-gold transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                <div className="mb-8 px-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 text-cream transition-all border border-white/10 ${isSidebarCollapsed ? 'p-3 justify-center' : 'px-4 py-3 w-full'}`}
                        title={isSidebarCollapsed ? (darkMode ? 'Light Aesthetics' : 'Night Protocol') : ''}
                    >
                        {darkMode ? <Sun size={20} className="text-gold" /> : <Moon size={20} className="text-gold" />}
                        {!isSidebarCollapsed && <span className="font-bold text-sm whitespace-nowrap">{darkMode ? 'Light Aesthetics' : 'Night Protocol'}</span>}
                    </button>
                </div>

                <nav className="flex-1 space-y-3 px-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            title={isSidebarCollapsed ? tab.label : ''}
                            className={`flex items-center gap-3 rounded-xl transition-all duration-300 group ${isSidebarCollapsed ? 'p-3 justify-center' : 'w-full px-4 py-3'} ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-gold to-[#F4D03F] text-royal dark:text-dark-primary shadow-lg'
                                : 'hover:bg-gold/10 text-cream/70 hover:text-gold'
                                }`}
                        >
                            <tab.icon size={20} className={activeTab === tab.id ? 'text-royal' : 'group-hover:text-gold'} />
                            {!isSidebarCollapsed && <span className="font-bold whitespace-nowrap">{tab.label}</span>}
                            {!isSidebarCollapsed && activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className={`mt-auto pt-6 border-t border-cream/10 ${isSidebarCollapsed ? 'px-0' : 'px-2'}`}>
                    {!isSidebarCollapsed ? (
                        <p className="text-[10px] text-cream/40 text-center uppercase tracking-[0.2em] font-bold">
                            build for Uraan AI techatone
                        </p>
                    ) : (
                        <div className="flex justify-center">
                            <span className="text-[10px] text-gold font-bold">UA</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-cream dark:bg-dark-primary p-10 relative custom-scrollbar">
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
                                <h2 className="text-5xl font-bold mb-6 text-royal dark:text-cream tracking-tight">AI-Powered Legal Case Management System</h2>
                                <p className="text-xl text-slate/70 dark:text-dark-text/70 leading-relaxed max-w-3xl">
                                    Revolutionizing legal workflows with forensic precision. Our AI-powered toolkit streamlines case classification, determines urgency with predictive modeling, and provides context-aware legal research assistance.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                {[
                                    { title: "Classification", desc: "Categorize cases into Jurisdictions with extreme accuracy.", color: "bg-white dark:bg-dark-secondary border-gold/20 dark:border-dark-border", icon: Scale },
                                    { title: "Prioritization", desc: "Identify high-urgency cases using stacking pipelines.", color: "bg-white dark:bg-dark-secondary border-gold/20 dark:border-dark-border", icon: AlertTriangle },
                                    { title: "RAG Assistant", desc: "Chat with 4000+ verified legal precedents.", color: "bg-white dark:bg-dark-secondary border-gold/20 dark:border-dark-border", icon: MessageSquare }
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, borderColor: '#D4AF37', boxShadow: '0 20px 25px -5px rgba(212, 175, 55, 0.1)' }}
                                        className={`${feature.color} border p-8 rounded-3xl cursor-pointer transition-all bg-white shadow-sm flex flex-col items-center text-center`}
                                        onClick={() => setActiveTab(['classify', 'prioritize', 'chat'][i] as any)}
                                    >
                                        <div className="p-4 bg-royal/5 dark:bg-dark-accent/10 rounded-2xl mb-4 text-royal dark:text-dark-accent">
                                            <feature.icon size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-royal dark:text-cream">{feature.title}</h3>
                                        <p className="text-slate/60 dark:text-dark-text/50 text-sm leading-relaxed">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Teammates Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-12 p-10 border border-gold/20 dark:border-dark-border bg-white dark:bg-dark-secondary rounded-[2.5rem] shadow-xl shadow-gold/5"
                            >
                                <h3 className="text-xl font-bold text-royal dark:text-cream mb-8 flex items-center gap-4">
                                    <span className="w-12 h-[2px] bg-gold dark:bg-dark-accent"></span>
                                    Development Team
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
                                    {[
                                        { name: "Hammad Ali Tahir", detail: "University of Education Lahore", link: "https://www.linkedin.com/in/hammad-ali08/" },
                                        { name: "Muhammad Usama Sharaf", detail: "Data Scientist at Algo", link: "https://www.linkedin.com/in/muhammad-usama-sharaf/" },
                                        { name: "Madiha Farman", detail: "Kohat University of Science and Technology", link: "https://www.linkedin.com/in/madiha-farman-205aa6324/" },
                                        { name: "Muhammad Zeeshan", detail: "Leads University Lahore", link: "https://www.linkedin.com/in/muhammad-zeeshan-37b106249/" }
                                    ].map((member, i) => (
                                        <div key={i} className="flex flex-col group">
                                            {member.link ? (
                                                <a
                                                    href={member.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold text-royal dark:text-dark-text text-lg flex items-center gap-3 transition-all hover:text-gold dark:hover:text-dark-accent hover:translate-x-1"
                                                >
                                                    {member.name}
                                                </a>
                                            ) : (
                                                <span className="font-bold text-royal dark:text-dark-text text-lg flex items-center gap-3 transition-colors group-hover:text-gold dark:group-hover:text-dark-accent">
                                                    {member.name}
                                                </span>
                                            )}
                                            <span className="text-slate/50 dark:text-dark-text/40 text-sm mt-1">{member.detail}</span>
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
