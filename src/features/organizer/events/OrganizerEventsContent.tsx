import { AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getApiErrorMessage,
} from "@/features/auth/utils";
import {
  getOrganizerEvents,
} from "@/features/organizer/events/services/create-event.service";
import type {
  OrganizerEvent,
} from "@/features/organizer/events/types";
import { OrganizerDashboardIcon } from "@/features/organizer/dashboard/OrganizerDashboardIcons";
import { OrganizerMetaFooter } from "@/features/organizer/shared/OrganizerMetaFooter";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

const DEFAULT_PAGE_SIZE = 10;

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-zinc-200 text-gray-700",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  PUBLISHED: "bg-green-100 text-green-700",
  REJECTED: "bg-rose-100 text-rose-700",
  CANCELLED: "bg-slate-200 text-slate-700",
};

function formatDate(dateInput?: string) {
  if (!dateInput) {
    return "-";
  }

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return dateInput;
  }

  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price?: number) {
  if (typeof price !== "number" || Number.isNaN(price)) {
    return "-";
  }

  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function OrganizerEventsContent() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  const loadEvents = useCallback(async (nextPage: number) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const pageData = await getOrganizerEvents({
        page: nextPage,
        size: DEFAULT_PAGE_SIZE,
      });

      setEvents(pageData.items);
      setHasNext(Boolean(pageData.hasNext));
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Không thể tải danh sách sự kiện. Vui lòng thử lại.",
        ),
      );
      setEvents([]);
      setHasNext(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents(page);
  }, [loadEvents, page]);

  const totalDraftEvents = useMemo(
    () =>
      events.filter(
        (event) => (event.status ?? "DRAFT").toUpperCase() === "DRAFT",
      ).length,
    [events],
  );

  return (
    <section className="relative flex-1">
      {toast && (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.tone === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            {toast.tone === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      <header className="flex h-20 items-center justify-between border-b border-slate-300/10 bg-slate-50/80 px-5 backdrop-blur-[6px] sm:px-8 lg:px-10 xl:px-10">
        <div className="flex-1 max-w-[576px]">
          <div className="relative">
            <div className="inline-flex h-11 w-full items-start justify-center overflow-hidden rounded-2xl bg-gray-100 py-3.5 pl-12 pr-4">
              <div className="flex-1 overflow-hidden text-sm font-normal text-gray-500">
                Search events, orders, or attendees...
              </div>
            </div>
            <div className="absolute left-4 top-[10px] flex h-6 items-center">
              <OrganizerDashboardIcon
                type="search"
                className="h-4 w-4 text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-6">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <OrganizerDashboardIcon type="bell" className="h-[18px] w-[18px]" />
            <span className="absolute left-6 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100"
            aria-label="Settings"
          >
            <OrganizerDashboardIcon type="settings" className="h-5 w-5" />
          </button>
          <div className="h-8 w-px bg-slate-300/30" />
          <p className="text-sm font-bold tracking-wider text-gray-700">
            ORGANIZER DASHBOARD
          </p>
        </div>
      </header>

      <div className="space-y-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-[672px] space-y-4">
            <h1 className="text-4xl font-bold leading-[48px] text-zinc-900 sm:text-5xl">
              Events Management
            </h1>
            <p className="text-lg font-light leading-7 text-gray-700">
              Theo doi va quan ly cac su kien da tao, trang thai va tien do
              duyet theo thoi gian thuc.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
              <span className="text-sm text-gray-700">Draft:</span>
              <span className="text-base font-bold text-zinc-900">
                {totalDraftEvents}
              </span>
              <span className="text-sm text-gray-700">Page:</span>
              <span className="text-base font-bold text-zinc-900">{page}</span>
            </div>

            <Link
              href="/organizer/create-event"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 text-sm font-semibold text-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] transition hover:brightness-105"
            >
              <span className="text-sm leading-none">+</span>
              <span>Create New Event</span>
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h2 className="text-xl font-bold leading-7 text-zinc-900">
              Event List
            </h2>
            <button
              type="button"
              onClick={() => void loadEvents(page)}
              className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>

          {errorMessage ? (
            <div className="p-6 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-[1040px] w-full">
              <thead className="bg-gray-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Banner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Ten su kien
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Ngay bat dau
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Gia ve
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Trang thai
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-700">
                    Thao tac
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm font-medium text-gray-700"
                    >
                      Dang tai danh sach su kien...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm font-medium text-gray-700"
                    >
                      Chua co su kien nao.
                    </td>
                  </tr>
                ) : (
                  events.map((item) => {
                    const eventId = item.id ?? "";
                    const status = (item.status ?? "DRAFT").toUpperCase();
                    const statusClassName =
                      STATUS_STYLE[status] || "bg-slate-200 text-slate-700";

                    return (
                      <tr
                        key={eventId || item.title}
                        className="border-t border-gray-100"
                      >
                        <td className="px-6 py-4">
                          {item.bannerUrl ? (
                            <Image
                              src={item.bannerUrl}
                              alt={item.title}
                              width={96}
                              height={56}
                              className="h-14 w-24 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-14 w-24 rounded-lg bg-gradient-to-br from-sky-200 to-violet-200" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[280px]">
                            <p className="truncate text-sm font-bold text-zinc-900">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-gray-700">
                              {item.category}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-900">
                          {formatDate(item.startTime)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                          {formatPrice(item.minPrice)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClassName}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/organizer/events/edit/${eventId}`}
                              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-slate-200"
                            >
                              Sua
                            </Link>
                            <Link
                              href={`/event/${eventId}`}
                              className="rounded-xl bg-blue-100 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-blue-200"
                            >
                              Xem chi tiet
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="inline-flex w-full items-center justify-between border-t border-gray-100 bg-gray-100/30 px-8 py-4">
            <p className="text-xs font-medium text-gray-700">
              Hien thi {events.length} su kien - Trang {page}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isLoading || page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-center text-xs font-semibold text-gray-700 outline outline-1 outline-offset-[-1px] outline-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={isLoading || !hasNext}
                onClick={() => setPage((prev) => prev + 1)}
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-center text-xs font-semibold text-gray-700 outline outline-1 outline-offset-[-1px] outline-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <OrganizerMetaFooter />
      </div>
    </section>
  );
}
