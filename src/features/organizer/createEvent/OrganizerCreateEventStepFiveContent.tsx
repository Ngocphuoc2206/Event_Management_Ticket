import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import type { ApiResult } from "@/features/auth/types";
import {
  getOrganizerDraftEventId,
  getOrganizerDraftPayload,
  setOrganizerDraftEventId,
} from "@/features/organizer/events/services/draft-storage";
import {
  getOrganizerEventById,
  publishOrganizerEvent,
  saveOrganizerEventDraft,
  submitOrganizerEventForApproval,
} from "@/features/organizer/events/services/create-event.service";
import type {
  OrganizerCreateEventPayload,
  OrganizerEvent,
} from "@/features/organizer/events/types";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

function buildFallbackDraftPayload(): OrganizerCreateEventPayload {
  const now = new Date();
  const start = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
  const end = new Date(start.getTime() + 1000 * 60 * 60 * 4);

  return {
    title: "Untitled organizer event",
    shortDescription: "Draft created from organizer workflow",
    description: "Draft created from organizer workflow",
    category: "General",
    venueName: "TBD Venue",
    address: "TBD Address",
    city: "Ho Chi Minh",
    bannerUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    visibility: "PUBLIC",
    minPrice: 0,
    status: "DRAFT",
  };
}

export function OrganizerCreateEventStepFiveContent() {
  const router = useRouter();
  const [eventId, setEventId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("DRAFT");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmittingWorkflow, setIsSubmittingWorkflow] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const queryEventId =
      typeof router.query.eventId === "string" ? router.query.eventId : null;
    const storedEventId = getOrganizerDraftEventId();
    const resolvedEventId = queryEventId || storedEventId;

    if (!resolvedEventId) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEventId(resolvedEventId);
    setOrganizerDraftEventId(resolvedEventId);

    void (async () => {
      try {
        const apiResult = await getOrganizerEventById(resolvedEventId);
        const eventData = getApiResultData(
          apiResult as ApiResult<OrganizerEvent>,
        );
        if (eventData?.status) {
          setStatus(String(eventData.status));
        }
      } catch {
        // Keep default status when detail endpoint is not reachable.
      }
    })();
  }, [router.query.eventId]);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const resolveDraftPayload = () => {
    return (
      (getOrganizerDraftPayload() as OrganizerCreateEventPayload | null) ??
      buildFallbackDraftPayload()
    );
  };

  const resolveEventId = async () => {
    if (eventId) {
      return eventId;
    }

    const draftPayload = resolveDraftPayload();
    const draftResult = await saveOrganizerEventDraft(draftPayload);
    const draftData = getApiResultData(
      draftResult as ApiResult<OrganizerEvent>,
    );
    const createdId = draftData?.id;

    if (!createdId) {
      throw new Error("Không thể tạo draft event trước khi submit.");
    }

    setEventId(createdId);
    setOrganizerDraftEventId(createdId);
    return createdId;
  };

  const handleSaveDraft = async () => {
    if (isSavingDraft) {
      return;
    }

    setIsSavingDraft(true);
    try {
      const id = await resolveEventId();
      const draftPayload = resolveDraftPayload();
      await saveOrganizerEventDraft(draftPayload, id);
      setStatus("DRAFT");
      showToast({ tone: "success", message: "Đã lưu draft thành công." });
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Không thể lưu draft."),
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const canPublishDirectly = useMemo(
    () => status.toUpperCase() === "APPROVED",
    [status],
  );

  const handleSubmitWorkflow = async () => {
    if (isSubmittingWorkflow) {
      return;
    }

    setIsSubmittingWorkflow(true);
    try {
      const id = await resolveEventId();

      if (canPublishDirectly) {
        await publishOrganizerEvent(id);
        setStatus("PUBLISHED");
        showToast({ tone: "success", message: "Sự kiện đã được publish." });
      } else {
        await submitOrganizerEventForApproval(id);
        setStatus("PENDING_APPROVAL");
        showToast({
          tone: "success",
          message: "Đã submit sự kiện để chờ duyệt.",
        });
      }
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Không thể cập nhật workflow."),
      });
    } finally {
      setIsSubmittingWorkflow(false);
    }
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      {toast ? (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.tone === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
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

      <div className="w-full px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="mx-auto w-full max-w-[1160px] space-y-8">
          <section className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
              Final Step
            </p>
            <h1 className="text-4xl font-bold leading-10 text-zinc-900">
              Review &amp; Publish
            </h1>
            <p className="text-base text-gray-700">
              Event ID: {eventId ?? "(chưa có - sẽ tạo khi save/submit)"}
            </p>
            <p className="text-base text-gray-700">Current Status: {status}</p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <h2 className="text-xl font-bold text-zinc-900">
              Workflow Actions
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Save Draft dùng cho trạng thái DRAFT. Nút chính sẽ tự động Submit
              for Approval, hoặc Publish nếu event đã APPROVED.
            </p>

            <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => void handleSubmitWorkflow()}
                disabled={isSubmittingWorkflow}
                className="inline-flex w-full justify-center rounded-3xl bg-gradient-to-r from-sky-700 to-violet-700 px-8 py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingWorkflow
                  ? "Dang xu ly..."
                  : canPublishDirectly
                    ? "Publish Event"
                    : "Submit For Approval"}
              </button>

              <button
                type="button"
                onClick={() => void handleSaveDraft()}
                disabled={isSavingDraft}
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gray-200 px-8 py-4 text-base font-bold text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSavingDraft ? "Dang luu..." : "Save as Draft"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
