/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CustomerDashboardIcon,
  CustomerDashboardSidebar,
  customerProfile,
  getCustomerNavigationItems,
} from "@/features/customer";
import type { CustomerTicketResponse } from "@/features/customer/tickets.service";
import { getMyTickets } from "@/features/customer/tickets.service";

type TicketStatus = "Active" | "Selling Fast" | "Live Now" | "Completed" | "Cancelled";

type TicketRecord = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  status: TicketStatus;
  code: string;
  qrCodeSrc: string;
  imageSrc: string;
  detailHref: string;
};

const STATUS_STYLES: Record<TicketStatus, string> = {
  Active: "bg-emerald-500 text-white",
  "Selling Fast": "bg-white text-violet-700",
  "Live Now": "bg-rose-500 text-white",
  Completed: "bg-slate-800/85 text-white",
  Cancelled: "bg-rose-100 text-rose-700",
};

function formatDate(value?: string) {
  if (!value) return "Pending schedule";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(date);
}

function formatTime(value?: string) {
  if (!value) return "Pending time";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    timeStyle: "short",
  }).format(date);
}

function getQrFallbackSrc(ticket: Pick<TicketRecord, "code" | "title" | "date" | "time" | "type">) {
  const payload = `EventHub|${ticket.code}|${ticket.title}|${ticket.date}|${ticket.time}|${ticket.type}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payload)}`;
}

