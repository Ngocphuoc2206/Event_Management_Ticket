import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CustomerDashboardIcon, CustomerDashboardSidebar, customerProfile, customerRecentOrders } from "@/features/customer";
import type { CustomerNavItem } from "@/features/customer";

type TicketTab = "upcoming" | "past";
type TicketStatus = "Selling Fast" | "Live Now" | "Completed" | "Cancelled";

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
  imageSrc: string;
  detailHref: string;
};

const customerTicketNavigationItems: CustomerNavItem[] = [
  { label: "Dashboard", href: "/customer", icon: "grid" },
  { label: "My Tickets", href: "/customer/my-tickets", icon: "ticket", active: true },
  { label: "Order History", href: "#orders", icon: "history" },
  { label: "Notifications", href: "#notifications", icon: "bell" },
  { label: "Settings", href: "#settings", icon: "settings" },
];

const UPCOMING_TICKETS: TicketRecord[] = [
  {
    id: "neon-pulse",
    title: "Neon Pulse Music Festival",
    category: "Concert & Live Music",
    date: "Oct 24, 2024",
    time: "08:00 PM",
    venue: "Grand Arena, LA",
    type: "VIP Pass",
    status: "Selling Fast",
    code: "EVH-NPF-8240",
    imageSrc: "/images/upc1.png",
    detailHref: "/event/neon-pulse",
  },
  {
    id: "global-tech",
    title: "Global Tech Summit 2024",
    category: "Technology & AI",
    date: "Nov 12, 2024",
    time: "09:00 AM",
    venue: "Convention Center",
    type: "Standard Admission",
    status: "Live Now",
    code: "EVH-GTS-0912",
    imageSrc: "/images/upc2.png",
    detailHref: "/event/global-tech",
  },
];

const PAST_TICKETS: TicketRecord[] = [
  {
    id: "design-forum",
    title: "Future Design Forum",
    category: "Design Conference",
    date: "Aug 02, 2024",
    time: "01:30 PM",
    venue: "Saigon Exhibition Hall",
    type: "Premium Seat",
    status: "Completed",
    code: "EVH-FDF-4401",
    imageSrc: "/images/upc2.png",
    detailHref: "/event/design-forum",
  },
  {
    id: "startup-night",
    title: "Startup Mixer Night",
    category: "Startup Networking",
    date: "Jul 10, 2024",
    time: "07:00 PM",
    venue: "Riverside Hub",
    type: "General Admission",
    status: "Cancelled",
    code: "EVH-SMN-1707",
    imageSrc: "/images/upc1.png",
    detailHref: "/event/startup-night",
  },
];

const STATUS_STYLES: Record<TicketStatus, string> = {
  "Selling Fast": "bg-white text-violet-700",
  "Live Now": "bg-rose-500 text-white",
  Completed: "bg-slate-800/85 text-white",
  Cancelled: "bg-rose-100 text-rose-700",
};

function parseCurrencyAmount(amount: string) {
  const normalizedAmount = Number.parseFloat(amount.replace(/[^0-9.]/g, ""));
  return Number.isFinite(normalizedAmount) ? normalizedAmount : 0;
}

function formatCurrencyAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getSavedValueClass(value: string) {
  if (value.length >= 12) {
    return "text-[2.7rem]";
  }

  if (value.length >= 10) {
    return "text-[3.2rem]";
  }

  if (value.length >= 8) {
    return "text-[3.7rem]";
  }

  return "text-[4.2rem]";
}

function getQrSrc(ticket: TicketRecord) {
  const payload = `EventHub|${ticket.code}|${ticket.title}|${ticket.date}|${ticket.time}|${ticket.type}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payload)}`;
}

