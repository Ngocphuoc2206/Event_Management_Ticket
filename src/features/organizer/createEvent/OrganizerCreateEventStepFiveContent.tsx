import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import type { ApiResult } from "@/features/auth/types";
import {
  getOrganizerDraftEventId,
  getOrganizerDraftPayload,
  mergeOrganizerDraftPayload,
  setOrganizerDraftEventId,
  setOrganizerDraftPayload,
} from "@/features/organizer/events/services/draft-storage";
import {
  getOrganizerEventById,
  saveOrganizerEventDraft,
  submitOrganizerEvent,
  updateOrganizerEvent,
} from "@/features/organizer/events/services/create-event.service";
import { getOrganizerTicketTypes } from "@/features/organizer/events/services/ticket-types.service";
import type {
  OrganizerCreateEventPayload,
  OrganizerEvent,
  OrganizerTicketType,
} from "@/features/organizer/events/types";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

function getStringField(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function mapToCreatePayload(
  source: unknown,
): Partial<OrganizerCreateEventPayload> {
  if (!source || typeof source !== "object") {
    return {};
  }

  const data = source as Record<string, unknown>;

  return {
    title: getStringField(data, ["title", "name", "eventName"]),
    shortDescription: getStringField(data, [
      "shortDescription",
      "short_description",
      "summary",
    ]),
    description: getStringField(data, ["description", "details", "content"]),
    category: getStringField(data, ["category", "eventCategory"]),
    venueName: getStringField(data, [
      "venueName",
      "venue_name",
      "venue",
      "locationName",
    ]),
    address: getStringField(data, [
      "address",
      "venueAddress",
      "locationAddress",
    ]),
    city: getStringField(data, ["city"]),
    bannerUrl: getStringField(data, [
      "bannerUrl",
      "banner_url",
      "banner",
      "imageUrl",
    ]),
    startTime: getStringField(data, [
      "startTime",
      "start_time",
      "startDateTime",
    ]),
    endTime: getStringField(data, ["endTime", "end_time", "endDateTime"]),
    visibility: "PUBLIC",
    minPrice: typeof data.minPrice === "number" ? data.minPrice : undefined,
    status:
      typeof data.status === "string"
        ? (data.status as OrganizerCreateEventPayload["status"])
        : undefined,
  };
}

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

function mergePayloadWithFallback(
  payload?: Partial<OrganizerCreateEventPayload>,
): OrganizerCreateEventPayload {
  const fallback = buildFallbackDraftPayload();

  return {
    ...fallback,
    ...payload,
    title: payload?.title?.trim() || fallback.title,
    shortDescription:
      payload?.shortDescription?.trim() || fallback.shortDescription,
    description: payload?.description?.trim() || fallback.description,
    category: payload?.category?.trim() || fallback.category,
    venueName: payload?.venueName?.trim() || fallback.venueName,
    address: payload?.address?.trim() || fallback.address,
    city: payload?.city?.trim() || fallback.city,
    bannerUrl: payload?.bannerUrl?.trim() || fallback.bannerUrl,
    startTime: payload?.startTime?.trim() || fallback.startTime,
    endTime: payload?.endTime?.trim() || fallback.endTime,
    visibility: "PUBLIC",
    minPrice: Number(payload?.minPrice ?? fallback.minPrice),
    status: (payload?.status ?? "DRAFT") as OrganizerCreateEventPayload["status"],
  };
}

export function OrganizerCreateEventStepFiveContent() {
  const router = useRouter();
  const [eventId, setEventId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("DRAFT");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmittingWorkflow, setIsSubmittingWorkflow] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [reviewPayload, setReviewPayload] =
    useState<OrganizerCreateEventPayload>(buildFallbackDraftPayload());

  useEffect(() => {
    const queryEventId =
      typeof router.query.eventId === "string" ? router.query.eventId : null;
    const storedEventId = getOrganizerDraftEventId();
    const resolvedEventId = queryEventId || storedEventId;

    const localDraftPayload = mergePayloadWithFallback(
      mapToCreatePayload(getOrganizerDraftPayload()),
    );
    setReviewPayload(localDraftPayload);

    if (!resolvedEventId) {
      return;
    }

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

        if (eventData) {
          const normalizedEventPayload = mapToCreatePayload(eventData);
          const hydratedPayload = mergePayloadWithFallback({
            ...normalizedEventPayload,
            ...mapToCreatePayload(getOrganizerDraftPayload()),
          });

          setReviewPayload(hydratedPayload);
          setOrganizerDraftPayload(hydratedPayload);
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
    return mergePayloadWithFallback({
      ...mapToCreatePayload(getOrganizerDraftPayload()),
      ...mapToCreatePayload(reviewPayload),
      status: "DRAFT",
    });
  };

  const toIsoOrFallback = (value: string | undefined, fallback: string) => {
    const parsed = new Date(value ?? "");
    return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
  };

  const toNumberOrZero = (value: unknown) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const buildCreatePayload = async (
    currentEventId: string,
  ): Promise<OrganizerCreateEventPayload> => {
    const latestPayload = resolveDraftPayload();
    mergeOrganizerDraftPayload(latestPayload as OrganizerCreateEventPayload);
    setReviewPayload((prev) => ({
      ...prev,
      ...mapToCreatePayload(latestPayload),
    }));

    let ticketTypes: OrganizerTicketType[] = [];

    try {
      ticketTypes = await getOrganizerTicketTypes(currentEventId);
    } catch {
      ticketTypes = [];
    }

    const totalTickets = ticketTypes.reduce(
      (sum, ticket) => sum + Number(ticket.quantity ?? 0),
      0,
    );

    const availableTickets = ticketTypes.reduce(
      (sum, ticket) => sum + Number(ticket.quantity ?? ticket.quantity ?? 0),
      0,
    );

    const minPriceFromTickets =
      ticketTypes.length > 0
        ? Math.min(...ticketTypes.map((ticket) => toNumberOrZero(ticket.price)))
        : toNumberOrZero(latestPayload.minPrice);

    const fallbackPayload = buildFallbackDraftPayload();

    return {
      title: latestPayload.title?.trim() || fallbackPayload.title,
      shortDescription:
        latestPayload.shortDescription?.trim() ||
        latestPayload.description?.trim().slice(0, 160) ||
        fallbackPayload.shortDescription,
      description:
        latestPayload.description?.trim() || fallbackPayload.description,
      category: latestPayload.category?.trim() || fallbackPayload.category,
      venueName: latestPayload.venueName?.trim() || fallbackPayload.venueName,
      address: latestPayload.address?.trim() || fallbackPayload.address,
      city: latestPayload.city?.trim() || fallbackPayload.city,
      bannerUrl: latestPayload.bannerUrl?.trim() || fallbackPayload.bannerUrl,
      startTime: toIsoOrFallback(
        latestPayload.startTime,
        fallbackPayload.startTime,
      ),
      endTime: toIsoOrFallback(latestPayload.endTime, fallbackPayload.endTime),
      visibility: "PUBLIC",
      minPrice: Number(minPriceFromTickets),
      status: "DRAFT",
      total_tickets: totalTickets,
      availability_tickets: availableTickets,
    };
  };

  const resolveEventId = async () => {
    if (eventId) {
      return eventId;
    }

    const draftPayload = resolveDraftPayload();
    const draftResult = await saveOrganizerEventDraft(
      draftPayload as OrganizerCreateEventPayload,
    );
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
      await saveOrganizerEventDraft(
        draftPayload as OrganizerCreateEventPayload,
        id,
      );
      setReviewPayload(draftPayload as OrganizerCreateEventPayload);
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

  const handleSubmitWorkflow = async () => {
    if (isSubmittingWorkflow) {
      return;
    }

    setIsSubmittingWorkflow(true);

    try {
      const id = await resolveEventId();
      const createPayload = await buildCreatePayload(id);

      await updateOrganizerEvent(id, {
        ...createPayload,
        status: "DRAFT",
      });
      const result = await submitOrganizerEvent(id);

      const updatedEvent = getApiResultData(
        result as ApiResult<OrganizerEvent>,
      );

      setStatus(String(updatedEvent?.status ?? "PENDING"));

      showToast({
        tone: "success",
        message: "Sự kiện đã được gửi duyệt thành công.",
      });

      await router.push("/organizer/events");
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
              Save Draft dùng cho trạng thái DRAFT. Nút chính sẽ tạo sự kiện qua
              POST /api/organizer/events, backend sẽ tự xử lý trạng thái chờ
              duyệt.
            </p>

            <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => void handleSubmitWorkflow()}
                disabled={isSubmittingWorkflow}
                className="inline-flex w-full justify-center rounded-3xl bg-gradient-to-r from-sky-700 to-violet-700 px-8 py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingWorkflow ? "Dang xu ly..." : "Submit For Approval"}
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

          <section className="rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <h2 className="text-xl font-bold text-zinc-900">
              Review Event Data
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Dữ liệu bên dưới được lấy từ state tổng (draft payload) của toàn
              bộ các bước.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Title
                </p>
                <p className="text-sm text-zinc-900">
                  {reviewPayload.title || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Category
                </p>
                <p className="text-sm text-zinc-900">
                  {reviewPayload.category || "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Description
                </p>
                <p className="text-sm text-zinc-900">
                  {reviewPayload.description || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Venue Name
                </p>
                <p className="text-sm text-zinc-900">
                  {reviewPayload.venueName || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Address
                </p>
                <p className="text-sm text-zinc-900">
                  {reviewPayload.address || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Start Time
                </p>
                <p className="text-sm text-zinc-900">
                  {reviewPayload.startTime || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  End Time
                </p>
                <p className="text-sm text-zinc-900">
                  {reviewPayload.endTime || "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Banner URL
                </p>
                <p className="break-all text-sm text-zinc-900">
                  {reviewPayload.bannerUrl || "-"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
