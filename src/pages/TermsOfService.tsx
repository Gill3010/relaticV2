import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
            {/* Header / Navbar equivalent for Legal Pages */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al Inicio</span>
                    </Link>
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-black tracking-tighter text-white leading-none">
                            RELATIC <span className="text-cta">PANAMÁ</span>
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-cta/10 rounded-2xl border border-cta/20">
                            <FileText className="w-8 h-8 text-cta" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Términos de <span className="text-cta">Servicio</span>
                        </h1>
                    </div>

                    <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-400 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar la plataforma de Relatic Panamá, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios ni acceder a nuestra red de investigaciones.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Uso de la Plataforma</h2>
                            <p>
                                Relatic Panamá proporciona herramientas para la publicación académica, libros digitales, y aprendizaje continuo. Usted se compromete a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Proporcionar información veraz y precisa en todo momento.</li>
                                <li>No utilizar la plataforma para fines ilícitos o que infrinjan derechos de propiedad intelectual.</li>
                                <li>Respetar la integridad científica y ética en todas las publicaciones y colaboraciones.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Propiedad Intelectual</h2>
                            <p>
                                Todo el contenido presente en esta plataforma, incluyendo software, logos, diseños y estructuras de red, es propiedad de Relatic Panamá o de sus respectivos autores bajo convenios específicos. El uso no autorizado de estos materiales está estrictamente prohibido.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Responsabilidad</h2>
                            <p>
                                Relatic Panamá actúa como una Red de Investigaciones Cualitativas y no se hace responsable por las opiniones vertidas por los investigadores en sus publicaciones. Nos esforzamos por mantener la plataforma disponible, pero no garantizamos el acceso ininterrumpido debido a mantenimientos técnicos o causas ajenas.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Modificaciones</h2>
                            <p>
                                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado de la plataforma después de dichos cambios constituye la aceptación de los nuevos términos.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-slate-800 text-sm italic">
                            Última actualización: 15 de marzo de 2026. Relatic Panamá - Ciencia, Tecnología e Innovación.
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
