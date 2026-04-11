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
    imageSrc: "/images/upc1.png", // Thay bằng đường dẫn ảnh thực tế của bạn
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
    imageSrc: "/images/upc2.png", // Thay bằng đường dẫn ảnh thực tế của bạn
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

function TicketInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-1.5 text-sm font-semibold leading-5 text-slate-700">{value}</div>
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
            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${STATUS_STYLES[ticket.status]}`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600">{ticket.category}</div>
            {/* ĐÃ FIX: Giảm size chữ xuống 24px (text-2xl) để nhỏ hơn Header "My Tickets" */}
            <h2 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-slate-900">{ticket.title}</h2>
          </div>
          <div className="rounded-[18px] bg-slate-50 p-2.5 ring-1 ring-slate-100">
            <Image src={getQrSrc(ticket)} alt={`QR for ${ticket.code}`} width={64} height={64} className="rounded-xl mix-blend-multiply" />
          </div>
        </div>

        <div className="mt-6 grid gap-y-5 gap-x-4 sm:grid-cols-2">
          <TicketInfoRow label="Date" value={ticket.date} />
          <TicketInfoRow label="Time" value={ticket.time} />
          <TicketInfoRow label="Venue" value={ticket.venue} />
          <TicketInfoRow label="Type" value={ticket.type} />
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-3.5 ring-1 ring-slate-100/60">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Ticket Code</div>
          <div className="mt-1 text-sm font-semibold tracking-[0.3em] text-slate-800">{ticket.code}</div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#5238FF] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download Ticket</span>
          </button>
          <a
            href={ticket.detailHref}
            className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
            aria-label={`View details for ${ticket.title}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
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

      <main className="min-h-screen w-full bg-[#FDFDFF] text-slate-900 font-sans">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          {/* SIDEBAR */}
          <CustomerDashboardSidebar
            navigationItems={customerTicketNavigationItems}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <div className="flex flex-1 flex-col">
            {/* TOP NAVIGATION BAR */}
            <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-8">
              <div className="text-[13px] font-medium text-slate-400">Platform management system v2.0</div>
              
              <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-slate-50/80 px-4 py-2.5 border border-slate-100 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Global search..."
                  className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <button className="relative text-slate-400 hover:text-blue-600 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="absolute right-[2px] top-[2px] block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
                </button>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200">
                    <Image
                      src={customerProfile.avatar || "/images/avatar-placeholder.png"}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-slate-900 leading-none">{customerProfile.name || "Alex Phước"}</span>
                    <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">PRO MEMBER</span>
                  </div>
                </div>
              </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <section className="flex-1 p-8">
              <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
                
                {/* PAGE HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">My Tickets</h1>
                    <p className="text-[15px] text-slate-400 font-medium mt-1.5">
                      Reviewing {UPCOMING_TICKETS.length + PAST_TICKETS.length} registered event passes
                    </p>
                  </div>
                </div>

                {/* UPCOMING TICKETS */}
                <section>
                  <div className="flex items-center justify-between gap-4 mb-5 mt-2">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Upcoming Tickets</h2>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-slate-500 border border-slate-200 shadow-sm uppercase">
                      {UPCOMING_TICKETS.length} Active
                    </span>
                  </div>
                  <div className="grid gap-7 xl:grid-cols-2">
                    {UPCOMING_TICKETS.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </section>

                {/* PAST TICKETS */}
                <section className="mt-4">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Past Tickets</h2>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-slate-500 border border-slate-200 shadow-sm uppercase">
                      {PAST_TICKETS.length} Archived
                    </span>
                  </div>
                  <div className="grid gap-7 xl:grid-cols-2">
                    {PAST_TICKETS.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </section>

              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}