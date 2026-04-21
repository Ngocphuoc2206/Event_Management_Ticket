import Link from "next/link";
import { AlertCircle, CheckCircle2, ChevronDown, ImagePlus, Upload } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import { getApiErrorMessage } from "@/features/auth/utils";
import {
  getOrganizerDraftPayload,
  setOrganizerDraftPayload,
} from "@/features/organizer/events/services/draft-storage";
import { updateOrganizerEvent } from "@/features/organizer/events/services/create-event.service";
import {
  ORGANIZER_ALLOWED_IMAGE_TYPES,
  ORGANIZER_MAX_IMAGE_SIZE_BYTES,
  uploadOrganizerBanner,
} from "@/features/organizer/events/services/media-upload.service";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

export function OrganizerCreateEventStepThreeContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const eventId = useMemo(() => {
    const queryEventId = router.query.eventId;
    return typeof queryEventId === "string" ? queryEventId : null;
  }, [router.query.eventId]);

  useEffect(() => {
    const draft = getOrganizerDraftPayload();
    if (draft?.bannerUrl) {
      setBannerUrl(draft.bannerUrl);
    }
  }, []);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const validateFile = (file: File) => {
    if (!ORGANIZER_ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Invalid file format. Only PNG, JPG, and WEBP are supported.";
    }

    if (file.size > ORGANIZER_MAX_IMAGE_SIZE_BYTES) {
      return "File is too large. Maximum size is 10MB.";
    }

    return null;
  };

  const handleUploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      showToast({ tone: "error", message: validationError });
      return;
    }

    if (isUploading) {
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadOrganizerBanner(file);
      setBannerUrl(uploadedUrl);

      const draftPayload = getOrganizerDraftPayload() ?? {};
      setOrganizerDraftPayload({ ...draftPayload, bannerUrl: uploadedUrl });

      if (eventId) {
        await updateOrganizerEvent(eventId, { bannerUrl: uploadedUrl, status: "DRAFT" });
      }

      showToast({ tone: "success", message: "Tải ảnh lên thành công" });
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Banner upload failed. Please try again."),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    void handleUploadFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    void handleUploadFile(file);
  };

  const nextHref = eventId
    ? {
        pathname: "/organizer/create-event/tickets-pricing",
        query: { eventId },
      }
    : "/organizer/create-event/tickets-pricing";

  const prevHref = eventId
    ? {
        pathname: "/organizer/create-event/location-time",
        query: { eventId },
      }
    : "/organizer/create-event/location-time";

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
        <div className="mx-auto w-full max-w-[1160px] space-y-8">
          <section className="space-y-3">
            <h1 className="text-4xl font-bold text-zinc-900">Visuals</h1>
            <p className="text-base text-gray-700">Upload banner (PNG/JPG/WEBP, max 10MB). URL is saved to draft/event.</p>
            <p className="text-sm text-gray-700">Event ID: {eventId ?? "(none yet - save draft in step 1)"}</p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <div className="mb-4 flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-bold text-zinc-900">Event Banner</h2>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleSelectFile}
            />

            <div
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-gray-50 px-8 py-14 text-center"
            >
              {bannerUrl ? (
                <div className="space-y-3">
                  <img src={bannerUrl} alt="Uploaded banner" className="h-56 w-full rounded-2xl object-cover" />
                  <p className="text-sm text-gray-700">Click để thay đổi ảnh banner</p>
                </div>
              ) : (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                    <Upload className="h-6 w-6 text-sky-700" />
                  </div>
                  <p className="text-lg font-semibold text-zinc-900">Click or drag and drop to upload banner</p>
                  <p className="mt-2 text-sm text-gray-700">Only PNG/JPG/WEBP, up to 10MB.</p>
                </>
              )}
              <p className="mt-2 text-xs text-gray-500">{isUploading ? "Uploading..." : "Ready to upload"}</p>
            </div>

            {bannerUrl ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-zinc-900">Uploaded URL</p>
                <input
                  readOnly
                  value={bannerUrl}
                  className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </div>
            ) : null}
          </section>

          <footer className="flex items-center justify-between border-t border-gray-100 pt-8">
            <Link href={prevHref} className="inline-flex items-center gap-2 rounded-2xl px-8 py-3 text-base font-bold text-gray-700">
              <ChevronDown className="h-4 w-4 rotate-90" />
              Back to Location
            </Link>

            <Link
              href={nextHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-3 text-base font-bold text-white"
            >
              Next Step: Tickets
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Link>
          </footer>
        </div>
      </div>
    </section>
  );
}
