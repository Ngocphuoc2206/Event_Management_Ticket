import {
  Bell,
  ChevronDown,
  Search,
  Settings,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ApiResult } from "@/features/auth/types";
import { getApiErrorMessage, getApiResultData, isApiResponse } from "@/features/auth/utils";
import { getOrganizerEvents } from "@/features/organizer/events/services/create-event.service";
import type { OrganizerEvent } from "@/features/organizer/events/types";
import {
  checkInOrganizerAttendee,
  getOrganizerAttendees,
  type OrganizerAttendee,
  type OrganizerAttendeeSortBy,
  type OrganizerSortDir,
} from "@/features/organizer/attendees/services/attendees.service";

type SortOption = OrganizerAttendeeSortBy;
type StatusFilter = "ALL" | "CHECKED_IN" | "PENDING";

type AttendeeRow = {
  id: string;
  fullName: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
  orderItemId: string;
};

function normalizeEventsPayload(payload: unknown): OrganizerEvent[] {
  if (Array.isArray(payload)) {
    return payload as OrganizerEvent[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as {
    items?: OrganizerEvent[];
    events?: OrganizerEvent[];
    content?: OrganizerEvent[];
    data?: OrganizerEvent[];
    results?: OrganizerEvent[];
  };

  const itemsCandidate =
    objectPayload.items ??
    objectPayload.events ??
    objectPayload.content ??
    objectPayload.data ??
    objectPayload.results;

  return Array.isArray(itemsCandidate) ? itemsCandidate : [];
}

function normalizeAttendeesPayload(payload: unknown): OrganizerAttendee[] {
  if (Array.isArray(payload)) {
    return payload as OrganizerAttendee[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as {
    items?: OrganizerAttendee[];
    attendees?: OrganizerAttendee[];
    content?: OrganizerAttendee[];
    data?: OrganizerAttendee[];
    results?: OrganizerAttendee[];
  };

  const itemsCandidate =
    objectPayload.items ??
    objectPayload.attendees ??
    objectPayload.content ??
    objectPayload.data ??
    objectPayload.results;

  return Array.isArray(itemsCandidate) ? itemsCandidate : [];
}

function mapAttendeeToRow(attendee: OrganizerAttendee): AttendeeRow {
  const fullName = attendee.fullName || attendee.username || "Unknown";

  return {
    id: attendee.id || attendee.orderItemId || fullName,
    fullName,
    email: attendee.email || "-",
    ticketType: attendee.ticketType || "-",
    checkedIn: Boolean(attendee.checkIn),
    orderItemId: attendee.orderItemId || attendee.id || "",
  };
}

export function OrganizerAttendeesContent() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("fullName");
  const [sortDir, setSortDir] = useState<OrganizerSortDir>("asc");

  const [attendees, setAttendees] = useState<AttendeeRow[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const statusParam = useMemo(() => {
    if (statusFilter === "CHECKED_IN") {
      return true;
    }

    if (statusFilter === "PENDING") {
      return false;
    }

    return undefined;
  }, [statusFilter]);

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);

    try {
      const response = await getOrganizerEvents({ page: 1, size: 100 });
      const payload = getApiResultData(response as ApiResult<unknown>);
      const normalizedEvents = normalizeEventsPayload(payload);

      setEvents(normalizedEvents);

      if (!selectedEventId && normalizedEvents[0]?.id) {
        setSelectedEventId(normalizedEvents[0].id);
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Khong the tai danh sach su kien."));
    } finally {
      setIsLoadingEvents(false);
    }
  }, [selectedEventId]);

  const loadAttendees = useCallback(async () => {
    if (!selectedEventId) {
      setAttendees([]);
      return;
    }

    setIsLoadingAttendees(true);
    setErrorMessage(null);

    try {
      const response = await getOrganizerAttendees(selectedEventId, {
        search: searchValue.trim() || undefined,
        status: statusParam,
        sortBy,
        sortDir,
      });

      const payload = getApiResultData(response as ApiResult<unknown>);
      const rows = normalizeAttendeesPayload(payload).map(mapAttendeeToRow);
      setAttendees(rows);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Khong the tai danh sach nguoi tham gia."));
      setAttendees([]);
    } finally {
      setIsLoadingAttendees(false);
    }
  }, [searchValue, selectedEventId, sortBy, sortDir, statusParam]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAttendees();
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadAttendees]);

  const handleCheckIn = async (row: AttendeeRow) => {
    if (!row.orderItemId || checkingInId) {
      return;
    }

    setCheckingInId(row.id);
    setSuccessMessage(null);

    try {
      const response = await checkInOrganizerAttendee(row.orderItemId);

      if (isApiResponse(response) && typeof response.code === "number" && response.code !== 0) {
        throw new Error(response.message || "Check-in that bai.");
      }

      setSuccessMessage(`Check-in thanh cong cho ${row.fullName}.`);
      await loadAttendees();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Khong the check-in nguoi tham gia."));
    } finally {
      setCheckingInId(null);
    }
  };

  return (
    <section className="flex-1 bg-slate-50 text-zinc-900">
      <header className="flex min-h-20 w-full flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-slate-50 px-5 py-4 sm:px-8 lg:px-10">
        <h1 className="text-xl font-semibold leading-7 text-zinc-900">Attendee Management</h1>

        <div className="flex w-full flex-wrap items-center justify-end gap-4 sm:w-auto sm:gap-6">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-gray-700" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by full name..."
              className="w-full rounded-full bg-gray-100 py-3 pl-12 pr-5 text-sm text-gray-700 placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" aria-label="Notifications" className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Settings" className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 p-5 sm:p-8">
        {errorMessage ? <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700">{errorMessage}</div> : null}
        {successMessage ? <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">{successMessage}</div> : null}

        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold leading-8 text-zinc-900">Guest List</h2>
            <p className="mt-1 text-sm leading-5 text-gray-700">
              Manage attendees and perform real-time check-in.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="relative inline-flex h-10 items-center rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <select
                value={selectedEventId}
                onChange={(event) => setSelectedEventId(event.target.value)}
                disabled={isLoadingEvents}
                className="h-10 appearance-none rounded-2xl bg-transparent py-2 pl-4 pr-10 text-sm font-medium text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Select event"
              >
                {!selectedEventId ? <option value="">Select event</option> : null}
                {events.map((eventItem) => (
                  <option key={eventItem.id ?? eventItem.title} value={eventItem.id ?? ""}>
                    {eventItem.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500" />
            </label>

            <label className="relative inline-flex h-10 items-center rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="h-10 appearance-none rounded-2xl bg-transparent py-2 pl-4 pr-10 text-sm font-medium text-zinc-900"
                aria-label="Filter by status"
              >
                <option value="ALL">All Status</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="PENDING">Pending</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500" />
            </label>

            <label className="relative inline-flex h-10 items-center rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-10 appearance-none rounded-2xl bg-transparent py-2 pl-4 pr-10 text-sm font-medium text-zinc-900"
                aria-label="Sort by"
              >
                <option value="fullName">Sort: Full Name</option>
                <option value="ticketType">Sort: Ticket Type</option>
                <option value="check-in">Sort: Check-in</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500" />
            </label>

            <label className="relative inline-flex h-10 items-center rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <select
                value={sortDir}
                onChange={(event) => setSortDir(event.target.value as OrganizerSortDir)}
                className="h-10 appearance-none rounded-2xl bg-transparent py-2 pl-4 pr-10 text-sm font-medium text-zinc-900"
                aria-label="Sort direction"
              >
                <option value="asc">ASC</option>
                <option value="desc">DESC</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500" />
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Full Name</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Email</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Ticket Type</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Check-in</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Order Item ID</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingAttendees ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      Loading attendees...
                    </td>
                  </tr>
                ) : !selectedEventId ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      Select an event to view attendees.
                    </td>
                  </tr>
                ) : attendees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      No attendees found.
                    </td>
                  </tr>
                ) : (
                  attendees.map((attendee) => (
                    <tr key={attendee.id} className="border-t border-gray-100 first:border-t-0">
                      <td className="px-6 py-5 text-sm font-semibold text-zinc-900">{attendee.fullName}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">{attendee.email}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">{attendee.ticketType}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 text-sm font-medium ${
                            attendee.checkedIn ? "text-emerald-600" : "text-gray-700"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${attendee.checkedIn ? "bg-emerald-500" : "bg-slate-300"}`} />
                          {attendee.checkedIn ? "Checked In" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-mono text-sm text-gray-500">{attendee.orderItemId || "-"}</td>
                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() => void handleCheckIn(attendee)}
                          disabled={attendee.checkedIn || checkingInId === attendee.id || !attendee.orderItemId}
                          className="rounded-xl bg-sky-700 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {checkingInId === attendee.id ? "Checking..." : attendee.checkedIn ? "Checked" : "Check-in"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 p-6">
            <p className="text-sm text-gray-700">Showing {attendees.length} attendees</p>
          </div>
        </section>
      </div>
    </section>
  );
}
