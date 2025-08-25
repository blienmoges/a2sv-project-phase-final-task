import Sidebar from "../component/Sidebar";

export default function SidebarDemoPage() {
	return (
		<div className="min-h-screen bg-gray-50 text-black flex">
			<Sidebar />
			<main className="flex-1 p-6">
				<h1 className="text-xl font-semibold mb-2">Home</h1>
				<p className="text-sm text-black/70">This area holds your page content.</p>
			</main>
		</div>
	);
}