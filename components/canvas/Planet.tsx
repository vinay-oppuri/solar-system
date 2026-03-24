'use client';

import { useRef, memo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, DoubleSide } from 'three';
import { useTexture } from '@react-three/drei';
import { Planet as PlanetData } from '@/data/planets';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';
import gsap from 'gsap';

const Atmosphere = ({ color, size, isGasGiant }: { color: string, size: number, isGasGiant: boolean }) => {
    const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
    const fragmentShader = `
    varying vec3 vNormal;
    uniform vec3 uColor;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
      gl_FragColor = vec4(uColor, 1.0) * intensity * 2.0;
    }
  `;
    return (
        <mesh scale={isGasGiant ? 1.06 : 1.12}>
            <sphereGeometry args={[size, 40, 40]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{ uColor: { value: new THREE.Color(color) } }}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
};

const Rings = ({ textureUrl, innerRadius, outerRadius, color }: { textureUrl?: string, innerRadius: number, outerRadius: number, color: string }) => {
    // If textureUrl is present, load it, otherwise use solid color. 
    // Custom hook usage isn't conditionally allowed, so we will handle placeholder ring
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[innerRadius, outerRadius, 64]} />
            <meshBasicMaterial color={color} side={DoubleSide} transparent opacity={0.4} />
        </mesh>
    );
};

interface PlanetProps {
    data: PlanetData;
    index: number;
}

const Planet = memo(({ data, index }: PlanetProps) => {
    const meshRef = useRef<Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    const setPhase = useStore(state => state.setPhase);
    const phase = useStore(state => state.phase);
    const setSelectedPlanet = useStore(state => state.setSelectedPlanet);
    const setCameraTarget = useStore(state => state.setCameraTarget);
    const selectedPlanet = useStore(state => state.selectedPlanet);

    const texture = useTexture(data.textureUrl);

    const angleRef = useRef((index * Math.PI) / 4); // Distribute initially

    useEffect(() => {
        // Initial reveal animation logic
        if (phase === 'sun-hovered' && groupRef.current) {
            // Scale from 0 to 1 over time with a stagger
            groupRef.current.scale.set(0, 0, 0);
            gsap.to(groupRef.current.scale, {
                x: 1, y: 1, z: 1,
                duration: 1.0,
                delay: index * 0.12,
                ease: 'back.out(1.5)',
            });
        }
    }, [phase, index]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += data.rotationSpeed * delta;
        }

        if (groupRef.current) {
            // Pause if hovered or traveling
            const isPaused = phase === 'planet-hovered' || phase === 'traveling' || phase === 'arrived';
            if (!isPaused) {
                angleRef.current -= data.orbitalSpeed * delta * 0.5; // Negative to go counter-clockwise (standard)
            }

            const x = Math.cos(angleRef.current) * data.orbitRadius;
            const z = Math.sin(angleRef.current) * data.orbitRadius;
            groupRef.current.position.set(x, 0, z);
        }
    });

    const handlePointerEnter = (e: any) => {
        e.stopPropagation();
        if (phase === 'sun-hovered' || phase === 'orbiting' || phase === 'idle') {
            document.body.style.cursor = 'pointer'; // "hint CTA"
            setPhase('planet-hovered');
            setSelectedPlanet(data);
            if (meshRef.current) {
                gsap.to((meshRef.current.material as THREE.MeshStandardMaterial).emissive, {
                    r: 0.1, g: 0.1, b: 0.1, duration: 0.3
                });
            }
        }
    };

    const handlePointerLeave = (e: any) => {
        e.stopPropagation();
        if (phase === 'planet-hovered' && selectedPlanet?.id === data.id) {
            document.body.style.cursor = 'auto';
            setPhase('orbiting');
            setSelectedPlanet(null);
            if (meshRef.current) {
                gsap.to((meshRef.current.material as THREE.MeshStandardMaterial).emissive, {
                    r: 0, g: 0, b: 0, duration: 0.3
                });
            }
        }
    };

    const handleClick = (e: any) => {
        e.stopPropagation();
        if (phase === 'planet-hovered' && selectedPlanet?.id === data.id) {
            setPhase('traveling');
            document.body.style.cursor = 'auto';
            if (groupRef.current) {
                const worldPos = new Vector3();
                groupRef.current.getWorldPosition(worldPos);
                setCameraTarget(worldPos);
            }
        }
    };

    const isDimmed = phase === 'planet-hovered' && selectedPlanet?.id !== data.id;

    return (
        <group ref={groupRef}>
            <group rotation={[0, 0, THREE.MathUtils.degToRad(data.axialTilt)]}>
                <mesh
                    ref={meshRef}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                    onClick={handleClick}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[data.size, 24, 24]} />
                    <meshStandardMaterial
                        map={texture}
                        roughness={data.type === 'Gas Giant' || data.type === 'Ice Giant' ? 0.3 : 0.8}
                        metalness={0.1}
                        transparent
                        opacity={isDimmed ? 0.4 : 1.0}
                    />
                </mesh>

                {data.hasRings && (
                    <Rings
                        textureUrl={data.ringTextureUrl}
                        innerRadius={data.size * 1.5}
                        outerRadius={data.size * 2.2}
                        color={data.color}
                    />
                )}

                {(data.type === 'Gas Giant' || data.type === 'Ice Giant' || data.id === 'earth' || data.id === 'venus') && (
                    <Atmosphere color={data.color} size={data.size} isGasGiant={data.type === 'Gas Giant' || data.type === 'Ice Giant'} />
                )}
            </group>
        </group>
    );
});

Planet.displayName = 'Planet';
export default Planet;
