import { Navbar } from '../components/sections/Navbar';
import { Hero } from '../components/sections/Hero';
import { InstitutionsCarousel } from '../components/sections/InstitutionsCarousel';
import { Footer } from '../components/sections/Footer';
import { NetworkCanvas } from '../components/sections/NetworkCanvas';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white selection:bg-cta selection:text-slate-900 font-sans">
            <Navbar />

            {/* Espacio + badge "Bienvenido a la Versión 2.0" entre Navbar y Hero */}
            <div className="pt-28 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full text-sm font-medium mb-8 shadow-sm backdrop-blur-md self-center">
                    <span className="w-2 h-2 rounded-full bg-cta animate-pulse"></span>
                    Bienvenidos a RELATIC PANAMÁ
                </div>
            </div>

            {/* Hero full-width (fuera del contenedor para llegar de borde a borde) */}
            <Hero />

            {/* Espacio entre Hero y NetworkCanvas — igual que antes */}
            <div className="mb-16" />

            {/* Nuevo Canvas Moderno Interactivo */}
            <NetworkCanvas />

            <InstitutionsCarousel />
            <Footer />
        </div>
    );
}
