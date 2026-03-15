import { motion } from 'framer-motion';

const images = [
    { src: '/institutions/Aiu.jpeg', alt: 'AIU', href: '' },
    { src: '/institutions/Centrolatinoamericano.jpeg', alt: 'Centro Latinoamericano', href: 'https://cespecorporativa.org/' },
    { src: '/institutions/Crupo.jpeg', alt: 'Grupo Panamá Oeste', href: 'https://crupanamaoeste.up.ac.pa/' },
    { src: '/institutions/Investigadores.jpeg', alt: 'Red de Investigadores', href: 'https://www.facebook.com/edgardo.reedergonzalez.5' },
    { src: '/institutions/Redipai.jpeg', alt: 'REDIPAI', href: '' },
    { src: '/institutions/Santander.jpeg', alt: 'Universidad Santander', href: 'https://usantander.edu.pa/' },
    { src: '/institutions/Udellpa.jpeg', alt: 'UDEL', href: 'https://udellpa.edu.pa/' },
    { src: '/institutions/Uea.jpeg', alt: 'UEA', href: '' },
    { src: '/institutions/Unihossana.jpeg', alt: 'Unihossana', href: 'https://uh.ac.pa/' },
    { src: '/institutions/Metxi.jpeg', alt: 'Metxi', href: 'https://www.metxi.net/Metxi/' },
];

export function InstitutionsCarousel() {

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
        <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800" id="instituciones">
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
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 z-10 pointer-events-none" />

                <motion.div
                    className="flex whitespace-nowrap"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    {[...images, ...images].map((item, i) => {
                        const cardClass = "flex-shrink-0 mx-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 transition-all duration-300 w-64 md:w-80 shadow-md hover:shadow-xl hover:shadow-cta/15 hover:border-cta/40 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center gap-4 group/card";
                        const content = (
                            <>
                                <div className="relative w-full h-28 md:h-32 flex items-center justify-center overflow-hidden rounded-xl px-2">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-[1.03]"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-cta/25 via-transparent to-primary/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                                        aria-hidden
                                    />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-300 group-hover/card:text-cta transition-colors truncate w-full text-center">
                                    {item.alt}
                                </h3>
                            </>
                        );
                        return item.href ? (
                            <a
                                key={i}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cardClass}
                            >
                                {content}
                            </a>
                        ) : (
                            <div key={i} className={cardClass}>
                                {content}
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
