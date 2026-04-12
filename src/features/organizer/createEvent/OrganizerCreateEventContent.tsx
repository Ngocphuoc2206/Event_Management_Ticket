import {
  Bell,
  CalendarDays,
  ChevronDown,
  Globe,
  Info,
  Lock,
  MapPin,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";

import { OrganizerBrandLogo } from "@/features/organizer/shared/OrganizerBrandLogo";

export function OrganizerCreateEventContent() {
  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-xl">
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

          <div className="h-8 w-px bg-slate-300/30" />
          <OrganizerBrandLogo />
        </div>
      </header>

      <div className="px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="w-full space-y-12">
          <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[512px] space-y-3">
              <h1 className="text-4xl font-bold leading-[48px] text-zinc-900 sm:text-5xl">Create New Event</h1>
              <p className="text-xl font-light leading-7 text-gray-700">Tell us the basics about your event.</p>
            </div>

            <div className="w-full max-w-64 space-y-3">
              <div className="flex items-end justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Step 1 of 5</p>
                <p className="text-sm font-bold text-zinc-900">Basic Info</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-12 rounded-full bg-indigo-600" />
              </div>
              <div className="text-right text-[10px] leading-4 text-gray-700">20% COMPLETED</div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-6 pb-10">
              <article className="relative rounded-[32px] bg-white px-8 pb-12 pt-8 border border-slate-100 shadow-[0px_32px_64px_-15px_rgba(0,0,0,0.06)]">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Music Festival 2024"
                      className="w-full rounded-2xl bg-gray-100 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
                      <div className="relative rounded-2xl bg-gray-100">
                        <select className="h-[56px] w-full appearance-none rounded-2xl bg-transparent px-6 pr-14 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2">
                          <option value="">Select a category</option>
                          <option value="music">Music</option>
                          <option value="technology">Technology</option>
                          <option value="business">Business</option>
                          <option value="sports">Sports</option>
                          <option value="education">Education</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-4 h-6 w-6 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Privacy</label>
                      <div className="inline-flex w-full rounded-2xl bg-gray-100 p-1">
                        <button
                          type="button"
                          className="flex-1 rounded-md bg-white py-4 text-sm font-bold text-sky-700 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            Public
                          </span>
                        </button>
                        <button type="button" className="flex-1 py-4 text-sm font-medium text-gray-700">
                          <span className="inline-flex items-center gap-2">
                            <Lock className="h-3 w-3" />
                            Private
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Description</label>
                    <textarea
                      placeholder="What is your event about? Share the highlights and what guests can expect..."
                      rows={6}
                      className="w-full resize-y rounded-2xl bg-gray-100 px-6 py-4 text-base leading-6 text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>
                </div>
              </article>

              <div className="flex items-center justify-between pt-4">
                <button type="button" className="rounded-2xl px-8 py-4 text-base font-bold text-gray-700">
                  Save Draft
                </button>
                <Link
                  href="/organizer/create-event/location-time"
                  className="relative inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-12 py-4 text-base font-bold text-white shadow-[0px_8px_10px_-6px_rgba(0,88,190,0.20),0px_20px_25px_-5px_rgba(0,88,190,0.20)]"
                >
                  Continue to Location
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Link>
              </div>
            </div>

            <aside className="space-y-6">
              <article className="overflow-hidden rounded-[32px] bg-gray-100 outline outline-1 outline-slate-300/10">
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_10%,_transparent_60%)]" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-[6px]">
                    Preview
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <h3 className="max-w-[260px] text-2xl font-bold leading-8 text-zinc-900">Your Event Title Will Appear Here</h3>

                  <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Date Pending
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Virtual or Physical
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-200/30 pt-4">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full border border-slate-50 bg-blue-100" />
                      <div className="-ml-1 h-6 w-6 rounded-full border border-slate-50 bg-purple-200" />
                      <div className="-ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-50 bg-zinc-200 text-[8px] font-bold text-zinc-900">
                        +12
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-700">Live Preview</span>
                  </div>
                </div>
              </article>

              <article className="rounded-[32px] bg-gradient-to-br from-violet-100 to-purple-100/60 p-6 outline outline-1 outline-violet-700/10">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-violet-700" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-violet-950">Pro-Tip for Organizers</h4>
                    <p className="text-xs leading-5 text-violet-900/80">
                      Keep your title under 60 characters for better visibility on mobile and social previews.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[32px] bg-white p-6 border border-slate-100">
                <ul className="space-y-6">
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-700 text-[10px] font-bold text-white">1</span>
                    <span className="text-sm font-bold text-zinc-900">Basic Information</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-700">2</span>
                    <span className="text-sm font-medium text-zinc-900">Location &amp; Time</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-700">3</span>
                    <span className="text-sm font-medium text-zinc-900">Ticket Pricing</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-700">4</span>
                    <span className="text-sm font-medium text-zinc-900">Event Media</span>
                  </li>
                </ul>
              </article>
            </aside>
          </section>
        </div>
      </div>

      <div className="pointer-events-none absolute right-5 top-5 text-gray-700/0">
        <UserCircle2 className="h-5 w-5" />
      </div>
    </section>
  );
}
