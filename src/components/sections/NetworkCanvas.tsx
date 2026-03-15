import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function NetworkCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particlesArray: Particle[] = [];
        let animationFrameId: number;

        const mouse = {
            x: undefined as number | undefined,
            y: undefined as number | undefined,
            radius: 120 // How far the mouse pushes particles/connects
        };

        const handleResize = () => {
            // Match canvas dimensions to the wrapper parent
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            initParticles();
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // CTA Color usually means brighter yellow! We'll use 1.5 - 3 to make them visible
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY;

                // Collision/Repulsion with mouse
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        // Max force when close, lower when at radius edge
                        const force = (mouse.radius - distance) / mouse.radius;
                        // Move inversely to the distance
                        const moveX = forceDirectionX * force * 3;
                        const moveY = forceDirectionY * force * 3;

                        this.x -= moveX;
                        this.y -= moveY;
                    }
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#FDE047'; // cta color
                ctx.fill();
            }
        }

        const initParticles = () => {
            particlesArray = [];
            // Dynamically calculate number based on area (responsive)
            const area = canvas.height * canvas.width;
            const numberOfParticles = Math.min(Math.floor(area / 9000), 200); // max 200

            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        };

        const connect = () => {
            const maxDistance = 14000; // Squared distance (approx 118px)

            for (let a = 0; a < particlesArray.length; a++) {
                // Connect particles to each other
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = dx * dx + dy * dy;

                    if (distance < maxDistance) {
                        const opacityValue = 1 - (distance / maxDistance);
                        ctx!.strokeStyle = `rgba(253, 224, 71, ${opacityValue * 0.4})`; // Semi-transparent yellow
                        ctx!.lineWidth = 1;
                        ctx!.beginPath();
                        ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx!.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx!.stroke();
                    }
                }

                // Connect particles to mouse
                if (mouse.x != null && mouse.y != null) {
                    let dxToMouse = particlesArray[a].x - mouse.x;
                    let dyToMouse = particlesArray[a].y - mouse.y;
                    let distanceToMouse = dxToMouse * dxToMouse + dyToMouse * dyToMouse;

                    if (distanceToMouse < maxDistance * 1.5) { // Reach further to mouse
                        const opacityValue = 1 - (distanceToMouse / (maxDistance * 1.5));
                        ctx!.strokeStyle = `rgba(253, 224, 71, ${opacityValue * 0.6})`;
                        ctx!.lineWidth = 1.2; // Slightly thicker towards mouse
                        ctx!.beginPath();
                        ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx!.lineTo(mouse.x, mouse.y);
                        ctx!.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize(); // Initial resize and init
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden mb-16 shadow-2xl flex items-center justify-center bg-slate-900 bg-opacity-100 border-y border-slate-800">
            {/* Malla de Gradiente (Gradient Mesh as background base) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cta/10 blur-[100px] rounded-full mix-blend-screen animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute top-[30%] left-[30%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Neural Network Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 block pointer-events-auto"
            />

            {/* Text Overlay */}
            <div className="relative z-20 text-center px-4 max-w-3xl pointer-events-none select-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-cta/20 text-cta text-sm font-semibold tracking-wider mb-4 border border-cta/30 uppercase">
                        Colaboración Interactiva
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
                        Red de <span className="text-cta">Conocimiento</span>
                    </h2>
                    <p className="text-lg text-slate-300 font-light drop-shadow-md">
                        Una plataforma moderna para conectar investigadores, educadores y estudiantes.
                        Nuestra red interactiva simboliza el flujo continuo de ideas e innovación,
                        donde cada punto eres tú y cada conexión es un nuevo descubrimiento.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
