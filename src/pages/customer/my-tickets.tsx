import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { CalendarCheck2, CalendarDays, ChevronRight, Clock3, Download, MapPin, QrCode, ShieldCheck, Ticket, X, Zap } from "lucide-react";

import { CustomerDashboardSidebar, customerNavigationItems, customerProfile } from "@/features/customer";

const EVENT_TABS = ["upcoming", "past"] as const;

type EventTab = (typeof EVENT_TABS)[number];

type TicketItem = {
  id: string;
  category: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  banner: string;
  qr: string;
  badgeLabel: string;
  badgeStyle: "fast" | "live" | "ended";
};

const UPCOMING_TICKETS: TicketItem[] = [
  {
    id: "npmf-1024",
    category: "Concert & Live Music",
    title: "Neon Pulse Music Festival",
    date: "Oct 24, 2024",
    time: "08:00 PM",
    venue: "Grand Arena, LA",
    type: "VIP Pass",
    banner: "https://placehold.co/1200x620/4f46e5/f8fafc.png",
    qr: "https://placehold.co/260x260/f8fafc/111827.png",
    badgeLabel: "Selling Fast",
    badgeStyle: "fast",
  },
  {
    id: "gts-2048",
    category: "Technology & AI",
    title: "Global Tech Summit 2024",
    date: "Nov 12, 2024",
    time: "09:00 AM",
    venue: "Convention Center",
    type: "Standard Admission",
    banner: "https://placehold.co/1200x620/0369a1/f8fafc.png",
    qr: "https://placehold.co/260x260/f8fafc/111827.png",
    badgeLabel: "Live Now",
    badgeStyle: "live",
  },
];

const PAST_TICKETS: TicketItem[] = [
  {
    id: "simf-3377",
    category: "Indie & Outdoor",
    title: "Summer Indie Music Fest",
    date: "Aug 08, 2024",
    time: "06:30 PM",
    venue: "Riverfront Park",
    type: "General Admission",
    banner: "https://placehold.co/1200x620/334155/ffffff.png",
    qr: "https://placehold.co/260x260/e2e8f0/334155.png",
    badgeLabel: "Event Ended",
    badgeStyle: "ended",
  },
  {
    id: "dtm-5588",
    category: "Design Community",
    title: "Designers Meetup Tokyo",
    date: "Jul 19, 2024",
    time: "10:00 AM",
    venue: "Creative Hub",
    type: "Workshop Pass",
    banner: "https://placehold.co/1200x620/1d4ed8/ffffff.png",
    qr: "https://placehold.co/260x260/e2e8f0/334155.png",
    badgeLabel: "Event Ended",
    badgeStyle: "ended",
  },
];

