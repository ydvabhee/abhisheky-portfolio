'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer } from '@react-three/drei';
import { MathUtils, type Mesh } from 'three';

function Knot() {
  const ref = useRef<Mesh>(null);

  // Ease rotation toward the cursor
  useFrame(({ pointer }, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, pointer.x * 0.6, 3, delta);
    ref.current.rotation.x = MathUtils.damp(ref.current.rotation.x, -pointer.y * 0.4, 3, delta);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={ref} scale={0.9}>
        <torusKnotGeometry args={[1, 0.32, 256, 48]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      // Dimmed so the name stays readable where it overlaps the knot
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45 }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      // Canvas ignores pointer events so hero text stays interactive; listen on body instead
      eventSource={document.body}
      eventPrefix="client"
    >
      <Knot />
      {/* Studio lights baked into the env map, no HDR download */}
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 5, -5]} scale={[10, 2, 1]} />
        <Lightformer intensity={2} position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={2} position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={1} position={[0, -5, 2]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
    </Canvas>
  );
}
