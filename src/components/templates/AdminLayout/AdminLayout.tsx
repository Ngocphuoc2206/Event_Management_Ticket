// src/components/templates/AdminLayout/AdminLayout.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, Users, Ticket, CheckSquare, 
  BarChart3, Settings, LogOut, Bell, Search, Zap,
  CalendarDays, HelpCircle // Thêm icon mới
} from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho Sidebar Item
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  exact?: boolean; // Thêm prop để xác định có cần khớp URL chính xác không
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, exact = false }) => {
  const router = useRouter();
  
  // SỬA LỖI TẠI ĐÂY: Logic xác định Active chuẩn xác hơn
  const isActive = exact 
    ? router.pathname === href // Khớp chính xác (dùng cho Dashboard)
    : router.pathname.startsWith(href) && href !== '/admin'; // Khớp một phần (dùng cho các trang khác)

  return (
    <Link href={href}>
      {/* CẬP NHẬT UI: Bo góc tròn hơn (rounded-full), màu xanh dương đậm khi active */}
      <div className={`flex items-center gap-3.5 px-5 py-3 rounded-full cursor-pointer transition-all duration-300 group ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
      }`}>
        <Icon 
          size={20} 
          strokeWidth={isActive ? 2.5 : 2} 
          className={isActive ? '' : 'text-slate-400 group-hover:text-blue-600'} 
        />
        <span className={`text-sm ${isActive ? 'font-bold' : 'font-semibold'}`}>{label}</span>
      </div>
    </Link>
  );
};

export default function AdminLayout({ children, title }: { children: React.ReactNode, title: string }) {
  const menuItems = [
    // exact={true} để chỉ active mục này khi URL là chính xác /admin
    { icon: LayoutDashboard, label: "Overview", href: "/admin", exact: true },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: CalendarDays, label: "Event Management", href: "/admin/events" },
    { icon: Ticket, label: "Ticket Platform", href: "/admin/tickets" },
    { icon: CheckSquare, label: "Organizer Requests", href: "/admin/requests" },
    { icon: BarChart3, label: "Financial Reports", href: "/admin/finance" },
    { icon: Settings, label: "System Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex font-sans">
      {/* SIDEBAR - Chỉnh lại padding và khoảng cách y chang mẫu */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen z-40">
        <div className="p-7">
          <div className="flex items-center gap-3 mb-10 px-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 rotate-3">
              <Zap size={22} fill="white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tighter block uppercase">EventHub</span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </nav>
        </div>

        {/* CẬP NHẬT UI: Nút Sign Out và Support nằm dưới cùng y chang mẫu */}
        <div className="mt-auto p-7 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3.5 px-5 py-3 text-slate-500 hover:text-blue-700 cursor-pointer rounded-full hover:bg-slate-50 transition-all group">
            <HelpCircle size={20} className="text-slate-400 group-hover:text-blue-600" />
            <span className="text-sm font-semibold">Support</span>
          </div>
          <button className="flex items-center gap-3.5 px-5 py-3 text-rose-500 font-bold hover:bg-rose-50 w-full rounded-full transition-all group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* HEADER - Chỉnh lại padding 10 thành 8 để gọn hơn y chang mẫu */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
             {/* CẬP NHẬT UI: Hiển thị thêm dòng sub-title nhỏ dưới tiêu đề */}
             <h1 className="text-xl font-black text-slate-900 tracking-tight">{title}</h1>
             <p className="text-xs text-slate-400 font-medium -mt-0.5">Manage platform users, roles, and access levels.</p>
          </div>
          
          <div className="flex items-center gap-5">
            {/* CẬP NHẬT UI: Thanh search bo góc tròn hơn (rounded-full) */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Global search..." className="pl-11 pr-4 py-2.5 bg-slate-100/50 rounded-full text-sm focus:outline-none focus:ring-2 ring-blue-500/10 w-80 transition-all border border-transparent focus:bg-white focus:border-blue-100" />
            </div>
            
            <div className="flex items-center gap-3">
                <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
                  <Bell size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
                <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
                  <Ticket size={20} /> {/* Icon cho Ticket Platform nhanh */}
                </button>
            </div>
            
            {/* User Profile - Gọn gàng hơn */}
            <div className="flex items-center gap-3 pl-5 border-l border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100">
                <img src="https://i.pravatar.cc/150?u=admin-alex" className="w-full h-full object-cover" alt="avatar" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-black text-slate-900">Alex Phước</p>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Nội dung trang - Padding y chang mẫu */}
        <div className="p-8 bg-gradient-to-b from-white to-[#F8F9FD]">
          {children}
        </div>
      </main>
    </div>
  );
}