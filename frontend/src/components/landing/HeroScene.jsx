import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';

function FloatingIcosahedron() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <MeshDistortMaterial
          color="#22c55e"
          emissive="#16a34a"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function OrbitingTorusKnot() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += delta * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[3, 1, -2]}>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshStandardMaterial color="#10b981" wireframe />
    </mesh>
  );
}

function FloatingOctahedron({ position, speed, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * speed;
    meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#22c55e" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#10b981" />
      <spotLight position={[0, 10, 0]} intensity={0.3} angle={0.5} penumbra={1} />

      <FloatingIcosahedron />
      <OrbitingTorusKnot />

      <FloatingOctahedron position={[-3, 2, -1]} speed={0.8} color="#4ade80" />
      <FloatingOctahedron position={[2, -2, 1]} speed={1.2} color="#34d399" />
      <FloatingOctahedron position={[-2, -1, 2]} speed={0.6} color="#22c55e" />
      <FloatingOctahedron position={[3.5, -1, -1]} speed={1.0} color="#10b981" />

      <Sparkles count={100} scale={12} size={1.5} speed={0.3} color="#4ade80" />
    </>
  );
}
