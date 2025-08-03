// useLeaderboardStore.ts
import { create } from "zustand";

export type LeaderboardPeriod = "monthly";

export interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardState {
	monthlyLeaderboard: LeaderboardPlayer[];
	isLoading: boolean;
	error: string | null;
	fetchLeaderboard: () => Promise<void>;
}

const API_URL = "https://moneylife1kdata.onrender.com/api/affiliates";

const getDateRange = (): { start_at: string; end_at: string } => {
	const now = new Date();
	const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
	const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	return {
		start_at: startDate.toISOString().split("T")[0],
		end_at: endDate.toISOString().split("T")[0],
	};
};

const processApiData = (data: any): LeaderboardPlayer[] => {
	if (!data?.affiliates || !Array.isArray(data.affiliates)) return [];

	return data.affiliates
		.filter((item: any) => item && item.username)
		.map((item: any, index: number) => ({
			rank: index + 1,
			username: item.username,
			wager: parseFloat(item.wagered_amount) || 0,
			isFeatured: item.username.toLowerCase().includes("5moking"),
		}))
		.sort((a, b) => b.wager - a.wager)
		.map((player, idx) => ({ ...player, rank: idx + 1 }));
};

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
	monthlyLeaderboard: [],
	isLoading: false,
	error: null,
	fetchLeaderboard: async () => {
		set({ isLoading: true, error: null });

		try {
			const { start_at, end_at } = getDateRange();
			const response = await fetch(
				`${API_URL}?start_at=${start_at}&end_at=${end_at}`
			);
			if (!response.ok) throw new Error(`Failed: ${response.status}`);
			const data = await response.json();
			const processed = processApiData(data);
			set({ monthlyLeaderboard: processed });
		} catch (err) {
			set({
				error: err instanceof Error ? err.message : "Unknown error",
			});
		} finally {
			set({ isLoading: false });
		}
	},
}));

export const getCurrentMonthlyRange = (): {
	start_at: string;
	end_at: string;
} => {
	const now = new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), 1);
	const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	return {
		start_at: start.toISOString().split("T")[0],
		end_at: end.toISOString().split("T")[0],
	};
};
