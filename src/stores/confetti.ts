import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConffetiStore {
	view: boolean;
	setView: (view: boolean) => void;
}

export const useConfettiStore = create<ConffetiStore>()((set) => ({
	view: false,
	setView: (view) => set({ view }),
}));
