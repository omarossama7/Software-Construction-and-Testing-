"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { useRef, useEffect } from "react"
import type * as THREE from "three"

interface Scene3DProps {
  balance: number
}

function GlassSphereVisualization({ balance }: Scene3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const mainSphereRef = useRef<THREE.Mesh>(null)
  const satelliteSpheresRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    if (!groupRef.current) return

    let animationId: number

    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.0008
        groupRef.current.rotation.x += 0.0003
      }

      if (mainSphereRef.current) {
        const scale = 1.2 + Math.sin(Date.now() * 0.003) * 0.2
        mainSphereRef.current.scale.set(scale, scale, scale)

        const material = mainSphereRef.current.material as THREE.MeshPhysicalMaterial
        if (material.transmission !== undefined) {
          material.transmission = 0.95 + Math.sin(Date.now() * 0.004) * 0.05
        }
      }

      satelliteSpheresRef.current.forEach((sphere, idx) => {
        if (sphere) {
          const angle = Date.now() * 0.0005 + (idx * Math.PI * 2) / 3
          const radius = 3 + idx * 0.5
          sphere.position.x = Math.cos(angle) * radius
          sphere.position.y = Math.sin(angle * 0.5) * 1.5
          sphere.position.z = Math.sin(angle) * radius

          // Pulsing effect
          const pulseScale = 0.6 + Math.sin(Date.now() * 0.004 + idx) * 0.15
          sphere.scale.set(pulseScale, pulseScale, pulseScale)

          // Rotation
          sphere.rotation.x += 0.01
          sphere.rotation.y += 0.015
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  const isPositive = balance >= 0
  const primaryColor = isPositive ? "#a78bfa" : "#f87171"

  return (
    <group ref={groupRef}>
      {/* Main glass sphere with premium materials */}
      <mesh ref={mainSphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 256, 256]} />
        <meshPhysicalMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.1}
          metalness={0.3}
          ior={1.5}
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Satellite glass spheres */}
      {[0, 1, 2].map((idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) satelliteSpheresRef.current[idx] = el
          }}
        >
          <sphereGeometry args={[0.6, 128, 128]} />
          <meshPhysicalMaterial
            transmission={0.9}
            thickness={0.3}
            roughness={0.15}
            metalness={0.2}
            ior={1.4}
            color={idx === 1 ? "#60a5fa" : idx === 2 ? "#fb923c" : primaryColor}
            emissive={idx === 1 ? "#60a5fa" : idx === 2 ? "#fb923c" : primaryColor}
            emissiveIntensity={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>
      ))}

      {/* Ambient light for glass effect */}
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#a78bfa" />
      <pointLight position={[0, 5, -5]} intensity={0.8} color="#60a5fa" />
    </group>
  )
}

export default function Scene3D({ balance }: Scene3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      <Environment preset="studio" />
      <ambientLight intensity={0.6} />
      <GlassSphereVisualization balance={balance} />
      <OrbitControls autoRotate autoRotateSpeed={1.5} enableZoom={false} enablePan={false} />
    </Canvas>
  )
}