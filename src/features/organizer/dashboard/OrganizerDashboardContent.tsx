import Image from "next/image";
import { UserCircle2 } from "lucide-react";

import { OrganizerDashboardIcon } from "./OrganizerDashboardIcons";
import type { OrganizerOrderRow, OrganizerStatCard } from "../types";

type OrganizerDashboardContentProps = {
  statCards: OrganizerStatCard[];
  recentOrders: OrganizerOrderRow[];
};

const TICKET_SALES_BARS = [
  { height: "h-24", opacity: "opacity-20" },
  { height: "h-40", opacity: "opacity-40" },
  { height: "h-28", opacity: "opacity-30" },
  { height: "h-56", opacity: "opacity-70" },
  { height: "h-40", opacity: "opacity-50" },
  { height: "h-60", opacity: "opacity-90" },
  { height: "h-44", opacity: "opacity-60" },
  { height: "h-56", opacity: "opacity-80" },
] as const;

const MONTHLY_REVENUE_ITEMS = [
  { label: "Neon Nights Festival", value: "$18.4k", width: "w-[68%]", color: "bg-sky-700" },
  { label: "Tech Summit 2024", value: "$12.1k", width: "w-[52%]", color: "bg-violet-700" },
  { label: "Indie Film Expo", value: "$9.2k", width: "w-[36%]", color: "bg-rose-700" },
  { label: "Rooftop Yoga", value: "$5.5k", width: "w-[24%]", color: "bg-gray-700" },
] as const;

