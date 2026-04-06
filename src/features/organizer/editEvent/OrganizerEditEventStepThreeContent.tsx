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

export function OrganizerEditEventStepThreeContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;

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
                  src="https://placehold.co/900x360?text=Main+Event+Banner"
                  alt="Main event banner"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-900/20" />
                <div className="absolute left-6 bottom-6 rounded-2xl bg-white/80 px-4 py-2 text-xs tracking-wide backdrop-blur-sm">
                  <p className="font-bold uppercase text-zinc-900">Main Event Banner</p>
                  <p className="text-gray-700">Recommended: 1920x800px</p>
                </div>
                <div className="absolute right-4 top-4 flex items-center gap-3">
                  <button type="button" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-900 shadow-xl">
                    <Upload className="h-4 w-4" />
                    Change Banner
                  </button>
                  <button type="button" className="rounded-full bg-red-700 p-2 text-white shadow-xl" aria-label="Remove banner">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>

            <article className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Event Gallery</h2>
                <button type="button" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700">
                  <Upload className="h-4 w-4" />
                  Upload Multiple
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  type="button"
                  className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300/50 bg-gray-100 text-gray-700"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="mt-2 text-xs font-bold uppercase tracking-wider">Add Media</span>
                </button>

                {GALLERY_ITEMS.map((item) => (
                  <div key={item} className="relative overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                    <img src={item} alt="Gallery item" className="h-48 w-full object-cover" />
                    <button
                      type="button"
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
