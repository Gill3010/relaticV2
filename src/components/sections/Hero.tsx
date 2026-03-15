import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Hero() {
    // Ejemplos de imágenes (podrías reemplazarlas por las de tu landing)
    const slides = [
        {
            id: 1,
            title: "Revistas Indexadas",
            description: "Publicación académica de alto impacto para investigadores y autores.",
            ctaText: "Publicar ahora",
            link: "#revistas"
        },
        {
            id: 2,
            title: "Carteles Digitales",
            description: "Presentaciones interactivas modernas para compartir tus ideas.",
            ctaText: "Crear Cartel",
            link: "#carteles"
        },
        {
            id: 3,
            title: "Libros Digitales",
            description: "Edición y distribución de e-books para llegar a más lectores.",
            ctaText: "Publicar Libro",
            link: "#libros"
        },
        {
            id: 4,
            title: "Aprendizaje Continuo",
            description: "Cursos y actualizaciones constantes para mantenerte a la vanguardia.",
            ctaText: "Ver Cursos",
            link: "#cursos"
        },
        {
            id: 5,
            title: "Propiedad Intelectual",
            description: "Protección de tus creaciones — próximamente disponible.",
            ctaText: "Saber más",
            link: "#propiedad"
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Auto-advance the slider every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // 3D Globe Particle Animation Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number, y: number, z: number }[] = [];
        let rotationX = 0;
        let rotationY = 0;
        // Normalized mouse position [-1, 1] used as speed boost
        let mouseX = 0;
        let mouseY = 0;

        const initParticles = () => {
            particles = [];
            const numParticles = 800;
            // Configurar radio dependiendo del tamaño de pantalla para que no se salga
            const h = canvas.height;
            const w = canvas.width;
            const radius = Math.min(w, h) * 0.45;

            for (let i = 0; i < numParticles; i++) {
                // Sphere math (Fibonacci sphere)
                const phi = Math.acos(-1 + (2 * i) / numParticles);
                const theta = Math.sqrt(numParticles * Math.PI) * phi;

                particles.push({
                    x: radius * Math.cos(theta) * Math.sin(phi),
                    y: radius * Math.sin(theta) * Math.sin(phi),
                    z: radius * Math.cos(phi)
                });
            }
        };

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = 600;
            }
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            // Normalizar a [-1, 1]: el cursor aporta un boost proporcional a su distancia del centro
            mouseX = ((e.clientX - rect.left) / canvas.width) * 2 - 1;
            mouseY = ((e.clientY - rect.top) / canvas.height) * 2 - 1;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        handleResize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Velocidad base constante (el globo NUNCA para)
            const autoSpeedX = 0.002;
            const autoSpeedY = 0.008;

            // El cursor suma velocidad adicional proporcional a su posición:
            // cursor a la derecha → gira más rápido a la derecha, etc.
            const boostY = mouseX * 0.025;
            const boostX = mouseY * 0.012;

            rotationX += autoSpeedX + boostX;
            rotationY += autoSpeedY + boostY;

            const cosX = Math.cos(rotationX);
            const sinX = Math.sin(rotationX);
            const cosY = Math.cos(rotationY);
            const sinY = Math.sin(rotationY);

            const time = Date.now() * 0.002;
            const pulse = Math.sin(time) * 10;
            const radiusScale = (Math.min(canvas.width, canvas.height) * 0.44) + pulse;

            const projectedParticles = particles.map(p => {
                const y1 = p.y * cosX - p.z * sinX;
                const z1 = p.y * sinX + p.z * cosX;
                const x2 = p.x * cosY + z1 * sinY;
                const z2 = -p.x * sinY + z1 * cosY;
                return { x2, y1, z2 };
            }).sort((a, b) => b.z2 - a.z2);

            projectedParticles.forEach((p) => {
                const focalLength = 1000;
                const scale = focalLength / (focalLength + p.z2 + 400);
                const x2D = p.x2 * scale + canvas.width / 2;
                const y2D = p.y1 * scale + canvas.height / 2;

                const size = Math.max(1.2, 3.5 * scale);

                ctx.beginPath();
                ctx.arc(x2D, y2D, size, 0, Math.PI * 2);

                const opacityFactor = (p.z2 + radiusScale) / (radiusScale * 2);
                const depthAlpha = Math.max(0.35, Math.min(1, Math.pow(opacityFactor, 0.8)));

                ctx.fillStyle = `rgba(253, 224, 71, ${depthAlpha.toFixed(3)})`;

                if (depthAlpha > 0.5) {
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#FDE047';
                } else {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = 'rgba(253, 224, 71, 0.3)';
                }

                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleDotClick = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className="relative w-full h-[600px] overflow-hidden rounded-3xl mb-16 shadow-2xl flex items-center justify-center bg-slate-900 group">
            <div className="absolute inset-0 z-0">
                {/* 3D Particle Globe Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen pointer-events-auto cursor-crosshair"
                />

                {/* Degradados para facilitar la legibilidad pero permitiendo que brille el Canvas */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/60 to-slate-900 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block py-1 px-3 rounded-full bg-cta/20 text-cta text-sm font-semibold tracking-wider mb-6 border border-cta/30 uppercase"
                >
                    Bienvenido al Futuro
                </motion.span>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={slides[currentSlide].id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
                            {slides[currentSlide].title}
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl font-light drop-shadow-md">
                            {slides[currentSlide].description}
                        </p>

                        <a
                            href={slides[currentSlide].link}
                            className="bg-cta text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(253,224,71,0.3)] text-lg inline-block"
                        >
                            {slides[currentSlide].ctaText}
                        </a>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicadores de Slider Funcionales */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleDotClick(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-cta scale-125 cursor-default" : "bg-white/40 hover:bg-white/70 cursor-pointer"}`}
                        aria-label={`Ir al slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
