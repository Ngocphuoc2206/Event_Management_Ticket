/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CustomerDashboardIcon } from "./CustomerDashboardIcons";
import type {
  CustomerOrderRow,
  CustomerOrderStatus,
  CustomerStatCard,
  CustomerTicketCard,
} from "../types";

const ORDER_TABLE_HEADINGS = [
  "Order ID",
  "Event",
  "Date",
  "Amount",
  "Status",
] as const;
const STATUS_STYLES: Record<CustomerOrderStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-600 border-none",
  Pending: "bg-amber-50 text-amber-600 border-none",
};
const STATUS_DOT_STYLES: Record<CustomerOrderStatus, string> = {
  Completed: "bg-emerald-500",
  Pending: "bg-amber-500",
};

function StatIcon({ icon, accent }: Pick<CustomerStatCard, "icon" | "accent">) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ${accent} group-hover:scale-110 transition-transform`}
    >
      <CustomerDashboardIcon type={icon} className="h-6 w-6" />
    </div>
  );
}

function TicketArtwork({
  palette,
  artTitle,
  imageSrc,
  status,
  title,
}: Pick<
  CustomerTicketCard,
  "palette" | "artTitle" | "imageSrc" | "status" | "title"
>) {
  return (
    <div
      className={`relative h-full min-h-[160px] overflow-hidden bg-gradient-to-br ${palette}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.45),_transparent_30%)]" />
      <div className="absolute left-4 top-4 z-10">
        <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
          {status}
        </span>
      </div>

      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 20vw, 100vw"
        />
      ) : null}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        {!imageSrc ? (
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500/80">
            {artTitle}
          </div>
        ) : null}
        {!imageSrc ? (
          <div className="mt-4 h-14 w-14 rounded-2xl border border-white/80 bg-white/80 shadow-[0_18px_30px_rgba(255,255,255,0.22)]" />
        ) : null}
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: CustomerOrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] uppercase font-black tracking-wider ${STATUS_STYLES[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_STYLES[status]}`}
      />
      {status}
    </span>
  );
}

function getTicketQrSrc(
  ticket: Pick<CustomerTicketCard, "ticketCode" | "title" | "date" | "venue">,
) {
  const payload = `EventHub|${ticket.ticketCode}|${ticket.title}|${ticket.date}|${ticket.venue}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payload)}`;
}

function TicketQr({ ticket }: { ticket: CustomerTicketCard }) {
  return (
    <button
      type="button"
      className="flex h-11 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:scale-[1.03] hover:border-blue-200"
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
  const [selectedQrTicket, setSelectedQrTicket] =
    useState<CustomerTicketCard | null>(null);

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
      {/* SỬA TẠI ĐÂY: Đổi bg-slate-50/30 thành bg-transparent để lộ màu #FDFDFF của layout */}
      <div className="flex-1 flex flex-col min-h-screen bg-transparent">
        {/* HEADER - Sticky tách biệt hoàn toàn khỏi scroll content */}
        <header className="sticky top-0 z-30 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-5 py-4 sm:px-8 lg:px-10 xl:px-12 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-400 font-medium -mt-0.5">
              Monitoring your personal activities
            </p>
          </div>

          <div className="flex items-center gap-5 self-end sm:self-auto">
            {/* 1. Thanh tìm kiếm (Search Bar) */}
            <div className="relative hidden lg:block">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Global search..."
                className="pl-11 pr-4 py-2.5 bg-slate-100/50 rounded-full text-sm focus:outline-none focus:ring-2 ring-blue-500/10 w-80 transition-all border border-transparent focus:bg-white focus:border-blue-100 font-semibold placeholder:font-normal"
              />
            </div>

            {/* 2. Nút Chuông Thông báo */}
            <div className="flex items-center gap-3 border-r border-slate-100 pr-5">
              <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
            </div>

            {/* 3. Khu vực Profile User */}
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=eef2ff&color=4f46e5`}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">
                  {customerName}
                </p>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight mt-1">
                  Pro Member
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT - Vùng Scroll chính */}
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
          {/* WELCOME SECTION */}
          <section className="mb-10">
            <div className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-2">
              Overview
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {customerName}!
            </h1>
            <p className="mt-2 max-w-2xl text-base font-medium text-slate-500">
              You have 2 events coming up this week. Get ready!
            </p>

            {/* STAT CARDS */}
            <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-[32px] border border-slate-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <StatIcon icon={card.icon} accent={card.accent} />
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      {card.label}
                    </div>
                  </div>
                  <div className="mt-2 text-3xl font-black text-slate-900">
                    {card.value}
                  </div>
                  <div className="mt-2 text-xs font-bold text-slate-400">
                    {card.note}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* UPCOMING TICKETS */}
          <section id="tickets" className="mt-12">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Upcoming Tickets
              </h2>
              <Link
                href="/customer/my-tickets"
                className="bg-slate-50 text-indigo-600 px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors border border-indigo-50"
              >
                View All
              </Link>
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
              {upcomingTickets.map((ticket) => (
                <article
                  key={ticket.title}
                  className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm sm:grid sm:grid-cols-[0.92fr_1.18fr] transition-all hover:-translate-y-1 hover:shadow-xl group"
                >
                  <TicketArtwork
                    palette={ticket.palette}
                    artTitle={ticket.artTitle}
                    imageSrc={ticket.imageSrc}
                    status={ticket.status}
                    title={ticket.title}
                  />

                  <div className="flex flex-col p-8">
                    <h3 className="text-xl font-black leading-tight tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {ticket.title}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                          <CustomerDashboardIcon
                            type="calendar"
                            className="h-4 w-4"
                          />
                        </div>
                        <span className="font-bold text-slate-600">
                          {ticket.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                          <CustomerDashboardIcon
                            type="pin"
                            className="h-4 w-4"
                          />
                        </div>
                        <span className="font-bold text-slate-600">
                          {ticket.venue}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                      <div onClick={() => setSelectedQrTicket(ticket)}>
                        <TicketQr ticket={ticket} />
                      </div>
                      <Link
                        href="/customer/my-tickets"
                        className="inline-flex items-center gap-2 rounded-2xl bg-indigo-900 px-6 py-3 text-sm font-black text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-800 hover:-translate-y-0.5 active:scale-95"
                      >
                        <CustomerDashboardIcon
                          type="download"
                          className="h-4 w-4"
                        />
                        <span>Download</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RECENT ORDERS */}
          <section id="orders" className="mt-12">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-black tracking-tight text-slate-900 mb-8">
                Recent Orders
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                      {ORDER_TABLE_HEADINGS.map((heading) => (
                        <th key={heading} className="pb-5">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="group hover:bg-slate-50/50 transition-all"
                      >
                        <td className="py-5 pr-4 text-sm font-bold text-indigo-600">
                          {order.id}
                        </td>
                        <td className="py-5 pr-4 text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {order.event}
                        </td>
                        <td className="py-5 pr-4 text-[11px] font-bold text-slate-400">
                          {order.date}
                        </td>
                        <td className="py-5 pr-4 text-sm font-black text-slate-900">
                          {order.amount}
                        </td>
                        <td className="py-5">
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <footer className="py-10 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-6">
            Copyright 2026 EventHub Ticketing Platform | All rights reserved
          </footer>
        </main>
      </div>

      {/* QR MODAL */}
      {selectedQrTicket ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm transition-all"
          onClick={() => setSelectedQrTicket(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  Scan Ticket QR
                </div>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                  {selectedQrTicket.title}
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-400">
                  {selectedQrTicket.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQrTicket(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current"
                  strokeWidth="3"
                >
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex w-fit rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                <Image
                  src={getTicketQrSrc(selectedQrTicket)}
                  alt={`Large QR for ${selectedQrTicket.ticketCode}`}
                  width={240}
                  height={240}
                  className="rounded-xl"
                />
              </div>
              <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Ticket Code
              </div>
              <div className="mt-1 text-lg font-black tracking-widest text-slate-900">
                {selectedQrTicket.ticketCode}
              </div>
              <p className="mt-4 text-xs font-bold text-slate-500 bg-white py-2 px-4 rounded-full inline-block border border-slate-100 shadow-sm">
                Show this QR at the gate for scanning
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
