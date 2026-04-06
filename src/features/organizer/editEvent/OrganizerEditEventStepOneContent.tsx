import {
  Bell,
  CalendarDays,
  ChevronDown,
  Search,
  Settings,
  Sparkles,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "event";
  }

  return eventId ?? "event";
}

export function OrganizerEditEventStepOneContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex h-20 items-center justify-between border-b border-slate-300/20 bg-slate-50 px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="pr-8">
            <p className="text-[28px] font-black leading-8 text-sky-700">
              Kinetic
              <br />
              Gallery
            </p>
          </div>

          <span className="text-slate-300">/</span>

          <div>
            <p className="text-base font-medium leading-6 text-gray-700">Prism Flow Music Festival 2024</p>
            <p className="text-xs uppercase tracking-widest text-slate-500">Edit Event Draft</p>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-6">
          <div className="relative hidden sm:block">
            <div className="inline-flex h-11 w-64 items-center rounded-full bg-gray-100 py-2 pl-5 pr-10 text-sm text-gray-500">
              Search events...
            </div>
            <Search className="absolute right-4 top-3 h-4 w-4 text-gray-700" />
          </div>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute left-6 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-3 border-l border-gray-100 pl-6 sm:flex">
            <div className="h-8 w-8 rounded-full bg-zinc-300" />
            <div className="text-sm font-semibold leading-5 text-zinc-900">
              Alex
              <br />
              Rivera
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1104px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-10 xl:grid-cols-[1.65fr_0.95fr]">
          <div className="space-y-10">
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[2.4px] text-sky-700">Step 01 of 05</p>
                  <h1 className="text-4xl font-bold leading-9 text-zinc-900">Basic Information</h1>
                </div>
                <p className="text-sm font-medium text-gray-700">20% Complete</p>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/5 rounded-full bg-gradient-to-r from-sky-700 to-violet-700" />
              </div>
            </section>

            <section className="space-y-10 pb-20">
              <article className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Title</label>
                <div className="rounded-xl bg-gray-100 p-5">
                  <p className="text-2xl font-bold leading-8 text-zinc-900">Prism Flow Music Festival 2024</p>
                </div>
              </article>

              <article className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
                  <div className="relative rounded-xl bg-gray-100 px-4 py-4">
                    <span className="text-base text-zinc-900">Music</span>
                    <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Visibility</label>
                  <div className="inline-flex w-full items-center gap-2 rounded-xl bg-gray-100 p-1">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-white px-4 py-3 text-sm font-bold text-sky-700 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                    >
                      Public
                    </button>
                    <button type="button" className="flex-1 rounded-lg px-4 py-3 text-sm font-medium text-gray-700">
                      Private
                    </button>
                  </div>
                </div>
              </article>

              <article className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Description</label>
                  <span className="text-[10px] leading-4 text-gray-500">Rich Text Enabled</span>
                </div>

                <div className="rounded-xl bg-gray-100 p-6">
                  <div className="space-y-6 text-base leading-6 text-zinc-900">
                    <p>
                      Prism Flow is the premier audiovisual music festival where digital art meets high-fidelity sound.
                      For the 2024 edition, we are transforming the urban waterfront into a kinetic gallery of light and rhythm.
                    </p>
                    <p>
                      Attendees can expect three main stages featuring international synth-pop icons, underground techno legends,
                      and experimental ambient producers. Beyond the music, explore interactive VR installations and gourmet local
                      food pairings designed to elevate the sensory experience.
                    </p>
                  </div>
                </div>
              </article>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button type="button" className="inline-flex items-center gap-2 text-base font-semibold text-gray-700">
                  <Undo2 className="h-4 w-4" />
                  Discard Draft
                </button>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button type="button" className="rounded-xl px-8 py-4 text-base font-bold text-gray-700">
                    Save as Draft
                  </button>
                  <Link
                    href={`${basePath}/location-time`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-4 text-base font-bold text-white shadow-[0px_4px_6px_-4px_rgba(0,88,190,0.20),0px_10px_15px_-3px_rgba(0,88,190,0.20)]"
                  >
                    Next Step
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6 pb-20">
            <article className="space-y-6 rounded-3xl bg-gray-100 p-8">
              <h3 className="text-lg font-bold leading-7 text-zinc-900">Event Preview</h3>

              <div className="overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <div className="relative h-40 bg-gradient-to-br from-zinc-800 to-zinc-500">
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-rose-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Live Status
                  </div>
                </div>

                <div className="space-y-2 p-5">
                  <span className="inline-flex rounded-full bg-purple-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-violet-950">
                    Music
                  </span>
                  <h4 className="text-base font-bold leading-6 text-zinc-900">Prism Flow Music Festival 2024</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Aug 24-26, 2024
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-700/10 bg-blue-100/30 p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-sky-700" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-900">Pro Tip</p>
                    <p className="text-sm leading-5 text-sky-800">
                      Adding a detailed description increases ticket conversion by up to 30%.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-300/10 bg-zinc-200/30 p-8">
              <h3 className="text-xs font-bold uppercase tracking-[2.4px] text-gray-700">Checklist</h3>
              <ul className="mt-4 space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-zinc-900">
                  <span className="h-5 w-5 rounded-full bg-sky-700" />
                  Event Identity
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <span className="h-5 w-5 rounded-full bg-gray-400" />
                  Date &amp; Venue
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <span className="h-5 w-5 rounded-full bg-gray-400" />
                  Ticket Tiers
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <span className="h-5 w-5 rounded-full bg-gray-400" />
                  Team Access
                </li>
              </ul>
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}
