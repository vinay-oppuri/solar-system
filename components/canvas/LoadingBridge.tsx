'use client';

import { useProgress } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

/**
 * Must be rendered INSIDE the <Canvas> (inside a Suspense).
 * It bridges @react-three/drei useProgress into the global Zustand store
 * so that UI components outside the Canvas can react to loading state.
 */
export default function LoadingBridge() {
    const { progress, active } = useProgress();
    const setLoadingProgress = useStore(state => state.setLoadingProgress);
    const setIsLoading = useStore(state => state.setIsLoading);
    // Track whether a real loading event was ever triggered
    const didStartLoading = useRef(false);

    useEffect(() => {
        // If active is true or progress > 0, a real loading cycle has begun
        if (active || progress > 0) {
            didStartLoading.current = true;
        }
        setLoadingProgress(progress);

        if (didStartLoading.current) {
            // Treat >= 99.5 as completed to avoid stuck overlays due float precision.
            const isDone = !active && progress >= 99.5;
            setIsLoading(!isDone);
        } else {
            // Nothing has started loading yet — could be cached assets.
            // Mark as loaded after a short grace period so the scene is visible.
            const timer = setTimeout(() => {
                if (!didStartLoading.current) {
                    setIsLoading(false);
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [progress, active, setLoadingProgress, setIsLoading]);

    return null;
}
