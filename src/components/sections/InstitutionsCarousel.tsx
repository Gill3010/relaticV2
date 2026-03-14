import { motion } from 'framer-motion';

export function InstitutionsCarousel() {
    // Lista ficticia como base. Se puede pasar un array por props si se requiere.
    const institutions = [
        { name: "Universidad Nacional", id: 1 },
        { name: "Instituto Tecnológico", id: 2 },
        { name: "Centro de Ciencias", id: 3 },
        { name: "Global Education Network", id: 4 },
        { name: "Academia de Saberes", id: 5 },
        { name: "Asociación Científica", id: 6 },
        { name: "Universidad Autónoma", id: 7 },
    ];

    // Marquee: La animación se desplazará constantemente duplicando los elementos
    const marqueeVariants = {
        animate: {
            x: ["0%", "-50%"],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    duration: 30,
                    ease: "linear" as const,
                },
            },
        },
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800" id="instituciones">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
                    Instituciones que confían en nosotros
                </h2>
                <p className="mt-4 text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Cientos de centros educativos y organizaciones forman parte de nuestra red latinoamericana y global.
                </p>
            </div>

            <div className="relative overflow-hidden w-full max-w-[1500px] mx-auto group">

                {/* Desvanecimiento en los bordes para el efecto de carrusel infinito */}
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-900 z-10 pointers-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-900 z-10 pointers-events-none"></div>

                <motion.div
                    className="flex whitespace-nowrap"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    {/* Se duplica la lista para crear una rotación perfecta (seamless loop) */}
                    {[...institutions, ...institutions].map((item, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 mx-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-all duration-300 w-64 md:w-80 shadow-sm hover:shadow-xl hover:shadow-cta/10 hover:-translate-y-1 cursor-pointer flex items-center justify-center group/card"
                        >
                            {/* Aquí vendrían los `<img />` reales de los logos. Por ahora texto estilizado. */}
                            <h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-300 group-hover/card:text-cta transition-colors truncate">
                                {item.name}
                            </h3>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
