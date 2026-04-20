import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ImagePlus,
  MoreHorizontal,
  Search,
  Settings,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import {
  getOrganizerEventById,
  updateOrganizerEvent,
} from "@/features/organizer/events/services/create-event.service";
import {
  uploadOrganizerMedia,
  validateOrganizerImageFile,
} from "@/features/organizer/events/services/upload-media.service";

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "event";
  }

  return eventId ?? "event";
}

const GALLERY_ITEMS = [
  "https://placehold.co/300x220?text=Gallery+01",
  "https://placehold.co/300x220?text=Gallery+02",
  "https://placehold.co/300x220?text=Gallery+03",
  "https://placehold.co/300x220?text=Gallery+04",
];

type NoticeTone = "success" | "error";

export function OrganizerEditEventStepThreeContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const [bannerUrl, setBannerUrl] = useState("https://placehold.co/900x360?text=Main+Event+Banner");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [notice, setNotice] = useState<{ tone: NoticeTone; message: string } | null>(null);

  const galleryStorageKey = useMemo(() => `organizer_event_gallery_${eventId}`, [eventId]);

  useEffect(() => {
    let mounted = true;

    const loadEvent = async () => {
      setIsLoadingEvent(true);

      try {
        const response = await getOrganizerEventById(eventId);
        const event = getApiResultData(response);

        if (mounted && event?.bannerUrl) {
          setBannerUrl(event.bannerUrl);
        }
      } catch {
        if (mounted) {
          setNotice({ tone: "error", message: "Khong the tai du lieu event." });
        }
      } finally {
        if (mounted) {
          setIsLoadingEvent(false);
        }
      }
    };

    void loadEvent();

    if (typeof window !== "undefined") {
      const savedGallery = localStorage.getItem(galleryStorageKey);
      if (savedGallery) {
        try {
          const parsed = JSON.parse(savedGallery) as unknown;
          if (Array.isArray(parsed)) {
            setGalleryUrls(parsed.filter((item): item is string => typeof item === "string"));
          }
        } catch {
          localStorage.removeItem(galleryStorageKey);
        }
      }
    }

    return () => {
      mounted = false;
    };
  }, [eventId, galleryStorageKey]);

  const showNotice = (tone: NoticeTone, message: string) => {
    setNotice({ tone, message });
  };

  const handleUploadBanner = async (file: File | null) => {
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
      await updateOrganizerEvent(eventId, { bannerUrl: uploaded.url });
      setBannerUrl(uploaded.url);
      showNotice("success", "Upload banner thanh cong.");
    } catch (error) {
      showNotice("error", getApiErrorMessage(error, "Khong the upload banner."));
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    }
  };

  const handleUploadGallery = async (files: FileList | null) => {
    if (!files || files.length === 0 || isUploadingGallery) {
      return;
    }

    const selectedFiles = Array.from(files);
    const invalidFile = selectedFiles.find((file) => !validateOrganizerImageFile(file).ok);

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
      const uploaded = await Promise.all(selectedFiles.map((file) => uploadOrganizerMedia(file, "gallery")));
      const uploadedUrls = uploaded.map((item) => item.url);

      setGalleryUrls((prev) => {
        const merged = [...uploadedUrls, ...prev].slice(0, 20);
        if (typeof window !== "undefined") {
          localStorage.setItem(galleryStorageKey, JSON.stringify(merged));
        }
        return merged;
      });

      showNotice("success", `Da upload ${uploadedUrls.length} hinh anh thanh cong.`);
    } catch (error) {
      showNotice("error", getApiErrorMessage(error, "Khong the upload gallery."));
    } finally {
      setIsUploadingGallery(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  };

  const handleRemoveBanner = async () => {
    if (isUploadingBanner) {
      return;
    }

    try {
      await updateOrganizerEvent(eventId, { bannerUrl: "" });
      setBannerUrl("https://placehold.co/900x360?text=Main+Event+Banner");
      showNotice("success", "Da xoa banner khoi event.");
    } catch (error) {
      showNotice("error", getApiErrorMessage(error, "Khong the xoa banner."));
    }
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-8 py-4">
        <div className="flex items-center gap-6">
          <p className="text-2xl font-black leading-8 text-sky-700">Kinetic Gallery</p>
          <div className="h-6 w-px bg-slate-300/40" />
          <nav className="hidden items-center gap-4 md:flex">
            <Link href="/organizer/events" className="text-base text-gray-700">
              Overview
            </Link>
            <span className="border-b-2 border-sky-700 pb-1 text-base font-bold text-sky-700">Editor</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <div className="inline-flex w-64 items-center rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-500">
              Search events...
            </div>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-700" />
          </div>

          <button type="button" className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <img
            src="https://placehold.co/40x40"
            alt="Organizer profile"
            className="h-10 w-10 rounded-full border-2 border-gray-200"
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1104px] flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        {notice ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              notice.tone === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Events</span>
            <span>›</span>
            <span>Edit Event</span>
            <span>›</span>
            <span className="font-semibold text-zinc-900">Media</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black leading-10 text-zinc-900">Prism Flow Music Festival 2024</h1>
              <p className="text-base text-gray-700">Curate the visual identity of your performance stage.</p>
            </div>

            <div className="space-y-2">
              <p className="text-right text-base font-bold uppercase tracking-widest text-sky-700">Step 03 of 05</p>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-28 bg-gradient-to-r from-sky-700 to-violet-700" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <article className="rounded-3xl bg-white p-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={bannerUrl}
                  alt="Main event banner"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-900/20" />
                <div className="absolute left-6 bottom-6 rounded-2xl bg-white/80 px-4 py-2 text-xs tracking-wide backdrop-blur-sm">
                  <p className="font-bold uppercase text-zinc-900">Main Event Banner</p>
                  <p className="text-gray-700">Recommended: 1920x800px</p>
                </div>
                <div className="absolute right-4 top-4 flex items-center gap-3">
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      void handleUploadBanner(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={isUploadingBanner || isLoadingEvent}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-900 shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploadingBanner ? "Uploading..." : "Change Banner"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemoveBanner()}
                    className="rounded-full bg-red-700 p-2 text-white shadow-xl"
                    aria-label="Remove banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>

            <article className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Event Gallery</h2>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    void handleUploadGallery(event.target.files);
                  }}
                />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isUploadingGallery}
                  className="inline-flex items-center gap-1 text-sm font-bold text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="h-4 w-4" />
                  {isUploadingGallery ? "Uploading..." : "Upload Multiple"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300/50 bg-gray-100 text-gray-700"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="mt-2 text-xs font-bold uppercase tracking-wider">Add Media</span>
                </button>

                {[...galleryUrls, ...GALLERY_ITEMS].map((item) => (
                  <div key={item} className="relative overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                    <img src={item} alt="Gallery item" className="h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryUrls((prev) => {
                          const next = prev.filter((url) => url !== item);
                          if (typeof window !== "undefined") {
                            localStorage.setItem(galleryStorageKey, JSON.stringify(next));
                          }
                          return next;
                        });
                      }}
                      className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-700 shadow-md"
                      aria-label="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <img src="https://placehold.co/300x220?text=+12" alt="More media" className="h-48 w-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">+12</div>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-6 pb-12">
            <article className="rounded-3xl border border-slate-300/10 bg-gray-100 p-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Media Requirements</h3>

              <ul className="mt-4 space-y-4 border-b border-slate-300/20 pb-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-sky-700" />
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Banner Dimensions</p>
                    <p className="text-xs leading-4 text-gray-700">At least 1920x800px for optimal display on 4K screens.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-sky-700" />
                  <div>
                    <p className="text-sm font-bold text-zinc-900">File Formats</p>
                    <p className="text-xs leading-4 text-gray-700">Supports JPG, PNG, and WebP up to 10MB each.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-gray-500/40" />
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Video Link</p>
                    <p className="text-xs leading-4 text-gray-700">Paste a YouTube or Vimeo link to show a teaser.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">Video Teaser URL</label>
                <div className="relative">
                  <input
                    type="text"
                    value="https://youtube.com/..."
                    readOnly
                    className="w-full rounded-2xl bg-white px-4 py-3 pr-10 text-sm text-gray-500 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                  />
                  <MoreHorizontal className="absolute right-3 top-3.5 h-4 w-4 text-gray-700" />
                </div>
              </div>
            </article>

            <article className="rounded-3xl bg-blue-100 p-6">
              <div className="flex items-center gap-2">
                <CircleHelp className="h-5 w-5 text-sky-950" />
                <h4 className="text-sm font-bold text-sky-950">Smart Cropping</h4>
              </div>

              <p className="mt-2 text-xs leading-5 text-sky-950/80">
                Our AI will automatically center the most important elements of your media for mobile and desktop views. Use the preview
                to check result.
              </p>

              <button type="button" className="mt-3 w-full rounded-2xl bg-sky-950 py-2 text-xs font-bold uppercase tracking-wider text-white">
                Preview All Views
              </button>
            </article>
          </aside>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-300/10 pb-8 pt-10">
          <Link href={`${basePath}/location-time`} className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-gray-700">
            <ChevronLeft className="h-4 w-4" />
            Previous Step
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="rounded-2xl px-8 py-3 text-base font-bold text-gray-700">
              Skip for Now
            </button>
            <Link
              href={`${basePath}/team-access`}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-3 text-base font-bold text-white shadow-lg"
            >
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </footer>
      </main>
    </section>
  );
}
