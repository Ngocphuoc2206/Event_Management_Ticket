import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Globe,
  Info,
  Lock,
  MapPin,
  Search,
  Settings,
  UserCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { getApiErrorMessage, getApiResultData, isApiResponse } from "@/features/auth/utils";
import { createOrganizerEvent } from "@/features/organizer/events/services/create-event.service";
import type { OrganizerCreateEventPayload, OrganizerEvent } from "@/features/organizer/events/types";

function toIsoWithOffset(daysOffset: number, hoursOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(date.getHours() + hoursOffset);
  return date.toISOString();
}

export function OrganizerCreateEventContent() {
  type ToastState = {
    tone: "success" | "error";
    message: string;
  };

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  const canSave = useMemo(
    () => title.trim() && category.trim() && description.trim(),
    [title, category, description],
  );

  const handleSaveDraft = async () => {
    if (!canSave || isSaving) {
      return;
    }

    setIsSaving(true);
    setToast(null);

    try {
      const safeDescription = description.trim();
      const payload: OrganizerCreateEventPayload = {
        title: title.trim(),
        shortDescription: safeDescription.slice(0, 140),
        description: safeDescription,
        category: category.trim(),
        venueName: "TBD Venue",
        address: "Updating soon",
        city: "TBD",
        bannerUrl: "https://placehold.co/1200x675?text=Event+Banner",
        startTime: toIsoWithOffset(7),
        endTime: toIsoWithOffset(7, 4),
        visibility: "PUBLIC",
        minPrice: 0,
      };

      const response = await createOrganizerEvent(payload);

      if (isApiResponse(response) && typeof response.code === "number" && response.code !== 0) {
        throw new Error(response.message || "Khong the tao event moi.");
      }

      const createdEvent = getApiResultData(response) as OrganizerEvent | undefined;

      showToast({ tone: "success", message: "Da tao event draft thanh cong." });

      if (createdEvent?.id) {
        void router.push(`/organizer/events/edit/${createdEvent.id}`);
      }
    } catch (error) {
      showToast({ tone: "error", message: getApiErrorMessage(error, "Khong the tao event moi. Vui long thu lai.") });
    } finally {
      setIsSaving(false);
    }
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
          <p className="text-sm font-bold tracking-wider text-gray-700">ORGANIZER DASHBOARD</p>
        </div>
      </header>

      <div className="px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="w-full space-y-12">
          {toast ? (
            <div className="fixed right-6 top-6 z-50">
              <div
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
                  toast.tone === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                }`}
              >
                {toast.tone === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {toast.message}
              </div>
            </div>
          ) : null}

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
                <div className="h-full w-12 rounded-full bg-gradient-to-r from-sky-700 to-violet-700" />
              </div>
              <div className="text-right text-[10px] leading-4 text-gray-700">20% COMPLETED</div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-6 pb-10">
              <article className="relative rounded-3xl bg-white px-8 pb-12 pt-8 outline outline-1 outline-slate-300/5 shadow-[0px_32px_64px_-15px_rgba(0,0,0,0.06)]">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. Summer Music Festival 2024"
                      className="w-full rounded-2xl bg-gray-100 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
                      <div className="relative rounded-2xl bg-gray-100">
                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          className="h-[56px] w-full appearance-none rounded-2xl bg-transparent px-6 pr-14 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                        >
                          <option value="">Select a category</option>
                          <option value="Music">Music</option>
                          <option value="Technology">Technology</option>
                          <option value="Business">Business</option>
                          <option value="Sports">Sports</option>
                          <option value="Education">Education</option>
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
                        <button type="button" disabled className="flex-1 py-4 text-sm font-medium text-gray-400">
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
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="What is your event about? Share the highlights and what guests can expect..."
                      rows={6}
                      className="w-full resize-y rounded-2xl bg-gray-100 px-6 py-4 text-base leading-6 text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>
                </div>
              </article>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => void handleSaveDraft()}
                  disabled={!canSave || isSaving}
                  className="rounded-2xl px-8 py-4 text-base font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Draft"}
                </button>
                <Link
                  href="/organizer/create-event/location-time"
                  className="relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-12 py-4 text-base font-bold text-white shadow-[0px_8px_10px_-6px_rgba(0,88,190,0.20),0px_20px_25px_-5px_rgba(0,88,190,0.20)]"
                >
                  Continue to Location
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Link>
              </div>
            </div>

            <aside className="space-y-6">
              <article className="overflow-hidden rounded-3xl bg-gray-100 outline outline-1 outline-slate-300/10">
                <div className="relative h-48 bg-gradient-to-br from-sky-700 to-violet-700">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_10%,_transparent_60%)]" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-[6px]">
                    Preview
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <h3 className="max-w-[260px] text-2xl font-bold leading-8 text-zinc-900">{title.trim() || "Your Event Title Will Appear Here"}</h3>

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
                </div>
              </article>

              <article className="rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100/60 p-6 outline outline-1 outline-violet-700/10">
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
