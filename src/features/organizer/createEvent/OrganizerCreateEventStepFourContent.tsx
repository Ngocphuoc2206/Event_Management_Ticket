import Link from "next/link";
import { Bell, ChevronDown, Pencil, Plus, Search, Settings } from "lucide-react";

type TicketTier = {
  name: string;
  badge: string;
  badgeStyle: string;
  price: string;
  quantity: string;
  period: string;
  stripe: string;
  sellingFast?: boolean;
};

const TICKET_TIERS: TicketTier[] = [
  {
    name: "Early Bird Access",
    badge: "Limited Tier",
    badgeStyle: "bg-purple-200 text-violet-950",
    price: "$49.00",
    quantity: "150",
    period: "Oct 01 - Oct 15",
    stripe: "bg-gradient-to-b from-sky-700 to-violet-700",
  },
  {
    name: "General Admission",
    badge: "Standard",
    badgeStyle: "bg-blue-100 text-sky-950",
    price: "$89.00",
    quantity: "500",
    period: "Oct 16 - Nov 30",
    stripe: "bg-violet-700",
  },
  {
    name: "VIP Backstage Pass",
    badge: "Selling Fast",
    badgeStyle: "bg-red-100 text-rose-900",
    price: "$249.00",
    quantity: "50",
    period: "Oct 01 - Nov 30",
    stripe: "bg-rose-700",
    sellingFast: true,
  },
];

function TicketCard({ tier }: { tier: TicketTier }) {
  return (
    <article className="inline-flex w-full overflow-hidden rounded-xl bg-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] outline outline-1 outline-slate-300/20">
      <div className={`w-2 shrink-0 ${tier.stripe}`} />
      <div className="grid flex-1 gap-6 p-8 md:grid-cols-[1.2fr_0.7fr_0.6fr_0.9fr_auto] md:items-start">
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-700">Ticket Name</div>
          <div className="inline-flex items-center gap-2 pb-1 text-xl font-bold text-zinc-900">
            <span>{tier.name}</span>
            {tier.sellingFast ? <span className="h-2 w-2 rounded-full bg-rose-700" /> : null}
          </div>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase leading-4 ${tier.badgeStyle}`}>
            {tier.badge}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-700">Price</div>
          <div className="text-xl font-semibold text-zinc-900">{tier.price}</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-700">Quantity</div>
          <div className="text-xl font-semibold text-zinc-900">{tier.quantity}</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-700">Sales Period</div>
          <div className="text-sm font-medium text-zinc-900">{tier.period}</div>
        </div>

        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100">
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function OrganizerCreateEventStepFourContent() {
  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex h-20 items-center justify-between border-b border-slate-300/10 bg-slate-50/80 px-5 backdrop-blur-[6px] sm:px-8 lg:px-10 xl:px-10">
        <div className="flex-1 max-w-[576px]">
          <div className="relative">
            <div className="inline-flex h-11 w-full items-start justify-center overflow-hidden rounded-2xl bg-gray-100 py-3.5 pl-12 pr-4">
              <div className="flex-1 overflow-hidden text-sm font-normal text-gray-500">Search events, orders, or attendees...</div>
            </div>
            <div className="absolute left-4 top-[10px] flex h-6 items-center">
              <Search className="h-4 w-4 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-6">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute left-6 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-px bg-slate-300/30" />
          <p className="text-sm font-bold tracking-wider text-gray-700">ORGANIZER DASHBOARD</p>
        </div>
      </header>

      <div className="px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="w-full max-w-[1280px] space-y-10">
          <section className="max-w-[960px] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-tight text-sky-700">Step 4 of 5</p>
              <p className="text-sm font-medium text-gray-700">80% Complete</p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-4/5 bg-gradient-to-b from-sky-700 to-violet-700" />
            </div>
            <p className="pt-2 text-sm font-medium text-gray-700">Current Step: Tickets &amp; Pricing</p>
          </section>

          <section className="grid gap-8 pb-6 xl:grid-cols-[1.55fr_1fr]">
            <div className="space-y-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold leading-10 text-zinc-900">Tickets &amp; Pricing</h1>
                <p className="text-lg leading-7 text-gray-700">
                  Define your ticket types and pricing strategy to maximize your event&apos;s reach.
                </p>
              </div>

              <div className="space-y-6 pb-4">
                {TICKET_TIERS.map((tier) => (
                  <TicketCard key={tier.name} tier={tier} />
                ))}

                <button
                  type="button"
                  className="flex w-full flex-col items-center justify-center rounded-xl py-10 outline outline-2 outline-slate-300"
                >
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <Plus className="h-3.5 w-3.5 text-gray-700" />
                  </span>
                  <span className="text-base font-semibold text-gray-700">Add Another Ticket Type</span>
                  <span className="pt-1 text-xs text-gray-500">Create different price points or membership levels</span>
                </button>
              </div>

              <footer className="flex items-center justify-between border-t border-gray-200 py-8">
                <Link href="/organizer/create-event" className="rounded-lg px-8 py-3 text-base font-semibold text-gray-700">
                  Back to Basic Info
                </Link>

                <div className="flex items-center gap-4">
                  <button type="button" className="rounded-lg bg-gray-200 px-8 py-3 text-base font-semibold text-gray-700">
                    Save Draft
                  </button>
                  <Link
                    href="/organizer/create-event/review-publish"
                    className="rounded-lg bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-3 text-base font-bold text-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)]"
                  >
                    Review &amp; Publish
                  </Link>
                </div>
              </footer>
            </div>

            <aside className="space-y-6">
              <article className="space-y-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <h3 className="text-lg font-bold text-zinc-900">Pricing Snapshot</h3>
                <div className="space-y-3 rounded-2xl bg-gray-100 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Total Ticket Tiers</span>
                    <span className="font-bold text-zinc-900">{TICKET_TIERS.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Lowest Price</span>
                    <span className="font-bold text-zinc-900">$49.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Highest Price</span>
                    <span className="font-bold text-zinc-900">$249.00</span>
                  </div>
                </div>
                <p className="text-xs leading-5 text-gray-700">
                  Your ticket stack looks balanced. Consider keeping at least one accessible option below $60.
                </p>
              </article>

              <article className="rounded-3xl bg-gradient-to-br from-sky-50 to-violet-50 p-6 outline outline-1 outline-sky-700/10">
                <h3 className="text-base font-bold text-zinc-900">Ready for final review</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Step 5 will show a complete preview with publishing controls so you can go live confidently.
                </p>
              </article>
            </aside>
          </section>
        </div>
      </div>
    </section>
  );
}
