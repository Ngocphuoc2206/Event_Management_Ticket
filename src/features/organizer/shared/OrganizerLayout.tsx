import Link from "next/link";
import { useRouter } from "next/router";
import { Bell, LogOut, Search, Settings, Zap } from "lucide-react";
import { useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getOrganizerNavigationItems,
  organizerProfile,
} from "../constants";
import { OrganizerDashboardIcon } from "../dashboard/OrganizerDashboardIcons";
import type { OrganizerNavItem } from "../types";

type OrganizerPageTitle =
  | "Dashboard"
  | "Events"
  | "Tickets"
  | "Attendees"
  | "Analytics"
  | "Settings";

type OrganizerLayoutProps = {
  title: string;
  activeLabel: OrganizerPageTitle;
  children: React.ReactNode;
};

function SidebarItem({ item }: { item: OrganizerNavItem }) {
  return (
    <Link href={item.href}>
      <div
        className={`flex cursor-pointer items-center gap-3.5 rounded-full px-5 py-3 transition-all duration-300 group ${
          item.active
            ? "bg-blue-600 text-white shadow-md shadow-blue-100"
            : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
        }`}
      >
        <OrganizerDashboardIcon
          type={item.icon}
          className={`h-5 w-5 ${item.active ? "" : "text-slate-400 group-hover:text-blue-600"}`}
        />
        <span className={`text-sm ${item.active ? "font-bold" : "font-semibold"}`}>{item.label}</span>
      </div>
    </Link>
  );
}

export function OrganizerLayout({ title, activeLabel, children }: OrganizerLayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = useMemo(() => getOrganizerNavigationItems(activeLabel), [activeLabel]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      const result = await logout(undefined, { redirectTo: "/auth/login" });
      await router.push(result.redirectTo);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex font-sans text-slate-900">
      <aside className="sticky top-0 z-40 flex h-screen w-[280px] flex-col border-r border-slate-100 bg-white">
        <div className="p-7">
          <div className="mb-10 flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-100">
              <Zap size={22} fill="white" />
            </div>
            <div>
              <span className="block text-xl font-black uppercase leading-none tracking-tighter text-slate-900">
                EventHub
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-blue-500">
                Organizer Panel
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-2 border-t border-slate-100 p-7">
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="group flex w-full items-center gap-3.5 rounded-full px-5 py-3 font-bold text-rose-500 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">{isLoggingOut ? "Dang dang xuat..." : "Dang xuat"}</span>
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-xl">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">{title}</h1>
            <p className="-mt-0.5 text-xs font-medium text-slate-400">Organizer workspace v2.0</p>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search organizer data..."
                className="w-80 rounded-full border border-transparent bg-slate-100/50 py-2.5 pl-11 pr-4 text-sm font-semibold transition-all focus:border-blue-100 focus:bg-white focus:outline-none focus:ring-2 ring-blue-500/10"
              />
            </div>

            <div className="flex items-center gap-3 border-r border-slate-100 pr-5">
              <button
                type="button"
                className="relative rounded-full p-2.5 text-slate-500 transition-all hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-blue-500" />
              </button>

              <Link
                href="/organizer/settings"
                className="rounded-full p-2.5 text-slate-500 transition-all hover:bg-slate-100"
                aria-label="Settings"
              >
                <Settings size={20} />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl border-2 border-white bg-blue-100 shadow-sm">
                <img
                  src={organizerProfile.avatarSrc || "https://i.pravatar.cc/150?u=organizer-giang"}
                  className="h-full w-full object-cover"
                  alt="organizer avatar"
                />
              </div>
              <div className="hidden text-left sm:block">
                <p className="leading-none text-sm font-black text-slate-900">{organizerProfile.name}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-tight text-blue-500">
                  {organizerProfile.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-80px)] p-8 [&>section>header]:hidden">{children}</div>
      </main>
    </div>
  );
}
