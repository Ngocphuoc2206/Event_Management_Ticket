import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  Search,
  Settings,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type CheckInStatus = "Checked In" | "Pending";
type TicketType = "VIP Experience" | "Standard Pass" | "Early Bird";
type TicketTypeFilter = TicketType | "All Ticket Types";

type AttendeeRow = {
  id: string;
  name: string;
  email: string;
  ticketType: TicketType;
  checkInStatus?: CheckInStatus;
  orderId: string;
  avatarSrc?: string;
  initials?: string;
  initialsBgClass?: string;
};

const ATTENDEE_ROWS: AttendeeRow[] = [
  {
    id: "ORD-90210",
    name: "Julian Casablancas",
    email: "j.casablancas@gmail.com",
    ticketType: "VIP Experience",
    checkInStatus: "Checked In",
    orderId: "ORD-90210",
    avatarSrc: "https://placehold.co/40x40",
  },
  {
    id: "ORD-88273",
    name: "Sarah Miller",
    email: "sarah.m@outlook.com",
    ticketType: "Standard Pass",
    checkInStatus: "Pending",
    orderId: "ORD-88273",
    initials: "SM",
    initialsBgClass: "bg-indigo-300 text-sky-700",
  },
  {
    id: "ORD-77122",
    name: "Marcus Aurelius",
    email: "marcus.stoic@live.com",
    ticketType: "Early Bird",
    checkInStatus: "Checked In",
    orderId: "ORD-77122",
    avatarSrc: "https://placehold.co/40x40",
  },
  {
    id: "ORD-55443",
    name: "Elena Rodriguez",
    email: "elena.rod@tech.co",
    ticketType: "VIP Experience",
    orderId: "ORD-55443",
    avatarSrc: "https://placehold.co/40x40",
  },
];

const TICKET_TYPE_FILTERS: TicketTypeFilter[] = ["All Ticket Types", "VIP Experience", "Standard Pass", "Early Bird"];

function getTicketBadge(ticketType: TicketType) {
  if (ticketType === "VIP Experience") {
    return {
      wrapClass: "bg-purple-200 text-violet-950",
      line1: "VIP",
      line2: "Experience",
    };
  }

  if (ticketType === "Standard Pass") {
    return {
      wrapClass: "bg-blue-100 text-sky-950",
      line1: "Standard",
      line2: "Pass",
    };
  }

  return {
    wrapClass: "bg-red-100 text-rose-900",
    line1: "Early Bird",
    line2: "",
  };
}

