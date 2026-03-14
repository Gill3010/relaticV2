import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, BookOpen, Monitor, Book, GraduationCap, Scale } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesHovered, setServicesHovered] = useState(false);

    const services = [
        { name: 'Revistas Indexadas', description: 'Publicación académica de alto impacto', icon: BookOpen },
        { name: 'Carteles Digitales', description: 'Presentaciones interactivas modernas', icon: Monitor },
        { name: 'Libros Digitales', description: 'Edición y distribución de e-books', icon: Book },
        { name: 'Plataforma de aprendizaje continuo', description: 'Cursos y actualizaciones constantes', icon: GraduationCap },
        { name: 'Propiedad Intelectual', description: 'Protección de tus creaciones', icon: Scale },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <nav className="max-w-7xl mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between text-slate-800 dark:text-white bg-white/40 dark:bg-slate-900/40">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center focus:outline-none cursor-pointer">
                    <span className="text-2xl font-bold tracking-tight">Relatic<span className="text-cta">V2</span></span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#inicio" className="text-sm font-medium hover:text-cta transition-colors">Inicio</a>
                    <a href="#instituciones" className="text-sm font-medium hover:text-cta transition-colors">Convenios</a>
                    <a href="#blog" className="text-sm font-medium hover:text-cta transition-colors">Blog</a>

                    {/* Services Mega Menu Trigger */}
                    <div
                        className="relative"
                        onMouseEnter={() => setServicesHovered(true)}
                        onMouseLeave={() => setServicesHovered(false)}
                    >
                        <button className="flex items-center space-x-1 text-sm font-medium hover:text-cta transition-colors outline-none py-2 cursor-pointer">
                            <span>Servicios</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", servicesHovered && "rotate-180")} />
                        </button>

                        {/* Mega Menu Dropdown */}
                        <AnimatePresence>
                            {servicesHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden p-6"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        {services.map((service, index) => (
                                            <a key={index} href={`#${service.name.toLowerCase().replace(/ /g, '-')}`} className="flex items-start p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors group">
                                                <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-cta group-hover:text-slate-900 transition-colors">
                                                    <service.icon className="w-5 h-5" />
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-semibold mb-1 group-hover:text-cta transition-colors text-slate-900 dark:text-white">{service.name}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{service.description}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <a href="#contacto" className="text-sm font-medium hover:text-cta transition-colors">Contacto</a>
                </div>

                {/* CTA Desktop */}
                <div className="hidden md:flex">
                    <button className="bg-cta text-slate-900 font-semibold px-6 py-2.5 rounded-full hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cta/20">
                        Comenzar
                    </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="text-slate-800 dark:text-white hover:text-cta transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer Right-to-Left */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[70] p-6 shadow-2xl border-l border-white/20 dark:border-slate-800 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Relatic<span className="text-cta">V2</span></span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <a href="#inicio" className="text-lg font-medium p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white">Inicio</a>

                                <div className="border-t border-b border-slate-200 dark:border-slate-800 py-4 my-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block px-3">Servicios</span>
                                    {services.map((service, index) => (
                                        <a key={index} href={`#${service.name.toLowerCase().replace(/ /g, '-')}`} className="flex items-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group mb-1">
                                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 group-hover:bg-cta group-hover:text-slate-900 transition-colors">
                                                <service.icon className="w-5 h-5 text-slate-500 group-hover:text-slate-900" />
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-cta">{service.name}</span>
                                        </a>
                                    ))}
                                </div>

                                <a href="#instituciones" className="text-lg font-medium p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white">Convenios</a>
                                <a href="#blog" className="text-lg font-medium p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white">Blog</a>
                                <a href="#contacto" className="text-lg font-medium p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white mb-6">Contacto</a>

                                <button className="w-full mt-4 bg-cta text-slate-900 font-semibold px-5 py-3.5 rounded-xl hover:bg-yellow-400 shadow-lg shadow-cta/20 transition-all active:scale-95">
                                    Comenzar
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
