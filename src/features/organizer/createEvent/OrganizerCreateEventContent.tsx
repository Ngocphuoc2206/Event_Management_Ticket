import { AlertCircle, CheckCircle2, ChevronDown, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import type { ApiResult } from "@/features/auth/types";
import {
  getOrganizerDraftEventId,
  getOrganizerDraftPayload,
  mergeOrganizerDraftPayload,
  setOrganizerDraftEventId,
  setOrganizerDraftPayload,
} from "@/features/organizer/events/services/draft-storage";
import { saveOrganizerEventDraft } from "@/features/organizer/events/services/create-event.service";
import type { OrganizerCreateEventPayload } from "@/features/organizer/events/types";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

type FormState = {
  title: string;
  category: string;
  description: string;
  visibility: "PUBLIC";
};

const DEFAULT_FORM: FormState = {
  title: "",
  category: "",
  description: "",
  visibility: "PUBLIC",
};

function buildDraftPayload(form: FormState): OrganizerCreateEventPayload {
  const now = new Date();
  const start = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
  const end = new Date(start.getTime() + 1000 * 60 * 60 * 4);

  return {
    title: form.title.trim(),
    shortDescription: form.description.trim().slice(0, 160) || "Organizer draft",
    description: form.description.trim() || "Organizer draft description",
    category: form.category.trim() || "General",
    venueName: "TBD Venue",
    address: "TBD Address",
    city: "Ho Chi Minh",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    visibility: form.visibility,
    minPrice: 0,
    status: "DRAFT",
  };
}

export function OrganizerCreateEventContent() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [draftEventId, setDraftEventId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const savedPayload = getOrganizerDraftPayload();
    const savedId = getOrganizerDraftEventId();

    if (savedPayload) {
      setForm((prev) => ({
        ...prev,
        title: savedPayload.title ?? prev.title,
        category: savedPayload.category ?? prev.category,
        description: savedPayload.description ?? prev.description,
        visibility: "PUBLIC",
      }));
    }

    if (savedId) {
      setDraftEventId(savedId);
    }
  }, []);

  useEffect(() => {
    const queryEventId = router.query.eventId;
    if (typeof queryEventId === "string" && queryEventId) {
      setDraftEventId(queryEventId);
      setOrganizerDraftEventId(queryEventId);
    }
  }, [router.query.eventId]);

  const canSaveDraft = useMemo(() => {
    return form.title.trim().length > 0 && form.category.trim().length > 0 && form.description.trim().length > 0;
  }, [form]);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2400);
  };

  const handleSaveDraft = async () => {
    if (!canSaveDraft || isSavingDraft) {
      return;
    }

    setIsSavingDraft(true);
    try {
      const payload = buildDraftPayload(form);
      const apiResult = await saveOrganizerEventDraft(payload, draftEventId ?? undefined);
      const saved = getApiResultData(apiResult as ApiResult<{ id?: string }>);

      if (saved?.id) {
        setDraftEventId(saved.id);
        setOrganizerDraftEventId(saved.id);
      }

      setOrganizerDraftPayload(payload);
      showToast({ tone: "success", message: "Draft đã được lưu lên hệ thống." });
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Không thể lưu draft. Vui lòng thử lại."),
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const nextStepHref = draftEventId
    ? {
        pathname: "/organizer/create-event/location-time",
        query: { eventId: draftEventId },
      }
    : "/organizer/create-event/location-time";

  const handleContinueToLocation = () => {
    mergeOrganizerDraftPayload({
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      shortDescription: form.description.trim().slice(0, 160),
      visibility: form.visibility,
    });
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
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

      <div className="px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="w-full space-y-10">
          <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[640px] space-y-2">
              <h1 className="text-4xl font-bold leading-[48px] text-zinc-900 sm:text-5xl">Create New Event</h1>
              <p className="text-lg leading-7 text-gray-700">Lưu Draft ở bước này để tạo event thật và tiếp tục hoàn thiện.</p>
            </div>

            <div className="w-full max-w-64 space-y-3">
              <div className="flex items-end justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Step 1 of 5</p>
                <p className="text-sm font-bold text-zinc-900">Basic Info</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-12 rounded-full bg-gradient-to-r from-sky-700 to-violet-700" />
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-6 pb-10">
              <article className="rounded-3xl bg-white px-8 pb-10 pt-8 shadow-[0px_32px_64px_-15px_rgba(0,0,0,0.06)]">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="e.g. Summer Music Festival 2026"
                      className="w-full rounded-2xl bg-gray-100 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
                      <input
                        type="text"
                        value={form.category}
                        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                        placeholder="Music / Tech / Business..."
                        className="w-full rounded-2xl bg-gray-100 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Privacy</label>
                      <div className="inline-flex w-full rounded-2xl bg-gray-100 p-1">
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, visibility: "PUBLIC" }))}
                          className="flex-1 rounded-md bg-white py-4 text-sm font-bold text-sky-700 shadow-sm"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            Public
                          </span>
                        </button>
                        <button type="button" disabled className="flex-1 py-4 text-sm font-medium text-gray-500">
                          <span className="inline-flex items-center gap-2">
                            <Lock className="h-3 w-3" />
                            Private (soon)
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Description</label>
                    <textarea
                      rows={6}
                      value={form.description}
                      onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="What is your event about?"
                      className="w-full resize-y rounded-2xl bg-gray-100 px-6 py-4 text-base leading-6 text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>

                  {draftEventId ? (
                    <p className="text-xs font-medium text-emerald-700">Draft ID: {draftEventId}</p>
                  ) : null}
                </div>
              </article>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => void handleSaveDraft()}
                  disabled={!canSaveDraft || isSavingDraft}
                  className="rounded-2xl px-8 py-4 text-base font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSavingDraft ? "Dang luu..." : "Save Draft"}
                </button>

                <Link
                  href={nextStepHref}
                  onClick={handleContinueToLocation}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-12 py-4 text-base font-bold text-white shadow-[0px_8px_10px_-6px_rgba(0,88,190,0.20),0px_20px_25px_-5px_rgba(0,88,190,0.20)]"
                >
                  Continue to Location
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Link>
              </div>
            </div>

            <aside className="space-y-6">
              <article className="rounded-3xl bg-white p-6 outline outline-1 outline-slate-300/10">
                <h3 className="text-lg font-bold text-zinc-900">Workflow</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li>1. Save Draft (status = DRAFT)</li>
                  <li>2. Complete remaining steps</li>
                  <li>3. Submit for approval / publish at final step</li>
                </ul>
              </article>
            </aside>
          </section>
        </div>
      </div>
    </section>
  );
}
