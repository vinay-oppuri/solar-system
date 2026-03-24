'use client';

import { memo, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GraphicsQuality, useStore } from '@/store/useStore';
import gsap from 'gsap';

interface OrbitProps {
    radius: number;
    index: number;
    quality: GraphicsQuality;
}

const Orbit = memo(({ radius, index, quality }: OrbitProps) => {
    const lineRef = useRef<any>(null);
    const phase = useStore(state => state.phase);
    const isCinematic = quality === 'cinematic';

    const points = useMemo(() => {
        const pts = [];
        const segments = isCinematic ? 168 : 128;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        return pts;
    }, [radius, isCinematic]);

    const lineGeometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [points]);

    useEffect(() => {
        if (!lineRef.current) return;

        const material = lineRef.current.material as THREE.LineBasicMaterial;
        const idleOpacity = isCinematic ? 0.05 : 0.035;
        const activeOpacity = isCinematic ? 0.11 : 0.065;

        if (phase === 'sun-hovered') {
            gsap.to(material, {
                opacity: activeOpacity,
                duration: 1.35,
                delay: index * 0.06,
                ease: 'power2.out',
            });
        } else {
            gsap.to(material, {
                opacity: idleOpacity,
                duration: 0.9,
                ease: 'power1.out',
            });
        }
    }, [phase, index, isCinematic]);

    return (
        // @ts-ignore
        <line ref={lineRef} geometry={lineGeometry}>
            <lineBasicMaterial
                color={isCinematic ? '#8ca2c8' : '#7890b6'}
                transparent
                opacity={isCinematic ? 0.05 : 0.035}
                depthWrite={false}
            />
        </line>
    );
});

Orbit.displayName = 'Orbit';
export default Orbit;
