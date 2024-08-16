import { create } from "zustand";
type Preferences = {
  soundEnabled: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
};

type Volume = {
  volume: number;
  setVolume: (volume: number) => void;
};

// SOUND hook
export const usePreferences = create<Preferences>((set) => ({
  soundEnabled: true,
  setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),
}));

// VOLUME hook
export const useVolume = create<Volume>((set) => ({
  volume: 0.5,
  setVolume: (volume: number) => set({ volume }),
}));
