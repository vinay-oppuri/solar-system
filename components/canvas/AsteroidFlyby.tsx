'use client';

import { Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GraphicsQuality } from '@/store/useStore';

interface AsteroidFlybyProps {
    quality: GraphicsQuality;
}

function randBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
}

function mulberry32(seed: number) {
    return function rng() {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default function AsteroidFlyby({ quality }: AsteroidFlybyProps) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const progressRef = useRef(-0.2);
    const driftRef = useRef(0);
    const isCinematic = quality === 'cinematic';

    const config = useMemo(() => {
        const side = Math.random() > 0.5 ? -1 : 1;
        const seed = Math.floor(Math.random() * 1_000_000);
        const start = new THREE.Vector3(side * 145, randBetween(-9, 17), randBetween(-42, 42));
        const end = new THREE.Vector3(-side * 145, randBetween(-9, 17), randBetween(-42, 42));

        return {
            seed,
            start,
            end,
            size: randBetween(0.22, 0.52),
            duration: randBetween(18, 30),
            driftAmplitude: randBetween(1.2, 3.4),
            driftSpeed: randBetween(0.35, 0.65),
            spin: new THREE.Vector3(
                randBetween(0.3, 1.0),
                randBetween(0.5, 1.4),
                randBetween(0.2, 0.8)
            ),
        };
    }, []);

    const geometry = useMemo(() => {
        const detail = quality === 'cinematic' ? 1 : 0;
        const geo = new THREE.IcosahedronGeometry(config.size, detail);
        const random = mulberry32(config.seed);
        const position = geo.attributes.position;

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const z = position.getZ(i);
            const vertex = new THREE.Vector3(x, y, z);
            const scale = 0.86 + random() * 0.3;
            vertex.multiplyScalar(scale);
            position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        position.needsUpdate = true;
        geo.computeVertexNormals();
        return geo;
    }, [config.seed, config.size, quality]);

    useFrame((_, delta) => {
        if (!groupRef.current || !meshRef.current) return;

        progressRef.current += delta / config.duration;
        if (progressRef.current > 1.15) {
            progressRef.current = -0.2;
        }

        driftRef.current += delta * config.driftSpeed;
        const t = progressRef.current;
        groupRef.current.position.lerpVectors(config.start, config.end, t);
        groupRef.current.position.y += Math.sin(driftRef.current) * config.driftAmplitude * 0.08;

        meshRef.current.rotation.x += config.spin.x * delta;
        meshRef.current.rotation.y += config.spin.y * delta;
        meshRef.current.rotation.z += config.spin.z * delta;
    });

    return (
        <group ref={groupRef}>
            <Trail
                width={isCinematic ? 0.95 : 0.65}
                length={isCinematic ? 7 : 5}
                color="#ffbf7a"
                decay={1}
                attenuation={(t) => t * t}
                local={false}
                stride={0}
                interval={1}
            >
                <mesh ref={meshRef} geometry={geometry} castShadow={isCinematic}>
                    <meshStandardMaterial
                        color="#7e7368"
                        roughness={0.95}
                        metalness={0.02}
                        emissive="#2a241d"
                        emissiveIntensity={0.04}
                    />
                </mesh>
            </Trail>
            <mesh position={[0, 0, 0]} raycast={() => null}>
                <sphereGeometry args={[config.size * 1.35, 16, 16]} />
                <meshBasicMaterial color="#ffd5a0" transparent opacity={0.12} depthWrite={false} />
            </mesh>
        </group>
    );
}
