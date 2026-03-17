function App() {
	const [state, setState] = useState<"menu" | "playing">("menu");
	const [gridSize, setGridSize] = useState<4 | 6>(4);
	const [theme, setTheme] = useState<"numbers" | "icons">("numbers");
	const [playerCount, setPlayerCount] = useState<1 | 2 | 3 | 4>(1);

	return (
		<section className=" w-full h-full flex bg-red-500 flex-col items-center items-center">
			<p>Test</p>
			<div className="w-full flex flex-col gap-4 p-4 md:p-8 bg-white max-w-lg rounded-2xl menu">
				<button className="">Number</button>
			</div>
		</section>
	);
}

export default App;
