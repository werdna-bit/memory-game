import { useEffect, useState } from "react";
import { formatTime } from "../helpers/index";

interface Props {
	theme: "numbers" | "icons";
	playerCount: number;
	gridSize: number;
	handleNewGame: () => void;
}
const ICONS = [
	null,
	"anchor-solid.svg",
	"atom-solid.svg",
	"bolt-lightning-solid.svg",
	"bomb-solid.svg",
	"book-solid.svg",
	"carrot-solid.svg",
	"cat-solid.svg",
	"crow-solid.svg",
	"fish-solid.svg",
	"flask-solid.svg",
	"hat-wizard-solid.svg",
	"jet-fighter-up-solid.svg",
	"lightbulb-solid.svg",
	"meteor-solid.svg",
	"moon-solid.svg",
	"star-solid.svg",
	"terminal-solid.svg",
	"tree-solid.svg",
];
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
	const [state, setState] = useState<"playing" | "paused">("playing");
	const [isChecking, setIsChecking] = useState(false);

	useEffect(() => {
		if (state === "paused") return;
		const interval = setInterval(() => {
			setTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [state]);

	useEffect(() => {
		const half = (gridSize * gridSize) / 2;
		const nums = Array.from({ length: half }, (_, i) => i + 1);
		const shuffled = [...nums, ...nums].sort(() => Math.random() - 0.5);
		setPuzzle(shuffled);
	}, [gridSize]);

	const generatePuzzle = () => {
		const half = (gridSize * gridSize) / 2;
		const nums = Array.from({ length: half }, (_, i) => i + 1);
		return [...nums, ...nums].sort(() => Math.random() - 0.5);
	};

	const handleClick = (value: number) => {
		if (isChecking || clicked.includes(value) || matched.includes(value))
			return;
		setMoves((prev) => prev + 1);
		const nC = [...clicked, value];
		setClicked(nC);
		if (nC.length === 2) {
			setIsChecking(true);
			setTimeout(() => {
				if (nC[0] !== nC[1] && puzzle[nC[0]] === puzzle[nC[1]]) {
					const newMatched = [...matched, nC[0], nC[1]];
					setMatched(newMatched);
					const newScores = [...scores];
					newScores[currentPlayer] += 1;
					if (newMatched.length === gridSize * gridSize) {
						setState("paused");
					}
					setScores(newScores);
				} else {
					setCurrentPlayer((prev) => (prev + 1) % playerCount);
				}
				setIsChecking(false);
				setClicked([]);
			}, 500);
		}
	};

	const handleRestart = () => {
		setClicked([]);
		setMatched([]);
		setTime(0);
		setState("playing");
		setPuzzle(generatePuzzle());
		setMoves(0);
		setCurrentPlayer(0);
		setScores(Array(playerCount).fill(0));
		setIsChecking(false);
	};

	const maxScore = Math.max(...scores);
	const winners = scores
		.map((s, i) => (s === maxScore ? i + 1 : null))
		.filter(Boolean) as number[];

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
							{theme === "icons" ? (
								<img
									src={`/icons/${ICONS[p]}`}
									alt={ICONS[p] ?? "icon"}
									className="w-1/2 h-1/2 object-contain"
								/>
							) : (
								p
							)}
						</div>
						<div
							style={{
								backfaceVisibility: "hidden",
								transform: "rotateY(180deg)",
							}}
							className="bg-[#152937] transition-all duration-300 ease-in-out hover:bg-[#6293B6] w-full h-full rounded-full flex items-center justify-center absolute inset-0"
						/>
					</button>
				))}
			</section>
			<div
				className={`fixed bg-black/40 flex items-center justify-center ${matched.length === gridSize * gridSize ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-300 ease-in-out h-[100vh] w-full top-0 left-0 z-101`}
			>
				<div className="w-full container p-4 max-w-lg rounded-2xl flex flex-col items-center gap-4 text-center md:p-8">
					<h1>
						{playerCount === 1
							? "You Win!"
							: winners.length > 1
								? "It's a Tie!"
								: `Player ${winners[0]} Wins!`}
					</h1>
					{playerCount === 1 ? (
						<div className="w-full">
							<h2>Game over! Here's how you got on...</h2>
							<div className="w-full flex flex-col gap-2 mt-4">
								<div className="light p-4 rounded-md font-[600] text-xl flex items-center justify-between w-full">
									<p>Time Elapsed</p>
									<h3>{formatTime(time)}</h3>
								</div>
								<div className="light p-4 rounded-md font-[600] text-xl flex items-center justify-between w-full">
									<p>Moves Taken</p>
									<h3>{moves} Moves</h3>
								</div>
							</div>
						</div>
					) : (
						<div className="w-full flex flex-col gap-2">
							<h2>Game over! Here are the results...</h2>
							{scores
								.map((score, i) => ({ score, player: i }))
								.sort((a, b) => b.score - a.score)
								.map(({ score, player }) => (
									<div
										key={player}
										className={`${score === maxScore ? "dark" : "light"} p-4 rounded-xl font-[600] text-xl flex items-center justify-between`}
									>
										<p>
											Player {player + 1} {score === maxScore && "(Winner!)"}
										</p>
										<h3>
											{score} Pair{score !== 1 && "s"}
										</h3>
									</div>
								))}
						</div>
					)}
					<div className="w-full flex items-center gap-4 mt-4 md:mt-8 justify-between">
						<button
							onClick={handleRestart}
							type="button"
							className="start rounded-3xl text-lg flex-1 font-[600] cursor-pointer p-2 px-4"
						>
							Restart
						</button>
						<button
							onClick={() => {
								handleRestart();
								handleNewGame();
							}}
							type="button"
							className="rounded-3xl new text-lg font-[600] flex-1 cursor-pointer p-2 px-4"
						>
							Setup New Game
						</button>
					</div>
				</div>
			</div>
			<footer className="flex w-full max-w-3xl mx-auto items-center gap-4">
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
								className={`${currentPlayer === i ? "activeP" : "wrapper"} relative transition-all duration-300 ease-in-out flex-1`}
							>
								<div
									className={`text-[#fda417] absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 ${currentPlayer === i ? "opacity-100" : "opacity-0"}`}
								>
									<svg
										aria-hidden="true"
										width={40}
										viewBox="0 0 16 16"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
									>
										<g strokeWidth="0"></g>
										<g strokeLinecap="round" strokeLinejoin="round"></g>
										<g>
											<rect
												width="16"
												height="16"
												id="icon-bound"
												fill="none"
											></rect>
											<polygon points="8,3 16,11 0,11"></polygon>
										</g>
									</svg>
								</div>
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
