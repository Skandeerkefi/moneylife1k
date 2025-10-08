import { create } from "zustand";

interface ShockReferral {
	username: string;
	totalReferrals: number;
	earnings: number;
	wagerAmount: number;
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

			// ✅ Clean and normalize data
			const normalized = data.map((item: any) => ({
				...item,
				wagerAmount: parseFloat(item.wagerAmount || 0),
				totalReferrals: parseInt(item.totalReferrals || 0),
				earnings: parseFloat(item.earnings || 0),
			}));

			set({ referrals: normalized, loading: false });
		} catch (err: any) {
			console.error("Shock Fetch Error:", err);
			set({ error: err.message, loading: false });
		}
	},
}));
