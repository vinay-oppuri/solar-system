import { create } from 'zustand';
import { Vector3 } from 'three';
import { Planet } from '@/data/planets';

export type Phase = 'idle' | 'sun-hovered' | 'orbiting' | 'planet-hovered' | 'traveling' | 'arrived';
export type GraphicsQuality = 'balanced' | 'cinematic';

interface AppState {
    phase: Phase;
    selectedPlanet: Planet | null;
    cameraTarget: Vector3;
    graphicsQuality: GraphicsQuality;
    isUIVisible: boolean;
    loadingProgress: number;
    isLoading: boolean;
    setPhase: (phase: Phase) => void;
    setSelectedPlanet: (planet: Planet | null) => void;
    setCameraTarget: (target: Vector3) => void;
    setGraphicsQuality: (quality: GraphicsQuality) => void;
    setUIVisible: (visible: boolean) => void;
    setLoadingProgress: (progress: number) => void;
    setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
    phase: 'idle',
    selectedPlanet: null,
    cameraTarget: new Vector3(0, 0, 0),
    graphicsQuality: 'cinematic',
    isUIVisible: true,
    loadingProgress: 0,
    isLoading: true,
    setPhase: (phase) => set({ phase }),
    setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
    setCameraTarget: (target) => set({ cameraTarget: target }),
    setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
    setUIVisible: (visible) => set({ isUIVisible: visible }),
    setLoadingProgress: (progress) => set({ loadingProgress: progress }),
    setIsLoading: (loading) => set({ isLoading: loading }),
}));
