import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import { motion, animate } from 'framer-motion';
import { ArrowRight, Globe, Layers, BookOpen, GraduationCap } from 'lucide-react';
import { EarthNode } from '../canvas/EarthNode';

export function GlobalNetwork() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-slate-950 text-white pt-24 pb-0"
    >
      {/* Subtle radial background glow centered behind globe */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-950/30 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Content Overlay */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg shadow-cyan-950/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Red Internacional de Colaboración
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Potenciamos la investigación{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta via-amber-300 to-cyan-400">
              a escala global
            </span>
          </h2>

          <p className="text-base md:text-xl text-slate-300 leading-relaxed mb-8">
            Impulsamos la colaboración entre científicos, instituciones y universidades de Latinoamérica y el mundo,
            multiplicando el impacto del conocimiento a través de una red viva e interactiva.
          </p>

        </motion.div>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-14"
        >
          <a
            href="https://miembros.relatic.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center px-8 py-4 font-extrabold text-slate-950 bg-cta rounded-full transition-all hover:scale-105 hover:bg-yellow-300 hover:shadow-[0_0_35px_rgba(253,224,71,0.6)] focus:outline-none shadow-xl shadow-cta/20"
          >
            Forma parte de la red
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* High-Contrast Metrics Panel (Visual Rest Area for perfect legibility) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto pb-10"
        >
          <MetricCard
            endValue={100}
            subtitle="Artículos de revistas"
            icon={Globe}
          />
          <MetricCard
            endValue={50}
            subtitle="Carteles digitales"
            icon={Layers}
          />
          <MetricCard
            endValue={15}
            subtitle="Cursos"
            icon={GraduationCap}
          />
          <MetricCard
            endValue={1}
            subtitle="Libro publicado"
            icon={BookOpen}
          />
        </motion.div>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative z-10 w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden pointer-events-auto flex items-end justify-center -mt-8 md:-mt-16 lg:-mt-20">
        {inView && (
          <Suspense
            fallback={
              <div className="text-slate-400 absolute bottom-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Cargando red global interactiva...
              </div>
            }
          >
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

function MetricCard({
  endValue,
  subtitle,
  icon: Icon,
}: {
  endValue: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, endValue, {
        duration: 2,
        ease: 'easeOut',
        onUpdate(value) {
          setCount(Math.round(value));
        },
      });
      return () => controls.stop();
    }
  }, [inView, endValue]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/95 hover:shadow-cyan-950/40"
    >
      <div className="p-2.5 rounded-xl bg-slate-800/80 text-cyan-400 mb-3 border border-slate-700/50">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-500 mb-1.5 tabular-nums">
        {count}+
      </div>
      <div className="text-xs md:text-sm font-semibold text-slate-300 leading-snug">
        {subtitle}
      </div>
    </div>
  );
}
