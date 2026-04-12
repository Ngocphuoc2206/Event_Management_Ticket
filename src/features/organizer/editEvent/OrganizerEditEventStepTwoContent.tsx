import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "event";
  }

  return eventId ?? "event";
}

export function OrganizerEditEventStepTwoContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;
  const [venueName, setVenueName] = useState("Skyline Arena");
  const [address, setAddress] = useState("New York");
  const [startTime, setStartTime] = useState("2024-08-15T09:00");
  const [endTime, setEndTime] = useState("2024-08-17T23:30");
  const minEndTime = useMemo(() => startTime || undefined, [startTime]);

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-8 py-4">
        <div className="flex items-center gap-6">
          <p className="text-2xl font-black leading-8 text-sky-700">Kinetic Gallery</p>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/events" className="text-base font-normal leading-6 text-gray-700">
              Explore
            </Link>
            <span className="border-b-2 border-sky-700 pb-1 text-base font-bold leading-6 text-sky-700">Manage</span>
            <Link href="/organizer" className="text-base font-normal leading-6 text-gray-700">
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <div className="inline-flex w-64 items-center rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-base text-gray-500">
              Search events...
            </div>
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          </div>

          <button type="button" className="rounded-full p-2 text-zinc-900 transition hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-full p-2 text-zinc-900 transition hover:bg-slate-100" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <img
            src="https://placehold.co/40x40"
            alt="Organizer profile"
            className="h-10 w-10 rounded-full"
          />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1104px] flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        <section className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-full bg-purple-200 px-3 py-1 text-base uppercase tracking-widest text-violet-950">
              Music Festival
            </span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-700" />
              <span className="text-sm font-semibold text-rose-700">Step 2: Scheduling</span>
            </div>
          </div>

          <h1 className="text-4xl font-black leading-10 text-zinc-900">Prism Flow Music Festival 2024</h1>
          <p className="text-base leading-6 text-gray-700">Update the venue details and session timing for your flagship event.</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <p className="text-base font-bold uppercase tracking-widest text-sky-700">2 / 5 Steps Completed</p>
            <p className="text-sm text-gray-700">Location &amp; Time</p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-2/5 rounded-full bg-indigo-600" />
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10 pb-8">
            <article className="space-y-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-700" />
                <h2 className="text-xl font-bold leading-7 text-zinc-900">Venue Information</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="edit-venue-name" className="text-base uppercase tracking-widest text-gray-700">
                    Venue Name
                  </label>
                  <input
                    id="edit-venue-name"
                    type="text"
                    value={venueName}
                    onChange={(event) => setVenueName(event.target.value)}
                    className="w-full rounded-lg bg-zinc-200 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-address" className="text-base uppercase tracking-widest text-gray-700">
                    Address
                  </label>
                  <input
                    id="edit-address"
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="w-full rounded-lg bg-zinc-200 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                  />
                </div>
              </div>
            </article>

            <article className="space-y-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sky-700" />
                <h2 className="text-xl font-bold leading-7 text-zinc-900">Event Schedule</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="edit-start-time" className="text-base uppercase tracking-widest text-gray-700">
                    Start Time
                  </label>
                  <div className="relative">
                    <input
                      id="edit-start-time"
                      type="datetime-local"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      className="w-full rounded-lg bg-zinc-200 px-6 py-4 pr-12 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                    <Clock3 className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-end-time" className="text-base uppercase tracking-widest text-gray-700">
                    End Time
                  </label>
                  <div className="relative">
                    <input
                      id="edit-end-time"
                      type="datetime-local"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      min={minEndTime}
                      className="w-full rounded-lg bg-zinc-200 px-6 py-4 pr-12 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                    <Clock3 className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-base uppercase tracking-widest text-gray-700">Configured Time Slots</label>

                <div className="flex items-center justify-between rounded-xl bg-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Clock3 className="h-5 w-5 text-sky-700" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-zinc-900">Main Stage Morning</p>
                      <p className="text-sm text-gray-700">09:00 AM - 01:00 PM</p>
                    </div>
                  </div>
                  <button type="button" className="rounded-md p-2 text-gray-500 transition hover:bg-gray-200" aria-label="Delete time slot">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-200">
                      <Clock3 className="h-5 w-5 text-violet-700" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-zinc-900">Evening Headliner</p>
                      <p className="text-sm text-gray-700">07:00 PM - 11:30 PM</p>
                    </div>
                  </div>
                  <button type="button" className="rounded-md p-2 text-gray-500 transition hover:bg-gray-200" aria-label="Delete time slot">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 py-4 text-base font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Time Slot
                </button>
              </div>
            </article>
          </div>

          <aside className="space-y-6 pb-12">
            <article className="relative h-80 overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-700/10 to-violet-700/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#ffffff_0%,_#f8fafc_45%,_#e2e8f0_100%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                  <MapPin className="h-6 w-6 text-sky-700" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/80 px-4 py-4 backdrop-blur-md">
                <div>
                  <p className="text-base font-bold text-sky-700">{venueName || "Skyline Arena"}</p>
                  <p className="text-xs text-gray-700">Confirmed Partner Venue</p>
                </div>
                <button type="button" className="text-sm font-bold text-sky-700">
                  Verify Address
                </button>
              </div>
            </article>

            <article className="relative space-y-6 overflow-hidden rounded-2xl bg-white p-8 shadow-[0px_32px_64px_-16px_rgba(25,28,30,0.06)]">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[9999px] bg-gradient-to-br from-sky-700/10 to-violet-700/10" />

              <p className="text-base uppercase tracking-widest text-gray-700">Live Ticket Preview</p>

              <div className="flex items-center gap-4">
                <img src="https://placehold.co/64x64" alt="Music festival abstract" className="h-16 w-16 rounded-lg object-cover" />
                <div>
                  <p className="text-lg font-bold leading-6 text-zinc-900">Prism Flow: Weekend Pass</p>
                  <p className="text-sm font-medium text-sky-700">August 15 - 17, 2024</p>
                </div>
              </div>

              <div className="relative border-t-2 border-slate-300">
                <span className="absolute -left-11 -top-3 h-6 w-6 rounded-full bg-slate-50" />
                <span className="absolute -right-11 -top-3 h-6 w-6 rounded-full bg-slate-50" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-700">Location</p>
                  <p className="text-base font-bold text-zinc-900">Skyline Arena, NY</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-gray-700">Starts</p>
                  <p className="text-base font-bold text-zinc-900">09:00 AM</p>
                </div>
              </div>
            </article>
          </aside>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-8">
          <Link href={basePath} className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-gray-700">
            <ChevronLeft className="h-4 w-4" />
            Previous Step
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="rounded-xl px-8 py-4 text-base font-bold text-sky-700">
              Save as Draft
            </button>
            <Link
              href={`${basePath}/ticket-tiers`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-10 py-4 text-base font-black text-white shadow-lg"
            >
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
