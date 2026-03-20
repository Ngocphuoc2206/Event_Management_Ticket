import UserLayout from "@/components/templates/UserLayout/UserLayout";
import { useState } from "react";
import Link from "next/link";

// Dữ liệu giả lập cho vé của người dùng
const MY_TICKETS = [
  {
    id: "TKT-89231",
    eventTitle: "Neon Nights: Underground Techno",
    date: "Oct 18, 2024",
    time: "9:00 PM",
    location: "Warehouse 42, Los Angeles",
    type: "VIP PASS",
    status: "Sắp diễn ra",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-89231"
  },
  {
    id: "TKT-44590",
    eventTitle: "Global AI & Tech Summit",
    date: "Nov 02, 2024",
    time: "8:00 AM",
    location: "Innovation Hub, SF",
    type: "STANDARD",
    status: "Sắp diễn ra",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-44590"
  }
];

const PAST_TICKETS = [
  {
    id: "TKT-11209",
    eventTitle: "Summer Indie Music Fest",
    date: "Aug 15, 2024",
    time: "4:00 PM",
    location: "Central Park, NY",
    type: "GA",
    status: "Đã tham gia",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop",
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <UserLayout title="Hồ sơ & Vé của tôi">
      <div className="bg-[#F9FAFB] min-h-screen pb-20">
        
        {/* 1. PROFILE HEADER COVER */}
        <div className="h-64 md:h-80 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden">
           {/* Pattern trang trí */}
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 -mt-24 md:-mt-32">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* CỘT TRÁI: THÔNG TIN USER & MENU */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 text-center relative">
                {/* Avatar nổi lên trên cover */}
                <div className="w-32 h-32 mx-auto rounded-full p-1 bg-white shadow-lg -mt-20 mb-4 relative">
                  <img src="https://i.pravatar.cc/150?u=alex" alt="User Avatar" className="w-full h-full object-cover rounded-full" />
                  <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </button>
                </div>
                
                <h2 className="text-2xl font-black text-gray-900">Alex Johnson</h2>
                <p className="text-gray-500 font-medium mb-6">alex.johnson@example.com</p>

                <div className="flex justify-center gap-6 border-y border-gray-100 py-6 mb-6">
                  <div>
                    <p className="text-2xl font-black text-indigo-600">12</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Sự kiện</p>
                  </div>
                  <div className="w-px bg-gray-100"></div>
                  <div>
                    <p className="text-2xl font-black text-indigo-600">3</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Sắp tới</p>
                  </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex flex-col gap-2 text-left">
                  <button 
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-5 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-colors ${activeTab === "upcoming" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    Vé của tôi
                  </button>
                  <button 
                    onClick={() => setActiveTab("history")}
                    className={`px-5 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-colors ${activeTab === "history" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Lịch sử tham gia
                  </button>
                  <button className="px-5 py-3.5 rounded-2xl font-bold flex items-center gap-3 text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Cài đặt tài khoản
                  </button>
                </nav>
              </div>
            </div>

            {/* CỘT PHẢI: DANH SÁCH VÉ */}
            <div className="flex-1 mt-10 lg:mt-0">
              <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900">
                  {activeTab === "upcoming" ? "Vé Sắp Tới" : "Lịch Sử Tham Gia"}
                </h1>
                <Link href="/events">
                  <button className="hidden md:flex bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-sm text-sm items-center gap-2">
                    Khám phá thêm sự kiện
                  </button>
                </Link>
              </div>

              {/* TICKET LIST */}
              <div className="space-y-6">
                {(activeTab === "upcoming" ? MY_TICKETS : PAST_TICKETS).map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-shadow relative">
                    
                    {/* Phần Trái: Hình ảnh & Thông tin */}
                    <div className="flex-1 flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-48 sm:h-auto">
                        <img src={ticket.image} alt={ticket.eventTitle} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="p-6 flex flex-col justify-center">
                        <div className="flex gap-2 mb-3">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest inline-block ${activeTab === "upcoming" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                            {ticket.status}
                          </span>
                          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest inline-block">
                            {ticket.type}
                          </span>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{ticket.eventTitle}</h3>
                        
                        <div className="space-y-1.5 mt-auto">
                          <p className="text-sm text-gray-600 font-bold flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {ticket.date} • {ticket.time}
                          </p>
                          <p className="text-sm text-gray-600 font-bold flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            {ticket.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Phần Phải: QR Code & Rãnh xé vé (Dashed Border) */}
                    <div className="w-full md:w-64 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center relative">
                      {/* Lỗ tròn giả lập rãnh xé */}
                      <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-[#F9FAFB] rounded-full border-b border-gray-100"></div>
                      <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 bg-[#F9FAFB] rounded-full border-t border-gray-100"></div>

                      {ticket.qrCode ? (
                        <>
                          <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-3">
                            <img src={ticket.qrCode} alt="QR Code" className="w-24 h-24" />
                          </div>
                          <p className="font-black text-gray-900 tracking-widest text-sm">{ticket.id}</p>
                          <button className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline">Tải vé PDF</button>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                          <p className="font-bold text-gray-500 text-sm">Sự kiện đã kết thúc</p>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}