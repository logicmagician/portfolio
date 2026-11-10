"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles, Environment, ContactShadows } from "@react-three/drei";
import { Component, Suspense, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

// Catches WebGL context failures and failed HDR/environment loads so the rest
// of the page keeps rendering instead of unmounting the whole React tree.
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene unavailable:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="scene-placeholder">
          <span>3D VIEW UNAVAILABLE ON THIS DEVICE</span>
        </div>
      );
    }
    return this.props.children;
  }
}

// The HDR environment is fetched over the network. If that fails, only the
// environment map is dropped; the chip and its built-in lights still render.
class EnvironmentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("HDR environment unavailable, using built-in lights:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Reads the user's reduced-motion preference once and keeps it current.
function usePrefersReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      ref.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return ref;
}

function Chip({ reducedMotion }: { reducedMotion: React.MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const still = reducedMotion.current;
    if (group.current) {
      if (still) {
        group.current.rotation.set(0, 0, 0);
        group.current.position.y = 0;
      } else {
        group.current.rotation.y += delta * 0.16;
        group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
        group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
      }
    }
    if (core.current) {
      const material = core.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = still
        ? 1.1
        : 1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.35;
    }
  });

  return (
    <group ref={group}>
      {/* Processor substrate */}
      <mesh>
        <boxGeometry args={[2.35, 0.22, 2.35]} />
        <meshStandardMaterial color="#101d35" metalness={0.85} roughness={0.28} />
      </mesh>
      {/* Central silicon die */}
      <mesh ref={core} position={[0, 0.19, 0]}>
        <boxGeometry args={[1.05, 0.18, 1.05]} />
        <meshStandardMaterial color="#123a66" metalness={0.65} roughness={0.2} emissive="#087bff" emissiveIntensity={1.2} />
      </mesh>
      {/* Fine contact pins around all four edges */}
      {Array.from({ length: 9 }).map((_, i) => {
        const p = -0.91 + i * 0.2275;
        return (
          <group key={i}>
            {[-1, 1].map((side) => (
              <mesh key={`x-${side}`} position={[p, -0.03, side * 1.22]}>
                <boxGeometry args={[0.09, 0.08, 0.32]} />
                <meshStandardMaterial color="#58d8ff" metalness={0.9} roughness={0.22} emissive="#087bff" emissiveIntensity={0.5} />
              </mesh>
            ))}
            {[-1, 1].map((side) => (
              <mesh key={`z-${side}`} position={[side * 1.22, -0.03, p]}>
                <boxGeometry args={[0.32, 0.08, 0.09]} />
                <meshStandardMaterial color="#58d8ff" metalness={0.9} roughness={0.22} emissive="#087bff" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* Circuit traces */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.7;
        const z = Math.sin(angle) * 1.7;
        return (
          <group key={i}>
            <mesh position={[x * 0.72, -0.12, z * 0.72]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.85, 0.025, 0.035]} />
              <meshStandardMaterial color="#1e9dff" emissive="#087bff" emissiveIntensity={1.8} />
            </mesh>
            <mesh position={[x, -0.1, z]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshBasicMaterial color="#7deaff" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function SceneContent({ reducedMotion }: { reducedMotion: React.MutableRefObject<boolean> }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 4]} intensity={85} color="#258cff" />
      <pointLight position={[-4, -1, -3]} intensity={55} color="#7c3aed" />
      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.45}>
        <Chip reducedMotion={reducedMotion} />
      </Float>
      <Sparkles count={90} scale={6} size={2.2} speed={0.35} color="#62d9ff" />
      <Stars radius={45} depth={30} count={650} factor={2.2} saturation={0.3} fade />
      <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={7} blur={2.5} far={4} />
      <EnvironmentBoundary>
        <Environment preset="night" />
      </EnvironmentBoundary>
    </>
  );
}

export default function EngineeringScene() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="scene-shell" aria-label="Interactive 3D processor and circuit environment" role="img">
      <SceneErrorBoundary>
        <Canvas
          camera={{ position: [3.4, 2.6, 4.6], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <SceneContent reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
      <div className="scene-caption">
        <span className="live-dot" /> PROCESSOR MODEL
      </div>
      <div className="scene-coordinate">CPU / CORE-01<br />SIGNAL: ACTIVE</div>
    </div>
  );
}
