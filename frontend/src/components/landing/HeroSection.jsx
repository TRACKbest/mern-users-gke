import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Link } from 'react-router-dom';
import HeroScene from './HeroScene';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-gray-950/40 via-transparent to-gray-950/80" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent leading-tight">
          Manage Your Grades
          <br />
          Effortlessly
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          A modern and simple platform to track university grades, calculate averages, and organize your academic journey efficiently.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-semibold text-lg shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 hover:scale-105"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold text-lg backdrop-blur-sm transition-all hover:bg-white/5"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
