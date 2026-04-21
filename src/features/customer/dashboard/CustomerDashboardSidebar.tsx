// src/components/templates/customer/dashboard/CustomerDashboardSidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { CustomerDashboardIcon } from "./CustomerDashboardIcons";
import type { CustomerNavItem, CustomerProfile } from "../types";

type CustomerDashboardSidebarProps = {
  navigationItems: CustomerNavItem[];
  profile: CustomerProfile; // Giữ lại prop này để không bị lỗi type ở file index.tsx
  onLogout: () => void;
};

export function CustomerDashboardSidebar({
  navigationItems,
  onLogout,
}: CustomerDashboardSidebarProps) {
  const router = useRouter();
  
  // Kiểm tra xem trang hiện tại có phải là Help không
  const isHelpPageActive = router.pathname === '/customer/help';

  return (
    <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen z-40">
      
      {/* --- TOP SECTION --- */}
      <div className="p-6">
        
        {/* Logo giống y hệt Admin (Khối vuông bo tròn góc, xoay nhẹ) */}
        <div className="mb-9 flex items-center gap-3 px-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 rotate-3">
            {/* Dùng luôn icon tia sét (Zap) giống admin hoặc bạn có thể thay bằng icon khác */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div>
            <span className="block text-xl font-black uppercase leading-none tracking-tighter text-slate-900">EventHub</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1 block">Customer Portal</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = (item.href.startsWith("/")
              ? router.pathname === item.href
              : false) || item.active;

            return (
              <Link key={item.label} href={item.href}>
                <div className={`flex cursor-pointer items-center gap-3.5 rounded-full px-5 py-2.5 transition-all duration-300 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
                }`}>
                  <CustomerDashboardIcon 
                    type={item.icon} 
                    className={`w-5 h-5 ${isActive ? '' : 'text-slate-400 group-hover:text-blue-600'}`} 
                  />
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-semibold'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- BOTTOM SECTION --- */}
      {/* Nút Help và Sign Out ép xuống đáy giống Admin */}
      <div className="mt-auto space-y-2 border-t border-slate-100 p-6">
        
        {/* Nút Help (Giống nút Support ở Admin) */}
        <Link href="/customer/help">
          <div className={`flex cursor-pointer items-center gap-3.5 rounded-full px-5 py-2.5 transition-all duration-300 group ${
            isHelpPageActive 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
              : 'text-slate-500 hover:text-blue-700 hover:bg-slate-50'
          }`}>
            <CustomerDashboardIcon 
              type="help" 
              className={`w-5 h-5 ${isHelpPageActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} 
            />
            <span className={`text-sm ${isHelpPageActive ? 'font-bold' : 'font-semibold'}`}>Help</span>
          </div>
        </Link>

        {/* Nút Sign Out (Mặc định màu đỏ, hover trượt icon sang trái giống Admin) */}
        <button 
          onClick={onLogout}
          className="group flex w-full items-center gap-3.5 rounded-full px-5 py-2.5 font-bold text-rose-500 transition-all hover:bg-rose-50"
        >
          <CustomerDashboardIcon 
            type="logout" 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
          />
          <span className="text-sm">Sign Out</span>
        </button>

      </div>
    </aside>
  );
}
