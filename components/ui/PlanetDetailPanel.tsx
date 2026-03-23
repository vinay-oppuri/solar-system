'use client';
import { useStore } from '@/store/useStore';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PlanetDetailPanel() {
    const phase = useStore(state => state.phase);
    const setPhase = useStore(state => state.setPhase);
    const planet = useStore(state => state.selectedPlanet);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (phase === 'arrived' && panelRef.current) {
            gsap.fromTo(panelRef.current,
                { x: '100%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 1, ease: 'power3.out' }
            );
        }
    }, [phase]);

    if (phase !== 'arrived' || !planet) return null;

    return (
        <div className="fixed inset-0 z-40 flex pointer-events-none">
            <div className="w-[60%] h-full relative">
                <button
                    onClick={() => setPhase('idle')}
                    className="pointer-events-auto absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-space-mono text-white transition-all backdrop-blur-md cursor-pointer hover:border-white/30"
                >
                    <span>←</span> Return to Solar System
                </button>
            </div>

            <div
                ref={panelRef}
                className="w-[40%] h-full pointer-events-auto overflow-y-auto"
                style={{
                    background: 'rgba(5, 13, 26, 0.75)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderLeft: '1px solid var(--ui-border)',
                    boxShadow: '-8px 0 32px rgba(0,0,0,0.6)'
                }}
            >
                <div className="p-12 pb-24">
                    <div className="mb-12">
                        <h1 className="font-orbitron font-bold text-6xl tracking-wider uppercase mb-4" style={{ color: planet.color }}>
                            {planet.name}
                        </h1>
                        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-space-mono tracking-widest uppercase text-accent">
                            {planet.type}
                        </span>
                    </div>

                    <p className="text-lg leading-relaxed text-starWhite/90 mb-12">
                        {planet.description}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-12 font-space-mono">
                        <Stat label="Diameter" value={`${planet.diameterKm.toLocaleString()} km`} />
                        <Stat label="Gravity" value={`${planet.gravityMs2} m/s²`} />
                        <Stat label="Mass" value={`${planet.massKg} kg`} />
                        <Stat label="Moons" value={planet.moons.toString()} />
                        <Stat label="Day" value={planet.dayLength} />
                        <Stat label="Year" value={planet.yearLength} />
                        <Stat label="Avg Temp" value={`${planet.avgTempC}°C`} />
                        <Stat label="Dist (Sun)" value={`${planet.distanceAU} AU`} />
                    </div>

                    <div className="mb-12">
                        <h3 className="font-orbitron text-xl text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Atmosphere</h3>
                        <div className="flex gap-2 flex-wrap text-sm font-space-mono">
                            {planet.atmosphere.length > 0 ? planet.atmosphere.map(gas => (
                                <span key={gas} className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded text-accent">
                                    {gas}
                                </span>
                            )) : <span className="text-white/50">None</span>}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-orbitron text-xl text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Fast Facts</h3>
                        <ul className="space-y-4">
                            {planet.funFacts.map((fact, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs text-accent">{i + 1}</span>
                                    </div>
                                    <p className="text-starWhite/80 leading-relaxed text-sm">{fact}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-xs text-white/50 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-sm text-starWhite whitespace-nowrap overflow-hidden text-ellipsis">{value}</div>
        </div>
    );
}
