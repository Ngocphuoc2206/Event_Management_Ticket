import { LayoutGrid, List, MoreHorizontal, Pencil, UserCircle2, View } from "lucide-react";
import Link from "next/link";

import { OrganizerDashboardIcon } from "../dashboard/OrganizerDashboardIcons";
import { OrganizerMetaFooter } from "../shared/OrganizerMetaFooter";

type PortfolioStatus = "Live" | "Draft" | "Completed";

type PortfolioItem = {
  id: string;
  name: string;
  venue: string;
  status: PortfolioStatus;
  sold: number;
  capacity: number;
  revenue: string;
  date: string;
  tone: "live" | "draft" | "completed";
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "neon-nights-festival",
    name: "Neon Nights Festival",
    venue: "Downtown Arena",
    status: "Live",
    sold: 4650,
    capacity: 5000,
    revenue: "$139,500.00",
    date: "Oct 24, 2024",
    tone: "live",
  },
  {
    id: "tech-summit-2024",
    name: "Tech Summit 2024",
    venue: "Global Convention Center",
    status: "Draft",
    sold: 0,
    capacity: 2500,
    revenue: "$0.00",
    date: "Nov 12, 2024",
    tone: "draft",
  },
  {
    id: "summer-food-expo",
    name: "Summer Food Expo",
    venue: "Waterfront Park",
    status: "Live",
    sold: 1210,
    capacity: 3000,
    revenue: "$54,450.00",
    date: "Aug 15, 2024",
    tone: "live",
  },
  {
    id: "acoustic-soul-session",
    name: "Acoustic Soul Session",
    venue: "The Jazz Lounge",
    status: "Completed",
    sold: 250,
    capacity: 250,
    revenue: "$18,750.00",
    date: "Jul 02, 2024",
    tone: "completed",
  },
];

const STATUS_STYLE: Record<PortfolioStatus, string> = {
  Live: "bg-green-100 text-green-700",
  Draft: "bg-zinc-200 text-gray-700",
  Completed: "bg-gray-100 text-gray-700",
};

