"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, UserCircle2 } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { OrganizerDashboardIcon } from "./OrganizerDashboardIcons";
import type { OrganizerNavItem, OrganizerProfile } from "../types";

type OrganizerDashboardSidebarProps = {
  navigationItems: OrganizerNavItem[];
  profile: OrganizerProfile;
};

export function OrganizerDashboardSidebar({ navigationItems, profile }: OrganizerDashboardSidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const resolvedNavigationItems = useMemo(() => {
    const pathname = router.pathname;

    return navigationItems.map((item) => {
      const isDashboard = item.href === "/organizer";
      const isEventsGroup = item.href === "/organizer/events";
      const isActive = isDashboard
        ? pathname === item.href
        : isEventsGroup
          ? pathname === item.href || pathname.startsWith(`${item.href}/`) || pathname.startsWith("/organizer/create-event")
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

      return {
        ...item,
        active: isActive,
      };
    });
  }, [navigationItems, router.pathname]);

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
    <aside className="flex w-full flex-col border-b border-slate-300/40 bg-gray-100 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-slate-300/30">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-violet-700 text-white">
            <OrganizerDashboardIcon type="events" className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-7 text-zinc-900">EventHub</h1>
            <p className="text-xs tracking-wide text-gray-700">Organizer Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-hidden px-4 pb-5">
        {resolvedNavigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 transition ${
              item.active
                ? "bg-sky-700/10 text-sky-700"
                : "text-gray-700 hover:bg-white/70 hover:text-slate-900"
            }`}
          >
            <OrganizerDashboardIcon type={item.icon} className="h-[18px] w-[18px]" />
            <span className={`text-base leading-6 ${item.active ? "font-medium" : "font-normal"}`}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="space-y-3 p-6 pt-4">
        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-2xl border border-slate-300/60 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Dang dang xuat..." : "Dang xuat"}</span>
        </button>

        <div className="flex items-center gap-3 rounded-2xl bg-zinc-200 p-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white">
            {profile.avatarSrc ? (
              <Image src={profile.avatarSrc} alt={`${profile.name} avatar`} fill sizes="40px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                <UserCircle2 className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{profile.name}</p>
            <p className="truncate text-xs text-gray-700">{profile.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
