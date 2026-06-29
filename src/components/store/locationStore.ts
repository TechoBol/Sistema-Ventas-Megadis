import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Location {
  id: number;
  name: string;
  [key: string]: any;
}

interface LocationStore {
  selectedLocation: Location | null;
  initialized: boolean;
  setSelectedLocation: (location: Location | null) => void;
  setInitialized: () => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      selectedLocation: null,
      initialized: false,
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setInitialized: () => set({ initialized: true }),
    }),
    { name: "selected-location" },
  ),
);