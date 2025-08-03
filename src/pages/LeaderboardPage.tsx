// LeaderboardPage.tsx
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import {
	useLeaderboardStore,
	getCurrentMonthlyRange,
} from "@/store/useLeaderboardStore";
import { Trophy, Info, Loader2, Award, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

function LeaderboardPage() {
	const { monthlyLeaderboard, fetchLeaderboard, isLoading, error } =
		useLeaderboardStore();

	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	const { start_at, end_at } = getCurrentMonthlyRange();
	const [timeLeft, setTimeLeft] = useState<string>("");

	useEffect(() => {
		const interval = setInterval(() => {
			const endDate = new Date(end_at + "T23:59:59");
			const now = new Date();
			const diff = endDate.getTime() - now.getTime();
			if (diff <= 0) {
				setTimeLeft("Leaderboard period has ended.");
				clearInterval(interval);
				return;
			}
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);
			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
		}, 1000);
		return () => clearInterval(interval);
	}, [end_at]);

	return (
		<div className='flex flex-col min-h-screen bg-[#161A34] text-white'>
			<Navbar />

			<main className='container flex-grow py-8'>
				{/* Title & Tooltip */}
				<div className='flex items-center justify-between mb-8'>
					<div className='flex items-center gap-2'>
						<Crown className='w-6 h-6 text-[#38BDF8]' />
						<h1 className='text-3xl font-bold'>Rainbet Leaderboard</h1>
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className='flex items-center gap-1 text-sm text-[#CF9F86] hover:text-[#38BDF8] cursor-help'>
									<Info className='w-4 h-4' />
									<span>How It Works</span>
								</div>
							</TooltipTrigger>
							<TooltipContent className='bg-[#161A34] text-white border border-[#38BDF8]'>
								<p>
									The leaderboard ranks players based on their total wager
									amount using the MONEYLIFE affiliate code on Rainbet.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Info & Code */}
				<div className='p-6 mb-8 rounded-lg bg-[#1E2547] border border-[#38BDF8]/30'>
					<p className='mb-4 text-[#CF9F86]'>
						Use affiliate code{" "}
						<span className='font-semibold text-[#38BDF8]'>MONEYLIFE</span> on
						<a
							href='https://rainbet.com'
							target='_blank'
							rel='noreferrer'
							className='mx-1 text-[#38BDF8] hover:underline'
						>
							Rainbet
						</a>
						to appear on this leaderboard!
					</p>
					<div className='px-3 py-1.5 rounded-md bg-[#38BDF8]/10 inline-block'>
						<span className='text-[#CF9F86]'>Affiliate Code:</span>
						<span className='ml-2 font-bold text-[#38BDF8]'>MONEYLIFE1K</span>
					</div>
				</div>

				{error && (
					<Alert
						variant='destructive'
						className='mb-6 bg-[#CF9F86]/20 border-[#CF9F86] text-white'
					>
						<AlertDescription>
							Failed to load leaderboard: {error}
						</AlertDescription>
					</Alert>
				)}

				{/* Rewards */}
				<div className='mb-8'>
					<h2 className='mb-6 text-2xl font-bold text-center'>Top Players</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{monthlyLeaderboard.length > 0 ? (
							<>
								<RewardCard
									position='2nd Place'
									reward='$250 Cash + Role'
									backgroundColor='from-slate-300 to-slate-400'
									player={monthlyLeaderboard[1]}
									icon={<Award className='w-8 h-8' />}
								/>
								<RewardCard
									position='1st Place'
									reward='$500 Cash + Role'
									backgroundColor='from-yellow-400 to-amber-600'
									player={monthlyLeaderboard[0]}
									icon={<Trophy className='w-8 h-8' />}
								/>
								<RewardCard
									position='3rd Place'
									reward='$100 Cash + Role'
									backgroundColor='from-amber-700 to-amber-800'
									player={monthlyLeaderboard[2]}
									icon={<Medal className='w-8 h-8' />}
								/>
							</>
						) : (
							<></>
						)}
					</div>
				</div>

				{/* Table */}
				<div className='mb-6 text-center'>
					<h2 className='text-xl font-semibold border-2 border-[#38BDF8] rounded-md py-2 px-6 inline-block'>
						Monthly Leaderboard
					</h2>
					<p className='mt-2 text-sm text-[#CF9F86]'>
						Period: {start_at} → {end_at}
					</p>
					<p className='mt-1 text-sm text-[#38BDF8]'>{timeLeft}</p>
				</div>
				{isLoading ? (
					<div className='flex items-center justify-center h-64'>
						<Loader2 className='w-8 h-8 animate-spin text-[#38BDF8]' />
					</div>
				) : (
					<LeaderboardTable period='monthly' data={monthlyLeaderboard} />
				)}
			</main>

			<Footer />
		</div>
	);
}

interface RewardCardProps {
	position: string;
	reward: string;
	backgroundColor: string;
	player?: LeaderboardPlayer;
	icon?: React.ReactNode;
}

function RewardCard({
	position,
	reward,
	backgroundColor,
	player,
	icon,
}: RewardCardProps) {
	return (
		<div className='flex flex-col h-full overflow-hidden rounded-xl bg-[#1E2547] border border-[#38BDF8]/30'>
			<div className={`h-2 bg-gradient-to-r ${backgroundColor}`} />
			<div className='flex flex-col items-center flex-grow p-6 text-white'>
				{icon && <div className='mb-4'>{icon}</div>}
				<h3 className='mb-2 text-xl font-bold'>{position}</h3>
				{player ? (
					<>
						<p className='font-medium'>{player.username}</p>
						<p className='text-[#38BDF8]'>${player.wager.toLocaleString()}</p>
						<a
							href='discord.gg/49aCsAvsBn'
							target='_blank'
							rel='noreferrer'
							className='w-full mt-4'
						>
							<Button className='w-full bg-[#38BDF8] hover:bg-[#2DA2D2] text-white'>
								Claim Prize
							</Button>
						</a>
					</>
				) : (
					<p className='text-[#CF9F86]'>{reward}</p>
				)}
			</div>
		</div>
	);
}

export default LeaderboardPage;
