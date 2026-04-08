import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { Plus, Search, CheckCircle, XCircle, Eye, Activity, TrendingUp, AlertCircle, X, MapPin, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { useState } from "react";

// Thêm nhiều data chi tiết hơn cho Modal
const INITIAL_EVENTS = [
  { 
    id: "EV-9921", 
    title: "Neon Nights Music Festival", 
    location: "Los Angeles, CA", 
    organizer: "Prism Events Inc.", 
    status: "PENDING", 
    date: "Oct 24, 2023", 
    time: "10:45 AM",
    amount: "$12,500",
    expectedAttendees: 5000,
    description: "An immersive electronic music festival featuring top DJs, stunning neon visuals, and art installations. Requires approval for large-scale stage setup, crowd control measures, and pyrotechnics clearance.",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop" // Concert image
  },
  { 
    id: "EV-9918", 
    title: "Tech Future Summit", 
    location: "Austin, TX", 
    organizer: "Next Ventures", 
    status: "PENDING", 
    date: "Oct 23, 2023", 
    time: "03:20 PM", 
    amount: "$3,200",
    expectedAttendees: 800,
    description: "A premier gathering of tech innovators, startups, and investors. Includes keynote speeches, panel discussions, and networking sessions. Requesting standard conference venue setup and AV equipment verification.",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop" // Conference image
  },
  { 
    id: "EV-9915", 
    title: "Gala Charity Dinner", 
    location: "New York, NY", 
    organizer: "Hope Foundation", 
    status: "PENDING", 
    date: "Oct 23, 2023", 
    time: "09:12 AM",
    amount: "$1,450",
    expectedAttendees: 200,
    description: "Annual fundraising gala with a formal dinner, silent auction, and live entertainment. Proceeds go to underprivileged children. Premium catering and seating layout approval needed.",
    img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600&auto=format&fit=crop" // Formal dining image
  },
];

export default function EventManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // State quản lý danh sách sự kiện (để có thể update status)
  const [events, setEvents] = useState(INITIAL_EVENTS);
  // State quản lý Modal chi tiết
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Xử lý Actions
  const handleApprove = (id: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, status: 'VERIFIED' } : ev));
    if (selectedEvent?.id === id) setIsModalOpen(false); // Đóng modal nếu đang mở
  };

  const handleReject = (id: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, status: 'REJECTED' } : ev));
    if (selectedEvent?.id === id) setIsModalOpen(false);
  };

  const openDetails = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout title="Dashboard Overview"> 
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Event Management</h1>
            <p className="text-sm text-slate-400 font-medium tracking-tight">Reviewing {events.filter(e => e.status === 'PENDING').length} pending event submissions</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-[20px] transition-all font-black text-sm shadow-lg shadow-blue-100 active:scale-95">
            <Plus size={18} strokeWidth={3} />
            Add New Event
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by event, organizer or ID..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-4 text-sm font-black outline-none focus:border-blue-500 text-slate-600 cursor-pointer w-full md:w-auto">
            <option>All Status</option>
            <option>Pending</option>
            <option>Verified</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 px-4">Event Info</th>
                  <th className="pb-6 text-center">Organizer</th>
                  <th className="pb-6 text-center">Submission</th>
                  <th className="pb-6 text-center">Status</th>
                  <th className="pb-6 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map((event) => (
                  <tr key={event.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-6 px-4 cursor-pointer" onClick={() => openDetails(event)}>
                      <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 rounded-[22px] overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-white ring-1 ring-slate-100 shrink-0">
                          <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">{event.title}</p>
                          <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{event.id} • {event.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-center">
                       <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                            {event.organizer[0]}
                          </div>
                          <span className="text-xs font-black text-slate-700">{event.organizer}</span>
                       </div>
                    </td>
                    <td className="py-6 text-center">
                      <p className="text-sm font-black text-slate-700">{event.date}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{event.time}</p>
                    </td>
                    <td className="py-6 text-center">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        event.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        event.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        • {event.status}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex justify-end gap-3">
                        {event.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleApprove(event.id)} title="Approve" className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all active:scale-90">
                              <CheckCircle size={18} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => handleReject(event.id)} title="Reject" className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-90">
                              <XCircle size={18} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                        <button onClick={() => openDetails(event)} title="View Details" className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all active:scale-90">
                          <Eye size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Approval Rate</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Current Week Analysis</p>
            <div className="flex items-end gap-2">
               <span className="text-3xl font-black text-slate-900">92.4%</span>
               <span className="text-emerald-500 font-black text-xs mb-1">+4.2%</span>
            </div>
          </div>

          <div className="bg-indigo-900 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-indigo-100 group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} className="text-indigo-200" />
              </div>
              <h3 className="text-xl font-black mb-2 leading-tight">Organizer Trend</h3>
              <p className="text-indigo-200 text-[11px] font-medium leading-relaxed mb-6 tracking-tight">Submissions increased by 24% this week. assign more reviewers to handle queue.</p>
              <button className="w-full bg-white text-indigo-900 font-black py-4 rounded-[20px] text-xs hover:shadow-lg transition-all active:scale-95 uppercase tracking-widest">
                View Reports
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertCircle size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Urgent Reviews</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Pending &gt; 48 hours</p>
            <div className="flex items-end gap-2">
               <span className="text-3xl font-black text-rose-600">{events.filter(e => e.status === 'PENDING').length}</span>
               <span className="text-slate-400 font-black text-xs mb-1 uppercase">Events</span>
            </div>
          </div>
        </div>

      </div>

      {/* EVENT DETAIL MODAL (Chỉ hiện khi isModalOpen = true) */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Cover Image & Close Button */}
            <div className="relative h-48 sm:h-64 bg-slate-100">
              <img src={selectedEvent.img} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
              <div className="absolute bottom-6 left-8 right-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/20 mb-3 inline-block`}>
                  {selectedEvent.status}
                </span>
                <h2 className="text-3xl font-black text-white leading-tight">{selectedEvent.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedEvent.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Calendar size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedEvent.date} • {selectedEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Users size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Size</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedEvent.expectedAttendees.toLocaleString()} Pax</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><DollarSign size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Est.</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedEvent.amount}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 mb-3">Event Description</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed bg-slate-50 p-5 rounded-[24px] border border-slate-100">
                  {selectedEvent.description}
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-base font-black text-slate-900 mb-3">Organizer Profile</h3>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[24px] border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-sm font-black text-white shadow-md">
                    {selectedEvent.organizer[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{selectedEvent.organizer}</p>
                    <p className="text-xs text-blue-600 font-bold hover:underline cursor-pointer mt-0.5">View full history & credentials</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions (Chỉ hiện khi trạng thái là PENDING) */}
            {selectedEvent.status === 'PENDING' && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => handleReject(selectedEvent.id)}
                  className="flex-1 py-4 bg-white text-rose-600 font-black rounded-[20px] text-sm border border-slate-200 hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95"
                >
                  Reject Request
                </button>
                <button 
                  onClick={() => handleApprove(selectedEvent.id)}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-[20px] text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Approve Event
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}