'use client';

import { memo, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';

interface OrbitProps {
    radius: number;
    index: number;
}

const Orbit = memo(({ radius, index }: OrbitProps) => {
    const lineRef = useRef<any>(null);
    const phase = useStore(state => state.phase);

    const points = useMemo(() => {
        const pts = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        return pts;
    }, [radius]);

    const lineGeometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [points]);

    useEffect(() => {
        if (phase === 'sun-hovered' && lineRef.current) {
            const material = lineRef.current.material as THREE.LineDashedMaterial;
            material.dashSize = 0;
            gsap.to(material, {
                dashSize: 0.5,
                duration: 1.5,
                delay: index * 0.12,
                ease: 'power2.out',
            });
        }
    }, [phase, index]);

    return (
        // @ts-ignore
        <line ref={lineRef} geometry={lineGeometry} onUpdate={(line: any) => line?.computeLineDistances?.()}>
            <lineDashedMaterial
                color="#ffffff"
                transparent
                opacity={0.12}
                dashSize={0.5}
                gapSize={0.3}
                scale={1}
            />
        </line>
    );
});

Orbit.displayName = 'Orbit';
export default Orbit;
