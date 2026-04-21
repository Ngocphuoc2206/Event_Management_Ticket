import { useEffect, useState } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { Users, Ticket, DollarSign, Activity, TrendingUp, MoreHorizontal } from 'lucide-react';
// Thay đổi import sang adminService chuẩn
import { adminService } from "@/features/admin/admin.service";

export default function AdminDashboard() {
  // 1. Khởi tạo State
  const [stats, setStats] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Hàm gọi API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Gọi song song dữ liệu báo cáo và sự kiện pending từ adminService
      // Lưu ý: adminService đã dùng getApiResultData để bóc tách nên kết quả trả về là data trực tiếp
      const [reportData, pendingEvents] = await Promise.all([
        adminService.getAdminReports(),
        adminService.getPendingEvents()
      ]);

      // Map dữ liệu vào format hiển thị của giao diện
      const apiStats = [
        { 
          label: "Total Users", 
          value: reportData?.totalUsers || "0", 
          icon: Users, trend: "+12.5%", color: "text-blue-600", bg: "bg-blue-50" 
        },
        { 
          label: "Active Tickets", 
          value: reportData?.activeTickets || "0", 
          icon: Ticket, trend: "+5.2%", color: "text-indigo-600", bg: "bg-indigo-50" 
        },
        { 
          label: "Revenue (MTD)", 
          value: `$${reportData?.revenue?.toLocaleString() || "0"}`, 
          icon: DollarSign, trend: "+18.4%", color: "text-emerald-600", bg: "bg-emerald-50" 
        },
        { 
          label: "Server Load", 
          value: reportData?.serverLoad || "42%", 
          icon: Activity, trend: "Stable", color: "text-amber-600", bg: "bg-amber-50" 
        },
      ];
      
      setStats(apiStats);
      setRecentRequests(pendingEvents || []);
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout title="Dashboard Overview">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {loading ? (
           <div className="col-span-4 text-center py-10 font-bold text-slate-400">Đang tải dữ liệu thống kê...</div>
        ) : (
          stats.map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                <span className={`text-[11px] font-black px-3 py-1.5 rounded-full ${
                  stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* RECENT REQUESTS TABLE */}
        <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Organizer Requests</h3>
              <p className="text-sm text-slate-400 font-medium">Monitoring EventHub platform activities</p>
            </div>
            <button className="bg-slate-50 text-indigo-600 px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors border border-indigo-50">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-5">Event Detail</th>
                  <th className="pb-5 text-center">Organizer</th>
                  <th className="pb-5 text-center">Status</th>
                  <th className="pb-5 text-right">Amount</th>
                  <th className="pb-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400">Đang tải yêu cầu...</td></tr>
                ) : (
                  recentRequests.map((req, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                      <td className="py-5">
                        <p className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{req.name || req.title}</p>
                        <p className="text-[11px] text-slate-400 font-bold">#{req.id?.toString().slice(0,7)} • {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'New'}</p>
                      </td>
                      <td className="py-5 text-center text-xs font-bold text-slate-600">{req.organizerName || "System"}</td>
                      <td className="py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                          req.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-500'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-5 text-right text-sm font-black text-slate-900">${req.price || '0'}</td>
                      <td className="py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && recentRequests.length === 0 && (
                   <tr><td colSpan={5} className="py-10 text-center text-slate-400">Không có yêu cầu nào mới</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GROWTH INSIGHTS */}
        <div className="bg-indigo-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            {/* Giữ nguyên phần UI Static của Growth Insights */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-50"></div>
            <div className="relative z-10 h-full flex flex-col">
               <div className="mb-8">
                 <TrendingUp size={32} className="text-indigo-300 mb-4" />
                 <h3 className="text-2xl font-black mb-2 leading-tight">Monthly Growth <br/> Insights</h3>
                 <p className="text-indigo-200 text-xs font-medium">Your platform revenue is up 18% so far. Keep it up!</p>
               </div>
               
               <div className="mt-auto space-y-4">
                 <div className="bg-white/10 backdrop-blur-md p-5 rounded-[24px] border border-white/10">
                    <p className="text-[10px] uppercase font-black text-indigo-300 tracking-widest mb-1">Target Progress</p>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-xl font-black">$85,000</span>
                       <span className="text-xs font-bold text-indigo-200">Goal: $100k</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    </div>
                 </div>
                 <button className="w-full bg-white text-indigo-900 font-black py-4 rounded-[20px] text-sm hover:shadow-xl active:scale-95 transition-all">
                    Download Full Report
                 </button>
               </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}