import { Navbar } from './components/sections/Navbar';
import { Hero } from './components/sections/Hero';
import { InstitutionsCarousel } from './components/sections/InstitutionsCarousel';
import { Footer } from './components/sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white selection:bg-cta selection:text-slate-900 font-sans">
      <Navbar />

      {/* Spacer margin to prevent Navbar overlap with Hero */}
      <main className="pt-28 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center min-h-[80vh]">

        {/* Etiqueta superior opcional por diversión :) */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full text-sm font-medium mb-8 shadow-sm backdrop-blur-md self-center">
          <span className="w-2 h-2 rounded-full bg-cta animate-pulse"></span>
          Bienvenido a la Versión 2.0
        </div>

        <Hero />
      </main>

      <InstitutionsCarousel />
      <Footer />
    </div>
  );
}

export default App;
