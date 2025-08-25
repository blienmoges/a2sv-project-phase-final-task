"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const HIDE_SIDEBAR_PATHS = ["/auth/signin", "/auth/signup", "/auth/verify-email"];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = HIDE_SIDEBAR_PATHS.some((p) => pathname.startsWith(p));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}

