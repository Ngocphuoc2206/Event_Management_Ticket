"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, UserCircle2 } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { OrganizerBrandLogo } from "@/features/organizer/shared/OrganizerBrandLogo";
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
    <aside className="flex w-full flex-col border-b border-slate-100 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="p-7">
        <OrganizerBrandLogo variant="sidebar" />

        <nav className="space-y-1.5">
        {resolvedNavigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center gap-3.5 rounded-full px-5 py-3 transition-all duration-300 ${
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
          </Link>
        ))}
        </nav>
      </div>

      <div className="mt-auto space-y-2 border-t border-slate-100 p-7">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
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

        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          className="group flex w-full items-center gap-3.5 rounded-full px-5 py-3 text-sm font-bold text-rose-500 transition-all duration-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}
