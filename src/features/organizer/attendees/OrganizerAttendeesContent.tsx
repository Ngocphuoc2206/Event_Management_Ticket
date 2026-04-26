import { AlertCircle, CheckCircle2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ApiResult } from "@/features/auth/types";
import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import { getOrganizerEvents } from "@/features/organizer/events/services/create-event.service";
import type { OrganizerEvent } from "@/features/organizer/events/types";
import {
  checkInOrganizerAttendee,
  getOrganizerAttendees,
} from "@/features/organizer/attendees/services/attendees.service";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

type OrganizerAttendee = {
  orderItemId: string;
  ticketCode: string;
  fullName: string;
  ticketType: string;
  checkedIn: boolean;
};

type SortBy = "fullName" | "ticketType" | "check-in";
type SortDir = "asc" | "desc";
type StatusFilter = "ALL" | "true" | "false";

const DEFAULT_PAGE_SIZE = 50;

function normalizeAttendeesPayload(payload: unknown): OrganizerAttendee[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((item, index) => {
    const obj = item as Record<string, unknown>;

    const ticketCode =
      (typeof obj.ticketCode === "string" && obj.ticketCode) || "";

    const orderItemId =
      (typeof obj.orderItemId === "string" && obj.orderItemId) ||
      (typeof obj.id === "string" && obj.id) ||
      `order-item-${index + 1}`;

    const fullName =
      (typeof obj.fullName === "string" && obj.fullName) ||
      (typeof obj.username === "string" && obj.username) ||
      "Unknown attendee";

    const ticketType =
      (typeof obj.ticketTypeName === "string" && obj.ticketTypeName) ||
      (typeof obj.ticketType === "string" && obj.ticketType) ||
      "-";

    const checkedInRaw = obj.checkedIn ?? obj.checkIn ?? obj.status;
    const checkedIn = checkedInRaw === true || checkedInRaw === "true";

    return {
      orderItemId,
      ticketCode,
      fullName,
      ticketType,
      checkedIn,
    };
  });
}

export function OrganizerAttendeesContent() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [attendees, setAttendees] = useState<OrganizerAttendee[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("fullName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [isCheckingInByOrderItemId, setIsCheckingInByOrderItemId] = useState<
    Record<string, boolean>
  >({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const pageData = await getOrganizerEvents({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
      });

      setEvents(pageData.items);
      if (!selectedEventId && pageData.items.length > 0) {
        setSelectedEventId(pageData.items[0]?.id ?? "");
      }
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Unable to load organizer events."),
      });
    } finally {
      setIsLoadingEvents(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const loadAttendees = useCallback(async () => {
    if (!selectedEventId) {
      setAttendees([]);
      return;
    }

    setIsLoadingAttendees(true);
    setErrorMessage(null);
    try {
      const apiResult = await getOrganizerAttendees(selectedEventId, {
        search: debouncedSearch || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        sortBy,
        sortDir,
      });

      const data = getApiResultData(apiResult as ApiResult<unknown>);
      setAttendees(normalizeAttendeesPayload(data));
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to load attendees list.",
      );
      setErrorMessage(message);
      setAttendees([]);
    } finally {
      setIsLoadingAttendees(false);
    }
  }, [selectedEventId, debouncedSearch, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAttendees();
  }, [loadAttendees]);

  const checkedInCount = useMemo(
    () => attendees.filter((item) => item.checkedIn).length,
    [attendees],
  );

  const handleCheckIn = async (ticketCode: string) => {
    if (!ticketCode) return;

    setIsCheckingInByOrderItemId((prev) => ({ ...prev, [ticketCode]: true }));

    try {
      await checkInOrganizerAttendee(ticketCode);

      setAttendees((prev) =>
        prev.map((item) =>
          item.ticketCode === ticketCode ? { ...item, checkedIn: true } : item,
        ),
      );

      showToast({ tone: "success", message: "Check-in successful." });
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Check-in failed."),
      });
    } finally {
      setIsCheckingInByOrderItemId((prev) => ({
        ...prev,
        [ticketCode]: false,
      }));
    }
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50 text-zinc-900">
      {toast ? (
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
      ) : null}

      <div className="mx-auto flex w-full max-w-300 flex-col gap-6 p-5 sm:p-8">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Attendee Management
            </h1>
            <p className="mt-1 text-sm text-gray-700">
              Manage attendees and perform check-in via organizer APIs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadAttendees()}
            disabled={!selectedEventId || isLoadingAttendees}
            className="rounded-2xl bg-gray-200 px-5 py-2.5 text-sm font-semibold text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingAttendees ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        <section className="grid gap-3 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] md:grid-cols-5">
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
              Event
            </span>
            <select
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
              disabled={isLoadingEvents}
              className="h-11 w-full rounded-2xl bg-gray-100 px-4 text-sm text-zinc-900"
            >
              {events.length === 0 ? (
                <option value="">No events available</option>
              ) : null}
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 md:col-span-3">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
              Search
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by username or full name"
                disabled={isLoadingAttendees}
                className="w-full rounded-2xl bg-gray-100 py-3 pl-10 pr-4 text-sm text-zinc-900"
              />
            </div>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              disabled={isLoadingAttendees}
              className="h-11 w-full rounded-2xl bg-gray-100 px-4 text-sm text-zinc-900"
            >
              <option value="ALL">ALL</option>
              <option value="true">Checked In</option>
              <option value="false">Pending</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
              Sort By
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortBy)}
              disabled={isLoadingAttendees}
              className="h-11 w-full rounded-2xl bg-gray-100 px-4 text-sm text-zinc-900"
            >
              <option value="fullName">fullName</option>
              <option value="ticketType">ticketType</option>
              <option value="check-in">check-in</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
              Sort Dir
            </span>
            <select
              value={sortDir}
              onChange={(event) => setSortDir(event.target.value as SortDir)}
              disabled={isLoadingAttendees}
              className="h-11 w-full rounded-2xl bg-gray-100 px-4 text-sm text-zinc-900"
            >
              <option value="asc">asc</option>
              <option value="desc">desc</option>
            </select>
          </label>

          <div className="rounded-2xl bg-gray-100 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
              Checked In
            </p>
            <p className="text-lg font-bold text-zinc-900">{checkedInCount}</p>
          </div>

          <div className="rounded-2xl bg-gray-100 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
              Total
            </p>
            <p className="text-lg font-bold text-zinc-900">
              {attendees.length}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
          {errorMessage ? (
            <div className="px-6 py-4 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-230 w-full">
              <thead className="bg-gray-100/70">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700">
                    Ticket Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700">
                    Check-in
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingAttendees ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-gray-700"
                    >
                      Loading attendees...
                    </td>
                  </tr>
                ) : attendees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-gray-700"
                    >
                      No attendees found.
                    </td>
                  </tr>
                ) : (
                  attendees.map((attendee) => {
                    const isCheckingIn =
                      !!isCheckingInByOrderItemId[attendee.ticketCode];

                    return (
                      <tr
                        key={attendee.orderItemId}
                        className="border-t border-gray-100"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                          {attendee.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {attendee.ticketType}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              attendee.checkedIn
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-zinc-200 text-gray-700"
                            }`}
                          >
                            {attendee.checkedIn ? "Checked In" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            disabled={
                              attendee.checkedIn ||
                              isCheckingIn ||
                              isLoadingAttendees
                            }
                            onClick={() =>
                              void handleCheckIn(attendee.ticketCode)
                            }
                            className="rounded-xl bg-linear-to-r from-sky-700 to-violet-700 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {attendee.checkedIn
                              ? "Done"
                              : isCheckingIn
                                ? "Checking..."
                                : "Check-in"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
