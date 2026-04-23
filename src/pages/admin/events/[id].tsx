/* eslint-disable @next/next/no-img-element */
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import {
  approveAdminEvent,
  findAdminEventByIdFromList,
  getAdminEventById,
  rejectAdminEvent,
  type AdminEvent,
} from "@/features/admin/events.service";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  MapPin,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatDateTime(rawDate?: string) {
  if (!rawDate) {
    return { date: "N/A", time: "N/A" };
  }

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return { date: rawDate, time: "" };
  }

  return {
    date: parsed.toLocaleDateString("vi-VN"),
    time: parsed.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function getStatusClasses(status: string) {
  if (status === "PUBLISHED" || status === "APPROVED") {
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  }

  if (status === "REJECTED") {
    return "bg-rose-50 text-rose-600 border-rose-100";
  }

  return "bg-amber-50 text-amber-600 border-amber-100";
}

export default function EventDetailPage() {
  const router = useRouter();
  const eventId = useMemo(() => {
    if (!router.isReady || !router.query.id) {
      return "";
    }

    return String(router.query.id);
  }, [router.isReady, router.query.id]);

  const [currentEvent, setCurrentEvent] = useState<AdminEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadEvent = useCallback(async () => {
    if (!eventId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const directEvent = await getAdminEventById(eventId);

      if (directEvent) {
        setCurrentEvent(directEvent);
      } else {
        const fallbackEvent = await findAdminEventByIdFromList(eventId);
        setCurrentEvent(fallbackEvent);
      }
    } catch (error) {
      setCurrentEvent(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải chi tiết sự kiện.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadEvent();
    }
  }, [eventId, loadEvent]);

  const handleApprove = async () => {
    if (!currentEvent) {
      return;
    }

    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updated = await approveAdminEvent(currentEvent.id);
      setCurrentEvent(updated ?? { ...currentEvent, status: "APPROVED" });
      setSuccessMessage("Duyệt sự kiện thành công.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Duyệt sự kiện thất bại.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!currentEvent) {
      return;
    }

    const rejectReason = window.prompt("Nhập lý do từ chối sự kiện:");
    if (rejectReason === null) {
      return;
    }

    if (!rejectReason.trim()) {
      setErrorMessage("Lý do từ chối không được để trống.");
      return;
    }

    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updated = await rejectAdminEvent(
        currentEvent.id,
        rejectReason.trim(),
      );
      setCurrentEvent(
        updated ?? {
          ...currentEvent,
          status: "REJECTED",
          rejectReason: rejectReason.trim(),
        },
      );
      setSuccessMessage("Từ chối sự kiện thành công.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Từ chối sự kiện thất bại.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Event Detail">
        <div className="p-10 text-slate-500 font-black uppercase tracking-widest text-xs">
          Loading event data...
        </div>
      </AdminLayout>
    );
  }

  if (!currentEvent) {
    return (
      <AdminLayout title="Event Not Found">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <AlertCircle size={64} className="text-slate-300" />
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tight">
            Event not found
          </h2>
          <p className="text-slate-500">
            Không tìm thấy sự kiện hoặc bạn không có quyền truy cập.
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

  const { date, time } = formatDateTime(
    currentEvent.startTime || currentEvent.createdAt,
  );

  return (
    <AdminLayout title="Event Detail">
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
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusClasses(currentEvent.status)}`}
                  >
                    {currentEvent.status}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentEvent.organizerName || "Unknown organizer"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="relative h-[300px] md:h-[400px] rounded-[40px] overflow-hidden border-8 border-white shadow-sm bg-slate-100">
              <img
                src={
                  currentEvent.bannerUrl ||
                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop"
                }
                className="w-full h-full object-cover"
                alt={currentEvent.title}
              />
              {currentEvent.category && (
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900">
                  {currentEvent.category}
                </div>
              )}
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Event Description
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                {currentEvent.description || "Chưa có mô tả cho sự kiện này."}
              </p>
            </div>

            {currentEvent.rejectReason && (
              <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-500 mb-2">
                  Reject Reason
                </p>
                <p className="text-sm font-semibold text-rose-700">
                  {currentEvent.rejectReason}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-8">
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
                      {date} {time ? `• ${time}` : ""}
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
                      {currentEvent.location || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {currentEvent.status === "PENDING" && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-[40px] p-8 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                  <AlertCircle size={14} /> Action Required
                </h3>
                <p className="text-sm font-bold text-slate-700 mb-6 leading-relaxed">
                  Sự kiện này đang chờ bạn phê duyệt trước khi hiển thị công
                  khai.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => void handleApprove()}
                    disabled={isActionLoading}
                    className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <CheckCircle size={18} strokeWidth={3} /> Approve Event
                  </button>
                  <button
                    onClick={() => void handleReject()}
                    disabled={isActionLoading}
                    className="w-full py-4 bg-white text-rose-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-50 border border-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <XCircle size={18} strokeWidth={3} /> Reject
                  </button>
                </div>
              </div>
            )}

            {(currentEvent.status === "PUBLISHED" ||
              currentEvent.status === "APPROVED") && (
              <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  Moderation
                </h3>
                <div className="flex items-center gap-3 text-emerald-600 mb-6">
                  <CheckCircle2 size={20} />
                  <p className="text-sm font-bold">Sự kiện đã được duyệt.</p>
                </div>
                <button
                  onClick={() => void handleReject()}
                  disabled={isActionLoading}
                  className="w-full py-4 bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <XCircle size={16} strokeWidth={3} /> Reject Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
