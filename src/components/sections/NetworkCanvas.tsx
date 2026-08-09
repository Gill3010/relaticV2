import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MouseState {
  x?: number;
  y?: number;
  radius: number;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
  }

  update(canvasWidth: number, canvasHeight: number, mouse: MouseState) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x > canvasWidth || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvasHeight || this.y < 0) this.speedY = -this.speedY;

    // Collision/Repulsion with mouse
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        const moveX = forceDirectionX * force * 3;
        const moveY = forceDirectionY * force * 3;

        this.x -= moveX;
        this.y -= moveY;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#FDE047'; // cta color
    ctx.fill();
  }
}

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    const mouse: MouseState = {
      x: undefined,
      y: undefined,
      radius: 120,
    };

    const handleResize = () => {
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

    const initParticles = () => {
      particlesArray = [];
      const area = canvas.height * canvas.width;
      const numberOfParticles = Math.min(Math.floor(area / 9000), 200);

      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(canvas.width, canvas.height));
      }
    };

    const connect = () => {
      const maxDistance = 14000;

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = dx * dx + dy * dy;

          if (distance < maxDistance) {
            const opacityValue = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(253, 224, 71, ${opacityValue * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }

        if (mouse.x != null && mouse.y != null) {
          const dxToMouse = particlesArray[a].x - mouse.x;
          const dyToMouse = particlesArray[a].y - mouse.y;
          const distanceToMouse = dxToMouse * dxToMouse + dyToMouse * dyToMouse;

          if (distanceToMouse < maxDistance * 1.5) {
            const opacityValue = 1 - distanceToMouse / (maxDistance * 1.5);
            ctx.strokeStyle = `rgba(253, 224, 71, ${opacityValue * 0.6})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(canvas.width, canvas.height, mouse);
        particlesArray[i].draw(ctx);
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full h-[450px] bg-slate-950 overflow-hidden flex flex-col items-center justify-center border-y border-slate-800">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-pointer" />

      {/* Decorative Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cta/10 via-transparent to-transparent pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 text-center px-4 max-w-3xl pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block py-1 px-3 rounded-full bg-cta/10 text-cta text-xs font-semibold tracking-wider border border-cta/20 uppercase mb-4"
        >
          Red Global de Conocimiento
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
        >
          Conectando mentes e investigadores en todo el mundo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg font-normal"
        >
          Visualización interactiva de nodos académicos en tiempo real. Mueve el cursor para interactuar con la red.
        </motion.p>
      </div>
    </section>
  );
}