export function OrganizerAttendeesContent() {
  const [searchValue, setSearchValue] = useState("");
  const [ticketTypeFilter, setTicketTypeFilter] = useState<TicketTypeFilter>("All Ticket Types");
  const [openActionsForId, setOpenActionsForId] = useState<string | null>(null);

  const filteredAttendees = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return ATTENDEE_ROWS.filter((attendee) => {
      const matchesSearch =
        normalizedSearch.length === 0
        || attendee.name.toLowerCase().includes(normalizedSearch)
        || attendee.email.toLowerCase().includes(normalizedSearch);

      const matchesTicketType = ticketTypeFilter === "All Ticket Types" || attendee.ticketType === ticketTypeFilter;

      return matchesSearch && matchesTicketType;
    });
  }, [searchValue, ticketTypeFilter]);

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
              placeholder="Search attendees..."
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
            <div className="mx-1 h-8 w-px bg-slate-300/30" />
            <img src="https://placehold.co/36x36" alt="Organizer avatar" className="h-9 w-9 rounded-full border-2 border-blue-100 object-cover" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 p-5 sm:p-8">
        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold leading-8 text-zinc-900">Guest List</h2>
            <p className="mt-1 text-sm leading-5 text-gray-700">
              Managing 1,240 confirmed attendees for &apos;Future Tech 2024&apos;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="relative inline-flex h-10 items-center rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <select
                value={ticketTypeFilter}
                onChange={(event) => setTicketTypeFilter(event.target.value as TicketTypeFilter)}
                className="h-10 appearance-none rounded-2xl bg-transparent py-2 pl-4 pr-10 text-sm font-medium text-zinc-900"
                aria-label="Filter by ticket type"
              >
                {TICKET_TYPE_FILTERS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500" />
            </label>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-5 text-sm font-semibold text-white shadow-[0px_4px_6px_-4px_rgba(0,88,190,0.2),0px_10px_15px_-3px_rgba(0,88,190,0.2)]"
            >
              <Download className="h-4 w-4" />
              <span>Export List</span>
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Attendee Name</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Email</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Ticket Type</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Check-in Status</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Order ID</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-wide text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      No attendees found.
                    </td>
                  </tr>
                ) : filteredAttendees.map((attendee) => {
                  const ticketBadge = getTicketBadge(attendee.ticketType);
                  const isCheckedIn = attendee.checkInStatus === "Checked In";
                  const hasCheckInStatus = Boolean(attendee.checkInStatus);

                  return (
                    <tr key={attendee.id} className="border-t border-gray-100 first:border-t-0">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {attendee.avatarSrc ? (
                            <img src={attendee.avatarSrc} alt={attendee.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${attendee.initialsBgClass ?? "bg-slate-200 text-slate-700"}`}
                            >
                              {attendee.initials}
                            </div>
                          )}
                          <span className="text-sm font-semibold text-zinc-900">{attendee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">{attendee.email}</td>
                      <td className="px-6 py-5">
                        {ticketBadge.line2 ? (
                          <span
                            className={`inline-flex min-w-[64px] flex-col items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase leading-3 ${ticketBadge.wrapClass}`}
                          >
                            <span>{ticketBadge.line1}</span>
                            <span>{ticketBadge.line2}</span>
                          </span>
                        ) : (
                          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase ${ticketBadge.wrapClass}`}>
                            {ticketBadge.line1}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {hasCheckInStatus ? (
                          <span
                            className={`inline-flex items-center gap-2 text-sm font-medium ${isCheckedIn ? "text-emerald-600" : "text-gray-700"}`}
                          >
                            <span className={`h-2 w-2 rounded-full ${isCheckedIn ? "bg-emerald-500" : "bg-slate-300"}`} />
                            {attendee.checkInStatus}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No status</span>
                        )}
                      </td>
                      <td className="px-6 py-5 font-mono text-sm text-gray-500">#{attendee.orderId}</td>
                      <td className="relative px-6 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenActionsForId((prev) => (prev === attendee.id ? null : attendee.id))
                          }
                          aria-haspopup="menu"
                          aria-expanded={openActionsForId === attendee.id}
                          aria-label={`More actions for ${attendee.name}`}
                          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openActionsForId === attendee.id ? (
                          <div
                            role="menu"
                            className="absolute right-6 top-14 z-10 min-w-40 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => setOpenActionsForId(null)}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                            >
                              View details
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => setOpenActionsForId(null)}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                            >
                              Resend ticket
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => setOpenActionsForId(null)}
                              className="block w-full px-4 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                            >
                              Remove attendee
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 p-6">
            <p className="text-sm text-gray-700">
              Showing <span className="font-semibold">{filteredAttendees.length === 0 ? 0 : 1}-{filteredAttendees.length}</span> of <span className="font-semibold">{filteredAttendees.length}</span> attendees
            </p>

            <div className="flex items-center gap-2">
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 text-zinc-900 opacity-30" aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-violet-700 text-sm font-bold text-white" aria-label="Page 1">
                  1
                </button>
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-medium text-zinc-900" aria-label="Page 2">
                  2
                </button>
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-medium text-zinc-900" aria-label="Page 3">
                  3
                </button>
                <span className="px-2 text-base text-gray-500">...</span>
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-medium text-zinc-900" aria-label="Page 124">
                  124
                </button>
              </div>

              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 text-zinc-900" aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="flex items-center gap-4 rounded-3xl bg-gray-100 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-700/10 text-sky-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Checked In</p>
              <p className="text-2xl font-bold text-zinc-900">842 / 1,240</p>
            </div>
          </article>

          <article className="flex items-center gap-4 rounded-3xl bg-gray-100 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-700/10 text-violet-700">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-700">VIP Ratio</p>
              <p className="text-2xl font-bold text-zinc-900">12%</p>
            </div>
          </article>

          <article className="flex items-center gap-4 rounded-3xl bg-gray-100 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-700/10 text-rose-700">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Velocity</p>
              <p className="text-2xl font-bold text-zinc-900">+14 / hr</p>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}
