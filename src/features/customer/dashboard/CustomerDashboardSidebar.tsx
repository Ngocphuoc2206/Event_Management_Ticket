import Link from "next/link";

import { BrandIcon, CustomerDashboardIcon } from "./CustomerDashboardIcons";
import type { CustomerNavItem, CustomerProfile } from "../types";

const SIDEBAR_ACTIONS = [
  { label: "Help", icon: "help" },
  { label: "Logout", icon: "logout" },
] as const;

type CustomerDashboardSidebarProps = {
  navigationItems: CustomerNavItem[];
  profile: CustomerProfile;
  onLogout: () => void;
};

export function CustomerDashboardSidebar({ navigationItems, profile, onLogout }: CustomerDashboardSidebarProps) {
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <aside className="flex w-full flex-col border-b border-white/80 bg-[#f6f8fc] px-5 py-6 shadow-[inset_-1px_0_0_rgba(226,232,240,0.8)] xl:sticky xl:top-0 xl:h-screen xl:w-[280px] xl:shrink-0 xl:overflow-y-auto xl:border-b-0 xl:border-r">
      <div className="flex items-start gap-3">
        <BrandIcon />
        <div>
          <div className="text-[1.7rem] font-bold tracking-tight">EventHub</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.32em] text-slate-400">Customer Portal</div>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              item.active
                ? "bg-white text-blue-600 shadow-[0_10px_30px_rgba(148,163,184,0.16)]"
                : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
            }`}
          >
            <CustomerDashboardIcon type={item.icon} className="h-[18px] w-[18px]" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <div className="space-y-1">
          {SIDEBAR_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.label === "Logout" ? onLogout : undefined}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-white/70 hover:text-slate-900"
            >
              <CustomerDashboardIcon type={action.icon} className="h-[18px] w-[18px]" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-[22px] bg-slate-200/70 px-4 py-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-100">
            {profile.avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarSrc} alt={`${profile.name} avatar`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500">{initials || "U"}</div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">{profile.name}</div>
            <div className="text-xs text-slate-500">{profile.membership}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

