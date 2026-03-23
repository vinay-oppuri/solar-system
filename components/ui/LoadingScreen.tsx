'use client';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const progress = useStore(state => state.loadingProgress);
    const isLoading = useStore(state => state.isLoading);
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const t = setTimeout(() => setShow(false), 800);
            return () => clearTimeout(t);
        }
    }, [isLoading]);

    if (!show) return null;

    return (
        <div className={`fixed inset-0 z-100 bg-spaceBlack flex flex-col items-center justify-center transition-opacity duration-700 ${!isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            <div className="w-64 max-w-[80vw]">
                <div className="text-accent font-space-mono text-xs mb-3 tracking-widest uppercase flex justify-between items-end">
                    <span className="animate-pulse">Establishing Uplink...</span>
                    <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-0.5 bg-white/10 overflow-hidden relative">
                    <div
                        className="absolute top-0 left-0 h-full bg-accent transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
