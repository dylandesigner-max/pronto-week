import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Fundo do hero em WebGL: o mesmo gradiente pêssego do Figma (#fdd8ac → #fff3e6),
 * vivo — ondas de ruído lentas e um brilho laranja que segue o cursor.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uAccent;
  uniform vec3 uPink;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * aspect, uv.y);

    float t = uTime * 0.08;
    float n = snoise(p * 1.4 + vec2(t, -t * 0.6));
    n += 0.5 * snoise(p * 2.8 - vec2(t * 1.3, t));

    // gradiente vertical do Figma, levemente "líquido"
    float g = clamp(1.0 - uv.y + n * 0.06, 0.0, 1.0);
    vec3 col = mix(uTop, uBottom, smoothstep(0.0, 1.0, g));

    // manchas suaves de cor da marca
    float blobA = smoothstep(0.55, 0.0, distance(p, vec2(aspect * 0.78 + sin(t * 2.0) * 0.06, 0.62 + cos(t * 1.7) * 0.05)));
    float blobB = smoothstep(0.5, 0.0, distance(p, vec2(aspect * 0.18 + cos(t * 1.5) * 0.05, 0.12 + sin(t * 2.2) * 0.04)));
    col = mix(col, uAccent, blobA * 0.06);
    col = mix(col, uPink, blobB * 0.05);

    // brilho que acompanha o cursor
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);
    float glow = smoothstep(0.45, 0.0, distance(p, m));
    col = mix(col, vec3(1.0, 0.93, 0.85), glow * 0.35);

    // grão sutil
    float grain = fract(sin(dot(uv * uRes + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.025;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Plane() {
  const mat = useRef();
  const { size, gl } = useThree();
  const mouse = useRef(new THREE.Vector2(0.7, 0.6));
  const target = useRef(new THREE.Vector2(0.7, 0.6));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.7, 0.6) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTop: { value: new THREE.Color('#fdd8ac') },
      uBottom: { value: new THREE.Color('#fff3e6') },
      uAccent: { value: new THREE.Color('#f8603e') },
      uPink: { value: new THREE.Color('#e861a2') },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e) => {
      const r = gl.domElement.getBoundingClientRect();
      target.current.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [gl]);

  useFrame((_, dt) => {
    const u = mat.current.uniforms;
    u.uTime.value += dt;
    mouse.current.lerp(target.current, 0.06);
    u.uMouse.value.copy(mouse.current);
    u.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

export default function HeroShader({ active = true }) {
  return (
    <Canvas
      className="hero__canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      orthographic
      camera={{ position: [0, 0, 1] }}
    >
      <Plane />
    </Canvas>
  );
}
