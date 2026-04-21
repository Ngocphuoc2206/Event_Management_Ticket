/* eslint-disable @next/next/no-img-element */
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import RejectEventModal from "@/components/organisms/RejectEventModal/RejectEventModal";
import {
  approveAdminEvent,
  getAdminEvents,
  rejectAdminEvent,
  type AdminEvent,
  type AdminEventStatus,
} from "@/features/admin/events.service";
import { CheckCircle, Eye, RefreshCcw, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 10;

function getStatusClasses(status: string) {
  if (status === "PUBLISHED") {
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  }

  if (status === "REJECTED") {
    return "bg-rose-50 text-rose-600 border-rose-100";
  }

  return "bg-amber-50 text-amber-600 border-amber-100";
}

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

export default function EventManagementPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminEventStatus | "ALL">(
    "PENDING_APPROVAL",
  );
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; eventId: string; eventTitle: string }>({
    isOpen: false,
    eventId: "",
    eventTitle: "",
  });

  const activeStatus = useMemo(() => {
    return statusFilter === "ALL" ? undefined : statusFilter;
  }, [statusFilter]);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminEvents({
        status: activeStatus,
        search: searchTerm.trim() || undefined,
        page,
        size: PAGE_SIZE,
      });

      setEvents(data.items);
      setTotalPages(Math.max(1, data.totalPages));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách sự kiện.");
      setEvents([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus, page, searchTerm]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

  const handleApprove = async (eventId: string) => {
    setActionLoadingId(eventId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await approveAdminEvent(eventId);
      setSuccessMessage("Duyệt sự kiện thành công.");
      await loadEvents();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Duyệt sự kiện thất bại.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectClick = (event: AdminEvent) => {
    setRejectModal({
      isOpen: true,
      eventId: event.id,
      eventTitle: event.title,
    });
  };

  const handleRejectConfirm = async (reason: string) => {
    const { eventId } = rejectModal;

    setActionLoadingId(eventId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await rejectAdminEvent(eventId, reason);
      setSuccessMessage("Từ chối sự kiện thành công.");
      setRejectModal({ isOpen: false, eventId: "", eventTitle: "" });
      await loadEvents();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Từ chối sự kiện thất bại.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectCancel = () => {
    setRejectModal({ isOpen: false, eventId: "", eventTitle: "" });
  };

  return (
    <AdminLayout title="Event Approval">
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Event Approval Queue
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Danh sách sự kiện chờ phê duyệt từ backend quản trị
            </p>
          </div>

          <button
            onClick={loadEvents}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-full transition-all text-sm border border-slate-100 active:scale-95"
            disabled={isLoading}
          >
            <RefreshCcw
              size={17}
              strokeWidth={2.5}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm theo tên sự kiện..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold transition-all"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            className="bg-slate-50 border border-slate-100 rounded-full px-8 py-4 text-sm font-black outline-none focus:border-indigo-500 text-slate-600 cursor-pointer w-full md:w-auto"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as AdminEventStatus | "ALL");
            }}
          >
            <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="ALL">ALL</option>
          </select>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
              {successMessage}
            </div>
          )}

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
                {isLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-xs font-black uppercase tracking-widest text-slate-400"
                    >
                      Đang tải danh sách sự kiện...
                    </td>
                  </tr>
                )}

                {!isLoading && events.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-xs font-black uppercase tracking-widest text-slate-400"
                    >
                      Không có sự kiện phù hợp
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  events.map((event) => {
                    const { date, time } = formatDateTime(event.startTime || event.createdAt);

                    return (
                      <tr
                        key={event.id}
                        className="group hover:bg-slate-50/50 transition-all"
                      >
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-slate-50">
                              <img
                                src={
                                  event.bannerUrl ||
                                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=300&auto=format&fit=crop"
                                }
                                className="w-full h-full object-cover"
                                alt={event.title}
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                {event.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                {event.id} • {event.location || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-6 text-center text-xs font-black text-slate-700">
                          {event.organizerName || "Unknown"}
                        </td>

                        <td className="py-6 text-center">
                          <p className="text-sm font-black text-slate-700">{date}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {time}
                          </p>
                        </td>

                        <td className="py-6 text-center">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusClasses(event.status)}`}
                          >
                            {event.status}
                          </span>
                        </td>

                        <td className="py-6 px-4">
                          <div className="flex justify-end gap-2">
                            {event.status === "PENDING_APPROVAL" && (
                              <>
                                <button
                                  onClick={() => void handleApprove(event.id)}
                                  disabled={actionLoadingId === event.id}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90 disabled:opacity-50"
                                  title="Duyệt nhanh"
                                >
                                  <CheckCircle size={18} />
                                </button>

                                <button
                                  onClick={() => handleRejectClick(event)}
                                  disabled={actionLoadingId === event.id}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90 disabled:opacity-50"
                                  title="Từ chối"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}

                            <Link href={`/admin/events/${event.id}`}>
                              <button
                                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Page {page + 1} / {Math.max(1, totalPages)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                disabled={page === 0 || isLoading}
                className="px-4 py-2 rounded-xl border border-slate-100 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(Math.max(0, totalPages - 1), currentPage + 1),
                  )
                }
                disabled={page + 1 >= totalPages || isLoading}
                className="px-4 py-2 rounded-xl border border-slate-100 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <RejectEventModal
          isOpen={rejectModal.isOpen}
          eventTitle={rejectModal.eventTitle}
          isLoading={actionLoadingId === rejectModal.eventId}
          onConfirm={handleRejectConfirm}
          onCancel={handleRejectCancel}
        />
      </div>
    </AdminLayout>
  );
}
