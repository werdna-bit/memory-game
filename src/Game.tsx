import { useEffect, useState } from "react";

interface Props {
	theme: "numbers" | "icons";
	playerCount: number;
	gridSize: number;
}
export default function Game({ theme, playerCount, gridSize }: Props) {
	const [clicked, setClicked] = useState<number[]>([]);
	const [matched, setMatched] = useState<number[]>([]);
	const [puzzle, setPuzzle] = useState<number[]>([]);

	useEffect(() => {
		const half = (gridSize * gridSize) / 2;
		const nums = Array.from({ length: half }, (_, i) => i + 1);
		const shuffled = [...nums, ...nums].sort(() => Math.random() - 0.5);
		setPuzzle(shuffled);
	}, [gridSize]);

	const handleClick = (value: number) => {
		const nC = [...clicked, value];
		setClicked(nC);

		if (nC.length === 2) {
			setTimeout(() => {
				//check if the index stuff match

				if (puzzle[nC[0]] === puzzle[nC[1]]) {
					const nM = [...matched, nC[0], nC[1]];
					setMatched(nM);
					setClicked([]);
				} else {
					setClicked([]);
				}
			}, 500);
		}
	};
	return (
		<main className="w-full h-full bg-[#FCFCFC] flex flex-col max-w-7xl mx-auto items-center justify-between p-8">
			<header className="w-full flex items-center justify-between">
				<h1 className="text-3xl md:text-4xl font-[600] text-dark">memory</h1>

				<button
					type="button"
					className="start rounded-3xl text-lg font-[600] cursor-pointer p-2 px-4"
				>
					Restart
				</button>
			</header>
			<section
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
					gridTemplateRows: `repeat(${gridSize}, 1fr)`,
					gap: "1rem",
				}}
				className="w-full max-w-lg grid-container"
			>
				{puzzle.map((p, index) => (
					<button
						disabled={matched.includes(index)}
						key={index}
						style={{
							transformStyle: "preserve-3d",
							transform: `${matched.includes(index) ? "rotateY(0deg)" : clicked.includes(index) ? "rotateY(0deg)" : "rotateY(180deg)"}`,
							transition: "transform 500ms ease-in-out",
						}}
						type="button"
						onClick={() => handleClick(index)}
						className="w-full rounded-full aspect-square font-bold relative"
					>
						<div
							style={{ backfaceVisibility: "hidden" }}
							className="orange text-2xl w-full h-full rounded-full flex items-center justify-center absolute inset-0"
						>
							{p}
						</div>
						<div
							style={{
								backfaceVisibility: "hidden",
								transform: "rotateY(180deg)",
							}}
							className="dark w-full h-full rounded-full flex items-center justify-center absolute inset-0"
						/>
					</button>
				))}
			</section>

			<footer>1</footer>
		</main>
	);
}
