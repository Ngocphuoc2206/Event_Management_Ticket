import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CustomerDashboardIcon, CustomerDashboardSidebar, customerProfile } from "@/features/customer";
import type { CustomerNavItem } from "@/features/customer";

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
  { label: "Order History", href: "/customer/order-history", icon: "history" },
  { label: "Notifications", href: "/customer/notifications", icon: "bell" },
  { label: "Profile Settings", href: "/customer/profile-settings", icon: "settings" },
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

function getQrSrc(ticket: TicketRecord) {
  const payload = `EventHub|${ticket.code}|${ticket.title}|${ticket.date}|${ticket.time}|${ticket.type}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payload)}`;
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

function TicketCard({ ticket }: { ticket: TicketRecord }) {
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
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.26em] ${STATUS_STYLES[ticket.status]}`}
          >
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
          <div className="rounded-[22px] bg-slate-100 p-3 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)]">
            <Image src={getQrSrc(ticket)} alt={`QR for ${ticket.code}`} width={56} height={56} className="rounded-[10px]" />
          </div>
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
            navigationItems={customerTicketNavigationItems}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="text-xs font-medium text-slate-500">Dashboard &nbsp;&rsaquo;&nbsp; My Tickets</div>
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.34em] text-blue-600">Customer Area</div>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.8rem]">My Tickets</h1>
                <p className="mt-3 max-w-2xl text-lg text-slate-500">
                  View your active passes, event details, and saved QR codes in one place.
                </p>
              </div>
            </header>

            <section className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Upcoming Tickets</h2>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  {UPCOMING_TICKETS.length} active
                </span>
              </div>
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {UPCOMING_TICKETS.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </section>

            <section className="mt-12">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Past Tickets</h2>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  {PAST_TICKETS.length} archived
                </span>
              </div>
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {PAST_TICKETS.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
