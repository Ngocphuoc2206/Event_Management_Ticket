import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { 
  ArrowLeft, Mail, Shield, Calendar, 
  MapPin, User, Activity, Edit2, Trash2 
} from "lucide-react";
import Link from "next/link";

// Mock data - Trong thực tế bạn sẽ fetch dựa trên router.query.id
const MOCK_USER_DETAILS = {
  id: "USR-9921",
  name: "Sarah Jenkins",
  email: "sarah.j@eventhub.com",
  role: "Organizer",
  status: "ACTIVE",
  joinDate: "Oct 24, 2023",
  location: "New York, USA",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
  bio: "Senior event planner with over 10 years of experience in organizing international music festivals and corporate tech summits.",
  totalEvents: 14,
  reputation: "98%"
};

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Giả lập fetch data
      setUser(MOCK_USER_DETAILS);
    }
  }, [id]);

  if (!user) return null;

  return (
    <AdminLayout title="User Profile Details">
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back to List
          </button>
          
          <div className="flex gap-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all shadow-sm">
              <Edit2 size={20} strokeWidth={2.5} />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm">
              <Trash2 size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Profile Card - Đồng bộ với style bo góc 40px của Event */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="px-10 pb-10">
            <div className="relative flex flex-col md:flex-row gap-8 -mt-12 items-end md:items-center">
              <div className="w-32 h-32 rounded-[32px] border-4 border-white overflow-hidden shadow-xl bg-white">
                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                    • {user.status}
                  </span>
                </div>
                <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">{user.id} • {user.role}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                <div className="flex items-center gap-3 text-blue-600 mb-3">
                  <Mail size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Email Address</span>
                </div>
                <p className="font-bold text-slate-900 truncate">{user.email}</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                <div className="flex items-center gap-3 text-purple-600 mb-3">
                  <Shield size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Join Date</span>
                </div>
                <p className="font-bold text-slate-900">{user.joinDate}</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                <div className="flex items-center gap-3 text-amber-600 mb-3">
                  <MapPin size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Location</span>
                </div>
                <p className="font-bold text-slate-900">{user.location}</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                <div className="flex items-center gap-3 text-emerald-600 mb-3">
                  <Activity size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Reputation</span>
                </div>
                <p className="font-bold text-slate-900">{user.reputation}</p>
              </div>
            </div>

            {/* Biography Section */}
            <div className="mt-8">
              <h3 className="text-base font-black text-slate-900 mb-4 uppercase tracking-wider">Biography</h3>
              <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                <p className="text-slate-500 font-medium leading-relaxed">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Tương tự hàng dưới của Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-indigo-900 p-8 rounded-[40px] text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40"></div>
             <div className="relative z-10 text-center">
               <h4 className="text-indigo-200 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Total Events Managed</h4>
               <p className="text-5xl font-black">{user.totalEvents}</p>
               <button className="mt-6 px-8 py-3 bg-white text-indigo-900 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                 View All Events
               </button>
             </div>
           </div>
           
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                 <Calendar size={32} strokeWidth={2.5} />
              </div>
              <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Next Activity</h4>
              <p className="text-xl font-black text-slate-900 mt-1">Networking Gala Review</p>
              <p className="text-blue-600 font-bold text-xs mt-1 italic">Tomorrow at 10:00 AM</p>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}  