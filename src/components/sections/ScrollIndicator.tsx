import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Document height (total scrollable height)
            const docHeight = document.documentElement.scrollHeight;
            // Current scroll position + viewport height
            const scrollPos = window.innerHeight + window.scrollY;
            
            // Hide if we are at the very bottom (with a small buffer)
            // Or if page is not scrollable enough
            if (scrollPos >= docHeight - 20) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    className="fixed bottom-10 right-6 md:right-10 z-[100] flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => window.scrollBy({ top: 400, behavior: 'smooth' })}
                >
                    <span className="text-white/50 text-[10px] font-bold tracking-[0.3em] uppercase select-none group-hover:text-cta transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Scroll
                    </span>
                    
                    <motion.div
                        animate={{ 
                            y: [0, 10, 0]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="relative flex items-center justify-center"
                    >
                        {/* Shadow/Glow base */}
                        <div className="absolute inset-0 bg-black/40 blur-lg rounded-full -z-10 scale-150" />
                        
                        <ArrowDown 
                            className="text-white w-9 h-9 md:w-12 md:h-12 group-hover:text-cta transition-colors duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" 
                            strokeWidth={2.5} 
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
