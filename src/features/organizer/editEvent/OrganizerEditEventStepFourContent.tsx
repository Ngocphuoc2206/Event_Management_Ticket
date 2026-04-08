import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Sparkles,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "event";
  }

  return eventId ?? "event";
}

type TicketCard = {
  name: string;
  detail: string;
  price: string;
  remaining: string;
  badge?: string;
  badgeTone?: "violet" | "rose";
  muted?: boolean;
};

const TICKET_CARDS: TicketCard[] = [
  {
    name: "VIP Experience",
    detail: "Full access + backstage lounge\n& hospitality",
    price: "$450.00",
    remaining: "124 / 200 Remaining",
    badge: "Selling Fast",
    badgeTone: "violet",
  },
  {
    name: "Standard Pass",
    detail: "General admission to all\nstages for 3 days",
    price: "$199.00",
    remaining: "842 / 1,500 Remaining",
  },
  {
    name: "Early Bird",
    detail: "Limited discounted passes for\nfirst 500 fans",
    price: "$149.00",
    remaining: "0 / 500 Remaining",
    badge: "Sold Out",
    badgeTone: "rose",
    muted: true,
  },
];

export function OrganizerEditEventStepFourContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <p className="text-2xl font-black leading-8 text-sky-700">Kinetic Gallery</p>
          <div className="h-6 w-px bg-slate-300/30" />
          <p className="text-base font-medium text-gray-700">Prism Flow Music Festival 2024</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden items-center rounded-full bg-gray-100 px-4 py-2 sm:flex">
            <Search className="h-4 w-4 text-gray-700" />
            <span className="px-3 text-sm text-gray-500">Search events...</span>
          </div>

          <div className="flex items-center gap-4 text-gray-700">
            <Bell className="h-5 w-5" />
            <Settings className="h-5 w-5" />
            <img src="https://placehold.co/36x36" alt="Organizer" className="h-10 w-10 rounded-full border-2 border-sky-700/20" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1104px] flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-wider text-sky-700">Step 04 of 05</p>
              <h1 className="text-3xl font-extrabold text-zinc-900">Ticket Setup</h1>
            </div>
            <p className="text-base font-medium text-gray-700">80% Complete</p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-4/5 bg-gradient-to-r from-sky-700 to-violet-700" />
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.28fr_0.72fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-zinc-900">Existing Ticket Types</h2>
              <p className="text-sm text-gray-700">Manage your inventory and pricing</p>
            </div>

            <div className="space-y-4">
              {TICKET_CARDS.map((ticket, index) => (
                <article
                  key={ticket.name}
                  className={`flex flex-wrap items-center gap-6 rounded-xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] ${
                    ticket.muted ? "opacity-75" : ""
                  }`}
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-lg ${
                      index === 0 ? "bg-gradient-to-br from-sky-700 to-violet-700" : "bg-gray-200"
                    }`}
                  >
                    <Ticket className={`h-6 w-6 ${index === 0 ? "text-white" : "text-gray-700"}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-900">{ticket.name}</h3>
                      {ticket.badge ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            ticket.badgeTone === "rose" ? "bg-rose-200 text-red-800" : "bg-purple-200 text-violet-950"
                          }`}
                        >
                          {ticket.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 whitespace-pre-line text-sm leading-5 text-gray-700">{ticket.detail}</p>
                  </div>

                  <div className="border-x border-slate-300/10 px-6 text-right">
                    <p className={`text-2xl font-black ${index === 0 ? "text-sky-700" : "text-zinc-900"}`}>{ticket.price}</p>
                    <p className={`text-xs font-medium ${index === 2 ? "text-red-700" : "text-gray-700"}`}>{ticket.remaining}</p>
                  </div>

                  <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100" aria-label="Edit ticket">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </article>
              ))}

              <button
                type="button"
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl py-8 outline outline-2 outline-slate-300 transition hover:bg-white"
              >
                <Plus className="h-6 w-6 text-gray-700" />
                <span className="text-base font-bold text-gray-700">Add New Ticket Type</span>
              </button>
            </div>
          </div>

          <aside className="pb-8 xl:sticky xl:top-8 xl:h-fit">
            <section className="rounded-xl bg-gray-200 p-8">
              <h3 className="text-lg font-bold text-zinc-900">Revenue Summary</h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Tickets Sold</span>
                  <span className="text-base font-bold text-zinc-900">1,466 / 2,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Current Revenue</span>
                  <span className="text-base font-bold text-sky-700">$223,358.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Fees Applied</span>
                  <span className="text-base font-bold text-zinc-900">2.5%</span>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-300/20 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">Quick Tips</h4>
                <div className="mt-4 flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-sky-700" />
                  <p className="text-xs leading-5 text-gray-700">
                    Adding a VIP tier typically increases overall event revenue by up to 24% for music festivals.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-300/10 pt-8">
          <Link href={`${basePath}/ticket-tiers`} className="inline-flex items-center gap-2 rounded-lg px-8 py-3 text-base font-bold text-zinc-900">
            <ArrowLeft className="h-4 w-4" />
            Previous Step
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="rounded-lg px-8 py-3 text-base font-bold text-zinc-900">
              Save as Draft
            </button>
            <Link
              href="/organizer/events"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-3 text-base font-bold text-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]"
            >
              Complete Editing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </footer>
      </main>
    </section>
  );
}
