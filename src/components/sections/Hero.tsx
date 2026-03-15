import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Deterministic pseudo-random (seeded) — keeps scatter positions stable across resizes
const pr = (seed: number) => {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};

export function Hero() {
    const slides = [
        { id: 1, title: 'Revistas Indexadas', description: 'Publicación académica de alto impacto para investigadores y autores.', ctaText: 'Publicar ahora', link: '#revistas' },
        { id: 2, title: 'Carteles Digitales', description: 'Presentaciones interactivas modernas para compartir tus ideas.', ctaText: 'Crear Cartel', link: '#carteles' },
        { id: 3, title: 'Libros Digitales', description: 'Edición y distribución de e-books para llegar a más lectores.', ctaText: 'Publicar Libro', link: '#libros' },
        { id: 4, title: 'Aprendizaje Continuo', description: 'Cursos y actualizaciones constantes para mantenerte a la vanguardia.', ctaText: 'Ver Cursos', link: '#cursos' },
        { id: 5, title: 'Propiedad Intelectual', description: 'Protección de tus creaciones — próximamente disponible.', ctaText: 'Saber más', link: '#propiedad' },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const scrollProgressRef = useRef(0);

    // ── Framer-motion scroll hooks ─────────────────────────────────────────────
    const { scrollY } = useScroll();

    // Globe canvas: parallax (moves 30 % slower than page)
    const globeY = useTransform(scrollY, [0, 700], [0, 90]);

    // Content text: fade + subtle scale on exit
    const contentOpacity = useTransform(scrollY, [0, 420], [1, 0]);
    const contentScale = useTransform(scrollY, [0, 420], [1, 0.91]);

    // ── Track raw scroll progress for canvas morph ──────────────────────────
    useEffect(() => {
        const onScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            // 0 when hero fully visible, 1 when hero completely above viewport
            scrollProgressRef.current = Math.max(0, Math.min(1, -rect.top / rect.height));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ── Auto-advance slider ──────────────────────────────────────────────────
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // ── Canvas: globe + background network ──────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let rotationX = 0;
        let rotationY = 0;
        let mouseX = 0;
        let mouseY = 0;

        const NUM_PARTICLES = 800;
        const NUM_BG_NODES = 90;

        // Globe shape buffers
        type Vec3 = { x: number; y: number; z: number };
        let spherePos: Vec3[] = [];
        let torusPos: Vec3[] = [];
        let scatterPos: Vec3[] = [];
        let currentPos: Vec3[] = [];

        // Background node state
        type BgNode = {
            x: number; y: number;
            vx: number; vy: number;
            alpha: number; phase: number;
            pulseR: number; pulseActive: boolean;
        };
        let bgNodes: BgNode[] = [];

        // ── Shape initialization ─────────────────────────────────────────
        const initShapes = () => {
            const w = canvas.width;
            const h = canvas.height;
            const radius = Math.min(w, h) * 0.38;

            spherePos = [];
            torusPos = [];
            scatterPos = [];
            currentPos = [];

            for (let i = 0; i < NUM_PARTICLES; i++) {
                // ── Sphere (Fibonacci) ───────────────────────────────────
                const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES);
                const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;
                spherePos.push({
                    x: radius * Math.cos(theta) * Math.sin(phi),
                    y: radius * Math.sin(theta) * Math.sin(phi),
                    z: radius * Math.cos(phi),
                });

                // ── Torus ────────────────────────────────────────────────
                const R = radius * 0.68;
                const r = radius * 0.30;
                const seg = 40;          // slices around major circle
                const tube = 20;          // slices around tube
                const iPhi = Math.floor(i / tube);
                const iTube = i % tube;
                const tPhi = (iPhi / seg) * Math.PI * 2;
                const tTheta = (iTube / tube) * Math.PI * 2;
                torusPos.push({
                    x: (R + r * Math.cos(tTheta)) * Math.cos(tPhi),
                    y: r * Math.sin(tTheta),
                    z: (R + r * Math.cos(tTheta)) * Math.sin(tPhi),
                });

                // ── Scatter / Galaxy ─────────────────────────────────────
                // Deterministic so positions are stable across resizes
                const angle = pr(i * 2.39996) * Math.PI * 4;
                const dist = Math.sqrt(pr(i * 1.61803)) * radius * 1.65;
                const vert = (pr(i * 3.14159) - 0.5) * radius * 0.45;
                scatterPos.push({
                    x: Math.cos(angle) * dist,
                    y: vert,
                    z: Math.sin(angle) * dist,
                });

                currentPos.push({ ...spherePos[i] });
            }
        };

        // ── Background nodes ─────────────────────────────────────────────
        const initBgNodes = () => {
            bgNodes = Array.from({ length: NUM_BG_NODES }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                alpha: 0.32 + Math.random() * 0.40,
                phase: Math.random() * Math.PI * 2,
                pulseR: 0,
                pulseActive: false,
            }));
        };

        // ── Resize ───────────────────────────────────────────────────────
        const handleResize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent ? parent.clientWidth : window.innerWidth;
            canvas.height = parent ? parent.clientHeight : 600;
            initShapes();
            initBgNodes();
        };

        // ── Mouse ─────────────────────────────────────────────────────────
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / canvas.width) * 2 - 1;
            mouseY = ((e.clientY - rect.top) / canvas.height) * 2 - 1;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        handleResize();

        // ── Lerp helper ───────────────────────────────────────────────────
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        // ── Pulse trigger ─────────────────────────────────────────────────
        let lastPulse = 0;
        const maybeTriggerpulse = (ts: number) => {
            if (ts - lastPulse > 2800) {
                lastPulse = ts;
                const node = bgNodes[Math.floor(Math.random() * bgNodes.length)];
                node.pulseActive = true;
                node.pulseR = 0;
            }
        };

        // ── Main animation loop ───────────────────────────────────────────
        const animate = (ts: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scrollP = scrollProgressRef.current;

            // Globe rotation
            rotationX += 0.002 + mouseY * 0.012;
            rotationY += 0.008 + mouseX * 0.025;

            const cosX = Math.cos(rotationX);
            const sinX = Math.sin(rotationX);
            const cosY = Math.cos(rotationY);
            const sinY = Math.sin(rotationY);

            const time = Date.now() * 0.001;
            const pulseDelta = Math.sin(time * 0.8) * 10;
            const radiusScale = Math.min(canvas.width, canvas.height) * 0.38 + pulseDelta;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // ── Aura behind globe ─────────────────────────────────────────
            const auraR = radiusScale * (1.35 + Math.sin(time * 0.45) * 0.06);
            const auraG = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR);
            auraG.addColorStop(0, `rgba(253, 224,  71, 0.14)`);
            auraG.addColorStop(0.45, `rgba( 34, 211, 238, 0.07)`);
            auraG.addColorStop(0.85, `rgba(  6,  78, 137, 0.04)`);
            auraG.addColorStop(1, `rgba(  0,   0,   0, 0.00)`);
            ctx.fillStyle = auraG;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ── Background network nodes ──────────────────────────────────
            maybeTriggerpulse(ts);
            const CON_DIST = 185;

            for (let i = 0; i < bgNodes.length; i++) {
                const n = bgNodes[i];
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0) n.x = canvas.width;
                if (n.x > canvas.width) n.x = 0;
                if (n.y < 0) n.y = canvas.height;
                if (n.y > canvas.height) n.y = 0;
                n.phase += 0.018;

                const a = n.alpha * (0.65 + 0.35 * Math.sin(n.phase));

                // Connections
                for (let j = i + 1; j < bgNodes.length; j++) {
                    const m = bgNodes[j];
                    const dx = n.x - m.x;
                    const dy = n.y - m.y;
                    const dst = Math.sqrt(dx * dx + dy * dy);
                    if (dst < CON_DIST) {
                        const lineA = (1 - dst / CON_DIST) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(m.x, m.y);
                        ctx.strokeStyle = `rgba(34, 211, 238, ${lineA.toFixed(3)})`;
                        ctx.lineWidth = 0.9;
                        ctx.stroke();
                    }
                }

                // Pulse ripple
                if (n.pulseActive) {
                    n.pulseR += 2.2;
                    const pA = Math.max(0, 0.38 - n.pulseR / 115);
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, n.pulseR, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${pA.toFixed(3)})`;
                    ctx.lineWidth = 1.1;
                    ctx.stroke();
                    if (n.pulseR > 115) { n.pulseActive = false; n.pulseR = 0; }
                }

                // Node dot
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2.8, 0, Math.PI * 2);
                ctx.shadowBlur = 11;
                ctx.shadowColor = 'rgba(34, 211, 238, 0.75)';
                ctx.fillStyle = `rgba(34, 211, 238, ${a.toFixed(3)})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // ── Globe morph ───────────────────────────────────────────────
            //   scrollP: 0 → 1
            //   0.00–0.15 : sphere
            //   0.15–0.50 : sphere → torus
            //   0.50–0.65 : torus
            //   0.65–0.95 : torus → scatter
            const morphToTorus = Math.max(0, Math.min(1, (scrollP - 0.15) / 0.35));
            const morphToScatter = Math.max(0, Math.min(1, (scrollP - 0.65) / 0.30));

            for (let i = 0; i < NUM_PARTICLES; i++) {
                const sp = spherePos[i];
                const tp = torusPos[i];
                const scp = scatterPos[i];

                let tx = lerp(sp.x, tp.x, morphToTorus);
                let ty = lerp(sp.y, tp.y, morphToTorus);
                let tz = lerp(sp.z, tp.z, morphToTorus);
                tx = lerp(tx, scp.x, morphToScatter);
                ty = lerp(ty, scp.y, morphToScatter);
                tz = lerp(tz, scp.z, morphToScatter);

                // Smooth lerp (per-frame, 5 % toward target)
                currentPos[i].x += (tx - currentPos[i].x) * 0.05;
                currentPos[i].y += (ty - currentPos[i].y) * 0.05;
                currentPos[i].z += (tz - currentPos[i].z) * 0.05;
            }

            // ── Globe projection & draw ───────────────────────────────────
            const projected = currentPos.map(p => {
                const y1 = p.y * cosX - p.z * sinX;
                const z1 = p.y * sinX + p.z * cosX;
                const x2 = p.x * cosY + z1 * sinY;
                const z2 = -p.x * sinY + z1 * cosY;
                return { x2, y1, z2 };
            }).sort((a, b) => b.z2 - a.z2);

            projected.forEach(p => {
                const focalLength = 1000;
                const scale = focalLength / (focalLength + p.z2 + 400);
                const x2D = p.x2 * scale + cx;
                const y2D = p.y1 * scale + cy;
                const size = Math.max(1.2, 3.5 * scale);

                const opFactor = (p.z2 + radiusScale) / (radiusScale * 2);
                const depthAlpha = Math.max(0.35, Math.min(1, Math.pow(opFactor, 0.8)));

                // Color: interpolates yellow ↔ cyan as morph progresses
                const cyanMix = morphToTorus * (1 - morphToScatter * 0.4);
                const rC = Math.round(lerp(253, 34, cyanMix));
                const gC = Math.round(lerp(224, 211, cyanMix));
                const bC = Math.round(lerp(71, 238, cyanMix));

                ctx.beginPath();
                ctx.arc(x2D, y2D, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${depthAlpha.toFixed(3)})`;
                ctx.shadowBlur = depthAlpha > 0.5 ? 12 : 4;
                ctx.shadowColor = depthAlpha > 0.5
                    ? `rgb(${rC}, ${gC}, ${bC})`
                    : `rgba(${rC}, ${gC}, ${bC}, 0.3)`;
                ctx.fill();
            });

            ctx.shadowBlur = 0;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[600px] overflow-hidden flex items-center justify-center bg-slate-900 group"
        >
            {/* Canvas layer — parallax on scroll */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: globeY }}
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full opacity-85 mix-blend-screen pointer-events-auto cursor-crosshair"
                />
                {/* Depth gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent pointer-events-none" />
                {/* Left / right edge vignette for full-bleed */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-slate-900/60 pointer-events-none" />
            </motion.div>

            {/* Hero text content — fade + scale on scroll exit */}
            <motion.div
                className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
                style={{ opacity: contentOpacity, scale: contentScale }}
            >
                {/* Badge block */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="flex flex-col items-center mb-10 md:mb-14 gap-2 -mt-12 md:-mt-16"
                >
                    <span className="inline-block py-1 px-4 rounded-full bg-cta/20 text-cta text-sm font-bold tracking-widest border border-cta/40 uppercase shadow-[0_0_12px_rgba(253,224,71,0.2)]">
                        Bienvenido al Futuro
                    </span>
                    <span className="text-[11px] text-cyan-400/70 tracking-[0.25em] uppercase font-medium">
                        Red Latinoamericana de Investigaciones Cualitativas
                    </span>
                </motion.div>

                {/* Slide content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slides[currentSlide].id}
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -22 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg hero-title-gradient">
                            {slides[currentSlide].title}
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl font-light drop-shadow-md">
                            {slides[currentSlide].description}
                        </p>

                        <a
                            href={slides[currentSlide].link}
                            className="bg-cta text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(253,224,71,0.35)] text-lg inline-block"
                        >
                            {slides[currentSlide].ctaText}
                        </a>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Slider dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide
                            ? 'bg-cta scale-125 cursor-default'
                            : 'bg-white/40 hover:bg-white/70 cursor-pointer'
                            }`}
                        aria-label={`Ir al slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
