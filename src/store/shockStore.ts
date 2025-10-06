import { create } from "zustand";

interface ShockReferral {
	username: string;
	totalReferrals: number;
	earnings: number;
	wagerAmount: number; // ✅ added
	[key: string]: any;
}

interface ShockState {
	referrals: ShockReferral[];
	loading: boolean;
	error: string | null;
	fetchReferrals: () => Promise<void>;
}

export const useShockStore = create<ShockState>((set) => ({
	referrals: [],
	loading: false,
	error: null,

	fetchReferrals: async () => {
		set({ loading: true, error: null });

		try {
			const res = await fetch(
				"https://moneylife1kdata-production.up.railway.app/api/shock/referrals"
			);
			if (!res.ok) throw new Error("Failed to fetch Shock referrals");

			const data = await res.json();
			set({ referrals: data, loading: false });
		} catch (err: any) {
			console.error("Shock Fetch Error:", err);
			set({ error: err.message, loading: false });
		}
	},
}));
