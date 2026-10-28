'use client';

import { useEffect, useRef } from 'react';

const css = `

.sb-blob {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}
.sb-blob-cyan {
  width: 78vmax; height: 78vmax;
  left: -26vmax; top: -34vmax;
  background: radial-gradient(closest-side, rgba(0, 240, 255, 0.10), rgba(0, 240, 255, 0.03) 55%, transparent);
  animation: sb-drift-1 46s ease-in-out infinite, sb-breathe 18s ease-in-out infinite;
}
.sb-blob-purple {
  width: 84vmax; height: 84vmax;
  right: -34vmax; bottom: -40vmax;
  background: radial-gradient(closest-side, rgba(162, 0, 255, 0.12), rgba(162, 0, 255, 0.04) 55%, transparent);
  animation: sb-drift-2 58s ease-in-out infinite, sb-breathe 22s ease-in-out -6s infinite;
}
.sb-blob-blue {
  width: 56vmax; height: 56vmax;
  right: 4vmax; top: -22vmax;
  background: radial-gradient(closest-side, rgba(29, 111, 255, 0.09), rgba(29, 111, 255, 0.025) 55%, transparent);
  animation: sb-drift-3 52s ease-in-out infinite, sb-breathe 26s ease-in-out -12s infinite;
}
.sb-horizon {
  position: absolute; left: 0; right: 0; bottom: 0; height: 45vh;
  background: radial-gradient(ellipse 70% 100% at 50% 100%, rgba(29, 111, 255, 0.06), transparent 70%);
}

@keyframes sb-drift-1 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50%      { transform: translate3d(9vmax, 7vmax, 0) scale(1.12); }
}
@keyframes sb-drift-2 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1.05); }
  50%      { transform: translate3d(-10vmax, -6vmax, 0) scale(0.94); }
}
@keyframes sb-drift-3 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(0.96); }
  50%      { transform: translate3d(-8vmax, 9vmax, 0) scale(1.1); }
}
@keyframes sb-breathe {
  0%, 100% { opacity: 0.75; }
  50%      { opacity: 1; }
}

@keyframes sb-astro-path {
  0%   { transform: translate3d(3vw, 74vh, 0);  opacity: 0; }
  6%   { opacity: 0.8; }
  24%  { transform: translate3d(8vw, 40vh, 0);  opacity: 0.8; }
  42%  { transform: translate3d(4vw, 16vh, 0);  opacity: 0.8; }
  48%  { transform: translate3d(30vw, 6vh, 0);  opacity: 0; }
  52%  { transform: translate3d(72vw, 6vh, 0);  opacity: 0; }
  58%  { transform: translate3d(90vw, 16vh, 0); opacity: 0.8; }
  76%  { transform: translate3d(86vw, 50vh, 0); opacity: 0.8; }
  92%  { transform: translate3d(92vw, 80vh, 0); opacity: 0.8; }
  96%  { transform: translate3d(95vw, 90vh, 0); opacity: 0; }
  100% { transform: translate3d(3vw, 74vh, 0);  opacity: 0; }
}
@keyframes sb-astro-tumble {
  0%, 100% { transform: rotate(-14deg); }
  50%      { transform: rotate(18deg); }
}
@keyframes sb-astro-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}
@keyframes sb-limb-a { 0%, 100% { transform: rotate(-9deg); } 50% { transform: rotate(11deg); } }
@keyframes sb-limb-b { 0%, 100% { transform: rotate(8deg); }  50% { transform: rotate(-12deg); } }
@keyframes sb-glint  { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.75; } }
@keyframes sb-light  { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }

.sb-astro {
  position: absolute; top: 0; left: 0;
  width: clamp(56px, 6.5vw, 110px);
  opacity: 0;
  animation: sb-astro-path 120s ease-in-out infinite;
  will-change: transform, opacity;
}
.sb-astro-bob    { animation: sb-astro-bob 7s ease-in-out infinite; filter: drop-shadow(0 0 14px rgba(0, 240, 255, 0.22)); }
.sb-astro-tumble { animation: sb-astro-tumble 22s ease-in-out infinite; }
.sb-limb-a { animation: sb-limb-a 7s ease-in-out infinite; }
.sb-limb-b { animation: sb-limb-b 8.5s ease-in-out infinite; }
.sb-limb-c { animation: sb-limb-b 9.5s ease-in-out infinite; }
.sb-limb-d { animation: sb-limb-a 10s ease-in-out infinite; }
.sb-glint  { animation: sb-glint 5s ease-in-out infinite; }
.sb-light  { animation: sb-light 1.8s ease-in-out infinite; }

@media (max-width: 767px) {
  .sb-astro { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sb-blob, .sb-astro, .sb-astro-bob, .sb-astro-tumble,
  .sb-limb-a, .sb-limb-b, .sb-limb-c, .sb-limb-d,
  .sb-glint, .sb-light { animation: none; }
  .sb-astro { opacity: 0.8; transform: translate3d(5vw, 40vh, 0); }
}
`;

