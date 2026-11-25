import React, { useEffect, useRef } from 'react';

export type SnowIntensity = 'gentle' | 'festive' | 'off';

interface Props {
  darkMode: boolean;
  intensity: SnowIntensity;
}

interface Flake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  driftAmp: number;
  driftFreq: number;
  phase: number;
  angle: number;
  spin: number;
  alpha: number;
  kind: 'mist' | 'crystal' | 'bokeh' | 'ember';
}

function drawCrystal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  angle: number,
  color: string,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = `rgba(${color}, ${alpha})`;
  ctx.lineWidth = Math.max(0.7, r * 0.14);
  ctx.lineCap = 'round';

  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r);
    // Delicate side branches
    ctx.moveTo(0, -r * 0.45);
    ctx.lineTo(r * 0.28, -r * 0.68);
    ctx.moveTo(0, -r * 0.45);
    ctx.lineTo(-r * 0.28, -r * 0.68);
    ctx.stroke();
  }
  ctx.restore();
}

export const AmbientWinterCanvas: React.FC<Props> = ({ darkMode, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (intensity === 'off') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const multiplier = intensity === 'festive' ? 1.65 : 1;
    const total = Math.round(72 * multiplier);

    const flakes: Flake[] = Array.from({ length: total }, (_, idx) => {
      const mod = idx % 10;
      let kind: Flake['kind'] = 'mist';
      if (mod === 0 || mod === 1) kind = 'crystal';
      else if (mod === 2) kind = 'bokeh';
      else if (mod === 3) kind = 'ember';

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size:
          kind === 'crystal'
            ? Math.random() * 5 + 4.5
            : kind === 'bokeh'
              ? Math.random() * 5.5 + 3.5
              : kind === 'ember'
                ? Math.random() * 2 + 1
                : Math.random() * 2 + 0.8,
        speedY:
          kind === 'ember'
            ? -(Math.random() * 0.3 + 0.12)
            : kind === 'bokeh'
              ? Math.random() * 0.9 + 0.55
              : kind === 'crystal'
                ? Math.random() * 0.7 + 0.35
                : Math.random() * 0.45 + 0.2,
        driftAmp: Math.random() * 0.65 + 0.2,
        driftFreq: Math.random() * 0.012 + 0.004,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.015,
        alpha:
          kind === 'bokeh'
            ? Math.random() * 0.22 + 0.1
            : kind === 'crystal'
              ? Math.random() * 0.48 + 0.28
              : kind === 'ember'
                ? Math.random() * 0.5 + 0.25
                : Math.random() * 0.45 + 0.2,
        kind
      };
    });

    let tick = 0;
    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const snowRgb = darkMode ? '248, 245, 238' : '150, 134, 108';
      const goldRgb = darkMode ? '218, 182, 114' : '180, 138, 66';
      const alphaScale = darkMode ? 1 : 0.62;

      for (const f of flakes) {
        f.y += f.speedY;
        f.x += Math.sin(tick * f.driftFreq + f.phase) * f.driftAmp;
        f.angle += f.spin;

        if (f.kind === 'ember') {
          if (f.y < -15) {
            f.y = canvas.height + 15;
            f.x = Math.random() * canvas.width;
          }
        } else if (f.y > canvas.height + 18) {
          f.y = -18;
          f.x = Math.random() * canvas.width;
        }
        if (f.x > canvas.width + 20) f.x = -20;
        if (f.x < -20) f.x = canvas.width + 20;

        const a = f.alpha * alphaScale;

        if (f.kind === 'crystal') {
          drawCrystal(ctx, f.x, f.y, f.size, f.angle, snowRgb, a);
        } else if (f.kind === 'bokeh') {
          const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
          grad.addColorStop(0, `rgba(${snowRgb}, ${a})`);
          grad.addColorStop(1, `rgba(${snowRgb}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (f.kind === 'ember') {
          const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 2.2);
          grad.addColorStop(0, `rgba(${goldRgb}, ${a})`);
          grad.addColorStop(1, `rgba(${goldRgb}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${snowRgb}, ${a})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [darkMode, intensity]);

  if (intensity === 'off') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};
