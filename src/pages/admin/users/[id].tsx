import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  ArrowLeft, ChevronRight, Mail, Key, 
  Calendar, Ticket, PlusCircle, CreditCard, 
  Edit3, ShieldAlert, FileText, MapPin, 
  CheckCircle2, Ban, Activity, Building2
} from "lucide-react";

const USERS_STORAGE_KEY = "app_users_v1";

// Dữ liệu mẫu (mở rộng thêm các trường chi tiết so với index)
const MOCK_USERS_DETAIL = [
  { 
    id: "USR-9921", name: "Sarah Jenkins", email: "sarah.j@eventhub.com", 
    role: "Organizer", status: "ACTIVE", joinDate: "March 2022",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    location: "London, United Kingdom",
    stats: { eventsHosted: 142, eventsGrowth: "+12%", ticketsSold: "24,592", sellThrough: "89%" },
    revenue: "$412.8k", followers: "8,432",
    orgName: "Jenkins Creative Ltd.", taxId: "GB-9823412-A"
  },
  { 
    id: "USR-9918", name: "Alex Admin", email: "alex.admin@eventhub.com", 
    role: "Admin", status: "ACTIVE", joinDate: "Oct 2023",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    location: "San Francisco, CA",
    stats: { eventsHosted: 0, eventsGrowth: "0%", ticketsSold: "0", sellThrough: "0%" },
    revenue: "$0", followers: "0", orgName: "System Admin", taxId: "N/A"
  },
  { 
    id: "USR-9915", name: "Jonathan Doe", email: "jonathan@example.com", 
    role: "Customer", status: "INACTIVE", joinDate: "Oct 2023",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop",
    location: "New York, NY",
    stats: { eventsHosted: 0, eventsGrowth: "0%", ticketsSold: "45", sellThrough: "N/A" },
    revenue: "$0", followers: "12", orgName: "Individual", taxId: "N/A"
  },
];

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Đồng bộ dữ liệu với LocalStorage
  useEffect(() => {
    if (router.isReady && id) {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      let usersData = MOCK_USERS_DETAIL;

      if (!savedUsers) {
        // Khởi tạo lần đầu
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS_DETAIL));
      } else {
        usersData = JSON.parse(savedUsers);
      }

      const foundUser = usersData.find((u: any) => u.id === String(id));
      setCurrentUser(foundUser);
      setIsLoading(false);
    }
  }, [router.isReady, id]);

  const toggleUserStatus = () => {
    if (!currentUser) return;
    const newStatus = currentUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updatedUser = { ...currentUser, status: newStatus };
    
    // 1. Cập nhật UI
    setCurrentUser(updatedUser);

    // 2. Cập nhật LocalStorage để đồng bộ với trang Index
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      const usersArray = JSON.parse(savedUsers).map((u: any) => 
        u.id === updatedUser.id ? updatedUser : u
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersArray));
    }
  };

  if (isLoading) return <div className="p-10 text-slate-500 font-black uppercase tracking-widest text-xs">Loading User Profile...</div>;

  if (!currentUser) {
    return (
      <AdminLayout title="User Not Found">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <ShieldAlert size={64} className="text-slate-300" />
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tight">User not found!</h2>
          <Link href="/admin/users" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-500 pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link href="/admin/users" className="hover:text-indigo-600 transition-colors">Users</Link>
              <ChevronRight size={12} strokeWidth={3} />
              <span className="text-slate-900">{currentUser.role} Profile</span>
            </div>
            
            <div className="flex items-center gap-4">
               <Link href="/admin/users">
                  <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95">
                    <ArrowLeft size={20} strokeWidth={3} />
                  </button>
               </Link>
               <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{currentUser.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      currentUser.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      currentUser.role === 'Organizer' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      • {currentUser.role}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Active since {currentUser.joinDate}
                    </span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <Mail size={16} /> Contact User
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2">
              <Key size={16} /> Reset Password
            </button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI (LEFT COLUMN - Rộng hơn) */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Stats Cards (2 cột) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Calendar size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-black text-emerald-500">{currentUser.stats.eventsGrowth} this year</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-2">{currentUser.stats.eventsHosted}</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Events Hosted</p>
               </div>

               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                      <Ticket size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-black text-slate-500">{currentUser.stats.sellThrough} sell-through</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-2">{currentUser.stats.ticketsSold}</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Tickets Sold</p>
               </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                   <Activity size={16} className="text-indigo-600"/> Recent Activity
                 </h3>
                 <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View History</button>
               </div>
               
               <div className="space-y-6">
                 {/* Activity 1 */}
                 <div className="flex gap-4 items-start group">
                   <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                     <PlusCircle size={16} />
                   </div>
                   <div className="flex-1 pb-6 border-b border-slate-50">
                     <div className="flex justify-between items-start">
                       <h4 className="text-sm font-black text-slate-900">Published "Summer Jazz Festival 2024"</h4>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2h ago</span>
                     </div>
                     <p className="text-xs text-slate-500 font-medium mt-1">New event created with 500 ticket capacity.</p>
                   </div>
                 </div>
                 {/* Activity 2 */}
                 <div className="flex gap-4 items-start group">
                   <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                     <CreditCard size={16} />
                   </div>
                   <div className="flex-1 pb-6 border-b border-slate-50">
                     <div className="flex justify-between items-start">
                       <h4 className="text-sm font-black text-slate-900">Payout Processed: $12,450.00</h4>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yesterday</span>
                     </div>
                     <p className="text-xs text-slate-500 font-medium mt-1">Automatic monthly settlement for May ticket sales.</p>
                   </div>
                 </div>
                 {/* Activity 3 */}
                 <div className="flex gap-4 items-start group">
                   <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100 transition-colors">
                     <Edit3 size={16} />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start">
                       <h4 className="text-sm font-black text-slate-900">Updated Profile Information</h4>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 days ago</span>
                     </div>
                     <p className="text-xs text-slate-500 font-medium mt-1">Changed business address and bank details.</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Top Performing Events (Dummy Cards) */}
            <div>
              <div className="flex justify-between items-end mb-6 px-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Performing Events</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1 hover:underline">
                  Explore all <ChevronRight size={14}/>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Summer Jazz Festival", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&auto=format&fit=crop", rev: "$15,400" },
                  { title: "Web3 Builders Summit", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop", rev: "$124,000" },
                  { title: "Digital Art Renaissance", img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=400&auto=format&fit=crop", rev: "$8,900" }
                ].map((ev, i) => (
                  <div key={i} className="bg-white rounded-[24px] p-3 border border-slate-100 shadow-sm group cursor-pointer hover:shadow-md transition-all">
                    <div className="h-32 rounded-2xl overflow-hidden mb-4">
                      <img src={ev.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={ev.title}/>
                    </div>
                    <div className="px-2 pb-2">
                      <h4 className="text-sm font-black text-slate-900 truncate">{ev.title}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-bold text-slate-400">View details</span>
                        <span className="text-xs font-black text-indigo-600">{ev.rev}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI (RIGHT COLUMN) */}
          <div className="space-y-6">
            
            {/* User Info Card */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0 relative">
                  <img src={currentUser.avatar} className="w-full h-full object-cover" alt={currentUser.name} />
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-tight">{currentUser.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{currentUser.email}</p>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin size={10}/> {currentUser.location}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5 mb-8 flex justify-between items-center border border-slate-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Status</p>
                  <p className="font-black text-slate-900 text-sm">Fully Verified</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  currentUser.status === 'ACTIVE' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentUser.status === 'ACTIVE' ? 'bg-indigo-600' : 'bg-rose-600'} animate-pulse`}></span>
                  {currentUser.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Revenue</p>
                  <p className="font-black text-xl text-slate-900">{currentUser.revenue}</p>
                </div>
                <div className="pl-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Followers</p>
                  <p className="font-black text-xl text-slate-900">{currentUser.followers}</p>
                </div>
              </div>
            </div>

            {/* Risk Management Card */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Risk Management</h3>
              
              <button 
                onClick={toggleUserStatus}
                className={`w-full py-4 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border ${
                  currentUser.status === "ACTIVE" 
                    ? "bg-white text-rose-600 border-rose-200 hover:bg-rose-50" 
                    : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <Ban size={16} strokeWidth={3} /> 
                {currentUser.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
              </button>
              
              <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed mt-4 px-2">
                {currentUser.status === "ACTIVE" 
                  ? "Account suspension will freeze all active payouts and hide events." 
                  : "Activating this account will restore access to all features."}
              </p>
            </div>

            {/* Organization Profile (Nếu là Organizer) */}
            {currentUser.role === "Organizer" && (
              <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl shadow-slate-200 border border-slate-800">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Organization Profile</h3>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm">{currentUser.orgName}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Tax ID: {currentUser.taxId}</p>
                  </div>
                </div>

                <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2">
                  <FileText size={16} /> View Business Documents
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}