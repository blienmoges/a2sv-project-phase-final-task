"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Home,
	Heart,
	Rss,
	Bookmark,
	Settings,
	User,
} from "lucide-react";

const navItems = [
	{ href: "/sidebar", label: "Home", Icon: Home },
	{ href: "/sidebar/for-you", label: "Foryou", Icon: Heart },
	{ href: "/sidebar/subscribed", label: "Subscribed", Icon: Rss },
	{ href: "/sidebar/saved", label: "Saved News", Icon: Bookmark },
	{ href: "/sidebar/setting", label: "Setting", Icon: Settings },
	{ href: "/sidebar/profile", label: "Profile", Icon: User },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="h-screen w-[260px] border-r border-black/10 bg-white shadow-sm">
			<div className="px-4 py-4 border-b border-black/10">
				<div className="flex items-center gap-3">
					<div className="h-7 w-7 rounded-md bg-black text-white flex items-center justify-center text-xs font-bold">NB</div>
					<div>
						<div className="text-sm font-semibold">News Brief</div>
						<div className="text-[11px] text-black/60">Slogan is included here</div>
					</div>
				</div>
			</div>

			<nav className="p-3 space-y-1">
				{navItems.map(({ href, label, Icon }) => {
					const isActive = pathname === href;
					return (
						<Link
							key={href}
							href={href}
							className={
								"flex items-center gap-3 rounded-md px-3 py-2 text-sm text-black/80 hover:bg-black/5 " +
								(isActive ? " bg-black/5" : "")
							}
						>
							<Icon className="h-4 w-4" />
							<span>{label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="mt-auto p-3" />
		</aside>
	);
}