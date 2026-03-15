import { Facebook, Instagram, Linkedin, Youtube, MessageCircleCode, Mail, Phone, MapPin, BookOpen, MonitorPlay, BookText, GraduationCap, Scale, Home, Users, LayoutGrid, MessageSquare, Newspaper } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0F172A] text-slate-300 py-16 px-4 md:px-8 border-t border-slate-800" id="contacto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">

                {/* Columna Principal - Info General */}
                <div className="md:col-span-2">
                    <div className="flex flex-col mb-4">
                        <span className="text-3xl font-black tracking-tighter text-white leading-none">
                            RELATIC <span className="text-cta">PANAMÁ</span>
                        </span>
                        <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest leading-tight mt-1.5">
                            Red Latinoamericana de<br />Investigaciones Cualitativas...
                        </span>
                    </div>
                    <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                        Impulsando el conocimiento y la educación a través de soluciones digitales de alto impacto en toda América Latina.
                    </p>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                        </a>
                        <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.95H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                            </svg>
                        </a>
                        <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <Facebook className="w-5 h-5 text-[#1877F2]" />
                        </a>
                        <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <Instagram className="w-5 h-5 text-[#E1306C]" />
                        </a>
                        <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <Youtube className="w-5 h-5 text-[#FF0000]" />
                        </a>
                        <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <MessageCircleCode className="w-5 h-5 text-[#25D366]" /> {/* WhatsApp color */}
                        </a>
                    </div>
                </div>

                {/* Navegación */}
                <div>
                    <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Navegación</h4>
                    <ul className="space-y-4">
                        <li><a href="#inicio" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Home className="w-5 h-5" strokeWidth={1.5} /> Inicio</a></li>
                        <li><a href="#instituciones" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Users className="w-5 h-5" strokeWidth={1.5} /> Convenios</a></li>
                        <li><a href="#servicios" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><LayoutGrid className="w-5 h-5" strokeWidth={1.5} /> Servicios</a></li>
                        <li><a href="#blog" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Newspaper className="w-5 h-5" strokeWidth={1.5} /> Blog</a></li>
                        <li><a href="#contacto" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><MessageSquare className="w-5 h-5" strokeWidth={1.5} /> Contacto</a></li>
                    </ul>
                </div>

                {/* Links útiles */}
                <div>
                    <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Servicios</h4>
                    <ul className="space-y-4">
                        <li><a href="#revistas" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><BookOpen className="w-5 h-5" strokeWidth={1.5} /> Revistas Indexadas</a></li>
                        <li><a href="#carteles" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><MonitorPlay className="w-5 h-5" strokeWidth={1.5} /> Carteles Digitales</a></li>
                        <li><a href="#libros" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><BookText className="w-5 h-5" strokeWidth={1.5} /> Libros Digitales</a></li>
                        <li><a href="#cursos" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><GraduationCap className="w-5 h-5" strokeWidth={1.5} /> Aprendizaje Continuo</a></li>
                        <li><a href="#propiedad" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Scale className="w-5 h-5" strokeWidth={1.5} /> Propiedad Intelectual</a></li>
                    </ul>
                </div>

                {/* Contacto directo */}
                <div>
                    <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contacto</h4>
                    <ul className="space-y-4 text-sm mt-3">
                        <li className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-800/60 shadow-inner border border-slate-700/50 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-slate-300" />
                            </div>
                            <a href="mailto:administracion@relaticpanama.org" className="hover:text-cta transition-colors text-base text-slate-200">administracion@relaticpanama.org</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-800/60 shadow-inner border border-slate-700/50 flex items-center justify-center">
                                <Phone className="w-4 h-4 text-slate-300" />
                            </div>
                            <span className="text-base text-slate-200">+507 6645-7685 | +507 208-4689</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-800/60 shadow-inner border border-slate-700/50 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-slate-300" />
                            </div>
                            <span className="text-base text-slate-200">Ciudad de Panamá, Panamá</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
                <div className="text-center md:text-left">
                    <p>© {currentYear} Relatic Panamá. Todos los derechos reservados.</p>
                    <p className="mt-1">Ciencia, Tecnología e Innovación.</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
                    </div>
                    <p>Powered by <span className="font-medium text-cta">Innova Proyectos</span></p>
                </div>
            </div>
        </footer>
    );
}
