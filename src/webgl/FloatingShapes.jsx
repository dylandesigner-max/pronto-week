import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../hooks/useSmoothScroll';

/**
 * Camada 3D global (fixa, atrás do conteúdo): formas "candy" nas cores da marca
 * que flutuam, giram e fazem parallax com o scroll e o mouse.
 * Aparecem nos respiros brancos entre os blocos do layout.
 */
const COLORS = ['#f8603e', '#bddd56', '#e861a2', '#fdd8ac', '#f8603e', '#bddd56'];

// pageY em "telas" desde o topo; x em fração da largura visível (-0.5..0.5)
const SHAPES = [
  { type: 'torus', x: -0.46, pageY: 1.05, s: 0.34, depth: 0.9 },
  { type: 'capsule', x: 0.47, pageY: 1.35, s: 0.3, depth: 1.15 },
  { type: 'sphere', x: 0.43, pageY: 1.9, s: 0.22, depth: 0.8 },
  { type: 'box', x: -0.47, pageY: 2.25, s: 0.26, depth: 1.1 },
  { type: 'torus', x: 0.46, pageY: 3.85, s: 0.28, depth: 1.0 },
  { type: 'capsule', x: -0.46, pageY: 4.2, s: 0.28, depth: 0.85 },
  { type: 'sphere', x: -0.44, pageY: 4.95, s: 0.24, depth: 1.2 },
  { type: 'box', x: 0.45, pageY: 5.35, s: 0.24, depth: 0.95 },
  { type: 'torus', x: -0.45, pageY: 5.9, s: 0.26, depth: 1.05 },
];

function geometryFor(type) {
  switch (type) {
    case 'torus':
      return new THREE.TorusGeometry(0.7, 0.3, 32, 64);
    case 'capsule':
      return new THREE.CapsuleGeometry(0.42, 0.8, 12, 24);
    case 'box':
      return new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
    default:
      return new THREE.SphereGeometry(0.75, 48, 48);
  }
}

function Shapes() {
  const group = useRef();
  const { viewport, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  const items = useMemo(
    () =>
      SHAPES.map((s, i) => ({
        ...s,
        geo: geometryFor(s.type),
        mat: new THREE.MeshPhysicalMaterial({
          color: COLORS[i % COLORS.length],
          roughness: 0.28,
          metalness: 0.05,
          clearcoat: 1,
          clearcoatRoughness: 0.2,
        }),
        seed: Math.random() * 10,
        rot: new THREE.Vector3(Math.random() * 6, Math.random() * 6, 0),
      })),
    [],
  );

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const vh = size.height;
    const unitPerPx = viewport.height / vh;
    const vel = scrollState.velocity || 0;
    const mobile = size.width < 768;

    group.current.children.forEach((mesh, i) => {
      const it = items[i];
      // posição na página convertida para a tela, com parallax por profundidade
      const yPx = it.pageY * vh - scrollState.y * it.depth;
      const y = viewport.height / 2 - yPx * unitPerPx - (it.pageY * vh * (1 - it.depth)) * unitPerPx * 0;
      const x = it.x * viewport.width * (mobile ? 1.05 : 1);
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, x + pointer.current.x * 0.12 * it.depth, 0.08);
      mesh.position.y = y + Math.sin(t * 0.8 + it.seed) * 0.12;
      mesh.rotation.x = it.rot.x + t * 0.3 + vel * 0.004 * it.depth;
      mesh.rotation.y = it.rot.y + t * 0.4 + pointer.current.x * 0.4;
      const s = it.s * (mobile ? 0.7 : 1) * (viewport.height / 6.3);
      mesh.scale.setScalar(s);
    });
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.current.y * 0.05, 0.05);
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} geometry={it.geo} material={it.mat} />
      ))}
    </group>
  );
}

export default function FloatingShapes() {
  return (
    <div className="gl-shapes" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 6]} intensity={2.2} />
        <directionalLight position={[-6, -2, 4]} intensity={0.6} color="#ffd9c2" />
        <Shapes />
      </Canvas>
    </div>
  );
}
