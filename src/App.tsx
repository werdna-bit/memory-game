import { useState } from "react";
import Game from "./Game";

function App() {
	const [state, setState] = useState<"menu" | "game">("menu");
	const [gridSize, setGridSize] = useState<4 | 6>(4);
	const [theme, setTheme] = useState<"numbers" | "icons">("numbers");
	const [playerCount, setPlayerCount] = useState<number>(1);

	return state === "menu" ? (
		<div className=" bg-[#152937] w-full h-full flex flex-col justify-center gap-8 md:gap-12 items-center">
			<h1 className="text-4xl md:text-5xl font-[600]">memory</h1>
			<div className="w-full flex flex-col gap-4 md:gap-8 p-8  bg-[#FCFCFC] max-w-xl rounded-3xl menu">
				<div className="space-y-3">
					<h3>Select Theme</h3>
					<div className="flex items-center gap-4">
						<button
							onClick={() => setTheme("numbers")}
							type="button"
							className={`flex-1 font-bold ${theme === "numbers" ? "active" : "menubutton"}`}
						>
							Number
						</button>
						<button
							onClick={() => setTheme("icons")}
							type="button"
							className={`flex-1 font-bold ${theme === "icons" ? "active" : "menubutton"}`}
						>
							Icons
						</button>
					</div>
				</div>

				<div className="space-y-3">
					<h3>Number of Players</h3>
					<div className="flex items-center gap-4">
						{Array.from({ length: 4 }, (_, i) => (
							<button
								key={i}
								onClick={() => setPlayerCount(i + 1)}
								type="button"
								className={`flex-1 font-bold ${i + 1 === playerCount ? "active" : "menubutton"}`}
							>
								{i + 1}
							</button>
						))}
					</div>
				</div>

				<div className="space-y-3">
					<h3>Grid Size</h3>
					<div className="flex items-center gap-4">
						<button
							onClick={() => setGridSize(4)}
							type="button"
							className={`flex-1 font-bold ${gridSize === 4 ? "active" : "menubutton"}`}
						>
							4x4
						</button>

						<button
							onClick={() => setGridSize(6)}
							type="button"
							className={`flex-1 font-bold ${gridSize === 6 ? "active" : "menubutton"}`}
						>
							6x6
						</button>
					</div>
				</div>

				<button
					onClick={() => setState("game")}
					type="button"
					className="w-full start"
				>
					Start Game
				</button>
			</div>
		</div>
	) : (
		<Game theme={theme} playerCount={playerCount} gridSize={gridSize} />
	);
}

export default App;