function isAbsoluteUrl(value?: string) {
  if (!value) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveQrCodeSrc(
  ticket: CustomerTicketResponse,
  fallbackTicket: Pick<TicketRecord, "code" | "title" | "date" | "time" | "type">,
) {
  const directImageUrlCandidates = [
    ticket.qrPublicUrl,
    ticket.qrCodeUrl,
    ticket.qrImageUrl,
    ticket.publicUrl,
    ticket.imageUrl,
  ];

  const directImageUrl = directImageUrlCandidates.find((candidate) =>
    isAbsoluteUrl(candidate),
  );

  if (directImageUrl) {
    return directImageUrl;
  }

  if (ticket.qrCode?.trim()) {
    return isAbsoluteUrl(ticket.qrCode)
      ? ticket.qrCode
      : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ticket.qrCode)}`;
  }

  return getQrFallbackSrc(fallbackTicket);
}

function mapTicketStatus(status?: string, used?: boolean, group?: "upcoming" | "past"): TicketStatus {
  if (group === "past" || used) return "Completed";
  if (status === "USED" || status === "COMPLETED") return "Completed";
  if (status === "CANCELLED" || status === "EXPIRED") return "Cancelled";
  if (status === "LIVE") return "Live Now";
  if (status === "SELLING_FAST") return "Selling Fast";
  return "Active";
}

function mapTicket(ticket: CustomerTicketResponse, index: number, group?: "upcoming" | "past"): TicketRecord {
  const code = ticket.ticketCode || ticket.code || ticket.id;
  const title = ticket.eventName || ticket.eventTitle || "Purchased Ticket";
  const type = ticket.ticketTypeName || ticket.ticketCategory || ticket.ticketTypeId || "Ticket";
  const dateSource = ticket.eventStartTime || ticket.eventDate || ticket.startTime || ticket.issuedAt || ticket.createdAt;
  const mappedTicket = {
    id: ticket.id,
    title,
    category: ticket.ticketCategory || "Event Ticket",
    date: formatDate(dateSource),
    time: formatTime(ticket.eventStartTime || ticket.startTime || ticket.eventDate),
    venue: ticket.venueName || ticket.venue || [ticket.address, ticket.city].filter(Boolean).join(", ") || ticket.location || "Venue pending",
    type,
    status: mapTicketStatus(ticket.status, ticket.used, group),
    code,
    qrCodeSrc: "",
    imageSrc: index % 2 === 0 ? "/images/upc1.png" : "/images/upc2.png",
    detailHref: ticket.eventId ? `/event/${ticket.eventId}` : "/customer/events",
  };

  return {
    ...mappedTicket,
    qrCodeSrc: resolveQrCodeSrc(ticket, mappedTicket),
  };
}

function TicketInfoRow({
  icon,
  label,
  value,
}: {
  icon: "calendar" | "pin" | "ticket";
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="pt-0.5 text-blue-600">
        <CustomerDashboardIcon type={icon} className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</div>
        <div className="mt-1 text-sm font-semibold leading-5 text-slate-700">{value}</div>
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  onOpenQr,
}: {
  ticket: TicketRecord;
  onOpenQr: (ticket: TicketRecord) => void;
}) {
  const isPast = ticket.status === "Completed" || ticket.status === "Cancelled";

  return (
    <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_44px_rgba(148,163,184,0.16)] ring-1 ring-slate-100">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={ticket.imageSrc}
          alt={ticket.title}
          fill
          sizes="(min-width: 1280px) 26vw, (min-width: 768px) 38vw, 100vw"
          className={`object-cover ${isPast ? "grayscale-[0.2] opacity-80" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/10 to-transparent" />
        <div className="absolute right-4 top-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.26em] ${STATUS_STYLES[ticket.status]}`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600">{ticket.category}</div>
            <h2 className="mt-2 text-[1.5rem] font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-[1.7rem]">{ticket.title}</h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenQr(ticket)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-slate-100 p-2.5 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)] transition hover:scale-[1.03] hover:bg-blue-50"
            aria-label={`Open QR code for ${ticket.title}`}
            title="Open QR"
          >
            <img src={ticket.qrCodeSrc} alt={`QR for ${ticket.code}`} width={56} height={56} className="rounded-[10px]" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TicketInfoRow icon="calendar" label="Date" value={ticket.date} />
          <TicketInfoRow icon="calendar" label="Time" value={ticket.time} />
          <TicketInfoRow icon="pin" label="Venue" value={ticket.venue} />
          <TicketInfoRow icon="ticket" label="Type" value={ticket.type} />
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Ticket Code</div>
          <div className="mt-1 text-sm font-semibold tracking-[0.24em] text-slate-700">{ticket.code}</div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(76,92,193,0.24)] transition hover:translate-y-[-1px]"
          >
            <CustomerDashboardIcon type="download" className="h-4 w-4" />
            <span>Download Ticket</span>
          </button>
          <a
            href={ticket.detailHref}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
            aria-label={`View details for ${ticket.title}`}
            title="View details"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
              <path d="M7 12h10" strokeLinecap="round" />
              <path d="m13.5 8.5 3.5 3.5-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 6.5h5" strokeLinecap="round" />
              <path d="M7 17.5h5" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function CustomerMyTicketsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [upcomingTickets, setUpcomingTickets] = useState<TicketRecord[]>([]);
  const [pastTickets, setPastTickets] = useState<TicketRecord[]>([]);
  const [selectedQrTicket, setSelectedQrTicket] = useState<TicketRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const purchaseSuccess = router.query.purchase === "success";
  const purchasedEventName =
    typeof router.query.event === "string" ? router.query.event : "";
  const purchasedOrderId =
    typeof router.query.orderId === "string" ? router.query.orderId : "";

  useEffect(() => {
    let isMounted = true;

    const loadTickets = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [upcomingResponse, pastResponse] = await Promise.all([
          getMyTickets({ type: "upcoming" }),
          getMyTickets({ type: "past" }),
        ]);

        if (isMounted) {
          setUpcomingTickets(upcomingResponse.map((ticket, index) => mapTicket(ticket, index, "upcoming")));
          setPastTickets(pastResponse.map((ticket, index) => mapTicket(ticket, index, "past")));
        }
      } catch {
        if (isMounted) {
          setUpcomingTickets([]);
          setPastTickets([]);
          setErrorMessage("Could not load your tickets. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTickets();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  return (
    <>
      <Head>
        <title>My Tickets | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#eef2f8] text-slate-900">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          <CustomerDashboardSidebar
            navigationItems={getCustomerNavigationItems("/customer/my-tickets")}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="mx-auto w-full max-w-[1600px]">
            <div className="text-xs font-medium text-slate-500">Dashboard &nbsp;&rsaquo;&nbsp; My Tickets</div>
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.34em] text-blue-600">Customer Area</div>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My Tickets</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
                  View your active passes, event details, and saved QR codes in one place.
                </p>
              </div>
            </header>

            {purchaseSuccess ? (
              <div className="mt-6 rounded-[26px] border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 shadow-[0_18px_44px_rgba(148,163,184,0.12)]">
                Payment success{purchasedEventName ? ` for ${purchasedEventName}` : ""}.
                {purchasedOrderId
                  ? ` Order ${purchasedOrderId} was completed and your QR ticket should appear below.`
                  : ""}
              </div>
            ) : null}

            <section className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Upcoming Tickets</h2>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  {upcomingTickets.length} active
                </span>
              </div>
              {isLoading ? (
                <div className="mt-6 rounded-[26px] bg-white px-6 py-12 text-center text-sm font-bold uppercase tracking-[0.28em] text-slate-400 shadow-[0_18px_44px_rgba(148,163,184,0.16)]">
                  Loading tickets...
                </div>
              ) : (
                <>
                  {errorMessage ? (
                    <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
                      {errorMessage}
                    </div>
                  ) : null}
                  {upcomingTickets.length > 0 ? (
                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                      {upcomingTickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} onOpenQr={setSelectedQrTicket} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[26px] bg-white px-6 py-12 text-center text-sm font-semibold text-slate-500 shadow-[0_18px_44px_rgba(148,163,184,0.16)]">
                      No active tickets yet. Complete payment to generate your ticket QR code.
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="mt-12">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Past Tickets</h2>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  {pastTickets.length} archived
                </span>
              </div>
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {pastTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onOpenQr={setSelectedQrTicket} />
                ))}
              </div>
            </section>
            </div>
          </section>
        </div>
      </main>

      {selectedQrTicket ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-[2px]"
          onClick={() => setSelectedQrTicket(null)}
        >
          <div
            className="w-full max-w-md rounded-[34px] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
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
                aria-label="Close QR"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="3">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex w-fit rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <img
                  src={selectedQrTicket.qrCodeSrc}
                  alt={`Large QR for ${selectedQrTicket.code}`}
                  width={240}
                  height={240}
                  className="rounded-xl"
                />
              </div>
              <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Ticket Code
              </div>
              <div className="mt-1 text-lg font-black tracking-widest text-slate-900">
                {selectedQrTicket.code}
              </div>
              <p className="mt-4 inline-block rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
                Show this QR at the gate for scanning
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
