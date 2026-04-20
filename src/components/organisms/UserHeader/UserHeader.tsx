// src/components/organisms/UserHeader/UserHeader.tsx
import { useSelector } from "react-redux";
import type { RootState } from "@/stores";

type Props = {
  // Có thể truyền title động từ Layout vào, hoặc dùng mặc định
  title?: string;
  subtitle?: string;
};

export default function UserHeader({
  title = "Dashboard Overview",
  subtitle = "Monitoring your personal activities",
}: Props) {
  const { fullName } = useSelector((state: RootState) => state.user);

  // Lấy chữ cái đầu tiên của tên để làm Avatar
  const initial = (fullName?.trim().charAt(0) || "U").toUpperCase();

  return (
    <header className="h-20 px-6 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 flex items-center justify-between">
      
      {/* --- CỘT TRÁI: Tiêu đề trang (Page Title & Subtitle) --- */}
      <div className="flex flex-col">
        <h1 className="text-[1.375rem] font-bold text-slate-900 leading-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-400 font-medium mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* --- CỘT PHẢI: Thanh công cụ (Search, Notification, Profile) --- */}
      <div className="flex items-center gap-4 lg:gap-6">
        
        {/* 1. Global Search */}
        <div className="hidden md:block relative w-64 lg:w-[320px]">
          <svg
            className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Global search..."
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-full py-2.5 pl-11 pr-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* 2. Notification Bell */}
        <button
          type="button"
          className="relative text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Blue dot indicator (Chấm xanh nhỏ báo có thông báo) */}
          <span className="absolute top-[6px] right-[6px] w-[8px] h-[8px] bg-blue-500 rounded-full border-2 border-white"></span>
        </button>

        {/* 3. User Profile */}
        <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-slate-100 cursor-pointer hover:opacity-80 transition-opacity">
          {/* Avatar vuông bo góc giống hình */}
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-indigo-50 text-sm font-bold text-indigo-600 shadow-sm border border-indigo-100/50">
            {initial}
          </div>
          
          {/* Tên và Role (Ẩn trên mobile để tiết kiệm diện tích) */}
          <div className="hidden sm:flex flex-col">
            <span className="text-[13px] font-bold text-slate-900 leading-tight">
              {fullName || "ng hài hước"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              PRO MEMBER
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}