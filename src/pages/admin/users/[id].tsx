import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  ArrowLeft, Mail, MapPin, KeyRound, 
  Ticket, Calendar, ChevronRight, Ban, CheckCircle2,
  PlusCircle, CreditCard, PenTool, Building2
} from "lucide-react";


const USERS_DATA: Record<string, any> = {
  "sarah-oenkins": {
    id: "sarah-oenkins",
    name: "Sarah oenkins",
    role: "ORGANIZER",
    status: "Active",
    statusDetail: "Fully Verified",
    joinDate: "March 2022",
    email: "sarah.j@eventhub.com",
    location: "London, United Kingdom",
    avatar: "https://i.pravatar.cc/150?u=sarahj",
    stats: { 
      eventsHosted: { value: 142, trend: "+12% this year" },
      ticketsSold: { value: "24,592", subtitle: "89% sell-through" },
      revenue: "$412.8k", 
      followers: "8,432" 
    },
    activities: [
      { id: 1, type: 'publish', title: 'Published "Summer Jazz Festival 2024"', desc: 'New event created with 500 ticket capacity.', time: '2H AGO', icon: PlusCircle },
      { id: 2, type: 'payout', title: 'Payout Processed: $12,450.00', desc: 'Automatic monthly settlement for May ticket sales.', time: 'YESTERDAY', icon: CreditCard },
      { id: 3, type: 'update', title: 'Updated Profile Information', desc: 'Changed business address and bank details.', time: '3 DAYS AGO', icon: PenTool },
    ],
    company: {
      name: "Jenkins Creative Ltd.",
      taxId: "GB-9823412-A"
    }
  },
  "alex": {
    id: "alex",
    name: "Alex",
    role: "ADMIN",
    status: "Active",
    statusDetail: "System Admin",
    joinDate: "December 2023",
    email: "alex.admin@eventhub.com",
    location: "New York, USA",
    avatar: "https://i.pravatar.cc/150?u=alex",
    stats: { 
      eventsHosted: { value: 0, trend: "N/A" },
      ticketsSold: { value: "0", subtitle: "N/A" },
      revenue: "$0", 
      followers: "0" 
    },
    activities: [
      { id: 1, type: 'update', title: 'Updated System Settings', desc: 'Modified global tax rates.', time: '1H AGO', icon: PenTool },
    ],
    company: null
  },
  "jonathan-doe": {
    id: "jonathan-doe",
    name: "Jonathan Doe",
    role: "CUSTOMER",
    status: "Active",
    statusDetail: "Verified Email",
    joinDate: "January 2024",
    email: "jonathan@example.com",
    location: "San Francisco, USA",
    avatar: "https://i.pravatar.cc/150?u=jonathan",
    stats: { 
      eventsHosted: { value: 0, trend: "N/A" },
      ticketsSold: { value: "12", subtitle: "Tickets Purchased" },
      revenue: "$1,250 spent", 
      followers: "42" 
    },
    activities: [
       { id: 1, type: 'purchase', title: 'Purchased 2 tickets', desc: 'Summer Jazz Festival 2024', time: '1 DAY AGO', icon: Ticket },
    ],
    company: null
  }
};

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  // Tránh lỗi undefined khi router chưa kịp load id
  if (!router.isReady) return <div className="p-10 text-slate-500 font-medium">Loading details...</div>;

  const user = USERS_DATA[id as string];

  if (!user) {
    return (
      <AdminLayout title="User Not Found">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <h2 className="text-2xl font-bold text-slate-400">User not found!</h2>
          <Link href="/admin/users" className="text-blue-600 font-semibold flex items-center gap-2 hover:underline">
            <ArrowLeft size={18} /> Back to Management
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-2 md:p-6 animate-in fade-in duration-500">
        
        {/* === Header (Breadcrumb + Actions) === */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div className="text-sm text-slate-500 mb-2 flex items-center gap-1 font-medium">
                    <Link href="/admin/users" className="hover:text-blue-600">Users</Link>
                    <ChevronRight size={14}/>
                    <span className="text-slate-900">{user.role === 'ORGANIZER' ? 'Organizer Profile' : 'User Profile'}</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                <div className="flex items-center gap-3 mt-3 text-sm font-medium">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold tracking-wide">{user.role}</span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {user.status} since {user.joinDate}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all">
                    <Mail size={16} /> Contact User
                </button>
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all">
                    <KeyRound size={16} /> Reset Password
                </button>
            </div>
        </div>

        {/* === Main Content Grid === */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* CỘT TRÁI: Thống kê & Lịch sử */}
            <div className="xl:col-span-2 space-y-6">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <span className="text-blue-600 text-sm font-semibold">{user.stats.eventsHosted.trend}</span>
                        </div>
                        <h3 className="text-4xl font-bold text-slate-900">{user.stats.eventsHosted.value}</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Total Events Hosted</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                <Ticket size={20} />
                            </div>
                            <span className="text-purple-600 text-sm font-semibold">{user.stats.ticketsSold.subtitle}</span>
                        </div>
                        <h3 className="text-4xl font-bold text-slate-900">{user.stats.ticketsSold.value}</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Total Tickets Sold</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                        <button className="text-blue-600 text-sm font-semibold hover:underline">View history</button>
                    </div>
                    <div className="p-6 space-y-6">
                        {user.activities.map((act: any) => (
                            <div key={act.id} className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    act.type === 'publish' ? 'bg-slate-100 text-slate-600' :
                                    act.type === 'payout' ? 'bg-emerald-50 text-emerald-600' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    <act.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                                        <span className="text-xs font-bold text-slate-400">{act.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{act.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: Thông tin cá nhân & Quản lý rủi ro */}
            <div className="space-y-6">
                
                {/* User Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="relative">
                            <img src={user.avatar} className="w-16 h-16 rounded-full object-cover border border-slate-200" alt="" />
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                <CheckCircle2 size={12} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin size={14} /> {user.location}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center justify-between border border-slate-100">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</p>
                            <p className="text-sm font-bold text-slate-900 mt-1">{user.statusDetail}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            LIVE
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">{user.stats.revenue}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Followers</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">{user.stats.followers}</p>
                        </div>
                    </div>
                </div>

                {/* Risk Management */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Risk Management</h3>
                    <button className="w-full py-2.5 border border-rose-200 text-rose-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors">
                        <Ban size={16} /> Suspend Account
                    </button>
                    <p className="text-xs text-slate-500 mt-3 text-center">Account suspension will freeze all active payouts.</p>
                </div>

                {/* Organization Profile (Chỉ hiện nếu có data company) */}
                {user.company && (
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Organization Profile</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{user.company.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">Tax ID: {user.company.taxId}</p>
                            </div>
                        </div>
                        <button className="w-full py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm shadow-sm">
                            View Business Documents
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}  