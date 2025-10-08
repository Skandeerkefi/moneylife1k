import { useEffect } from "react";
import { useShockStore } from "@/store/shockStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ShockPage() {
	const { referrals, loading, error, fetchReferrals } = useShockStore();

	useEffect(() => {
		fetchReferrals();
	}, [fetchReferrals]);

	const prizes = [250, 125, 100, 70, 55];

	// ✅ Safe number formatter (handles string or undefined)
	const formatWager = (amount: any) => {
		const num = parseFloat(amount);
		if (isNaN(num) || num <= 0) return "$0";
		return `$${num.toFixed(3)}`;
	};

	// ✅ Sort descending safely
	const sortedReferrals = [...referrals].sort(
		(a, b) => parseFloat(b.wagerAmount || 0) - parseFloat(a.wagerAmount || 0)
	);

	return (
		<div className='flex flex-col min-h-screen bg-[#161A34] text-white'>
			<Navbar />

			<main className='flex-1 w-full max-w-5xl px-6 py-10 mx-auto'>
				<h1 className='mb-6 text-3xl font-bold text-center'>
					Shock Leaderboard
				</h1>

				{loading && (
					<p className='text-center text-gray-300'>Loading referrals...</p>
				)}

				{error && <p className='text-center text-red-400'>❌ Error: {error}</p>}

				{!loading && !error && referrals.length === 0 && (
					<p className='text-center text-gray-400'>No referral data found.</p>
				)}

				{!loading && !error && referrals.length > 0 && (
					<div className='overflow-x-auto'>
						<table className='w-full overflow-hidden border border-gray-600 rounded-lg'>
							<thead className='bg-[#1F2349] text-gray-200'>
								<tr>
									<th className='px-4 py-2 text-left'>#</th>
									<th className='px-4 py-2 text-left'>Username</th>
									<th className='px-4 py-2 text-left'>wagerAmount</th>
									<th className='px-4 py-2 text-left'>Prize</th>
								</tr>
							</thead>
							<tbody>
								{sortedReferrals.map((ref, index) => (
									<tr
										key={index}
										className={`${
											index % 2 === 0 ? "bg-[#1A1D3D]" : "bg-[#21254F]"
										} hover:bg-[#292E63] transition-colors`}
									>
										<td className='px-4 py-2'>{index + 1}</td>
										<td className='px-4 py-2 font-semibold'>
											{ref.username || "N/A"}
										</td>
										<td className='px-4 py-2 text-blue-400'>
											{formatWager(ref.wagerAmount)}
										</td>
										<td className='px-4 py-2 font-semibold text-yellow-400'>
											{index < prizes.length ? `$${prizes[index]}` : "-"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
