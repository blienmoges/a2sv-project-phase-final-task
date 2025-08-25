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

type NavItem = {
  label: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Foryou", href: "/foryou", Icon: Heart },
  { label: "Subscribed", href: "/subscribed", Icon: Rss },
  { label: "Saved News", href: "/saved", Icon: Bookmark },
  { label: "Setting", href: "/settings", Icon: Settings },
  { label: "Profile", href: "/profile", Icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 shrink-0 border-r border-gray-200 bg-white">
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-white text-xs font-bold">NB</div>
          <div>
            <div className="text-sm font-semibold">News Brief</div>
            <div className="text-xs text-gray-500">Slogan is included here</div>
          </div>
        </div>
      </div>

      <nav className="px-2">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