function Astronaut({ uid }: { uid: string }) {
  const id = (n: string) => `${uid}-${n}`;
  return (
    <svg viewBox="0 0 220 300" className="h-auto w-full overflow-visible" role="presentation">
      <defs>
        <linearGradient id={id('suit')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#d9dfee" />
          <stop offset="1" stopColor="#8d97b5" />
        </linearGradient>
        <linearGradient id={id('limb')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f4f6fc" />
          <stop offset="1" stopColor="#97a1bf" />
        </linearGradient>
        <linearGradient id={id('pack')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#aab3cf" />
          <stop offset="1" stopColor="#59627f" />
        </linearGradient>
        <radialGradient id={id('visor')} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#3b4f8f" />
          <stop offset="0.5" stopColor="#141c3d" />
          <stop offset="1" stopColor="#05081a" />
        </radialGradient>
        <linearGradient id={id('glove')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fe9ff" />
          <stop offset="1" stopColor="#3a7bd5" />
        </linearGradient>
      </defs>

      <g className="sb-astro-tumble" style={{ transformOrigin: '110px 150px' }}>
        
        <rect x="50" y="92" width="120" height="108" rx="22" fill={`url(#${id('pack')})`} />

        <g className="sb-limb-c" style={{ transformOrigin: '90px 190px' }}>
          <path d="M72 188 h34 l-2 62 h-32 z" fill={`url(#${id('limb')})`} />
          <rect x="68" y="244" width="42" height="24" rx="10" fill="#4a5270" />
          <rect x="68" y="244" width="42" height="7" rx="3" fill="#00f0ff" opacity="0.8" />
        </g>
        <g className="sb-limb-d" style={{ transformOrigin: '130px 190px' }}>
          <path d="M114 188 h34 l4 58 h-32 z" fill={`url(#${id('limb')})`} />
          <rect x="116" y="240" width="42" height="24" rx="10" fill="#4a5270" />
          <rect x="116" y="240" width="42" height="7" rx="3" fill="#00f0ff" opacity="0.8" />
        </g>

        <rect x="64" y="96" width="92" height="104" rx="32" fill={`url(#${id('suit')})`} />
        <rect x="84" y="128" width="52" height="30" rx="7" fill="#2b3150" />
        <circle className="sb-light" cx="96" cy="139" r="4" fill="#00f0ff" />
        <circle className="sb-light" cx="110" cy="139" r="4" fill="#a200ff" style={{ animationDelay: '0.6s' }} />
        <circle className="sb-light" cx="124" cy="139" r="4" fill="#1d6fff" style={{ animationDelay: '1.2s' }} />
        <rect x="90" y="148" width="40" height="4" rx="2" fill="rgba(0,240,255,0.5)" />
        <rect x="64" y="178" width="92" height="12" rx="6" fill="#59627f" />

        <g className="sb-limb-a" style={{ transformOrigin: '72px 118px' }}>
          <path d="M72 108 C 40 100, 22 82, 14 56 l26 -8 C 46 66, 58 78, 80 90 z" fill={`url(#${id('limb')})`} />
          <circle cx="26" cy="50" r="17" fill={`url(#${id('glove')})`} />
        </g>
        
        <g className="sb-limb-b" style={{ transformOrigin: '148px 118px' }}>
          <path d="M148 108 C 180 112, 198 128, 206 156 l-26 8 C 174 146, 160 134, 140 126 z" fill={`url(#${id('limb')})`} />
          <circle cx="198" cy="164" r="17" fill={`url(#${id('glove')})`} />
        </g>

        <circle cx="110" cy="64" r="50" fill={`url(#${id('suit')})`} />
        <circle cx="110" cy="64" r="50" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="1.5" />
        <rect x="84" y="104" width="52" height="14" rx="7" fill="#8d97b5" />
        <ellipse cx="110" cy="66" rx="36" ry="31" fill={`url(#${id('visor')})`} />
        <ellipse cx="110" cy="66" rx="36" ry="31" fill="none" stroke="#c9d1ea" strokeWidth="2.5" />
        <path
          className="sb-glint"
          d="M88 50 C 94 40, 108 36, 120 38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <ellipse className="sb-glint" cx="128" cy="84" rx="8" ry="4" fill="#00f0ff" opacity="0.4" />
      </g>
    </svg>
  );
}

type RGB = [number, number, number];
type Star = { x: number; y: number; z: number; r: number; tw: number; sp: number; hue: RGB };
type Shooter = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number };
type Pt = [number, number];
type Pattern = { name: string; pts: Pt[]; links: [number, number][] };
type Constellation = { pat: Pattern; x: number; y: number; s: number; rot: number; born: number };

const STAR_COLORS: RGB[] = [
  [255, 255, 255],
  [255, 255, 255],
  [210, 240, 255],
  [180, 230, 255],
];
const CURSOR_TINT: RGB = [120, 240, 255];
const CURSOR_R = 190; 
const DRAW_MS = 4200; 
const HOLD_MS = 7000; 
const FADE_MS = 3500; 
const LIFE_MS = DRAW_MS + HOLD_MS + FADE_MS;

const PATTERNS: Pattern[] = [
  {
    name: 'Orion',
    pts: [[0.2, 0.1], [0.8, 0.05], [0.38, 0.5], [0.5, 0.52], [0.62, 0.54], [0.25, 0.95], [0.78, 0.92]],
    links: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
  },
  {
    name: 'Ursa Major',
    pts: [[0.78, 0.3], [0.8, 0.62], [0.55, 0.68], [0.5, 0.4], [0.32, 0.35], [0.16, 0.45], [0.0, 0.65]],
    links: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]],
  },
  {
    name: 'Cassiopeia',
    pts: [[0.0, 0.3], [0.22, 0.8], [0.5, 0.4], [0.78, 0.85], [1.0, 0.2]],
    links: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: 'Scorpius',
    pts: [[0.05, 0.12], [0.2, 0.0], [0.25, 0.3], [0.4, 0.45], [0.5, 0.7], [0.62, 0.9], [0.85, 1.0], [1.0, 0.8], [0.95, 0.6]],
    links: [[0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
  },
  {
    name: 'Cygnus',
    pts: [[0.5, 0.0], [0.5, 0.45], [0.5, 1.0], [0.1, 0.3], [0.9, 0.6]],
    links: [[0, 1], [1, 2], [3, 1], [1, 4]],
  },
  {
    name: 'Leo',
    pts: [[0.08, 0.6], [0.14, 0.35], [0.26, 0.15], [0.42, 0.05], [0.45, 0.3], [0.88, 0.4], [0.7, 0.7]],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 4]],
  },
];

const mix = (a: RGB, b: RGB, t: number) =>
  `${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)}`;

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
}

