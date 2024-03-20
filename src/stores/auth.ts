import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
	token: null | string;
	getToken: () => null | string;
	login: (symplaApiKey: string) => Promise<void>;
	logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			token: null,

			getToken: () => get().token,

			login: async (symplaApiKey) => {
				const response = await fetch("/api/login", {
					body: JSON.stringify({ symplaApiKey }),
					method: "POST",
				});

				if (response.status !== 200) throw new Error("Invalid Api Key");

				const { token } = await response.json();
				set({ token });
			},

			logout: () => set({ token: null }),
		}),
		{ name: "sympla-raffle-auth" },
	),
);
