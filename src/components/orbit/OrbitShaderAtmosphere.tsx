"use client";

import { useEffect, useRef } from "react";

type OrbitShaderAtmosphereProps = {
  accent: string;
  isVisionField: boolean;
  isInspectOpen: boolean;
};

const vertexShaderSource = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uAccent;
uniform float uVision;
uniform float uInspect;
uniform float uIntensity;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + vec2(45.32));
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;

  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.48;
  }

  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / max(uResolution.y, 1.0);

  float t = uTime * 0.055;

  float softField = smoothstep(0.86, 0.05, length(p * vec2(0.92, 1.15)));
  float productHalo = smoothstep(0.62, 0.04, length((uv - vec2(0.56, 0.50)) * vec2(1.45, 1.05)));
  float leftCalm = smoothstep(0.7, 0.08, length((uv - vec2(0.22, 0.42)) * vec2(1.15, 1.3)));

  float driftA = fbm(uv * 2.2 + vec2(t, -t * 0.7));
  float driftB = fbm(uv * 5.5 + vec2(-t * 1.6, t * 0.9));

  float diagonal = smoothstep(
    0.42,
    0.0,
    abs((uv.y - uv.x * 0.34) - 0.36 + sin(uTime * 0.09) * 0.018)
  );

  float lowerOptic = smoothstep(
    0.36,
    0.0,
    abs(uv.y - 0.68 + sin(uv.x * 4.2 + uTime * 0.16) * 0.012)
  );

  vec3 accent = uAccent;
  vec3 ivory = vec3(0.96, 0.92, 0.84);
  vec3 cold = vec3(0.52, 0.68, 0.82);

  vec3 color = vec3(0.0);
  color += accent * productHalo * (0.16 + driftA * 0.18);
  color += cold * softField * (0.035 + driftB * 0.05);
  color += ivory * diagonal * 0.035;
  color += accent * lowerOptic * 0.045;
  color += ivory * leftCalm * 0.012;

  float grain = hash(uv * uResolution.xy + vec2(uTime * 0.7));
  color += vec3((grain - 0.5) * 0.012);

  float alpha = 0.0;
  alpha += productHalo * 0.13;
  alpha += softField * 0.055;
  alpha += diagonal * 0.05;
  alpha += lowerOptic * 0.045;

  alpha *= uIntensity;
  alpha *= mix(0.7, 1.12, uVision);
  alpha *= mix(1.0, 0.36, uInspect);

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.28));
}
`;

function parseAccentColor(accent: string): [number, number, number] {
  const rgbaMatch = accent.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

  if (rgbaMatch) {
    return [
      Number(rgbaMatch[1]) / 255,
      Number(rgbaMatch[2]) / 255,
      Number(rgbaMatch[3]) / 255,
    ];
  }

  const hexMatch = accent
    .trim()
    .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

  if (hexMatch) {
    return [
      parseInt(hexMatch[1], 16) / 255,
      parseInt(hexMatch[2], 16) / 255,
      parseInt(hexMatch[3], 16) / 255,
    ];
  }

  return [0.55, 0.78, 1];
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Could not create shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  const program = gl.createProgram();

  if (!program) {
    throw new Error("Could not create WebGL program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown program link error.";
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return { program, vertexShader, fragmentShader };
}

export function OrbitShaderAtmosphere({
  accent,
  isVisionField,
  isInspectOpen,
}: OrbitShaderAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });

    if (!gl) {
      return;
    }

    let animationFrame = 0;
    let disposed = false;

    let programBundle: ReturnType<typeof createProgram>;

    try {
      programBundle = createProgram(gl);
    } catch {
      return;
    }

    const { program, vertexShader, fragmentShader } = programBundle;

    const positionBuffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, "aPosition");

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      accent: gl.getUniformLocation(program, "uAccent"),
      vision: gl.getUniformLocation(program, "uVision"),
      inspect: gl.getUniformLocation(program, "uInspect"),
      intensity: gl.getUniformLocation(program, "uIntensity"),
    };

    const accentColor = parseAccentColor(accent);
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      const width = Math.max(1, Math.floor(rect.width * pixelRatio));
      const height = Math.max(1, Math.floor(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
    };

    const render = (now: number) => {
      if (disposed) {
        return;
      }

      resize();

      const time = reducedMotion ? 0 : (now - start) * 0.001;
      const intensity = isVisionField ? 1 : 0.72;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time);
      gl.uniform3f(
        uniforms.accent,
        accentColor[0],
        accentColor[1],
        accentColor[2],
      );
      gl.uniform1f(uniforms.vision, isVisionField ? 1 : 0);
      gl.uniform1f(uniforms.inspect, isInspectOpen ? 1 : 0);
      gl.uniform1f(uniforms.intensity, intensity);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    render(performance.now());

    return () => {
      disposed = true;

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      gl.deleteBuffer(positionBuffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    };
  }, [accent, isVisionField, isInspectOpen]);

  return (
    <div
      className="orbit-shader-atmosphere pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden rounded-[2rem] md:rounded-[3rem] lg:block"
      style={{
        opacity: 0.72,
        mixBlendMode: "screen",
        isolation: "isolate",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
