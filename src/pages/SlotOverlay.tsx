import { useEffect, useState, useRef } from "react";

export default function SlotOverlay() {
	const [visibleCalls, setVisibleCalls] = useState<any[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const scrollInterval = useRef<NodeJS.Timeout | null>(null);

	// Fetch slot calls every 15 seconds
	useEffect(() => {
		const fetchOverlayCalls = async () => {
			try {
				const res = await fetch(
					"https://moneylife1kdata.onrender.com/api/slot-calls",
					{
						headers: {
							Authorization:
								"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGJkMTg2MjQyNGJjNjllZGJmZGM4YSIsInJvbGUiOiJhZG1pbiIsImtpY2tVc2VybmFtZSI6InNrYW5kZXIiLCJpYXQiOjE3NTQyMTk1MjcsImV4cCI6MTc1NDgyNDMyN30.Obp3v8gjiCKLWHuOhVX4ncEjga1fzj-67HIBhWDvt2k",
						},
					}
				);

				if (!res.ok) throw new Error("Failed to fetch slot calls");

				const data = await res.json();

				const accepted = data
					.filter((call: any) => call.status === "accepted")
					.map((call: any) => ({
						id: call._id,
						slotName: call.name,
						requester: call.user?.kickUsername || "Unknown",
						betAmount: call.betAmount ?? null,
						x250Hit: call.x250Hit ?? false,
						bonusCallName: call.bonusCall?.name ?? null,
					}));

				setVisibleCalls(accepted);
			} catch (err) {
				console.error("Overlay fetch failed:", err);
			}
		};

		fetchOverlayCalls();
		const interval = setInterval(fetchOverlayCalls, 15000);
		return () => clearInterval(interval);
	}, []);

	// Scroll logic using scrollTop
	useEffect(() => {
		if (!scrollRef.current || visibleCalls.length <= 3) return;

		const container = scrollRef.current;
		let scrollPos = 0;
		const itemHeight = container.firstElementChild?.clientHeight || 80; // fallback 80px
		const totalHeight = itemHeight * visibleCalls.length;

		// Reset scroll to top on calls change
		container.scrollTop = 0;

		scrollInterval.current && clearInterval(scrollInterval.current);

		scrollInterval.current = setInterval(() => {
			scrollPos += 1;
			if (scrollPos >= totalHeight) scrollPos = 0;
			container.scrollTop = scrollPos;
		}, 20);

		return () => {
			scrollInterval.current && clearInterval(scrollInterval.current);
			if (container) container.scrollTop = 0;
		};
	}, [visibleCalls]);

	// Duplicate calls for seamless scroll looping
	const doubledCalls = [...visibleCalls, ...visibleCalls];

	return (
		<div
			className='fixed max-w-full -translate-x-1/2 bg-transparent pointer-events-none select-none bottom-10 left-1/2 w-96'
			style={{ userSelect: "none" }}
		>
			<div className='overflow-hidden rounded-2xl border-4 border-[#EA6D0C] bg-black bg-opacity-70 backdrop-blur-md shadow-xl'>
				{/* TITLE */}
				<div className='text-center py-3 text-xl font-bold text-white bg-[#AF2D03] rounded-t-md border-b border-[#EA6D0C]/60 tracking-wide'>
					🎰 SLOT CALLS
				</div>

				{/* SCROLLING CONTENT */}
				<div
					style={{ height: "240px" }}
					className='overflow-hidden'
					ref={scrollRef}
				>
					<div className='flex flex-col'>
						{doubledCalls.map((call, index) => (
							<div
								key={`${call.id}-${index}`}
								className='flex flex-col px-6 py-4 border-b border-[#EA6D0C]/30 last:border-none'
								style={{ height: "80px", boxSizing: "border-box" }}
							>
								<div className='text-xl font-extrabold text-white drop-shadow-md'>
									🎰 <span className='text-[#38BDF8]'>@{call.requester}</span>{" "}
									called <span className='text-[#EA6D0C]'>{call.slotName}</span>
								</div>
								<div className='text-[#FFFFFFCC] mt-1 font-semibold flex items-center gap-2'>
									{call.betAmount !== null && (
										<span>
											for{" "}
											<span className='text-[#AF2D03]'>
												${call.betAmount.toLocaleString()}
											</span>
										</span>
									)}
									{call.x250Hit && (
										<span className='ml-auto px-2 py-0.5 rounded-full bg-[#38BDF8] text-[#191F3B] text-xs font-bold select-none'>
											💥 250x HIT!
										</span>
									)}
								</div>
								{call.bonusCallName && (
									<div className='mt-1 text-[#38BDF8] italic font-medium drop-shadow-md'>
										Bonus Call:{" "}
										<span className='font-bold'>{call.bonusCallName}</span>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
