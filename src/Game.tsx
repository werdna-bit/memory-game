import { useEffect, useState } from "react";
import { formatTime } from "../helpers/index";

interface Props {
	theme: "numbers" | "icons";
	playerCount: number;
	gridSize: number;
	handleNewGame: () => void;
}
export default function Game({
	theme,
	handleNewGame,
	playerCount,
	gridSize,
}: Props) {
	const [clicked, setClicked] = useState<number[]>([]);
	const [matched, setMatched] = useState<number[]>([]);
	const [puzzle, setPuzzle] = useState<number[]>([]);
	const [time, setTime] = useState<number>(0);
	const [moves, setMoves] = useState<number>(0);
	const [currentPlayer, setCurrentPlayer] = useState<number>(0);
	const [scores, setScores] = useState<number[]>(Array(playerCount).fill(0));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime((prev) => {
				return prev + 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const half = (gridSize * gridSize) / 2;
		const nums = Array.from({ length: half }, (_, i) => i + 1);
		const shuffled = [...nums, ...nums].sort(() => Math.random() - 0.5);
		setPuzzle(shuffled);
	}, [gridSize]);

	const handleClick = (value: number) => {
		// Prevent clicking the same card twice or already matched cards
		if (clicked.includes(value) || matched.includes(value)) return;

		setMoves((prev) => prev + 1);

		const nC = [...clicked, value];
		setClicked(nC);

		if (nC.length === 2) {
			setTimeout(() => {
				if (nC[0] !== nC[1] && puzzle[nC[0]] === puzzle[nC[1]]) {
					setMatched([...matched, nC[0], nC[1]]);
					const newScores = [...scores];
					newScores[currentPlayer] += 1;
					setScores(newScores);
				} else {
					setCurrentPlayer((prev) => (prev + 1) % playerCount);
				}
				setClicked([]);
			}, 500);
		}
	};

	const handleRestart = () => {
		setClicked([]);
		setMatched([]);
		setTime(0);

		const half = (gridSize * gridSize) / 2;
		const nums = Array.from({ length: half }, (_, i) => i + 1);
		const shuffled = [...nums, ...nums].sort(() => Math.random() - 0.5);
		setPuzzle(shuffled);
		setMoves(0);
	};

	return (
		<main className="w-full h-full bg-[#FCFCFC] flex flex-col max-w-7xl mx-auto items-center justify-between p-8">
			<header className="w-full flex items-center justify-between">
				<h1 className="text-3xl md:text-4xl font-[600] text-dark">memory</h1>

				<div className="space-x-4">
					<button
						onClick={handleRestart}
						type="button"
						className="start rounded-3xl text-lg font-[600] cursor-pointer p-2 px-4"
					>
						Restart
					</button>

					<button
						onClick={() => {
							handleRestart();
							handleNewGame();
						}}
						type="button"
						className="rounded-3xl new text-lg font-[600] cursor-pointer p-2 px-4"
					>
						New Game
					</button>
				</div>
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
						disabled={matched.includes(index) || clicked.includes(index)}
						key={index}
						style={{
							transformStyle: "preserve-3d",
							transform: `${matched.includes(index) ? "rotateY(0deg)" : clicked.includes(index) ? "rotateY(0deg)" : "rotateY(180deg)"}`,
							transition: "transform 500ms ease-in-out",
						}}
						type="button"
						onClick={() => handleClick(index)}
						className={`w-full rounded-full aspect-square font-bold relative cursor-pointer`}
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
							className="bg-[#152937] transition-all duration-300 ease-in-out  hover:bg-[#6293B6] w-full h-full rounded-full flex items-center justify-center absolute inset-0"
						/>
					</button>
				))}
			</section>

			<footer className="flex w-full max-w-lg items-center gap-4">
				{playerCount === 1 ? (
					<>
						<div className="flex-1 flex items-center wrapper justify-between gap-4">
							<h1>Time</h1>
							<p>{formatTime(time)}</p>
						</div>

						<div className="flex-1 flex items-center wrapper justify-between gap-4">
							<h1>Moves</h1>
							<p>{moves}</p>
						</div>
					</>
				) : (
					<div className="flex w-full items-center gap-4">
						{Array.from({ length: playerCount }, (_, i) => (
							<div
								key={i + 7}
								className={`${currentPlayer === i ? "activeP" : "wrapper"} transition-all duration-300 ease-in-out flex-1`}
							>
								<h1>Player {i + 1}</h1>
								<p>{scores[i]}</p>
							</div>
						))}
					</div>
				)}
			</footer>
		</main>
	);
}
