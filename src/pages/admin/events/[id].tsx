/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  Users,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Ban,
  Share2,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Đảm bảo đồng bộ key v6 với trang danh sách
const STORAGE_KEY = "app_events_final_v6";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && id) {
      // Ép kiểu id về string để tránh lỗi mảng từ Next.js router
      const eventId = String(id);
      const savedEvents = localStorage.getItem(STORAGE_KEY);

      if (savedEvents) {
        try {
          const eventsArray = JSON.parse(savedEvents);
          const foundEvent = eventsArray.find(
            (ev: any) => String(ev.id) === eventId,
          );
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCurrentEvent(foundEvent);
        } catch (error) {
          console.error("Lỗi đọc dữ liệu sự kiện:", error);
        }
      }
      setIsLoading(false);
    }
  }, [router.isReady, id]);

  const updateEventStatus = (newStatus: string) => {
    if (!currentEvent) return;

    // 1. Cập nhật state UI hiện tại để đổi giao diện tức thì
    const updatedEvent = { ...currentEvent, status: newStatus };
    setCurrentEvent(updatedEvent);

    // 2. Cập nhật vào localStorage để đồng bộ với trang index
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    if (savedEvents) {
      try {
        let eventsArray = JSON.parse(savedEvents);
        eventsArray = eventsArray.map((ev: any) =>
          String(ev.id) === String(updatedEvent.id) ? updatedEvent : ev,
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsArray));
      } catch (error) {
        console.error("Lỗi ghi dữ liệu sự kiện:", error);
      }
    }
  };

  const handleApprove = () => updateEventStatus("VERIFIED");
  const handleReject = () => updateEventStatus("REJECTED");

  if (isLoading)
    return (
      <div className="p-10 text-slate-500 font-black uppercase tracking-widest text-xs">
        Loading Event Data...
      </div>
    );

  if (!currentEvent) {
    return (
      <AdminLayout title="Event Not Found">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <AlertCircle size={64} className="text-slate-300" />
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tight">
            Event not found!
          </h2>
          <p className="text-slate-500">
            The event ID &quot;{id}&quot; does not exist in our records.
          </p>
          <Link
            href="/admin/events"
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <ArrowLeft size={18} /> Back to Events
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const getPayoutStatus = () => {
    if (currentEvent.status === "VERIFIED")
      return { text: "Ready to Payout", color: "text-emerald-400" };
    if (currentEvent.status === "REJECTED")
      return { text: "Cancelled", color: "text-rose-400" };
    return { text: "Pending Review", color: "text-amber-400" };
  };
  const payoutInfo = getPayoutStatus();

  return (
    <AdminLayout title={"Event Detail"}>
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link
                href="/admin/events"
                className="hover:text-indigo-600 transition-colors"
              >
                Events Management
              </Link>
              <ChevronRight size={12} strokeWidth={3} />
              <span className="text-slate-900">Event Detail</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin/events">
                <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all">
                  <ArrowLeft size={20} strokeWidth={3} />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentEvent.title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      currentEvent.status === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : currentEvent.status === "REJECTED"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {currentEvent.status}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    by{" "}
                    <span className="text-slate-700">
                      {currentEvent.organizer}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <Share2 size={16} /> Share
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={16} /> View Live
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="relative h-[300px] md:h-[400px] rounded-[40px] overflow-hidden border-8 border-white shadow-sm bg-slate-100">
              <img
                src={currentEvent.image}
                className="w-full h-full object-cover"
                alt={currentEvent.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900">
                {currentEvent.category}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Tickets Sold",
                  value: currentEvent.stats?.ticketsSold?.value || "0",
                  sub: `${currentEvent.stats?.ticketsSold?.percentage || "0%"} of capacity`,
                  icon: Ticket,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Gross Revenue",
                  value: currentEvent.stats?.revenue || "$0",
                  sub: "Total sales (inc. tax)",
                  icon: DollarSign,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Total Views",
                  value: currentEvent.stats?.views || "0",
                  sub: "Page visits",
                  icon: Users,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm"
                >
                  <div
                    className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <item.icon size={24} strokeWidth={2.5} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">
                    {item.value}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight uppercase text-xs tracking-[0.2em]">
                Event Description
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed italic">
                &quot;{currentEvent.description}&quot;
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {currentEvent.status === "PENDING" && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-[40px] p-8 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                  <AlertCircle size={14} /> Action Required
                </h3>
                <p className="text-sm font-bold text-slate-700 mb-6 leading-relaxed">
                  This event is waiting for your approval to go live on the
                  platform.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleApprove}
                    className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} strokeWidth={3} /> Approve Event
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full py-4 bg-white text-rose-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-50 border border-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} strokeWidth={3} /> Reject
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-200">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                Event Logistics
              </h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Date & Time
                    </p>
                    <p className="font-bold text-sm mt-1">
                      {currentEvent.date} • {currentEvent.time}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Location
                    </p>
                    <p className="font-bold text-sm mt-1 leading-snug">
                      {currentEvent.location}
                    </p>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Payout Status
                      </p>
                      <p
                        className={`font-black text-xl mt-1 ${payoutInfo.color}`}
                      >
                        {payoutInfo.text}
                      </p>
                    </div>
                    {currentEvent.status === "VERIFIED" ? (
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={32} className="text-slate-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {currentEvent.status === "VERIFIED" && (
              <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  Moderation
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={handleReject}
                    className="w-full py-4 bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Ban size={16} strokeWidth={3} /> Suspend / Revoke
                  </button>
                  <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed px-4">
                    Suspending this event will stop ticket sales and hide it
                    from the public marketplace.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
