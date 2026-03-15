import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function ExploreRelatic() {
    return (
        <section className="relative py-8 px-4 overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cta/10 blur-[80px] rounded-full animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative group block p-6 md:p-8 rounded-[2rem] bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-2xl overflow-hidden"
                >
                    {/* Hover glow effect */}
                    <div className="absolute -inset-px bg-gradient-to-r from-cta/20 via-cyan-400/20 to-cta/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-4 group-hover:text-cta transition-colors">
                                <Sparkles size={12} className="text-cta animate-pulse" />
                                Descubre Relatic Panamá
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3 tracking-tight">
                                Potencia tu impacto <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-cyan-400">académico y científico</span>
                            </h2>
                            
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                                Servicios diseñados para investigadores y autores. 
                                Desde publicaciones indexadas hasta plataformas de aprendizaje innovadoras.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <motion.a
                                href="https://miembros.relatic.org/login"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group/btn relative px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold inline-flex items-center gap-3 shadow-lg hover:shadow-cta/20 transition-all overflow-hidden text-sm"
                            >
                                <span className="relative z-10">Conocer más</span>
                                <ArrowRight className="relative z-10 group-hover/btn:translate-x-1 transition-transform" size={18} />
                                
                                {/* Button background animate */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cta to-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-slate-900 dark:bg-white group-hover/btn:scale-x-0 transition-transform origin-left duration-500" />
                            </motion.a>
                        </div>
                    </div>

                    {/* Subtle decorative grid/pattern */}
                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                            <path d="M0 20H100M0 40H100M0 60H100M0 80H100M20 0V100M40 0V100M60 0V100M80 0V100" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                    </div>
                </motion.div>
            </div>
            
            {/* Scroll indicator or separator line */}
            <div className="mt-12 flex justify-center">
                <div className="w-px h-12 bg-gradient-to-b from-slate-200 dark:from-white/10 to-transparent" />
            </div>
        </section>
    );
}
