'use client';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export default function HoverCard() {
    const phase = useStore(state => state.phase);
    const selectedPlanet = useStore(state => state.selectedPlanet);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
        };
        if (phase === 'planet-hovered') {
            window.addEventListener('mousemove', handleMouseMove);
            // Give initial position if it hasn't moved yet? Tricky.
        }
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [phase]);

    if (phase !== 'planet-hovered' || !selectedPlanet) return null;

    return (
        <div
            className="pointer-events-none fixed z-50 flex flex-col gap-2 p-5 transition-opacity duration-300"
            style={{
                left: pos.x + 20,
                top: pos.y + 20,
                background: 'var(--ui-glass)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid var(--ui-border)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
        >
            <h2 className="font-orbitron font-bold text-2xl text-white tracking-widest uppercase" style={{ color: selectedPlanet.color }}>{selectedPlanet.name}</h2>
            <div className="flex items-center gap-2 text-accent text-sm font-space-mono mb-2">
                <span className="uppercase tracking-widest">{selectedPlanet.type}</span>
                <span>•</span>
                <span>{selectedPlanet.distanceAU} AU</span>
            </div>
            <p className="max-w-xs text-sm text-starWhite/80 leading-relaxed">
                {selectedPlanet.funFacts[0]}
            </p>
            <div className="mt-2 text-xs font-bold text-accent font-space-mono flex items-center gap-2">
                CLICK TO TRAVEL
                <span className="animate-pulse">→</span>
            </div>
        </div>
    );
}
