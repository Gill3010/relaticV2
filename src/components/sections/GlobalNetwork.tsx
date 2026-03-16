import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EarthNode } from '../canvas/EarthNode';

export function GlobalNetwork() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-white dark:bg-primary pt-24 pb-0">
      
      {/* Main Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-12 mb-6"
        >
          Una red <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-amber-500">distinta a todas las demás</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8"
        >
          Conectamos investigadores en toda Latinoamérica, multiplicando el impacto de nuestro trabajo, colaborando en proyectos y expandiendo nuestro conocimiento colectivo.
        </motion.p>
        
        {/* Call to Action Button */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="mb-16"
        >
          <a
            href="https://miembros.relatic.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center px-8 py-4 font-bold text-slate-900 bg-cta rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(253,224,71,0.5)] focus:outline-none"
          >
            Forma parte de la red
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Static Metrics Row (No Cards) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full max-w-5xl mx-auto pb-12"
        >
            <MetricItem title="+100" subtitle="Artículos de revistas" />
            <MetricItem title="+50" subtitle="Carteles digitales" />
            <MetricItem title="+15" subtitle="Cursos" />
            <MetricItem title="+1" subtitle="Libro publicado" />
        </motion.div>
      </div>

      {/* 3D Canvas Box - Restricted height so we only see top of globe */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pointer-events-auto flex items-end justify-center -mt-10 md:-mt-16 lg:-mt-24">
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cta/10 dark:bg-cta/5 rounded-full blur-[100px] pointer-events-none" />

        {inView && (
          <Suspense fallback={<div className="text-slate-400 absolute bottom-10">Cargando globo interactivo...</div>}>
            <Canvas
              camera={{ position: [0, 1.5, 4.5], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <EarthNode />
            </Canvas>
          </Suspense>
        )}
      </div>

    </section>
  );
}

function MetricItem({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 mb-2">
        {title}
      </div>
      <div className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300">
        {subtitle}
      </div>
    </div>
  );
}