export function OrganizerEventsContent() {
  return (
    <section className="flex-1">
      <header className="flex h-20 items-center justify-between border-b border-slate-300/10 bg-slate-50/80 px-5 backdrop-blur-[6px] sm:px-8 lg:px-10 xl:px-10">
        <div className="flex-1 max-w-[576px]">
          <div className="relative">
            <div className="inline-flex h-11 w-full items-start justify-center overflow-hidden rounded-2xl bg-gray-100 py-3.5 pl-12 pr-4">
              <div className="flex-1 overflow-hidden text-sm font-normal text-gray-500">Search events, orders, or attendees...</div>
            </div>
            <div className="absolute left-4 top-[10px] flex h-6 items-center">
              <OrganizerDashboardIcon type="search" className="h-4 w-4 text-gray-700" />
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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 text-sm font-semibold text-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] transition hover:brightness-105"
          >
            <span className="text-sm leading-none">+</span>
            <span>Create New Event</span>
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-gray-700">
            <UserCircle2 className="h-5 w-5" />
          </div>
        </div>
      </header>

      <div className="space-y-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-[672px] space-y-4">
            <h1 className="text-4xl font-bold leading-[48px] text-zinc-900 sm:text-5xl">Events Management</h1>
            <p className="text-lg font-light leading-7 text-gray-700">
              Track and manage your created events, their sales performance, and
              <br className="hidden sm:block" />
              status in real-time.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-4 rounded-2xl bg-gray-100 p-1">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-2 text-sm font-medium text-zinc-900 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]"
            >
              All
            </button>
            <button type="button" className="inline-flex items-center justify-center rounded-2xl px-5 py-2 text-sm font-medium text-gray-700">
              Live
            </button>
            <button type="button" className="inline-flex items-center justify-center rounded-2xl px-5 py-2 text-sm font-medium text-gray-700">
              Draft
            </button>
            <button type="button" className="inline-flex items-center justify-center rounded-2xl px-5 py-2 text-sm font-medium text-gray-700">
              Past
            </button>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          <article className="relative h-52 rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                <OrganizerDashboardIcon type="ticket" className="h-5 w-5 text-sky-700" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Tickets Sold</p>
            </div>

            <div className="mt-10 flex items-baseline gap-2">
              <p className="text-4xl font-bold leading-10 text-zinc-900">12,482</p>
              <p className="text-sm font-medium leading-5 text-green-600">+12%</p>
            </div>

            <p className="mt-4 text-sm font-normal leading-5 text-gray-700">Total across 8 active events</p>
          </article>

          <article className="relative h-52 rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-200">
                <OrganizerDashboardIcon type="analytics" className="h-5 w-5 text-violet-700" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Total Revenue</p>
            </div>

            <div className="mt-10 flex items-baseline gap-2">
              <p className="text-4xl font-bold leading-10 text-zinc-900">$248,390</p>
              <p className="text-sm font-medium leading-5 text-green-600">+8.4%</p>
            </div>

            <p className="mt-4 text-sm font-normal leading-5 text-gray-700">Net earnings this month</p>
          </article>

          <article className="relative flex min-h-52 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-violet-700 p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <div className="absolute bottom-4 right-5 opacity-10 text-white">
              <OrganizerDashboardIcon type="events" className="h-16 w-16" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">Quick Insight</p>
              <h3 className="text-2xl font-semibold leading-8 text-white">
                Neon Nights is
                <br />
                92% sold out
              </h3>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-[2px]"
              >
                Boost Sales
              </button>
            </div>
          </article>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h2 className="text-xl font-bold leading-7 text-zinc-900">Current Portfolio</h2>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100" aria-label="List view">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full">
              <thead className="bg-gray-100/50">
                <tr>
                  <th className="px-8 py-7 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Event Name</th>
                  <th className="px-6 py-7 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Tickets Sold</th>
                  <th className="px-6 py-7 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Revenue</th>
                  <th className="px-6 py-7 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Date</th>
                  <th className="px-8 py-7 text-right text-xs font-bold uppercase tracking-wider text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {PORTFOLIO_ITEMS.map((item, index) => {
                  const percent = item.capacity === 0 ? 0 : Math.round((item.sold / item.capacity) * 100);
                  const rowMuted = item.tone === "completed";
                  return (
                    <tr key={item.name} className={`${index !== 0 ? "border-t border-gray-100" : ""}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 ${
                              rowMuted ? "opacity-60" : ""
                            }`}
                          >
                            <OrganizerDashboardIcon
                              type="events"
                              className={`h-5 w-5 ${rowMuted ? "text-gray-500" : "text-sky-700"}`}
                            />
                          </div>

                          <div>
                            <p className={`text-base font-bold ${rowMuted ? "text-gray-700" : "text-zinc-900"}`}>{item.name}</p>
                            <p className="mt-1 text-xs text-gray-700">{item.venue}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[item.status]}`}>
                          {item.status === "Live" ? <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600" /> : null}
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-6">
                        <div className="w-36 space-y-2">
                          <div className="flex items-start justify-between gap-2 text-sm">
                            <span className={`font-medium ${rowMuted ? "text-gray-700" : "text-zinc-900"}`}>
                              {item.sold.toLocaleString()} / {item.capacity.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-700">{percent}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full ${rowMuted ? "bg-gray-700" : "bg-gradient-to-r from-sky-700 to-violet-700"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className={`px-6 py-6 text-base font-semibold ${rowMuted ? "text-gray-700" : "text-zinc-900"}`}>{item.revenue}</td>

                      <td className={`px-6 py-6 text-sm ${rowMuted ? "text-gray-700" : "text-zinc-900"}`}>{item.date}</td>

                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <button type="button" className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100" aria-label="View">
                            <View className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/organizer/events/edit/${item.id}`}
                            className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button type="button" className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100" aria-label="More">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="inline-flex w-full items-center justify-between border-t border-gray-100 bg-gray-100/30 px-8 py-4">
            <p className="text-xs font-medium text-gray-700">Showing 4 of 24 events</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-center text-xs font-semibold text-gray-700 outline outline-1 outline-offset-[-1px] outline-slate-300"
              >
                Previous
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-center text-xs font-semibold text-gray-700 outline outline-1 outline-offset-[-1px] outline-slate-300"
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