function useStarfield(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  mouse: React.MutableRefObject<{ x: number; y: number }>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    const shooters: Shooter[] = [];
    const consts: Constellation[] = [];
    let lastPattern = '';
    let nextConst = 0;
    let nextShooter = performance.now() + 4000;
    let raf = 0;
    let last = performance.now();
    let running = true;

    const ptr = { tx: 0, ty: 0, x: 0, y: 0, k: 0, on: false, seen: false };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(260, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.35 + z * 0.95,
          tw: Math.random() * Math.PI * 2,
          sp: 0.5 + Math.random() * 1.2,
          hue: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        };
      });

      consts.length = 0;
      nextConst = performance.now();
    };

    const spawnConstellation = (now: number) => {
      const active = new Set(consts.map((c) => c.pat.name));
      const pool = PATTERNS.filter((p) => !active.has(p.name) && p.name !== lastPattern);
      const pat = pool[Math.floor(Math.random() * pool.length)];
      const s = Math.min(w, h) * (0.28 + Math.random() * 0.14);
      let x = 0;
      let y = 0;
      for (let k = 0; k < 12; k++) {
        x = w * 0.06 + Math.random() * Math.max(0, w * 0.88 - s);
        y = h * 0.12 + Math.random() * Math.max(0, h * 0.76 - s);
        if (consts.every((c) => Math.hypot(c.x - x, c.y - y) > s * 1.3)) break;
      }
      consts.push({ pat, x, y, s, rot: (Math.random() - 0.5) * 0.5, born: now });
      lastPattern = pat.name;
    };

    const spawnShooter = () => {
      const fromLeft = Math.random() > 0.35;
      const speed = 520 + Math.random() * 380;
      const angle = (Math.PI / 180) * (20 + Math.random() * 20);
      shooters.push({
        x: fromLeft ? Math.random() * w * 0.6 : w * (0.4 + Math.random() * 0.6),
        y: Math.random() * h * 0.45,
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 0.9 + Math.random() * 0.7,
        len: 90 + Math.random() * 110,
      });
    };

    const prox = (x: number, y: number) => {
      if (ptr.k < 0.01) return 0;
      const d = Math.hypot(x - ptr.x, y - ptr.y);
      return d < CURSOR_R ? (1 - d / CURSOR_R) * ptr.k : 0;
    };

    const drawConstellation = (c: Constellation, now: number, t: number, mx: number, my: number) => {
      const age = now - c.born;
      const prog = Math.min(1, age / DRAW_MS);
      const env = age < DRAW_MS + HOLD_MS ? 1 : Math.max(0, 1 - (age - DRAW_MS - HOLD_MS) / FADE_MS);
      const L = c.pat.links.length;
      const cos = Math.cos(c.rot);
      const sin = Math.sin(c.rot);

      const pos = c.pat.pts.map(([px, py]) => {
        const ux = px - 0.5;
        const uy = py - 0.5;
        return [
          c.x + c.s / 2 + (ux * cos - uy * sin) * c.s - mx * 12,
          c.y + c.s / 2 + (ux * sin + uy * cos) * c.s - my * 12,
        ] as Pt;
      });

      const reveal = pos.map(() => 1);
      c.pat.links.forEach(([a, b], i) => {
        reveal[a] = Math.min(reveal[a], i / L);
        reveal[b] = Math.min(reveal[b], (i + 1) / L);
      });

      ctx.lineCap = 'round';
      c.pat.links.forEach(([a, b], i) => {
        const f = Math.min(1, Math.max(0, prog * L - i));
        if (f <= 0) return;
        const [ax, ay] = pos[a];
        const [bx, by] = pos[b];
        const p = (prox(ax, ay) + prox(bx, by)) / 2;
        ctx.strokeStyle = `rgba(140,225,255,${((0.2 + 0.55 * p) * env).toFixed(3)})`;
        ctx.lineWidth = 0.8 + p * 0.9;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
        ctx.stroke();
      });

      pos.forEach(([x, y], i) => {
        const n = Math.min(1, Math.max(0, (prog - reveal[i]) * L)) * env;
        if (n <= 0) return;
        const p = prox(x, y);
        ctx.fillStyle = `rgba(200,240,255,${(0.9 * n).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + p * 1.2, 0, Math.PI * 2);
        ctx.fill();
        const pulse = 6 + 2 * Math.sin(t * 2 + i * 1.7) + p * 9;
        sparkle(ctx, x, y, pulse, `rgba(160,235,255,${(0.5 * n).toFixed(3)})`);
      });

      const la = 0.3 * env * Math.min(1, prog * 2);
      if (la > 0.01) {
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '4px';
        ctx.font = '10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(160,225,255,${la.toFixed(3)})`;
        ctx.fillText(c.pat.name.toUpperCase(), c.x + c.s / 2, c.y + c.s + 22);
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '0px';
      }
    };

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      const mx = (mouse.current.x - 0.5) * 2;
      const my = (mouse.current.y - 0.5) * 2;
      const t = now / 1000;

      if (!reduce) {
        ptr.x += (ptr.tx - ptr.x) * 0.18;
        ptr.y += (ptr.ty - ptr.y) * 0.18;
        ptr.k += ((ptr.on ? 1 : 0) - ptr.k) * 0.06;
      }

      if (ptr.k > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 280);
        g.addColorStop(0, `rgba(0,240,255,${(0.1 * ptr.k).toFixed(3)})`);
        g.addColorStop(0.5, `rgba(70,90,255,${(0.035 * ptr.k).toFixed(3)})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
      }

      for (const s of stars) {
        if (!reduce) {
          s.x -= (3 + s.z * 11) * dt;
          s.y += (1 + s.z * 4) * dt;
          if (s.x < -4) s.x = w + 4;
          if (s.y > h + 4) s.y = -4;
        }
        const px = s.x - mx * s.z * 20;
        const py = s.y - my * s.z * 20;

        const dx = px - ptr.x;
        const dy = py - ptr.y;
        const d = Math.hypot(dx, dy) || 1;
        const near = ptr.k > 0.01 && d < CURSOR_R ? Math.pow(1 - d / CURSOR_R, 2) * ptr.k : 0;
        const x = px + (dx / d) * near * 9;
        const y = py + (dy / d) * near * 9;

        const tw = reduce ? 0.85 : 0.55 + 0.45 * Math.sin(t * s.sp + s.tw);

        const flash = reduce ? 0 : Math.pow(Math.max(0, Math.sin(t * s.sp * 0.9 + s.tw * 3)), 14);
        const a = Math.min(1, (0.2 + s.z * 0.7) * tw + near * 0.6 + flash * 0.5);
        const col = mix(s.hue, CURSOR_TINT, Math.min(1, near * 0.9));
        const r = s.r * (1 + near * 1.3 + flash * 0.6);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${col},${a.toFixed(3)})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        if (s.z > 0.9 || near > 0.2) {
          const gr = s.r * 6 * (1 + near);
          const g = ctx.createRadialGradient(x, y, 0, x, y, gr);
          g.addColorStop(0, `rgba(${col},${(a * 0.4).toFixed(3)})`);
          g.addColorStop(1, `rgba(${col},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, gr, 0, Math.PI * 2);
          ctx.fill();
        }

        const fs = (s.z > 0.6 ? s.r * 2.2 : 0) + flash * s.r * 9 + near * 12;
        if (fs > 1.4) sparkle(ctx, x, y, fs, `rgba(${col},${(a * 0.8).toFixed(3)})`);
      }

      if (!reduce) {
        for (let i = consts.length - 1; i >= 0; i--) {
          if (now - consts[i].born > LIFE_MS) consts.splice(i, 1);
        }
        if (consts.length < 2 && now > nextConst) {
          spawnConstellation(now);
          nextConst = now + 5000 + Math.random() * 3000;
        }
        for (const c of consts) drawConstellation(c, now, t, mx, my);

        if (now > nextShooter) {
          spawnShooter();
          nextShooter = now + 6000 + Math.random() * 8000;
        }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const s = shooters[i];
          s.life += dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          const p = s.life / s.max;
          if (p >= 1 || s.x < -200 || s.x > w + 200 || s.y > h + 200) {
            shooters.splice(i, 1);
            continue;
          }
          const alpha = Math.sin(p * Math.PI) * 0.9;
          const mag = Math.hypot(s.vx, s.vy);
          const tx = s.x - (s.vx / mag) * s.len;
          const ty = s.y - (s.vy / mag) * s.len;
          const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
          g.addColorStop(0, `rgba(255,255,255,${alpha})`);
          g.addColorStop(0.3, `rgba(0,240,255,${alpha * 0.5})`);
          g.addColorStop(1, 'rgba(0,240,255,0)');
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: MouseEvent) => {
      ptr.tx = e.clientX;
      ptr.ty = e.clientY;
      ptr.on = true;
      if (!ptr.seen) {
        ptr.x = e.clientX;
        ptr.y = e.clientY;
        ptr.seen = true;
      }
    };
    const onLeave = () => {
      ptr.on = false;
    };

    build();
    window.addEventListener('resize', build);
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduce) {
      window.addEventListener('mousemove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [canvasRef, mouse]);
}

export default function SpaceBackground({ astronaut = true }: { astronaut?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const astroRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useStarfield(canvasRef, mouse);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cx = 0.5;
    let cy = 0.5;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };

    const tick = () => {
      cx += (mouse.current.x - cx) * 0.04;
      cy += (mouse.current.y - cy) * 0.04;
      const dx = (cx - 0.5) * 2;
      const dy = (cy - 0.5) * 2;
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${dx * -18}px, ${dy * -18}px, 0)`;
      if (astroRef.current) astroRef.current.style.transform = `translate3d(${dx * 28}px, ${dy * 28}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-[-1] overflow-hidden bg-[#010208] pointer-events-none">
      
      <div ref={glowRef} className="absolute -inset-[4%] will-change-transform">
        <div className="sb-blob sb-blob-cyan" />
        <div className="sb-blob sb-blob-purple" />
        <div className="sb-blob sb-blob-blue" />
      </div>
      <div className="sb-horizon" />

      <canvas ref={canvasRef} className="absolute inset-0" />

      {astronaut && (
        <div ref={astroRef} className="absolute inset-0 will-change-transform">
          <div className="sb-astro">
            <div className="sb-astro-bob">
              <Astronaut uid="sb-astro" />
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }}
      />

      <style>{css}</style>
    </div>
  );
}