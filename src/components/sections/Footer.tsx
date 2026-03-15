import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, BookOpen, MonitorPlay, BookText, GraduationCap, Scale, Home, Users, LayoutGrid, MessageSquare, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                        <a href="https://www.linkedin.com/in/relatic-panam%C3%A1-a80b93356/" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                        </a>
                        <a href="https://x.com/RelaticPanama" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.95H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/people/Relatic-Panam%C3%A1/61573905375213/" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <Facebook className="w-5 h-5 text-[#1877F2]" />
                        </a>
                        <a href="https://www.instagram.com/relatic.panama" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300">
                            <Instagram className="w-5 h-5 text-[#E1306C]" />
                        </a>
                        <a href="https://www.youtube.com/@RelaticPanama" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300 flex items-center justify-center" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                                <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                        <a href="https://wa.me/50766751782" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 hover:scale-110 transition-transform duration-300 flex items-center justify-center" aria-label="WhatsApp">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Navegación */}
                <div>
                    <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Navegación</h4>
                    <ul className="space-y-4">
                        <li><a href="/" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Home className="w-5 h-5" strokeWidth={1.5} /> Inicio</a></li>
                        <li><a href="/#instituciones" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Users className="w-5 h-5" strokeWidth={1.5} /> Convenios</a></li>
                        <li><a href="/#servicios" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><LayoutGrid className="w-5 h-5" strokeWidth={1.5} /> Servicios</a></li>
                        <li><a href="https://relaticpanama.org/_blog/" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Newspaper className="w-5 h-5" strokeWidth={1.5} /> Blog</a></li>
                        <li><a href="/#contacto" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><MessageSquare className="w-5 h-5" strokeWidth={1.5} /> Contacto</a></li>
                    </ul>
                </div>

                {/* Links útiles */}
                <div>
                    <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Servicios</h4>
                    <ul className="space-y-4">
                        <li><a href="https://relaticpanama.org/_journals/" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><BookOpen className="w-5 h-5" strokeWidth={1.5} /> Revistas Indexadas</a></li>
                        <li><a href="https://relaticpanama.org/_posters/" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><MonitorPlay className="w-5 h-5" strokeWidth={1.5} /> Carteles Digitales</a></li>
                        <li><a href="https://relaticpanama.org/_books/index.php/edrp/catalog" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><BookText className="w-5 h-5" strokeWidth={1.5} /> Libros Digitales</a></li>
                        <li><a href="https://relaticpanama.org/_classroom/" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><GraduationCap className="w-5 h-5" strokeWidth={1.5} /> Aprendizaje Continuo</a></li>
                        <li><a href="#" className="flex items-center gap-3 hover:text-cta transition-colors text-sm"><Scale className="w-5 h-5" strokeWidth={1.5} /> Propiedad Intelectual</a></li>
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
                        <Link to="/privacidad" className="hover:text-white transition-colors">Políticas de Privacidad</Link>
                        <Link to="/terminos" className="hover:text-white transition-colors">Términos de Servicio</Link>
                    </div>
                    <p>Powered by <a href="https://innova-proyectos.web.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-cta hover:underline">Innova Proyectos</a></p>
                </div>
            </div>
        </footer>
    );
}

