import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, Users, Ticket, CheckSquare, 
  BarChart3, Settings, LogOut, Bell, Search, Zap 
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-1' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1'
      }`}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        <span className="font-bold text-sm">{label}</span>
      </div>
    </Link>
  );
};

export default function AdminLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="min-h-screen bg-[#FDFDFF] flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0 h-screen z-40">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
            <Zap size={22} fill="white" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tighter block">TICKETLY</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          <SidebarItem icon={LayoutDashboard} label="Overview" href="/admin" />
          <SidebarItem icon={Ticket} label="Ticket Platform" href="/admin/tickets" />
          <SidebarItem icon={Users} label="User Management" href="/admin/users" />
          <SidebarItem icon={CheckSquare} label="Organizer Requests" href="/admin/requests" />
          <SidebarItem icon={BarChart3} label="Financial Reports" href="/admin/finance" />
          <SidebarItem icon={Settings} label="System Settings" href="/admin/settings" />
        </nav>

        <div className="pt-6 border-t border-slate-50">
          <button className="flex items-center gap-3 px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 w-full rounded-2xl transition-all group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">{title}</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Global search..." className="pl-11 pr-4 py-2.5 bg-slate-100/50 rounded-2xl text-sm focus:outline-none focus:ring-2 ring-indigo-500/10 w-72 transition-all border border-transparent focus:bg-white focus:border-indigo-100" />
            </div>
            
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">Alex Phước</p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight">Super Admin</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100">
                <img src="https://i.pravatar.cc/150?u=admin-alex" className="w-full h-full object-cover" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 bg-gradient-to-b from-white to-[#F8F9FD]">
          {children}
        </div>
      </main>
    </div>
  );
}