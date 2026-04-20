import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage, getApiResultData, isApiResponse } from "@/features/auth/utils";
import {
  getOrganizerEventById,
  updateOrganizerEvent,
} from "@/features/organizer/events/services/create-event.service";
import type { OrganizerCreateEventPayload, OrganizerEvent } from "@/features/organizer/events/types";

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "event";
  }

  return eventId ?? "event";
}

function toIsoWithOffset(daysOffset: number, hoursOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(date.getHours() + hoursOffset);
  return date.toISOString();
}

export function OrganizerEditEventStepOneContent() {
  type ToastState = {
    tone: "success" | "error";
    message: string;
  };

  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;

  const [eventData, setEventData] = useState<OrganizerEvent | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let mounted = true;

    const loadEvent = async () => {
      setIsLoading(true);
      setToast(null);

      try {
        const response = await getOrganizerEventById(eventId);
        if (isApiResponse(response) && typeof response.code === "number" && response.code !== 0) {
          throw new Error(response.message || "Khong the tai chi tiet su kien.");
        }
        const data = getApiResultData(response);

        if (!mounted) {
          return;
        }

        if (!data) {
          throw new Error("Khong tim thay du lieu su kien.");
        }

        setEventData(data);
        setTitle(data.title ?? "");
        setCategory(data.category ?? "");
        setDescription(data.description ?? "");
      } catch (error) {
        if (mounted) {
          showToast({ tone: "error", message: getApiErrorMessage(error, "Khong the tai chi tiet su kien.") });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      mounted = false;
    };
  }, [eventId, showToast]);

  const handleSave = async () => {
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
        venueName: eventData?.venueName?.trim() || "TBD Venue",
        address: eventData?.address?.trim() || "Updating soon",
        city: eventData?.city?.trim() || "TBD",
        bannerUrl: eventData?.bannerUrl?.trim() || "https://placehold.co/1200x675?text=Event+Banner",
        startTime: eventData?.startTime || toIsoWithOffset(7),
        endTime: eventData?.endTime || toIsoWithOffset(7, 4),
        visibility: "PUBLIC",
        minPrice: typeof eventData?.minPrice === "number" ? eventData.minPrice : 0,
      };

      const response = await updateOrganizerEvent(eventId, payload);

      if (isApiResponse(response) && typeof response.code === "number" && response.code !== 0) {
        throw new Error(response.message || "Cap nhat su kien that bai.");
      }

      showToast({ tone: "success", message: "Da cap nhat thong tin su kien." });
    } catch (error) {
      showToast({ tone: "error", message: getApiErrorMessage(error, "Khong the cap nhat su kien.") });
    } finally {
      setIsSaving(false);
    }
  };

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
            <p className="text-base font-medium leading-6 text-gray-700">{title || "Edit Event"}</p>
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
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1104px] px-5 py-8 sm:px-8 lg:px-10">
        {toast ? (
          <div className="fixed right-6 top-6 z-50">
            <div
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
                toast.tone === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
              }`}
            >
              {toast.tone === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {toast.message}
            </div>
          </div>
        ) : null}

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-[2.4px] text-sky-700">Step 01 of 05</p>
                <h1 className="text-4xl font-bold leading-9 text-zinc-900">Basic Information</h1>
              </div>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-1/5 rounded-full bg-gradient-to-r from-sky-700 to-violet-700" />
            </div>
          </section>

          <section className="space-y-8 pb-8">
            {isLoading ? (
              <div className="rounded-xl bg-white p-8 text-sm font-medium text-gray-700">Loading event details...</div>
            ) : (
              <>
                <article className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded-xl bg-gray-100 p-5 text-2xl font-bold leading-8 text-zinc-900"
                  />
                </article>

                <article className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
                  <div className="relative rounded-xl bg-gray-100">
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="h-[56px] w-full appearance-none rounded-xl bg-transparent px-4 pr-12 text-base text-zinc-900 outline-none"
                    >
                      <option value="">Select category</option>
                      <option value="Music">Music</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Sports">Sports</option>
                      <option value="Education">Education</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-700" />
                  </div>
                </article>

                <article className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Description</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={8}
                    className="w-full rounded-xl bg-gray-100 p-6 text-base leading-6 text-zinc-900"
                  />
                </article>
              </>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={!canSave || isSaving || isLoading}
                className="rounded-xl px-8 py-4 text-base font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save as Draft"}
              </button>
              <Link
                href={`${basePath}/location-time`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-4 text-base font-bold text-white shadow-[0px_4px_6px_-4px_rgba(0,88,190,0.20),0px_10px_15px_-3px_rgba(0,88,190,0.20)]"
              >
                Next Step
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
