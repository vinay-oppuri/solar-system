'use client';

import { GraphicsQuality, useStore } from '@/store/useStore';

const presets: { id: GraphicsQuality; label: string }[] = [
    { id: 'balanced', label: 'Balanced' },
    { id: 'cinematic', label: 'Cinematic' },
];

export default function GraphicsPreset() {
    const graphicsQuality = useStore(state => state.graphicsQuality);
    const setGraphicsQuality = useStore(state => state.setGraphicsQuality);

    return (
        <div
            className="fixed top-4 right-4 z-[60] p-2 rounded-xl border border-white/15 backdrop-blur-xl"
            style={{
                background: 'rgba(7, 14, 28, 0.7)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
            }}
        >
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-space-mono mb-2 px-1">
                Graphics
            </div>
            <div className="flex gap-1">
                {presets.map(preset => {
                    const selected = graphicsQuality === preset.id;
                    return (
                        <button
                            key={preset.id}
                            onClick={() => setGraphicsQuality(preset.id)}
                            className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-space-mono transition-colors border"
                            style={{
                                borderColor: selected ? 'rgba(79,195,247,0.6)' : 'rgba(255,255,255,0.12)',
                                background: selected ? 'rgba(79,195,247,0.18)' : 'rgba(255,255,255,0.04)',
                                color: selected ? '#9de7ff' : 'rgba(255,255,255,0.8)'
                            }}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
