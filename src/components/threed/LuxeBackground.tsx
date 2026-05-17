'use client';

/**
 * LuxeBackground — Warm Modern / Quiet Luxury hero background.
 *
 * Combines two high-taste layers:
 *   1. Stacked WebGL Canvas (Background): Runs a highly optimized single-pass
 *      fractional Brownian motion (fBm) liquid silk fragment shader on the GPU.
 *      Reacts organically to the cursor and shifts depth with page scroll.
 *      Blends strictly with low opacity limits (6% to 12%) to remain highly subtle.
 *   2. Interactive 2D Canvas (Foreground): Draws the refined dot-grid with organic
 *      noise-field drift and mouse spring repulsion.
 *
 * Safe-guards: Includes full WebGL context compilation verification with graceful
 * fallbacks in case WebGL is disabled or unsupported.
 */

import React, { useRef, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types & Props
// ---------------------------------------------------------------------------

interface CameraControls {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

interface LuxeBackgroundProps {
  cameraControls: CameraControls;
  currentTheme?: string;
}

// ---------------------------------------------------------------------------
// Configuration Constants
// ---------------------------------------------------------------------------

const GRID_SPACING = 24; // px between dot centres
const DOT_RADIUS = 1.5; // base dot radius
const REPEL_RADIUS = 210; // cursor influence radius
const REPEL_STRENGTH = 22; // max pixel displacement
const SPRING_STIFFNESS = 0.09; // spring return speed
const DRIFT_SPEED = 0.00025; // noise time multiplier
const DRIFT_AMPLITUDE = 1.8; // max px of organic drift

// Light & Dark 2D grid/aura palette overrides (Monochrome OLED Graphite)
const PALETTE_LIGHT = {
  dot: 'rgba(100, 110, 130, 0.12)',
  dotHover: 'rgba(60, 70, 90, 0.35)',
  aura: 'rgba(100, 110, 130, 0.015)',
};

const PALETTE_DARK = {
  dot: 'rgba(140, 150, 170, 0.08)',
  dotHover: 'rgba(200, 210, 230, 0.24)',
  aura: 'rgba(140, 150, 170, 0.015)',
};

// Precise RGB color coordinates for WebGL uniform binding (matches globals.css)
const RGB_LIGHT_BG = [250 / 255, 251 / 255, 254 / 255]; // oklch(0.980 0.003 250)
const RGB_LIGHT_ACCENT = [30 / 255, 32 / 255, 37 / 255]; // oklch(0.13 0.006 250)

const RGB_DARK_BG = [13 / 255, 13 / 255, 15 / 255]; // oklch(0.060 0.003 250)
const RGB_DARK_ACCENT = [242 / 255, 243 / 255, 245 / 255]; // oklch(0.960 0.003 240)

// ---------------------------------------------------------------------------
// GLSL Shaders
// ---------------------------------------------------------------------------

const VERTEX_SHADER_SRC = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColorBg;
uniform vec3 uColorAccent;
uniform float uDarkTheme;
uniform float uScrollOffset;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  
  // Custom slow liquid coordinates incorporating scroll offsets
  vec2 p = uv;
  p.x *= aspect;
  p.y += uScrollOffset * 0.0003;
  
  vec2 m = uMouse / uResolution.xy;
  m.x *= aspect;

  // Layered flowing distortion vectors
  vec2 q = vec2(0.0);
  q.x = fbm(p + vec2(uTime * 0.02, uTime * 0.01) + m * 0.12);
  q.y = fbm(p + vec2(uTime * 0.01, -uTime * 0.015) - m * 0.08);
  
  vec2 r = vec2(0.0);
  r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + uTime * 0.008);
  r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + uTime * 0.006);
  
  float f = fbm(p + r * 0.8);
  
  float factor = smoothstep(0.18, 0.82, f);
  float intensity = mix(0.07, 0.13, uDarkTheme);
  vec3 finalColor = mix(uColorBg, uColorAccent, factor * intensity);
  
  // High-taste organic vignette
  float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
  vignette = clamp(pow(16.0 * vignette, 0.18), 0.0, 1.0);
  
  if (uDarkTheme > 0.5) {
    finalColor = mix(finalColor * 0.88, finalColor, vignette);
  } else {
    finalColor = mix(finalColor * 1.01, finalColor, vignette);
  }
  
  fragColor = vec4(finalColor, 1.0);
}
`;

// ---------------------------------------------------------------------------
// 2D Noise helper for dot grid
// ---------------------------------------------------------------------------

function smoothHash(x: number, y: number, t: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + t * 74.9) * 43758.545;
  return s - Math.floor(s);
}

function smoothNoise(x: number, y: number, t: number): number {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  const fx = x - ix,
    fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = smoothHash(ix, iy, t);
  const b = smoothHash(ix + 1, iy, t);
  const c = smoothHash(ix, iy + 1, t);
  const d = smoothHash(ix + 1, iy + 1, t);
  return a + (b - a) * ux + (c - a) * uy + (d - a - c + b) * ux * uy;
}

// ---------------------------------------------------------------------------
// 2D Grid Particle Class
// ---------------------------------------------------------------------------

class Dot {
  ox: number; // origin x
  oy: number; // origin y
  vx: number; // spring velocity x
  vy: number; // spring velocity y
  cx: number; // current x
  cy: number; // current y
  ni: number; // noise offset seed

  constructor(ox: number, oy: number, seed: number) {
    this.ox = ox;
    this.oy = oy;
    this.cx = ox;
    this.cy = oy;
    this.vx = 0;
    this.vy = 0;
    this.ni = seed;
  }
}

// ---------------------------------------------------------------------------
// Main LuxeBackground Component
// ---------------------------------------------------------------------------

export default function LuxeBackground({ cameraControls, currentTheme }: LuxeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const timeRef = useRef(0);

  // WebGL Context References
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const glUniformsRef = useRef<{
    time: WebGLUniformLocation | null;
    res: WebGLUniformLocation | null;
    mouse: WebGLUniformLocation | null;
    colorBg: WebGLUniformLocation | null;
    colorAccent: WebGLUniformLocation | null;
    darkTheme: WebGLUniformLocation | null;
    scrollOffset: WebGLUniformLocation | null;
  }>({
    time: null,
    res: null,
    mouse: null,
    colorBg: null,
    colorAccent: null,
    darkTheme: null,
    scrollOffset: null,
  });

  // Build grid of dots based on bounds
  const buildGrid = useCallback((w: number, h: number) => {
    const cols = Math.ceil(w / GRID_SPACING) + 2;
    const rows = Math.ceil(h / GRID_SPACING) + 2;
    const dots: Dot[] = [];
    let seed = 0;
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        dots.push(new Dot(c * GRID_SPACING, r * GRID_SPACING, seed++));
      }
    }
    dotsRef.current = dots;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // WebGL initialization helper
  const initWebGL = useCallback(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: true,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      console.warn('WebGL2 not supported, falling back to 2D gradient backplane.');
      return;
    }
    glRef.current = gl;

    // Helper: Compile individual shader
    const compile = (src: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(VERTEX_SHADER_SRC, gl.VERTEX_SHADER);
    const fs = compile(FRAGMENT_SHADER_SRC, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Create & link program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    glProgramRef.current = program;

    // Set quad geometry (4 coordinates mapping the full screen viewport)
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Grab uniform locations
    glUniformsRef.current = {
      time: gl.getUniformLocation(program, 'uTime'),
      res: gl.getUniformLocation(program, 'uResolution'),
      mouse: gl.getUniformLocation(program, 'uMouse'),
      colorBg: gl.getUniformLocation(program, 'uColorBg'),
      colorAccent: gl.getUniformLocation(program, 'uColorAccent'),
      darkTheme: gl.getUniformLocation(program, 'uDarkTheme'),
      scrollOffset: gl.getUniformLocation(program, 'uScrollOffset'),
    };
  }, []);

  // Frame Render Loop
  const render = useCallback(() => {
    const canvas2d = canvasRef.current;
    if (!canvas2d) return;
    const ctx2d = canvas2d.getContext('2d');
    if (!ctx2d) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas2d.width / dpr;
    const H = canvas2d.height / dpr;
    const isDark = currentTheme === 'dark';
    const pal = isDark ? PALETTE_DARK : PALETTE_LIGHT;

    // Scroll offset calculations fed to shaders
    const scrollT = Math.max(0, Math.min(1, (cameraControls.yPos - -20) / 120));
    const scrollOffset = scrollT * H * 0.04;

    timeRef.current += DRIFT_SPEED;
    const t = timeRef.current;

    // ── WebGL Shader Backdrop Draw ──────────────────────────────────────────
    const gl = glRef.current;
    const glProgram = glProgramRef.current;
    if (gl && glProgram) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.useProgram(glProgram);

      // Bind dynamic uniform values
      gl.uniform1f(glUniformsRef.current.time, t * 100);
      gl.uniform2f(glUniformsRef.current.res, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(
        glUniformsRef.current.mouse,
        mouseRef.current.x * dpr,
        (H - mouseRef.current.y) * dpr
      );
      gl.uniform1f(glUniformsRef.current.scrollOffset, scrollOffset);

      const colorBg = isDark ? RGB_DARK_BG : RGB_LIGHT_BG;
      const colorAccent = isDark ? RGB_DARK_ACCENT : RGB_LIGHT_ACCENT;
      gl.uniform3fv(glUniformsRef.current.colorBg, colorBg);
      gl.uniform3fv(glUniformsRef.current.colorAccent, colorAccent);
      gl.uniform1f(glUniformsRef.current.darkTheme, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // ── 2D Canvas Dot Grid Foreground Draw ──────────────────────────────────
    ctx2d.clearRect(0, 0, W, H);

    // Fallback simple background if WebGL failed
    if (!gl) {
      ctx2d.fillStyle = isDark ? 'rgba(31, 27, 26, 1)' : 'rgba(251, 249, 245, 1)';
      ctx2d.fillRect(0, 0, W, H);

      // Draw a fallback 2D aura
      const cx = W * 0.5;
      const cy = H * 0.35 + scrollOffset * 0.4;
      const r = Math.max(W, H) * 0.4;
      const grad = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, pal.aura);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, W, H);
    }

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    for (const dot of dotsRef.current) {
      // Gentle drift noise calculation
      const nx = smoothNoise(dot.ox / GRID_SPACING + t * 0.4, dot.ni * 0.12, t);
      const ny = smoothNoise(dot.ni * 0.17, dot.oy / GRID_SPACING + t * 0.4, t);
      const driftX = (nx - 0.5) * 2 * DRIFT_AMPLITUDE;
      const driftY = (ny - 0.5) * 2 * DRIFT_AMPLITUDE;

      const targetX = dot.ox + driftX;
      const targetY = dot.oy + driftY + scrollOffset;

      // Distance check for spring displacement
      const dx = dot.cx - mx;
      const dy = dot.cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let repelX = 0,
        repelY = 0;
      if (dist < REPEL_RADIUS && dist > 0) {
        const influence = 1 - dist / REPEL_RADIUS;
        const smoothInfluence = influence * influence;
        repelX = (dx / dist) * REPEL_STRENGTH * smoothInfluence;
        repelY = (dy / dist) * REPEL_STRENGTH * smoothInfluence;
      }

      const finalX = targetX + repelX;
      const finalY = targetY + repelY;

      // Spring displacement physics
      dot.vx += (finalX - dot.cx) * SPRING_STIFFNESS;
      dot.vy += (finalY - dot.cy) * SPRING_STIFFNESS;
      dot.vx *= 0.72;
      dot.vy *= 0.72;
      dot.cx += dot.vx;
      dot.cy += dot.vy;

      const proximity = Math.max(0, 1 - dist / REPEL_RADIUS);
      const radius = DOT_RADIUS + proximity * 0.5;

      ctx2d.beginPath();
      ctx2d.arc(dot.cx, dot.cy, radius, 0, Math.PI * 2);
      ctx2d.fillStyle = proximity > 0.05 ? pal.dotHover : pal.dot;
      ctx2d.fill();
    }

    rafRef.current = requestAnimationFrame(render);
  }, [cameraControls, currentTheme]);

  // Initial mount & resize effects
  useEffect(() => {
    const canvas2d = canvasRef.current;
    const canvasGl = glCanvasRef.current;
    if (!canvas2d || !canvasGl) return;

    initWebGL();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Resize Foreground 2D Canvas
      canvas2d.width = w * dpr;
      canvas2d.height = h * dpr;
      canvas2d.style.width = `${w}px`;
      canvas2d.style.height = `${h}px`;
      const ctx2d = canvas2d.getContext('2d');
      if (ctx2d) ctx2d.scale(dpr, dpr);

      // Resize WebGL Backdrop Canvas
      canvasGl.width = w * dpr;
      canvasGl.height = h * dpr;
      canvasGl.style.width = `${w}px`;
      canvasGl.style.height = `${h}px`;

      buildGrid(w, h);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [buildGrid, handleMouseMove, render, initWebGL]);

  return (
    <div
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* Background: WebGL Fluid Silk Shader */}
      <canvas
        ref={glCanvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'block',
          zIndex: 1,
        }}
      />
      {/* Foreground: 2D Spring Interactive Dot-Grid */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'block',
          zIndex: 2,
        }}
      />
    </div>
  );
}
