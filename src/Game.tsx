interface Props {
	theme: "numbers" | "icons";
	playerCount: number;
	gridSize: number;
}
export default function Game({ theme, playerCount, gridSize }: Props) {
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
			<section>2</section>
			<footer>1</footer>
		</main>
	);
}
