import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CustomerDashboardIcon } from "./CustomerDashboardIcons";
import type { CustomerOrderRow, CustomerOrderStatus, CustomerStatCard, CustomerTicketCard } from "../types";

const HEADER_ACTION_ICONS = ["search", "profile"] as const;
const ORDER_TABLE_HEADINGS = ["Order ID", "Event", "Date", "Amount", "Status"] as const;
const STATUS_STYLES: Record<CustomerOrderStatus, string> = {
  Completed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-slate-200 text-slate-600",
};
const STATUS_DOT_STYLES: Record<CustomerOrderStatus, string> = {
  Completed: "bg-emerald-500",
  Pending: "bg-slate-400",
};

function StatIcon({ icon, accent }: Pick<CustomerStatCard, "icon" | "accent">) {
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 ${accent}`}>
      <CustomerDashboardIcon type={icon} className="h-[18px] w-[18px]" />
    </div>
  );
}

function TicketArtwork({
  palette,
  artTitle,
  imageSrc,
  status,
  title,
}: Pick<CustomerTicketCard, "palette" | "artTitle" | "imageSrc" | "status" | "title">) {
  return (
    <div className={`relative h-full min-h-[160px] overflow-hidden bg-gradient-to-br ${palette}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.45),_transparent_30%)]" />
      <div className="absolute left-3 top-3 z-10">
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.26em] text-blue-600">
          {status}
        </span>
      </div>

      {imageSrc ? (
        <Image src={imageSrc} alt={title} fill className="object-cover" sizes="(min-width: 1280px) 20vw, 100vw" />
      ) : null}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        {!imageSrc ? <div className="text-[11px] uppercase tracking-[0.48em] text-slate-500/80">{artTitle}</div> : null}
        {!imageSrc ? (
          <div className="mt-4 h-14 w-14 rounded-2xl border border-white/80 bg-white/80 shadow-[0_18px_30px_rgba(255,255,255,0.22)]" />
        ) : null}
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: CustomerOrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      <span className={`h-2 w-2 rounded-full ${STATUS_DOT_STYLES[status]}`} />
      {status}
    </span>
  );
}

function getTicketQrSrc(ticket: Pick<CustomerTicketCard, "ticketCode" | "title" | "date" | "venue">) {
  const payload = `EventHub|${ticket.ticketCode}|${ticket.title}|${ticket.date}|${ticket.venue}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payload)}`;
}

function TicketQr({ ticket }: { ticket: CustomerTicketCard }) {
  return (
    <button
      type="button"
      className="flex h-11 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition hover:scale-[1.03]"
      aria-label={`Open QR code for ${ticket.title}`}
      title="Open QR"
    >
      <Image
        src={getTicketQrSrc(ticket)}
        alt={`QR for ${ticket.ticketCode}`}
        width={28}
        height={28}
        className="rounded-[4px]"
      />
    </button>
  );
}

type CustomerDashboardContentProps = {
  customerName: string;
  statCards: CustomerStatCard[];
  upcomingTickets: CustomerTicketCard[];
  recentOrders: CustomerOrderRow[];
};

export function CustomerDashboardContent({
  customerName,
  statCards,
  upcomingTickets,
  recentOrders,
}: CustomerDashboardContentProps) {
  const [selectedQrTicket, setSelectedQrTicket] = useState<CustomerTicketCard | null>(null);

  useEffect(() => {
    if (!selectedQrTicket) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedQrTicket(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedQrTicket]);

  return (
    <>
      <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-2xl font-semibold tracking-tight">Dashboard</div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {HEADER_ACTION_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-600 shadow-[0_8px_20px_rgba(148,163,184,0.12)] transition hover:text-slate-900"
            >
              <CustomerDashboardIcon type={icon} className="h-[18px] w-[18px]" />
            </button>
          ))}
        </div>
        </header>

        <section className="mt-10">
        <div className="text-xs font-bold uppercase tracking-[0.34em] text-blue-600">Overview</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.8rem]">
          Welcome back, {customerName}!
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-500">You have 2 events coming up this week. Get ready!</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[24px] border border-white/90 bg-white/92 p-5 shadow-[0_20px_50px_rgba(148,163,184,0.14)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{card.label}</div>
                <StatIcon icon={card.icon} accent={card.accent} />
              </div>
              <div className={`mt-6 text-[2rem] font-bold leading-none ${card.accent}`}>{card.value}</div>
              <div className="mt-2 text-sm text-slate-500">{card.note}</div>
            </article>
          ))}
        </div>
        </section>

        <section id="tickets" className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Upcoming Tickets</h2>
          <Link href="/customer/my-tickets" className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
            View All -&gt;
          </Link>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {upcomingTickets.map((ticket) => (
            <article
              key={ticket.title}
              className="overflow-hidden rounded-[24px] border border-white/90 bg-white/95 shadow-[0_24px_60px_rgba(148,163,184,0.16)] sm:grid sm:grid-cols-[0.92fr_1.18fr]"
            >
              <TicketArtwork
                palette={ticket.palette}
                artTitle={ticket.artTitle}
                imageSrc={ticket.imageSrc}
                status={ticket.status}
                title={ticket.title}
              />

              <div className="flex flex-col p-5">
                <h3 className="text-[1.8rem] font-bold leading-tight tracking-tight text-slate-900">{ticket.title}</h3>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <CustomerDashboardIcon type="calendar" className="h-4 w-4" />
                    <span>{ticket.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CustomerDashboardIcon type="pin" className="h-4 w-4" />
                    <span>{ticket.venue}</span>
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                  <div onClick={() => setSelectedQrTicket(ticket)}>
                    <TicketQr ticket={ticket} />
                  </div>
                  <Link
                    href="/customer/my-tickets"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(76,92,193,0.28)] transition hover:translate-y-[-1px]"
                  >
                    <CustomerDashboardIcon type="download" className="h-4 w-4" />
                    <span>Download Ticket</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        </section>

        <section id="orders" className="mt-12">
        <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Recent Orders</h2>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-white/90 bg-white/92 shadow-[0_24px_60px_rgba(148,163,184,0.16)]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {ORDER_TABLE_HEADINGS.map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-5 text-sm font-semibold text-blue-600">{order.id}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-800">{order.event}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{order.date}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-800">{order.amount}</td>
                    <td className="px-6 py-5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </section>

        <footer className="py-10 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
          Copyright 2024 EventHub Ticketing Platform | All rights reserved
        </footer>
      </section>

      {selectedQrTicket ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-[2px]"
          onClick={() => setSelectedQrTicket(null)}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600">
                  Scan Ticket QR
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{selectedQrTicket.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{selectedQrTicket.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQrTicket(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:text-slate-900"
                aria-label="Close QR preview"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-6 rounded-[26px] bg-slate-50 p-5 text-center">
              <div className="mx-auto flex w-fit rounded-[24px] bg-white p-4 shadow-[0_16px_38px_rgba(148,163,184,0.2)]">
                <Image
                  src={getTicketQrSrc(selectedQrTicket)}
                  alt={`Large QR for ${selectedQrTicket.ticketCode}`}
                  width={240}
                  height={240}
                  className="rounded-[18px]"
                />
              </div>
              <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Ticket Code</div>
              <div className="mt-2 text-sm font-semibold tracking-[0.24em] text-slate-700">{selectedQrTicket.ticketCode}</div>
              <p className="mt-3 text-xs text-slate-500">Show this QR at the gate for scanning.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

