import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Clock3,
  Info,
  MapPin,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

export function OrganizerCreateEventStepTwoContent() {
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const minEndDateTime = useMemo(() => startDateTime || undefined, [startDateTime]);

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
        <div className="w-full space-y-12">
          <section className="space-y-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Step 2 of 5</p>
                <h1 className="text-4xl font-bold leading-10 text-zinc-900">Where and when?</h1>
                <p className="pt-1 text-lg text-gray-700">Set the location and schedule for your event.</p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-2xl font-bold leading-8 text-zinc-900">40%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Progress</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-sky-700 to-violet-700" />
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-8 pb-12">
              <article className="space-y-12 rounded-3xl bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/20">
                <div className="space-y-6">
                  <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-zinc-900">
                    <MapPin className="h-5 w-5 text-sky-700" />
                    Venue Details
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="venue-name" className="text-sm font-bold uppercase tracking-tight text-gray-700">
                        Venue Name
                      </label>
                      <input
                        id="venue-name"
                        type="text"
                        value={venueName}
                        onChange={(event) => setVenueName(event.target.value)}
                        placeholder="e.g. Grand Metropolitan Hall"
                        className="w-full rounded-2xl bg-gray-100 px-4 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="venue-address" className="text-sm font-bold uppercase tracking-tight text-gray-700">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-[19px] top-[19px] h-4 w-4 text-gray-700/50" />
                        <input
                          id="venue-address"
                          type="text"
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          placeholder="Street address, city, state"
                          className="w-full rounded-2xl bg-gray-100 py-4 pl-12 pr-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-zinc-900">
                    <CalendarDays className="h-5 w-5 text-violet-700" />
                    Event Schedule
                  </h3>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="start-time" className="text-sm font-bold uppercase tracking-tight text-gray-700">
                        Start Date &amp; Time
                      </label>
                      <div className="relative">
                        <input
                          id="start-time"
                          type="datetime-local"
                          value={startDateTime}
                          onChange={(event) => setStartDateTime(event.target.value)}
                          className="w-full rounded-2xl bg-gray-100 p-4 pr-11 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                        />
                        <Clock3 className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="end-time" className="text-sm font-bold uppercase tracking-tight text-gray-700">
                        End Date &amp; Time
                      </label>
                      <div className="relative">
                        <input
                          id="end-time"
                          type="datetime-local"
                          value={endDateTime}
                          onChange={(event) => setEndDateTime(event.target.value)}
                          min={minEndDateTime}
                          className="w-full rounded-2xl bg-gray-100 p-4 pr-11 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                        />
                        <Clock3 className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <div className="flex items-center justify-between pt-4">
                <Link href="/organizer/create-event" className="rounded-2xl px-8 py-3 text-base font-bold text-sky-700">
                  Back
                </Link>
                <Link
                  href="/organizer/create-event/visuals"
                  className="rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-4 text-base font-bold text-white shadow-[0px_8px_10px_-6px_rgba(0,88,190,0.20),0px_20px_25px_-5px_rgba(0,88,190,0.20)]"
                >
                  Continue to Step 3
                </Link>
              </div>
            </div>

            <aside className="space-y-8">
              <article className="relative h-72 overflow-hidden rounded-3xl bg-white shadow-lg outline outline-1 outline-slate-300/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_#9bd1ff_0%,_transparent_45%),linear-gradient(145deg,#2d74d9,#7a4de2)] opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-[163px] top-[126px] flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-2xl">
                  <MapPin className="h-5 w-5 text-rose-700" />
                </div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80">Live Preview</p>
                  <h4 className="text-xl font-bold text-white">{venueName.trim() || "Map visualization"}</h4>
                </div>
              </article>

              <div className="space-y-4">
                <article className="rounded-3xl bg-gradient-to-br from-violet-100 to-purple-200/70 p-6 outline outline-1 outline-violet-500/20">
                  <Info className="h-5 w-5 text-violet-950" />
                  <h5 className="mt-4 text-base font-bold text-violet-950">Pro Tip</h5>
                  <p className="mt-1 text-sm leading-6 text-violet-950/85">
                    Consider traffic and peak hours when setting your start time to keep check-in smooth for large crowds.
                  </p>
                </article>

                <article className="flex items-center justify-between gap-4 rounded-3xl bg-gray-100 p-6 outline outline-1 outline-slate-300/10">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-200">
                      <Sparkles className="h-5 w-5 text-sky-700" />
                    </div>
                    <div>
                      <h5 className="text-base font-bold text-zinc-900">Timezone detected</h5>
                      <p className="text-xs text-gray-700">
                        {startDateTime || endDateTime ? "Follow browser local timezone" : "Eastern Standard Time (GMT-5)"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700 outline outline-1 outline-slate-300/20">
                    Auto
                  </div>
                </article>
              </div>

              <article className="flex items-center justify-between rounded-3xl bg-white px-6 py-6 outline outline-1 outline-slate-300/20">
                <div className="flex items-center gap-3">
                  <span className="relative h-3 w-3">
                    <span className="absolute h-3 w-3 rounded-full bg-rose-700 opacity-75" />
                    <span className="h-3 w-3 rounded-full bg-rose-700" />
                  </span>
                  <span className="text-sm font-bold text-zinc-900">Saving progress...</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">Auto-save: ON</span>
              </article>
            </aside>
          </section>
        </div>
      </div>
    </section>
  );
}
