'use client';

import { useRef, memo, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, DoubleSide } from 'three';
import { useTexture } from '@react-three/drei';
import { Planet as PlanetData } from '@/data/planets';
import { GraphicsQuality, useStore } from '@/store/useStore';
import * as THREE from 'three';
import gsap from 'gsap';

const Atmosphere = ({ color, size, quality, strength }: { color: string, size: number, quality: GraphicsQuality, strength: number }) => {
    const segments = quality === 'cinematic' ? 44 : 32;

    const vertexShader = `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;
    const fragmentShader = `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    uniform vec3 uColor;
    uniform float uStrength;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), 2.2);
      float alpha = fresnel * uStrength;
      gl_FragColor = vec4(uColor, alpha);
    }
  `;
    return (
        <mesh scale={1.035}>
            <sphereGeometry args={[size, segments, segments]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uColor: { value: new THREE.Color(color) },
                    uStrength: { value: strength }
                }}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
};

const Rings = ({ textureUrl, innerRadius, outerRadius, color, quality, maxAnisotropy }: { textureUrl?: string, innerRadius: number, outerRadius: number, color: string, quality: GraphicsQuality, maxAnisotropy: number }) => {
    const ringTexture = useTexture(textureUrl ?? '/textures/saturn_ring.png?v=1');
    const isCinematic = quality === 'cinematic';

    useEffect(() => {
        ringTexture.colorSpace = THREE.SRGBColorSpace;
        ringTexture.wrapS = THREE.RepeatWrapping;
        ringTexture.wrapT = THREE.ClampToEdgeWrapping;
        ringTexture.anisotropy = Math.min(maxAnisotropy, isCinematic ? 8 : 4);
        ringTexture.needsUpdate = true;
    }, [ringTexture, isCinematic, maxAnisotropy]);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[innerRadius, outerRadius, isCinematic ? 128 : 80]} />
            <meshStandardMaterial
                color={color}
                map={ringTexture}
                alphaMap={ringTexture}
                emissive={color}
                emissiveIntensity={isCinematic ? 0.08 : 0.05}
                side={DoubleSide}
                transparent
                opacity={textureUrl ? 0.82 : 0.08}
                roughness={0.72}
                metalness={0.05}
                depthWrite={false}
            />
        </mesh>
    );
};

interface PlanetProps {
    data: PlanetData;
    index: number;
    quality: GraphicsQuality;
}

const Planet = memo(({ data, index, quality }: PlanetProps) => {
    const meshRef = useRef<Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const isCinematic = quality === 'cinematic';
    const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
    const isGasLike = data.type === 'Gas Giant' || data.type === 'Ice Giant';
    const isEarth = data.id === 'earth';
    const isVenus = data.id === 'venus';

    const setPhase = useStore(state => state.setPhase);
    const phase = useStore(state => state.phase);
    const setSelectedPlanet = useStore(state => state.setSelectedPlanet);
    const setCameraTarget = useStore(state => state.setCameraTarget);
    const selectedPlanet = useStore(state => state.selectedPlanet);

    const texture = useTexture(data.textureUrl);
    const sphereSegments = isCinematic ? 36 : 24;

    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(maxAnisotropy, isCinematic ? 8 : 4);
        texture.needsUpdate = true;
    }, [texture, isCinematic, maxAnisotropy]);

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
                gsap.to(meshRef.current.scale, { x: 1.03, y: 1.03, z: 1.03, duration: 0.24, ease: 'power2.out' });
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
                gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.24, ease: 'power2.out' });
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
                    castShadow={isCinematic}
                    receiveShadow={isCinematic}
                >
                    <sphereGeometry args={[data.size, sphereSegments, sphereSegments]} />
                    <meshPhysicalMaterial
                        map={texture}
                        roughness={isGasLike ? 0.74 : (isEarth ? 0.45 : 0.62)}
                        metalness={0.02}
                        clearcoat={isEarth ? 0.55 : (isVenus ? 0.3 : 0.12)}
                        clearcoatRoughness={isEarth ? 0.28 : 0.62}
                        envMapIntensity={isCinematic ? 0.55 : 0.35}
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
                        quality={quality}
                        maxAnisotropy={maxAnisotropy}
                    />
                )}

                {(data.id === 'earth' || data.id === 'venus') && (
                    <Atmosphere
                        color={data.color}
                        size={data.size}
                        quality={quality}
                        strength={data.id === 'earth' ? 0.38 : 0.2}
                    />
                )}
            </group>
        </group>
    );
});

Planet.displayName = 'Planet';
export default Planet;
