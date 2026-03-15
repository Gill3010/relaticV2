import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
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
                            <Shield className="w-8 h-8 text-cta" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Políticas de <span className="text-cta">Privacidad</span>
                        </h1>
                    </div>

                    <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-400 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introducción</h2>
                            <p>
                                En Relatic Panamá (Red Latinoamericana de Investigaciones Cualitativas), valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios relacionados con la ciencia, tecnología e innovación.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Información que Recopilamos</h2>
                            <p>
                                Recopilamos información que usted nos proporciona directamente, como cuando se registra para una revista indexada, solicita información sobre propiedad intelectual o se inscribe en nuestros cursos de aprendizaje continuo. Esto puede incluir:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nombre y apellidos</li>
                                <li>Dirección de correo electrónico</li>
                                <li>Filiación institucional o académica</li>
                                <li>Información de contacto profesional</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Uso de la Información</h2>
                            <p>
                                La información recopilada se utiliza exclusivamente para:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Gestionar sus publicaciones y certificaciones académicas.</li>
                                <li>Proveer actualizaciones sobre nuestras investigaciones y convenios institucionales.</li>
                                <li>Mejorar la experiencia de usuario en nuestra plataforma digital.</li>
                                <li>Cumplir con obligaciones legales y normativas en el ámbito de la investigación.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Protección de Datos</h2>
                            <p>
                                Implementamos medidas de seguridad técnicas y administrativas para proteger sus datos contra el acceso no autorizado, la alteración o la divulgación. Utilizamos protocolos de encriptación y servidores seguros para garantizar que su información académica y personal esté protegida.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Sus Derechos</h2>
                            <p>
                                Usted tiene derecho a acceder, rectificar o eliminar su información personal en cualquier momento. Para ejercer estos derechos, puede ponerse en contacto con nuestro equipo administrativo a través de los canales oficiales proporcionados en nuestro sitio web.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-slate-800 text-sm italic">
                            Última actualización: 15 de marzo de 2026. Relatic Panamá se reserva el derecho de actualizar esta política para reflejar cambios en nuestras prácticas o requisitos legales.
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
