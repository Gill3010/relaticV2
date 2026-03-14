import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Hero() {
    // Ejemplos de imágenes (podrías reemplazarlas por las de tu landing)
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
            title: "Educación Continua",
            description: "Plataformas modernas para el aprendizaje en la era digital.",
            ctaText: "Ver Cursos",
            link: "#cursos"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
            title: "Publicaciones Indexadas",
            description: "Lleva tus investigaciones académicas al siguiente nivel.",
            ctaText: "Publicar ahora",
            link: "#revistas"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
            title: "Carteles Digitales",
            description: "La forma más dinámica e interactiva de presentar tus ideas.",
            ctaText: "Crear Cartel",
            link: "#carteles"
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance the slider every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleDotClick = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className="relative w-full h-[600px] overflow-hidden rounded-3xl mb-16 shadow-2xl flex items-center justify-center bg-slate-900 group">
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    <motion.img
                        key={slides[currentSlide].id}
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover object-center absolute inset-0 mix-blend-overlay"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </AnimatePresence>
                {/* Degradado para facilitar la legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block py-1 px-3 rounded-full bg-cta/20 text-cta text-sm font-semibold tracking-wider mb-6 border border-cta/30 uppercase"
                >
                    Bienvenido al Futuro
                </motion.span>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={slides[currentSlide].id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
                            {slides[currentSlide].title}
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl font-light drop-shadow-md">
                            {slides[currentSlide].description}
                        </p>

                        <a
                            href={slides[currentSlide].link}
                            className="bg-cta text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(253,224,71,0.3)] text-lg inline-block"
                        >
                            {slides[currentSlide].ctaText}
                        </a>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicadores de Slider Funcionales */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleDotClick(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-cta scale-125 cursor-default" : "bg-white/40 hover:bg-white/70 cursor-pointer"}`}
                        aria-label={`Ir al slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
