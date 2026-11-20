import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../hooks/useSmoothScroll';

/**
 * Imagem com distorção em WebGL (foto do entregador na seção Ofertas):
 * - revelação em onda conforme o scroll (uProgress, controlado pelo GSAP)
 * - leve separação RGB proporcional à velocidade do scroll
 * O recorte reproduz o do Figma: a imagem ocupa 108.54% da altura, ancorada embaixo.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uProgress;
  uniform float uVel;
  uniform float uCropTop;

  void main() {
    vec2 uv = vUv;

    // revelação de baixo para cima com borda ondulada
    // (uv.y = 0 embaixo) — a parte de baixo aparece primeiro
    float edge = uProgress * 1.3 - 0.12 + sin(uv.x * 9.0 + uTime * 1.6) * 0.04;
    float reveal = smoothstep(edge, edge - 0.12, uv.y);

    // deslocamento enquanto revela
    uv.y += (1.0 - uProgress) * 0.08 * (1.0 - uv.y);

    // recorte do Figma: imagem com 108.54% de altura, ancorada embaixo
    vec2 tuv = vec2(uv.x, uv.y * (1.0 - uCropTop));

    float shift = clamp(uVel, -40.0, 40.0) * 0.00012;
    vec4 cr = texture2D(uTex, tuv + vec2(shift, 0.0));
    vec4 cg = texture2D(uTex, tuv);
    vec4 cb = texture2D(uTex, tuv - vec2(shift, 0.0));
    vec4 col = vec4(cr.r, cg.g, cb.b, cg.a);

    col.a *= reveal;
    if (tuv.y > 1.0 || tuv.y < 0.0) col.a = 0.0;
    gl_FragColor = col;
    #include <colorspace_fragment>
  }
`;

function ImagePlane({ src, state }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const mat = useRef();
  const { viewport } = useThree();

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }, [tex]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uVel: { value: 0 },
      uCropTop: { value: 0.0854 / 1.0854 },
    }),
    [tex],
  );

  useFrame((_, dt) => {
    const u = mat.current.uniforms;
    u.uTime.value += dt;
    u.uProgress.value = state.progress;
    u.uVel.value = THREE.MathUtils.lerp(u.uVel.value, scrollState.velocity || 0, 0.1);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent />
    </mesh>
  );
}

export default function DistortImage({ src, state, active = true }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
      orthographic
      camera={{ position: [0, 0, 5], zoom: 1 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <ImagePlane src={src} state={state} />
      </Suspense>
    </Canvas>
  );
}

