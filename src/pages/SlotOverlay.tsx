import { useEffect, useState, useRef } from "react";

export default function SlotOverlay() {
	const [visibleCalls, setVisibleCalls] = useState<any[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const scrollInterval = useRef<NodeJS.Timeout | null>(null);

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

				const mappedCalls = data.map((call: any) => ({
					id: call._id,
					slotName: call.name,
					requester: call.user?.kickUsername || "Unknown",
					betAmount: call.betAmount ?? null,
					x250Hit: call.x250Hit ?? false,
					bonusCallName: call.bonusCall?.name ?? null,
				}));

				setVisibleCalls(mappedCalls);
			} catch (err) {
				console.error("Overlay fetch failed:", err);
			}
		};

		fetchOverlayCalls();
		const interval = setInterval(fetchOverlayCalls, 15000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!scrollRef.current || visibleCalls.length <= 3) return;

		const container = scrollRef.current;
		let scrollPos = 0;
		const itemHeight = container.firstElementChild?.clientHeight || 80;
		const totalHeight = itemHeight * visibleCalls.length;

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

	const doubledCalls = [...visibleCalls, ...visibleCalls];

	return (
		<div
			className='fixed max-w-full -translate-x-1/2 pointer-events-none select-none bottom-10 left-1/2 w-96'
			style={{ userSelect: "none", zIndex: 9999 }}
		>
			<div
				className='overflow-hidden border-4 shadow-xl rounded-3xl'
				style={{
					borderColor: "#EA6D0C",
					backgroundColor: "rgba(25, 31, 59, 0.85)", // #191F3B with opacity
					backdropFilter: "blur(8px)",
				}}
			>
				{/* TITLE */}
				<div
					className='py-3 font-extrabold tracking-widest text-center rounded-t-3xl'
					style={{
						backgroundColor: "#AF2D03",
						color: "#FFFFFF",
						borderBottom: "2px solid #EA6D0C",
						textShadow: "0 0 6px #EA6D0C",
						userSelect: "none",
					}}
				>
					🎰 SLOT CALLS
				</div>

				{/* SCROLLING CONTENT */}
				<div
					ref={scrollRef}
					className='overflow-hidden'
					style={{ height: 240 }}
				>
					<div className='flex flex-col'>
						{doubledCalls.map((call, index) => (
							<div
								key={`${call.id}-${index}`}
								className='flex flex-col justify-center px-6 py-3 border-b last:border-none'
								style={{
									borderColor: "rgba(234, 109, 12, 0.3)",
									height: 80,
									boxSizing: "border-box",
								}}
							>
								<div
									className='font-extrabold text-white drop-shadow-md'
									style={{ fontSize: "1.15rem" }}
								>
									🎰 <span style={{ color: "#38BDF8" }}>@{call.requester}</span>{" "}
									called{" "}
									<span style={{ color: "#EA6D0C" }}>{call.slotName}</span>
								</div>
								<div
									className='flex items-center gap-2 mt-1 font-semibold'
									style={{ color: "#FFFFFFCC" }}
								>
									{call.betAmount !== null && (
										<span>
											for{" "}
											<span style={{ color: "#AF2D03" }}>
												${call.betAmount.toLocaleString()}
											</span>
										</span>
									)}
									{call.x250Hit && (
										<span
											className='ml-auto text-xs font-bold rounded-full select-none'
											style={{
												backgroundColor: "#38BDF8",
												color: "#191F3B",
												padding: "0.15em 0.5em",
											}}
										>
											💥 250x HIT!
										</span>
									)}
								</div>
								{call.bonusCallName && (
									<div
										className='mt-1 italic font-medium drop-shadow-md'
										style={{ color: "#38BDF8" }}
									>
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
