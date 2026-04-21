import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import type { ApiResult } from "@/features/auth/types";
import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import {
  getOrganizerEventById,
  updateOrganizerEvent,
} from "@/features/organizer/events/services/create-event.service";
import {
  ORGANIZER_ALLOWED_IMAGE_TYPES,
  ORGANIZER_MAX_IMAGE_SIZE_BYTES,
  uploadOrganizerBanner,
} from "@/features/organizer/events/services/media-upload.service";
import type { OrganizerEvent } from "@/features/organizer/events/types";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "";
  }

  return eventId ?? "";
}

export function OrganizerEditEventStepThreeContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [bannerUrl, setBannerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
        if (eventData?.bannerUrl) {
          setBannerUrl(eventData.bannerUrl);
        }
      } catch (error) {
        setToast({
          tone: "error",
          message: getApiErrorMessage(error, "Unable to load current banner image."),
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [eventId]);

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

  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      showToast({ tone: "error", message: validationError });
      return;
    }

    if (!eventId || isUploading) {
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadOrganizerBanner(file);
      await updateOrganizerEvent(eventId, { bannerUrl: uploadedUrl, status: "DRAFT" });
      setBannerUrl(uploadedUrl);
      showToast({ tone: "success", message: "Banner uploaded successfully and URL saved." });
    } catch (error) {
      showToast({ tone: "error", message: getApiErrorMessage(error, "Banner upload failed.") });
    } finally {
      setIsUploading(false);
    }
  };

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    void handleUpload(file);
    event.target.value = "";
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

      <main className="mx-auto flex w-full max-w-[1104px] flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="space-y-2">
          <h1 className="text-4xl font-black leading-10 text-zinc-900">Edit Event Media</h1>
          <p className="text-sm text-gray-700">Event ID: {eventId || "N/A"}</p>
          <p className="text-sm text-gray-700">Supports PNG/JPG/WEBP, maximum 10MB.</p>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-zinc-900">Main Event Banner</h2>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={onSelectFile}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isLoading || !eventId}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-900 shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Dang upload..." : "Change Banner"}
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-gray-100">
            {bannerUrl ? (
              <img src={bannerUrl} alt="Main event banner" className="h-72 w-full object-cover" />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-gray-500">
                {isLoading ? "Loading banner..." : "No banner yet"}
              </div>
            )}
          </div>

          {bannerUrl ? (
            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wide text-gray-700">Banner URL</label>
              <input readOnly value={bannerUrl} className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900" />
            </div>
          ) : null}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-300/10 pb-8 pt-10">
          <Link href={`${basePath}/location-time`} className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-gray-700">
            <ChevronLeft className="h-4 w-4" />
            Previous Step
          </Link>

          <Link
            href={`${basePath}/team-access`}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-3 text-base font-bold text-white shadow-lg"
          >
            Next Step
            <ChevronRight className="h-4 w-4" />
          </Link>
        </footer>
      </main>
    </section>
  );
}
