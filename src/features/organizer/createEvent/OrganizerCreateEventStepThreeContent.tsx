import Link from "next/link";
import { useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ImagePlus,
  Play,
  Search,
  Settings,
  Sparkles,
  SquareChevronRight,
  Upload,
} from "lucide-react";

import { getApiErrorMessage } from "@/features/auth/utils";
import {
  uploadOrganizerMedia,
  validateOrganizerImageFile,
} from "@/features/organizer/events/services/upload-media.service";

const CREATE_EVENT_BANNER_URL_KEY = "organizer_create_event_banner_url";

type NoticeTone = "success" | "error";

export function OrganizerCreateEventStepThreeContent() {
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [notice, setNotice] = useState<{ tone: NoticeTone; message: string } | null>(null);

  const showNotice = (tone: NoticeTone, message: string) => {
    setNotice({ tone, message });
  };

  const handleBannerUpload = async (file: File | null) => {
    if (!file || isUploadingBanner) {
      return;
    }

    const validation = validateOrganizerImageFile(file);
    if (!validation.ok) {
      showNotice("error", validation.message);
      return;
    }

    setIsUploadingBanner(true);
    setNotice(null);

    try {
      const uploaded = await uploadOrganizerMedia(file, "banner");
      setBannerUrl(uploaded.url);

      if (typeof window !== "undefined") {
        localStorage.setItem(CREATE_EVENT_BANNER_URL_KEY, uploaded.url);
      }

      showNotice("success", "Upload banner thanh cong.");
    } catch (error) {
      showNotice("error", getApiErrorMessage(error, "Khong the upload banner. Vui long thu lai."));
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || isUploadingGallery) {
      return;
    }

    const pickedFiles = Array.from(files);
    const invalidFile = pickedFiles.find((file) => !validateOrganizerImageFile(file).ok);

    if (invalidFile) {
      const invalidReason = validateOrganizerImageFile(invalidFile);
      if (!invalidReason.ok) {
        showNotice("error", invalidReason.message);
      }
      return;
    }

    setIsUploadingGallery(true);
    setNotice(null);

    try {
      const uploadedResults = await Promise.all(
        pickedFiles.map((file) => uploadOrganizerMedia(file, "gallery")),
      );

      const uploadedUrls = uploadedResults.map((item) => item.url);
      setGalleryUrls((prev) => [...uploadedUrls, ...prev].slice(0, 12));
      showNotice("success", `Da upload ${uploadedUrls.length} hinh anh thanh cong.`);
    } catch (error) {
      showNotice("error", getApiErrorMessage(error, "Khong the upload gallery. Vui long thu lai."));
    } finally {
      setIsUploadingGallery(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
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
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute left-6 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-px bg-slate-300/30" />
          <p className="text-sm font-bold tracking-wider text-gray-700">ORGANIZER DASHBOARD</p>
        </div>
      </header>

      <div className="px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="w-full space-y-12">
          {notice ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                notice.tone === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {notice.message}
            </div>
          ) : null}

          <section className="space-y-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="pb-1 text-4xl font-bold leading-10 text-zinc-900">Visuals</h1>
                <p className="text-base leading-6 text-gray-700">Upload high-quality images to make your event stand out.</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm font-bold uppercase tracking-wider text-sky-700">Step 3 of 5</p>
                <p className="text-xs text-gray-700">60% Completed</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-3/5 bg-gradient-to-r from-sky-700 to-violet-700" />
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.55fr_1fr]">
            <div className="space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-900">
                    <ImagePlus className="h-4 w-4 text-sky-700" />
                    Event Banner
                  </h2>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-normal uppercase tracking-wide text-gray-700">
                    Recommended: 1920x1080px
                  </span>
                </div>

                <div className="rounded-3xl bg-white px-8 py-20 outline outline-2 outline-slate-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <Upload className="h-6 w-6 text-sky-700" />
                    </div>
                    <h3 className="pb-1 text-lg font-semibold text-zinc-900">Click to upload banner</h3>
                    <p className="max-w-80 text-sm leading-5 text-gray-700">
                      PNG, JPG or WebP (Max 10MB). High resolution
                      <br />
                      landscape images work best.
                    </p>
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        void handleBannerUpload(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      disabled={isUploadingBanner}
                      className="mt-4 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploadingBanner ? "Dang upload..." : "Chon file banner"}
                    </button>
                    {bannerUrl ? (
                      <p className="mt-3 max-w-full truncate text-xs text-gray-700">URL: {bannerUrl}</p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="space-y-6 pb-8">
                <h2 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-900">
                  <ImagePlus className="h-5 w-5 text-sky-700" />
                  Gallery Images
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploadingGallery}
                    className="inline-flex min-h-36 flex-col items-center justify-center rounded-2xl outline outline-2 outline-slate-300"
                  >
                    <Upload className="h-5 w-5 text-gray-500" />
                    <span className="pt-2 text-xs font-medium text-gray-700">
                      {isUploadingGallery ? "Dang upload..." : "Add Media"}
                    </span>
                  </button>

                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      void handleGalleryUpload(event.target.files);
                    }}
                  />

                  {galleryUrls.map((item) => (
                    <div key={item} className="group relative overflow-hidden rounded-2xl bg-gray-100">
                      <img src={item} alt="Uploaded media" className="h-36 w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40 opacity-0 transition group-hover:opacity-100">
                        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md">
                          <SquareChevronRight className="h-3.5 w-3.5 text-zinc-900" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {[1, 2, 3].map((item) => (
                    <div key={item} className="group relative overflow-hidden rounded-2xl bg-gray-100">
                      <div className="h-36 bg-[linear-gradient(135deg,#dbe7ff,#e8ddff)]" />
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40 opacity-0 transition group-hover:opacity-100">
                        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md">
                          <SquareChevronRight className="h-3.5 w-3.5 text-zinc-900" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <article className="rounded-3xl bg-gradient-to-br from-gray-100 to-slate-100 p-6 outline outline-1 outline-slate-300/10">
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200">
                    <Sparkles className="h-3.5 w-3.5 text-violet-950" />
                  </span>
                  <h3 className="text-base font-bold text-zinc-900">Pro Tips</h3>
                </div>

                <ul className="space-y-4">
                  <li className="inline-flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-700/10 text-xs font-bold text-sky-700">01</span>
                    <p className="text-sm leading-6 text-gray-700">Use images that highlight crowd energy and atmosphere to improve ticket conversion.</p>
                  </li>
                  <li className="inline-flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-700/10 text-xs font-bold text-sky-700">02</span>
                    <p className="text-sm leading-6 text-gray-700">Avoid dense text overlays so your visuals stay clean and premium on all devices.</p>
                  </li>
                  <li className="inline-flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-700/10 text-xs font-bold text-sky-700">03</span>
                    <p className="text-sm leading-6 text-gray-700">Add at least 3 gallery images to unlock premium listing visibility on discovery pages.</p>
                  </li>
                </ul>
              </article>

              <article className="rounded-3xl bg-white p-6 outline outline-1 outline-slate-300/20 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.05)]">
                <h3 className="text-base font-bold text-zinc-900">Event Teaser Video</h3>
                <p className="mt-1 text-xs leading-5 text-gray-700">Share a short trailer link to increase trust and excitement before purchase.</p>
                <div className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900/5 py-12 outline outline-1 outline-slate-300/30">
                  <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <Play className="h-3.5 w-3.5" />
                    Add YouTube/Vimeo Link
                  </button>
                </div>
              </article>
            </aside>
          </section>

          <footer className="flex items-center justify-between border-t border-gray-100 pt-10">
            <Link href="/organizer/create-event/location-time" className="inline-flex items-center gap-2 rounded-2xl px-8 py-3 text-base font-bold text-gray-700">
              <ChevronDown className="h-4 w-4 rotate-90" />
              Back to Location
            </Link>

            <div className="flex items-center gap-4">
              <button type="button" className="rounded-2xl bg-blue-100 px-8 py-3 text-base font-bold text-sky-700">
                Save Draft
              </button>
              <Link
                href="/organizer/create-event/tickets-pricing"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-3 text-base font-bold text-white shadow-[0px_4px_6px_-4px_rgba(0,88,190,0.20),0px_10px_15px_-3px_rgba(0,88,190,0.20)]"
              >
                Next Step: Tickets
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
