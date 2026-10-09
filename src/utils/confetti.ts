/**
 * High-performance, zero-dependency GPU Canvas Confetti Engine
 * Used for award-winning 2026 microinteractions on event registration & onboarding
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  width: number;
  height: number;
  color: string;
  alpha: number;
  decay: number;
}

const COLORS = [
  '#3b82f6', // Sapphire blue
  '#f97316', // Luminous orange
  '#10b981', // Emerald green
  '#8b5cf6', // Violet
  '#ec4899', // Hot pink
  '#fbbf24', // Amber gold
];

export function triggerConfetti(originX = 0.5, originY = 0.6): void {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const count = 75;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI / 4) + Math.random() * (Math.PI / 2) + (Math.random() > 0.5 ? 0 : Math.PI);
    const speed = 7 + Math.random() * 12;

    particles.push({
      x: width * originX,
      y: height * originY,
      vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
      vy: -Math.sin(angle) * speed * 1.3,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.25,
      width: 8 + Math.random() * 6,
      height: 5 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      decay: 0.012 + Math.random() * 0.015,
    });
  }

  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.vx *= 0.985; // drag
      p.angle += p.angularVelocity;
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
