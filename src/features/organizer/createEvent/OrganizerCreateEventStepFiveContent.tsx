"use client";

import {
  Bell,
  CalendarDays,
  Edit3,
  Globe,
  MapPin,
  Save,
  Search,
  Settings,
} from "lucide-react";
import { useMemo, useState } from "react";

type TicketPreview = {
  name: string;
  subtitle: string;
  price: string;
  quantity: string;
  stripe: string;
};

const TICKET_PREVIEWS: TicketPreview[] = [
  {
    name: "Early Bird Access",
    subtitle: "Available until June 1st",
    price: "$45.00",
    quantity: "200 Tickets",
    stripe: "bg-sky-700",
  },
  {
    name: "General Admission",
    subtitle: "Full venue access",
    price: "$75.00",
    quantity: "Unlimited",
    stripe: "bg-violet-700",
  },
  {
    name: "VIP Backstage",
    subtitle: "Exclusive lounge + Meet & Greet",
    price: "$195.00",
    quantity: "50 Tickets",
    stripe: "bg-rose-700",
  },
];

export function OrganizerCreateEventStepFiveContent() {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [expectedAttendees, setExpectedAttendees] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [hasConfirmedAttendeesPlan, setHasConfirmedAttendeesPlan] = useState(false);

  const isAttendeesCompleted = useMemo(() => {
    const expected = Number(expectedAttendees);
    const isExpectedValid = Number.isFinite(expected) && expected > 0;
    const isEmailValid = /\S+@\S+\.\S+/.test(contactEmail.trim());

    return isExpectedValid && isEmailValid && hasConfirmedAttendeesPlan;
  }, [contactEmail, expectedAttendees, hasConfirmedAttendeesPlan]);

  const toggleActions = () => {
    if (!isAttendeesCompleted) {
      return;
    }

    setIsActionsOpen((prev) => !prev);
  };

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

      <div className="w-full px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="w-full max-w-[1280px] space-y-12">
          <section className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Final Step</p>
                <h1 className="text-4xl font-bold leading-10 text-zinc-900">Review &amp; Publish</h1>
                <p className="text-lg leading-7 text-gray-700">Double-check everything before making your event live.</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm font-bold text-sky-700">Step 5 of 5</p>
                <p className="text-2xl font-bold leading-8 text-zinc-900">100%</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-sky-700 to-violet-700" />
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.75fr_1fr]">
            <div className="space-y-8">
              <article className="space-y-8 rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900">Event Details</h2>
                  <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                    <Edit3 className="h-2.5 w-2.5" />
                    Edit
                  </button>
                </div>

                <div className="relative h-80 overflow-hidden rounded-3xl">
                  <div className="h-full w-full bg-[linear-gradient(145deg,#3a79d9,#5d44be)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/0" />
                  <div className="absolute left-6 top-[228px] space-y-2">
                    <span className="inline-flex rounded-full bg-purple-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-950">
                      Music Festival
                    </span>
                    <h3 className="text-3xl font-bold leading-9 text-white">Neon Horizons 2024</h3>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-2xl bg-gray-100 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                      <CalendarDays className="h-4 w-4 text-sky-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date &amp; Time</p>
                      <p className="text-base font-semibold text-zinc-900">Saturday, Aug 24, 2024</p>
                      <p className="text-sm text-gray-700">7:00 PM - 11:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-gray-100 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                      <MapPin className="h-4 w-4 text-sky-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-base font-semibold text-zinc-900">The Sky Garden, NY</p>
                      <p className="text-sm text-gray-700">405 W 14th St, New York</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="space-y-8 rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900">Ticket Categories</h2>
                  <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                    <Edit3 className="h-2.5 w-2.5" />
                    Manage
                  </button>
                </div>

                <div className="space-y-4">
                  {TICKET_PREVIEWS.map((ticket) => (
                    <article key={ticket.name} className="flex items-center justify-between rounded-3xl bg-gray-100 p-6">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-2 rounded-full ${ticket.stripe}`} />
                        <div>
                          <p className="text-base font-bold text-zinc-900">{ticket.name}</p>
                          <p className="text-sm text-gray-700">{ticket.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-zinc-900">{ticket.price}</p>
                        <p className="text-xs text-gray-700">{ticket.quantity}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </div>

            <aside className="space-y-8 pb-32">
              <article className="rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <h3 className="text-lg font-bold text-zinc-900">Venue Preview</h3>

                <div className="relative mt-4 h-64 overflow-hidden rounded-3xl bg-gray-200">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_28%,_#b2d6ff_0%,_transparent_45%),linear-gradient(145deg,#cbd5e1,#f1f5f9)] opacity-90" />
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-700 to-violet-700 text-white shadow-[0px_0px_0px_8px_rgba(255,255,255,0.30)]">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-6 text-gray-700">
                  The Sky Garden offers a panoramic
                  <br />
                  view of the Manhattan skyline.
                  <br />
                  Modern acoustics and state-of-
                  <br />
                  the-art lighting are included.
                </p>
              </article>

              <article className="space-y-6 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <h3 className="text-lg font-bold text-zinc-900">Publishing Settings</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-sky-700" />
                      <div>
                        <p className="text-sm font-bold text-zinc-900">Public Event</p>
                        <p className="text-xs text-gray-700">Visible to everyone</p>
                      </div>
                    </div>
                    <div className="relative h-6 w-12 rounded-full bg-sky-700">
                      <span className="absolute left-7 top-1 h-4 w-4 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-bold text-zinc-900">Scheduled Release</p>
                        <p className="text-xs text-gray-700">Off</p>
                      </div>
                    </div>
                    <div className="relative h-6 w-12 rounded-full bg-zinc-200">
                      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </article>

              <article className="space-y-5 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-zinc-900">Attendees Setup</h3>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      isAttendeesCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {isAttendeesCompleted ? "Completed" : "Required"}
                  </span>
                </div>

                <div className="space-y-4">
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Expected Attendees</span>
                    <input
                      type="number"
                      min={1}
                      value={expectedAttendees}
                      onChange={(event) => setExpectedAttendees(event.target.value)}
                      placeholder="e.g. 500"
                      className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Attendees Contact Email</span>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(event) => setContactEmail(event.target.value)}
                      placeholder="attendees@yourevent.com"
                      className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </label>

                  <label className="inline-flex items-start gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={hasConfirmedAttendeesPlan}
                      onChange={(event) => setHasConfirmedAttendeesPlan(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300"
                    />
                    I confirm attendees check-in workflow is prepared.
                  </label>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    disabled={!isAttendeesCompleted}
                    onClick={toggleActions}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                    aria-haspopup="menu"
                    aria-expanded={isActionsOpen}
                  >
                    Actions
                  </button>

                  {isActionsOpen ? (
                    <div role="menu" className="absolute right-0 top-14 z-10 min-w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => setIsActionsOpen(false)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Preview attendees page
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => setIsActionsOpen(false)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export attendees plan
                      </button>
                    </div>
                  ) : null}
                </div>

                {!isAttendeesCompleted ? (
                  <p className="text-xs leading-5 text-amber-700">
                    Complete Attendees Setup to enable Actions.
                  </p>
                ) : null}
              </article>

              <article className="space-y-4">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-3xl bg-gradient-to-r from-sky-700 to-violet-700 px-8 py-4 text-lg font-bold text-white shadow-[0px_8px_32px_-8px_rgba(0,88,190,0.50)]"
                >
                  Publish Event
                </button>

                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gray-200 px-8 py-4 text-base font-bold text-zinc-900"
                >
                  <Save className="h-3 w-3.5" />
                  Save as Draft
                </button>

                <p className="px-6 text-center text-xs leading-4 text-gray-700">
                  By publishing, you agree to EventHub&apos;s
                  <br />
                  Terms of Service and Event Organizer
                  <br />
                  Agreement.
                </p>
              </article>
            </aside>
          </section>
        </div>
      </div>
    </section>
  );
}