const ORDER_STATUS_STYLE: Record<OrganizerOrderRow["status"], { wrapper: string; dot: string; text: string }> = {
  Completed: {
    wrapper: "bg-green-100",
    dot: "bg-green-500",
    text: "text-green-700",
  },
  Pending: {
    wrapper: "bg-amber-100",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
};

const KPI_TONE_STYLE: Record<OrganizerStatCard["tone"], { iconBox: string; icon: string; badge: string }> = {
  sky: {
    iconBox: "bg-sky-700/10",
    icon: "text-sky-700",
    badge: "bg-sky-700/10 text-sky-700",
  },
  violet: {
    iconBox: "bg-violet-700/10",
    icon: "text-violet-700",
    badge: "bg-violet-700/10 text-violet-700",
  },
  rose: {
    iconBox: "bg-rose-700/10",
    icon: "text-rose-700",
    badge: "bg-rose-700/10 text-rose-700",
  },
  slate: {
    iconBox: "bg-gray-700/10",
    icon: "text-gray-700",
    badge: "bg-gray-700/10 text-gray-700",
  },
};

function StatCard({ card }: { card: OrganizerStatCard }) {
  const toneStyle = KPI_TONE_STYLE[card.tone];

  return (
    <article className="relative h-44 rounded-3xl bg-white p-[25px] outline outline-1 outline-slate-300/5 shadow-[0px_32px_64px_-12px_rgba(25,28,30,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneStyle.iconBox}`}>
          <OrganizerDashboardIcon type={card.icon} className={`h-[18px] w-[18px] ${toneStyle.icon}`} />
        </div>

        {card.showStackedDots ? (
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-sky-700 shadow-[0px_0px_0px_2px_rgba(247,249,251,1.00)]" />
            <div className="-ml-2 h-6 w-6 rounded-full bg-violet-700 shadow-[0px_0px_0px_2px_rgba(247,249,251,1.00)]" />
          </div>
        ) : card.badgeText ? (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-bold leading-4 ${toneStyle.badge} ${card.badgeMultiLine ? "whitespace-pre-line" : ""}`}
          >
            {card.badgeText}
          </span>
        ) : null}
      </div>

      <div className="mt-7">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-700">{card.label}</p>
        <p className="mt-1 text-3xl font-bold leading-9 text-zinc-900">{card.value}</p>
      </div>
    </article>
  );
}

export function OrganizerDashboardContent({ statCards, recentOrders }: OrganizerDashboardContentProps) {
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
          >
            <OrganizerDashboardIcon type="bell" className="h-[18px] w-[18px]" />
            <span className="absolute left-6 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100"
          >
            <OrganizerDashboardIcon type="settings" className="h-5 w-5" />
          </button>
          <div className="h-8 w-px bg-slate-300/30" />
          <p className="text-sm font-bold tracking-wider text-gray-700">ORGANIZER DASHBOARD</p>
        </div>
      </header>

      <div className="px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="inline-flex flex-col items-start gap-2">
            <h2 className="text-4xl font-bold leading-10 text-zinc-900">Moring, Giang Đẹp Zai Ahihi</h2>
            <p className="text-lg leading-7 text-gray-700">Here&apos;s what&apos;s happening with your events today.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-12 min-w-[176px] items-center justify-center rounded-2xl bg-purple-200 px-6 text-sm font-semibold leading-5 text-violet-950 transition hover:bg-purple-300"
            >
              View All Attendees
            </button>
            <button
              type="button"
              className="relative inline-flex h-12 min-w-[176px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 text-sm font-semibold leading-5 text-white shadow-[0px_32px_64px_-12px_rgba(25,28,30,0.06)] transition hover:brightness-105"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/60 text-xs leading-none">+</span>
              Create New Event
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <StatCard key={card.label} card={card} />
            ))}
          </div>
        </section>

        <section id="analytics" className="mt-12 grid gap-5 xl:grid-cols-[2fr_1fr]">
          <article className="relative rounded-3xl bg-white p-8 outline outline-1 outline-slate-300/5 shadow-[0px_32px_64px_-12px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold leading-7 text-zinc-900">Ticket Sales Trend</h3>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-2xl bg-gray-100 px-4 text-sm font-medium text-zinc-900"
              >
                <span>Last 30 Days</span>
                <OrganizerDashboardIcon type="more" className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="mt-10 flex h-60 items-end justify-between gap-2">
              {TICKET_SALES_BARS.map((bar, index) => (
                <div
                  key={`${bar.height}-${index}`}
                  className={`flex-1 rounded-t-2xl bg-gradient-to-b from-sky-700 to-violet-700 ${bar.height} ${bar.opacity}`}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 px-2 text-xs uppercase tracking-wider text-gray-700">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </article>

          <article className="relative rounded-3xl bg-white px-8 pb-10 pt-8 outline outline-1 outline-slate-300/5 shadow-[0px_32px_64px_-12px_rgba(25,28,30,0.06)]">
            <h3 className="text-xl font-bold leading-7 text-zinc-900">Monthly Revenue</h3>

            <div className="mt-10 space-y-6">
              {MONTHLY_REVENUE_ITEMS.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-zinc-900">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${item.width} ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="orders" className="mt-12 overflow-hidden rounded-3xl bg-white shadow-[0px_32px_64px_-12px_rgba(25,28,30,0.06)] outline outline-1 outline-slate-300/5">
          <div className="flex items-center justify-between border-b border-slate-300/10 p-8">
            <h3 className="text-xl font-bold leading-7 text-zinc-900">Recent Orders</h3>
            <button type="button" className="text-sm font-semibold leading-5 text-sky-700">
              View All Orders
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Customer</th>
                  <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Event Name</th>
                  <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Ticket Type</th>
                  <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Amount</th>
                  <th className="px-8 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => {
                  const statusStyle = ORDER_STATUS_STYLE[order.status];
                  return (
                    <tr key={`${order.customerEmail}-${index}`} className="border-t border-slate-300/10 first:border-t-0">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 overflow-hidden rounded-full">
                            {order.customerAvatar ? (
                              <Image
                                src={order.customerAvatar}
                                alt={`${order.customerName} avatar`}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                                <UserCircle2 className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold leading-5 text-zinc-900">{order.customerName}</p>
                            <p className="text-xs leading-4 text-gray-700">{order.customerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium leading-5 text-zinc-900">{order.eventName}</td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase leading-4 ${
                            order.ticketType === "VIP" ? "bg-purple-200 text-violet-950" : "bg-zinc-200 text-gray-700"
                          }`}
                        >
                          {order.ticketType}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold leading-5 text-zinc-900">{order.amount}</td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${statusStyle.wrapper}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                          <span className={`text-xs font-bold leading-4 ${statusStyle.text}`}>{order.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
