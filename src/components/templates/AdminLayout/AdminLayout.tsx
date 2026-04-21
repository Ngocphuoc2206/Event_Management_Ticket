/* eslint-disable @next/next/no-img-element */
// src/components/templates/AdminLayout/AdminLayout.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Users,
  Ticket,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Zap,
  CalendarDays,
  HelpCircle,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  exact?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  exact = false,
}) => {
  const router = useRouter();
  const isActive = exact
    ? router.pathname === href
    : router.pathname.startsWith(href) && href !== "/admin";

  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3.5 px-5 py-3 rounded-full cursor-pointer transition-all duration-300 group ${
          isActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-100"
            : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
        }`}
      >
        <Icon
          size={20}
          strokeWidth={isActive ? 2.5 : 2}
          className={isActive ? "" : "text-slate-400 group-hover:text-blue-600"}
        />
        <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const router = useRouter();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Kiểm tra xem trang hiện tại có phải là support không để làm sáng nút góc dưới
  const isSupportPageActive = router.pathname === "/admin/support";

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin", exact: true },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: CalendarDays, label: "Event Management", href: "/admin/events" },
    { icon: Ticket, label: "Ticket Platform", href: "/admin/tickets" },
    { icon: CheckSquare, label: "Organizer Requests", href: "/admin/requests" },
    { icon: BarChart3, label: "Financial Reports", href: "/admin/finance" },
    { icon: Settings, label: "System Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex font-sans text-slate-900">
      <aside className="w-70 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen z-40">
        <div className="p-7">
          <div className="flex items-center gap-3 mb-10 px-1">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 rotate-3">
              <Zap size={22} fill="white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tighter block uppercase leading-none">
                EventHub
              </span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1 block">
                Admin Panel
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </nav>
        </div>

        {/* Nút Support và Sign Out ở góc trái dưới cùng */}
        <div className="mt-auto p-7 border-t border-slate-100 space-y-2">
          <div
            onClick={() => router.push("/admin/support")} // Click để dẫn vào trang báo cáo
            className={`flex items-center gap-3.5 px-5 py-3 cursor-pointer rounded-full transition-all duration-300 group ${
              isSupportPageActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-slate-500 hover:text-blue-700 hover:bg-slate-50"
            }`}
          >
            <HelpCircle
              size={20}
              className={
                isSupportPageActive
                  ? "text-white"
                  : "text-slate-400 group-hover:text-blue-600"
              }
            />
            <span
              className={`text-sm ${isSupportPageActive ? "font-bold" : "font-semibold"}`}
            >
              Support
            </span>
          </div>

          <button className="flex items-center gap-3.5 px-5 py-3 text-rose-500 font-bold hover:bg-rose-50 w-full rounded-full transition-all group">
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-400 font-medium -mt-0.5">
              Platform management system v2.0
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden lg:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Global search..."
                className="pl-11 pr-4 py-2.5 bg-slate-100/50 rounded-full text-sm focus:outline-none focus:ring-2 ring-blue-500/10 w-80 transition-all border border-transparent focus:bg-white focus:border-blue-100 font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 border-r border-slate-100 pr-5">
              <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-white shadow-sm overflow-hidden">
                <img
                  src="https://i.pravatar.cc/150?u=admin-alex"
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">
                  Alex Phước
                </p>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight mt-1">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 min-h-[calc(100vh-80px)]">{children}</div>
      </main>
    </div>
  );
}
