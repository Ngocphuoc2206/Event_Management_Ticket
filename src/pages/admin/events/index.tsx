/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import Link from "next/link";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  Activity,
  AlertCircle,
} from "lucide-react";

// Đổi key sang v6 để ép trình duyệt xóa data ảnh cũ bị lỗi
const STORAGE_KEY = "app_events_final_v6";

const INITIAL_EVENTS = [
  {
    id: "EV-9921",
    title: "Neon Nights Music Festival",
    location: "Los Angeles, CA",
    organizer: "Prism Events Inc.",
    organizerId: "USR-001",
    status: "PENDING",
    date: "Oct 24, 2023",
    time: "10:45 AM",
    amount: "$12,500",
    description:
      "An immersive electronic music festival featuring top DJs and stunning neon visuals.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    category: "Music Festival",
    stats: {
      ticketsSold: { value: "1,250", percentage: "85%" },
      revenue: "$12,500",
      views: "4,520",
    },
  },
  {
    id: "EV-9918",
    title: "Tech Future Summit 2024",
    location: "Austin, TX",
    organizer: "Next Ventures",
    organizerId: "USR-002",
    status: "PENDING",
    date: "Oct 23, 2023",
    time: "03:20 PM",
    amount: "$3,200",
    description:
      "Join industry leaders for a deep dive into the future of tech and innovation.",
    image:
      "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800&auto=format&fit=crop",
    category: "Conference",
    stats: {
      ticketsSold: { value: "320", percentage: "64%" },
      revenue: "$3,200",
      views: "1,850",
    },
  },
  {
    id: "EV-9915",
    title: "Gala Charity Dinner",
    location: "New York, NY",
    organizer: "Hope Foundation",
    organizerId: "USR-003",
    status: "PENDING",
    date: "Oct 23, 2023",
    time: "09:12 AM",
    amount: "$1,450",
    description:
      "Annual charity dinner to support local communities and global initiatives.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    category: "Charity",
    stats: {
      ticketsSold: { value: "120", percentage: "80%" },
      revenue: "$1,450",
      views: "850",
    },
  },
  {
    id: "EV-9910",
    title: "Art & Wine Walk",
    location: "San Francisco, CA",
    organizer: "Urban Creative",
    organizerId: "USR-004",
    status: "PENDING",
    date: "Oct 20, 2023",
    time: "02:00 PM",
    amount: "$850",
    description:
      "A cultural journey through local galleries featuring premium wine tastings.",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    category: "Cultural",
    stats: {
      ticketsSold: { value: "85", percentage: "100%" },
      revenue: "$850",
      views: "620",
    },
  },
  {
    id: "EV-9922",
    title: "Coachella Music Festival 2024",
    location: "Indio, CA",
    organizer: "Goldenvoice",
    organizerId: "USR-005",
    status: "PENDING",
    date: "April 12, 2024",
    time: "10:45 AM",
    amount: "$1,250,000",
    description:
      "The world's most famous music and arts festival returns to the desert.",
    image:
      "https://images.unsplash.com/photo-1459749411177-042180ce673f?q=80&w=800&auto=format&fit=crop",
    category: "Music Festival",
    stats: {
      ticketsSold: { value: "12,500", percentage: "83%" },
      revenue: "$1,250,000",
      views: "45.2k",
    },
  },
];

export default function EventManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Viết thành hàm riêng để có thể gọi lại mượt mà mỗi lần mount
    const loadData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          setEvents(JSON.parse(savedData));
        } catch (e) {
          setEvents(INITIAL_EVENTS);
        }
      } else {
        setEvents(INITIAL_EVENTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      }
    };

    loadData();
  }, []);

  const syncData = (newData: any[]) => {
    setEvents(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const handleApprove = (id: string) => {
    syncData(
      events.map((ev) => (ev.id === id ? { ...ev, status: "VERIFIED" } : ev)),
    );
  };

  const handleReject = (id: string) => {
    syncData(
      events.map((ev) => (ev.id === id ? { ...ev, status: "REJECTED" } : ev)),
    );
  };

  const handleReviewAll = () => {
    const hasPending = events.some((ev) => ev.status === "PENDING");
    if (!hasPending) return alert("No pending events to review!");
    if (confirm("Are you sure you want to approve all pending events?")) {
      syncData(
        events.map((ev) =>
          ev.status === "PENDING" ? { ...ev, status: "VERIFIED" } : ev,
        ),
      );
    }
  };

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!mounted) return null;

  return (
    <AdminLayout title="">
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Event Management
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Reviewing {events.filter((e) => e.status === "PENDING").length}{" "}
              pending event submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-all text-sm border border-slate-200">
              Export Report
            </button>
            <button
              onClick={handleReviewAll}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm shadow-lg shadow-indigo-100 active:scale-95"
            >
              Review All
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by event, organizer or ID..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 px-4">Event Details</th>
                  <th className="pb-6 text-center">Organizer</th>
                  <th className="pb-6 text-center">Date & Time</th>
                  <th className="pb-6 text-center">Status</th>
                  <th className="pb-6 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="group hover:bg-slate-50/50 transition-all"
                  >
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-slate-50">
                          <img
                            src={event.image}
                            className="w-full h-full object-cover"
                            alt={event.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=300&auto=format&fit=crop";
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                            {event.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                            {event.id} • {event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-center text-xs font-black text-slate-700">
                      <Link
                        href={`/admin/users/${event.organizerId}`}
                        className="hover:text-indigo-600 hover:underline transition-colors"
                      >
                        {event.organizer}
                      </Link>
                    </td>
                    <td className="py-6 text-center">
                      <p className="text-sm font-black text-slate-700">
                        {event.date}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {event.time}
                      </p>
                    </td>
                    <td className="py-6 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          event.status === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : event.status === "REJECTED"
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        • {event.status}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex justify-end gap-2">
                        {event.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(event.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(event.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <Link href={`/admin/events/${event.id}`}>
                          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90">
                            <Eye size={18} />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={24} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">
                Approval Rate
              </h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">
                Current Week Analysis
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">92.4%</span>
              <span className="text-sm font-bold text-emerald-500">+4.2%</span>
            </div>
          </div>

          <div className="bg-indigo-900 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-indigo-100 group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} className="text-indigo-200" />
              </div>
              <h3 className="text-xl font-black mb-2 leading-tight">
                Review Queue
              </h3>
              <p className="text-indigo-200 text-[11px] font-medium mb-6 tracking-tight">
                You have {events.filter((e) => e.status === "PENDING").length}{" "}
                events waiting.
              </p>
              <button
                onClick={handleReviewAll}
                className="w-full bg-white text-indigo-900 font-black py-4 rounded-[20px] text-xs hover:bg-indigo-50 transition-all active:scale-95 uppercase tracking-widest"
              >
                Approve All Now
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={24} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">
                Urgent Reviews
              </h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">
                Pending &gt; 48 Hours
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-rose-500">2</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Events
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