function TicketMiniQr({
  ticket,
  onOpen,
}: {
  ticket: TicketRecord;
  onOpen: (ticket: TicketRecord) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(ticket)}
      className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-slate-100 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)] transition hover:scale-[1.03]"
      aria-label={`Open QR code for ${ticket.title}`}
      title="Open QR"
    >
      <Image src={getQrSrc(ticket)} alt={`QR for ${ticket.code}`} width={56} height={56} className="rounded-[10px]" />
    </button>
  );
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
    <article className="overflow-hidden rounded-[26px] bg-white shadow-[0_18px_44px_rgba(148,163,184,0.16)] ring-1 ring-slate-100">
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
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.26em] ${STATUS_STYLES[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600">{ticket.category}</div>
            <h2 className="mt-2 text-[2rem] font-bold leading-[1.05] tracking-tight text-slate-900">{ticket.title}</h2>
          </div>
          <TicketMiniQr ticket={ticket} onOpen={onOpenQr} />
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
          <Link
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
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function CustomerMyTicketsPage() {
  const [activeTab, setActiveTab] = useState<TicketTab>("upcoming");
  const [selectedQrTicket, setSelectedQrTicket] = useState<TicketRecord | null>(null);
  const { logout } = useAuth();
  const router = useRouter();
  const totalValueSaved = formatCurrencyAmount(
    customerRecentOrders
      .filter((order) => order.status === "Completed")
      .reduce((sum, order) => sum + parseCurrencyAmount(order.amount), 0),
  );

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

  const tickets = activeTab === "upcoming" ? UPCOMING_TICKETS : PAST_TICKETS;

  return (
    <>
      <Head>
        <title>My Tickets | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#eef2f8] text-slate-900">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          <CustomerDashboardSidebar
            navigationItems={customerTicketNavigationItems}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.7rem]">My Tickets</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Manage your active reservations and view details for upcoming and past event experiences.
                </p>
              </div>

              <div className="inline-flex rounded-full bg-slate-200/70 p-1 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)]">
                <button
                  type="button"
                  onClick={() => setActiveTab("upcoming")}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                    activeTab === "upcoming" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("past")}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                    activeTab === "past" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Past Events
                </button>
              </div>
            </header>

            <section className="mt-8 grid gap-5 xl:grid-cols-2">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onOpenQr={setSelectedQrTicket} />
              ))}
            </section>

            <section className="mt-9 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
              <article className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-blue-700 to-violet-600 px-7 py-7 text-white shadow-[0_20px_44px_rgba(76,92,193,0.24)]">
                <div className="absolute right-6 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full border-4 border-slate-900/15 xl:block" />
                <div className="absolute right-14 top-1/2 hidden h-14 w-14 -translate-y-1/2 text-slate-900/15 xl:block">
                  <svg viewBox="0 0 24 24" className="h-full w-full fill-current">
                    <path d="m12 2.75 2.5 5.08 5.6.82-4.05 3.95.96 5.58L12 15.55 7 18.18l.96-5.58L3.9 8.65l5.6-.82L12 2.75Z" />
                  </svg>
                </div>
                <h2 className="text-[2rem] font-bold tracking-tight">Upgrade to Diamond Access?</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/80">
                  Experience your upcoming festivals with backstage access, private lounge, and fast-track entry.
                </p>
                <button
                  type="button"
                  className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-100"
                >
                  Check Eligibility
                </button>
              </article>

              <article className="rounded-[24px] bg-slate-100/80 px-8 py-8 shadow-[0_16px_38px_rgba(148,163,184,0.14)] ring-1 ring-slate-200/70">
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Total Value Saved</div>
                <div
                  className={`mt-5 whitespace-nowrap font-bold leading-none tracking-[-0.06em] tabular-nums text-slate-900 ${getSavedValueClass(totalValueSaved)}`}
                >
                  {totalValueSaved}
                </div>
                <Link href="/customer" className="mt-5 inline-flex items-center text-base font-semibold text-blue-700 hover:text-blue-800">
                  Loyalty Program
                  <span className="ml-2">-&gt;</span>
                </Link>
              </article>
            </section>

            <footer className="flex flex-col gap-4 py-10 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-6">
                <Link href="/help" className="hover:text-slate-600">Help Center</Link>
                <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
              </div>
              <div className="flex items-center gap-2">
                <span>Secured by EventHub Shield</span>
                <span className="text-blue-600">◔</span>
              </div>
            </footer>
          </section>
        </div>

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
                  <p className="mt-2 text-sm text-slate-500">{selectedQrTicket.date} • {selectedQrTicket.time}</p>
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
                    src={getQrSrc(selectedQrTicket)}
                    alt={`Large QR for ${selectedQrTicket.code}`}
                    width={240}
                    height={240}
                    className="rounded-[18px]"
                  />
                </div>
                <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Ticket Code</div>
                <div className="mt-2 text-sm font-semibold tracking-[0.24em] text-slate-700">{selectedQrTicket.code}</div>
                <p className="mt-3 text-xs text-slate-500">Show this QR at the gate for scanning.</p>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