function EventBadge({ label, style }: { label: string; style: TicketItem["badgeStyle"] }) {
  if (style === "live") {
    return (
      <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-rose-700 px-4 py-1.5">
        <span className="h-2 w-2 rounded-full bg-white" />
        <span className="text-xs font-bold uppercase tracking-wider text-white">{label}</span>
      </div>
    );
  }

  if (style === "ended") {
    return (
      <div className="absolute right-4 top-4 rounded-full bg-slate-700 px-4 py-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-white">{label}</span>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-4 rounded-full bg-purple-200 px-4 py-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-violet-950">{label}</span>
    </div>
  );
}

export default function CustomerMyTicketsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [qrPreviewTicketId, setQrPreviewTicketId] = useState<string | null>(null);
  const navigationItems = customerNavigationItems.map((item) => ({
    ...item,
    active: item.href === "/customer/my-tickets",
  }));
  const currentTickets = activeTab === "upcoming" ? UPCOMING_TICKETS : PAST_TICKETS;
  const qrPreviewTicket = currentTickets.find((item) => item.id === qrPreviewTicketId) ?? null;

  return (
    <>
      <Head>
        <title>My Tickets | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#eef2f8] text-slate-900">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          <CustomerDashboardSidebar
            navigationItems={navigationItems}
            profile={customerProfile}
            onLogout={() => void router.push("/auth/login")}
          />

          <section className="flex-1 px-6 py-10 md:px-10 xl:px-12">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="inline-flex flex-col items-start gap-4">
                <h2 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl xl:text-[44px] xl:leading-[48px]">
                  My Tickets
                </h2>
                <p className="max-w-xl text-sm leading-6 text-gray-700 sm:text-base">
                  Manage your active reservations and view details for upcoming and past event experiences.
                </p>
              </div>

              <div className="inline-flex w-full items-center rounded-full bg-gray-200 p-1 sm:w-auto">
                {EVENT_TABS.map((tab) => {
                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        setQrPreviewTicketId(null);
                      }}
                      className={`rounded-full px-6 py-2.5 text-base leading-6 transition md:px-8 ${
                        isActive
                          ? "bg-white font-semibold text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                          : "font-medium text-gray-700"
                      }`}
                    >
                      {tab === "upcoming" ? "Upcoming Events" : "Past Events"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {currentTickets.map((ticketItem) => (
                  <article
                    key={ticketItem.id}
                    className="overflow-hidden rounded-3xl bg-white outline outline-1 outline-slate-300/10"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={ticketItem.banner}
                        alt={`${ticketItem.title} banner`}
                        fill
                        sizes="(max-width: 1280px) 100vw, 434px"
                        unoptimized
                        className="object-cover"
                      />
                      <EventBadge label={ticketItem.badgeLabel} style={ticketItem.badgeStyle} />
                    </div>

                    <div className="flex flex-col gap-8 p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{ticketItem.category}</p>
                          <h3 className="text-3xl font-bold leading-9 text-zinc-900">{ticketItem.title}</h3>
                        </div>

                          <button
                            type="button"
                            onClick={() => setQrPreviewTicketId(ticketItem.id)}
                            className="rounded-2xl bg-gray-100 p-3 text-slate-700 transition hover:bg-slate-200"
                            aria-label={`Open QR for ${ticketItem.title}`}
                          >
                            <QrCode className="h-12 w-10" />
                          </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="inline-flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-sky-700" />
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-700">Date</p>
                            <p className="text-base font-semibold text-zinc-900">{ticketItem.date}</p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-3">
                          <Clock3 className="h-5 w-5 text-sky-700" />
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-700">Time</p>
                            <p className="text-base font-semibold text-zinc-900">{ticketItem.time}</p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-sky-700" />
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-700">Venue</p>
                            <p className="text-base font-semibold text-zinc-900">{ticketItem.venue}</p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-3">
                          <Ticket className="h-5 w-5 text-sky-700" />
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-700">Type</p>
                            <p className="text-base font-semibold text-zinc-900">{ticketItem.type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 py-4 text-base font-bold text-white"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Ticket</span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 text-gray-700"
                          aria-label="View event schedule"
                        >
                          <CalendarCheck2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {qrPreviewTicket ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4">
                  <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">QR Preview</p>
                        <h5 className="text-lg font-bold text-zinc-900">{qrPreviewTicket.title}</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQrPreviewTicketId(null)}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        aria-label="Close QR preview"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <Image
                        src={qrPreviewTicket.qr}
                        alt={`${qrPreviewTicket.title} QR code`}
                        width={260}
                        height={260}
                        unoptimized
                        className="h-auto w-full rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <section className="grid grid-cols-1 gap-4 pt-2 xl:grid-cols-3 xl:items-stretch">
                <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-violet-700 p-10 xl:col-span-2">
                  <div className="pointer-events-none absolute -right-8 top-6 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                  <Zap className="absolute right-8 top-8 h-16 w-16 text-white/20" />

                  <div className="relative z-10">
                    <h4 className="text-3xl font-bold leading-9 text-white">Upgrade to Diamond Access?</h4>
                    <p className="mt-2 max-w-96 pb-4 text-base leading-6 text-white/80">
                      Experience your upcoming festivals with
                      <br className="hidden sm:block" />
                      backstage access, private lounge, and fast-track
                      <br className="hidden sm:block" />
                      entry.
                    </p>
                    <button
                      type="button"
                      className="mt-6 rounded-2xl bg-white px-8 py-3 text-base font-bold text-sky-700"
                    >
                      Check Eligibility
                    </button>
                  </div>
                </article>

                <article className="rounded-3xl bg-gray-100 p-10 outline outline-1 outline-slate-300/10">
                  <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-700">Total Value Saved</p>
                    <p className="text-5xl font-black leading-[48px] text-zinc-900">$240.50</p>
                  </div>
                  <button
                    type="button"
                    className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-sky-700"
                  >
                    <span>Loyalty Program</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </article>
              </section>
            </div>

            <footer className="mt-10 flex flex-col gap-6 border-t border-slate-300/20 pt-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                <Link href="#help" className="text-base font-normal leading-6 text-gray-700 hover:text-zinc-900">
                  Help Center
                </Link>
                <Link href="#terms" className="text-base font-normal leading-6 text-gray-700 hover:text-zinc-900">
                  Terms of Service
                </Link>
                <Link href="#privacy" className="text-base font-normal leading-6 text-gray-700 hover:text-zinc-900">
                  Privacy Policy
                </Link>
              </div>

              <div className="inline-flex items-center gap-2">
                <p className="text-base font-normal leading-6 text-gray-700">
                  Secured by <span className="font-bold">EventHub Shield</span>
                </p>
                <ShieldCheck className="h-5 w-4 text-sky-700" />
              </div>
            </footer>
          </section>
        </div>
      </main>
    </>
  );
}
