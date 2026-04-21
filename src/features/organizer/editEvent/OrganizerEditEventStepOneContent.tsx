import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import type { ApiResult } from "@/features/auth/types";
import {
  getOrganizerEventById,
  updateOrganizerEvent,
} from "@/features/organizer/events/services/create-event.service";
import type { OrganizerCreateEventPayload, OrganizerEvent } from "@/features/organizer/events/types";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

type EditFormState = {
  title: string;
  category: string;
  description: string;
  visibility: "PUBLIC";
};

const EMPTY_FORM: EditFormState = {
  title: "",
  category: "",
  description: "",
  visibility: "PUBLIC",
};

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "";
  }

  return eventId ?? "";
}

export function OrganizerEditEventStepOneContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;

  const [form, setForm] = useState<EditFormState>(EMPTY_FORM);
  const [loadedEvent, setLoadedEvent] = useState<OrganizerEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    setIsLoading(true);

    void (async () => {
      try {
        const apiResult = await getOrganizerEventById(eventId);
        const eventData = getApiResultData(apiResult as ApiResult<OrganizerEvent>);

        if (!eventData) {
          throw new Error("Không lấy được dữ liệu sự kiện.");
        }

        setLoadedEvent(eventData);
        setForm({
          title: eventData.title ?? "",
          category: eventData.category ?? "",
          description: eventData.description ?? "",
          visibility: "PUBLIC",
        });
      } catch (error) {
        setToast({
          tone: "error",
          message: getApiErrorMessage(error, "Không thể tải dữ liệu event để chỉnh sửa."),
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [eventId]);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2400);
  };

  const canSave = useMemo(() => {
    return form.title.trim().length > 0 && form.category.trim().length > 0 && form.description.trim().length > 0;
  }, [form]);

  const handleSaveDraft = async () => {
    if (!eventId || !canSave || isSaving || !loadedEvent) {
      return;
    }

    const payload: Partial<OrganizerCreateEventPayload> = {
      ...loadedEvent,
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      shortDescription: form.description.trim().slice(0, 160),
      visibility: form.visibility,
      status: "DRAFT",
    };

    setIsSaving(true);
    try {
      const apiResult = await updateOrganizerEvent(eventId, payload);
      const updated = getApiResultData(apiResult as ApiResult<OrganizerEvent>);
      if (updated) {
        setLoadedEvent(updated);
      }
      showToast({ tone: "success", message: "Đã cập nhật draft thành công." });
    } catch (error) {
      showToast({ tone: "error", message: getApiErrorMessage(error, "Không thể cập nhật event draft.") });
    } finally {
      setIsSaving(false);
    }
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

      <div className="mx-auto w-full max-w-[1104px] px-5 py-8 sm:px-8 lg:px-10">
        <section className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[2.4px] text-sky-700">Step 01 of 05</p>
          <h1 className="text-4xl font-bold leading-9 text-zinc-900">Basic Information</h1>
          <p className="text-sm text-gray-700">Event ID: {eventId || "N/A"}</p>
        </section>

        <section className="mt-8 space-y-6 rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
          {isLoading ? <p className="text-sm text-gray-700">Đang tải dữ liệu event...</p> : null}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-2xl bg-gray-100 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="w-full rounded-2xl bg-gray-100 px-6 py-4 text-base text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Event Description</label>
            <textarea
              rows={7}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full resize-y rounded-2xl bg-gray-100 px-6 py-4 text-base leading-6 text-zinc-900 outline-none ring-sky-500 transition focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => void handleSaveDraft()}
              disabled={!canSave || isSaving || isLoading}
              className="rounded-xl px-8 py-4 text-base font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Dang luu..." : "Save as Draft"}
            </button>

            <Link
              href={`${basePath}/location-time`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-4 text-base font-bold text-white"
            >
              Next Step
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
