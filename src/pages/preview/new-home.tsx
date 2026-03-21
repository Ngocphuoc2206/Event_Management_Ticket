import Head from "next/head";
import {
  ArrowRight,
  CalendarDays,
  CircleDot,
  Clock3,
  CreditCard,
  ExternalLink,
  Heart,
  Instagram,
  MapPin,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
  Youtube,
} from "lucide-react";

const NAV_ITEMS = ["Explore", "Venues", "Schedule", "Support"];
const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Settings", "Contact Us"];

const SCHEDULE_ITEMS = [
  {
    time: "18:00",
    meridiem: "PM",
    title: "Doors Open & Kinetic Gallery Tour",
    description: "Early entry for VIP and Early Bird ticket holders.",
  },
  {
    time: "20:00",
    meridiem: "PM",
    title: "Opening Act: Neon Pulse",
    description: "Synthesizer dreamscapes and live visuals.",
  },
  {
    time: "22:00",
    meridiem: "PM",
    title: "Headliner: The Prism Collective",
    description: "The signature 3-hour audio-visual journey.",
  },
];

const TICKET_TIERS = [
  {
    name: "VIP Experience",
    description: "Front row + Backstage access",
    price: "$249",
    status: "4 Left",
    featured: true,
    soldOut: false,
  },
  {
    name: "Standard Floor",
    description: "Main arena standing access",
    price: "$89",
    status: "Available",
    featured: false,
    soldOut: false,
  },
  {
    name: "Early Bird",
    description: "Limited early release pricing",
    price: "$59",
    status: "Sold Out",
    featured: false,
    soldOut: true,
  },
];

const RELATED_EVENTS = [
  {
    category: "Digital Art",
    title: "Cyber Resonance 0.2",
    meta: "Sep 12 • Brooklyn Navy Yard",
    visualClass: "bg-[radial-gradient(circle_at_20%_20%,#67e8f9_0,#1d4ed8_35%,#0f172a_80%)]",
  },
  {
    category: "Nightlife",
    title: "Deep House Sessions",
    meta: "Oct 05 • The Echo Room",
    visualClass: "bg-[radial-gradient(circle_at_75%_15%,#f472b6_0,#7c3aed_40%,#111827_85%)]",
  },
  {
    category: "Tech Expo",
    title: "Kinetic Visionaries 2024",
    meta: "Nov 15 • Javits Center",
    visualClass: "bg-[radial-gradient(circle_at_30%_20%,#34d399_0,#0ea5e9_35%,#172554_85%)]",
  },
];

export default function NewHomePreviewPage() {
  return (
    <>
      <Head>
        <title>Preview New Home</title>
      </Head>

      <main className="min-h-screen bg-slate-100 px-4 py-6 sm:py-8">
        <header className="mx-auto w-full max-w-[1280px] rounded-2xl bg-slate-50/80 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-2xl leading-8 font-black text-sky-700">Kinetic Events</div>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <a key={item} href="#" className="text-base leading-6 font-normal text-gray-700 transition-colors hover:text-sky-700">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <label className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2" aria-label="Search events">
                <Search className="size-4 text-gray-500" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full min-w-0 bg-transparent text-sm font-normal text-gray-500 outline-none placeholder:text-gray-500 sm:w-48"
                />
              </label>

              <button
                type="button"
                className="rounded-lg bg-sky-700 px-6 py-2 text-base leading-6 font-bold text-white transition-colors hover:bg-sky-800"
              >
                Sign In
              </button>
            </div>
          </div>
        </header>

        <section className="relative mx-auto mt-6 h-[420px] w-full max-w-[1280px] overflow-hidden rounded-xl md:mt-8 md:h-[500px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#38bdf8_0%,#1d4ed8_35%,#0f172a_75%)]" />
          <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="absolute right-16 top-20 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-36 w-36 rounded-full bg-violet-300/20 blur-2xl" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/5" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-12">
            <div className="max-w-3xl space-y-4 md:space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-violet-200 px-4 py-1 text-sm font-bold tracking-wide text-violet-950 uppercase md:text-base">
                  Concert
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-4 py-1 text-sm font-bold tracking-wide text-white uppercase md:text-base">
                  <CircleDot className="size-3" aria-hidden="true" />
                  Selling Fast
                </span>
              </div>

              <h1 className="text-3xl leading-tight font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] sm:text-4xl md:text-6xl md:leading-[1.05]">
                Prism Flow Music
                <br className="hidden sm:block" />
                Festival 2024
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-white/90 md:text-base">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-cyan-200" aria-hidden="true" />
                  August 24, 2024 • 18:00
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-cyan-200" aria-hidden="true" />
                  Skyline Arena, New York
                </span>
                <span className="inline-flex items-center gap-2">
                  <UserRound className="size-4 text-cyan-200" aria-hidden="true" />
                  By Kinetic Gallery
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 w-full max-w-[1280px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-16 lg:col-span-8">
              <section className="space-y-6">
                <h2 className="text-3xl leading-9 font-black text-zinc-900">About The Event</h2>
                <div className="space-y-4 text-base leading-6 text-gray-700">
                  <p>
                    Experience the ultimate fusion of light, sound, and technology at the Prism Flow Music Festival. This
                    year, we&apos;re pushing the boundaries of the live music experience with immersive 3D spatial audio and a
                    kinetic light installation that reacts in real-time to the performers&apos; movements.
                  </p>
                  <p>
                    Our lineup features a curated selection of global electronic pioneers and underground legends. Beyond
                    the main stage, explore the &quot;Gallery of Motion,&quot; a digital art playground where moments are frozen in
                    time through high-speed photography and interactive projection mapping.
                  </p>
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="text-3xl leading-9 font-black text-zinc-900">Event Schedule</h2>
                <div className="space-y-2">
                  {SCHEDULE_ITEMS.map((item) => (
                    <article key={item.time} className="flex flex-col gap-4 rounded-xl bg-white p-6 sm:flex-row sm:items-center sm:gap-6">
                      <div className="min-w-20 text-center">
                        <p className="text-2xl leading-8 font-black text-sky-700">{item.time}</p>
                        <p className="text-xs leading-4 font-bold tracking-wider text-gray-500 uppercase">{item.meridiem}</p>
                      </div>

                      <div className="hidden h-12 w-px bg-slate-300/30 sm:block" />

                      <div>
                        <h3 className="inline-flex items-center gap-2 text-lg leading-7 font-bold text-zinc-900">
                          <Clock3 className="size-4 text-sky-700" aria-hidden="true" />
                          {item.title}
                        </h3>
                        <p className="text-base leading-6 text-gray-700">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-3xl leading-9 font-black text-zinc-900">Venue Location</h2>
                <div className="relative h-80 overflow-hidden rounded-xl bg-gray-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,#e2e8f0_0%,#bfdbfe_45%,#c7d2fe_100%)]" />
                  <div className="absolute -top-4 left-10 h-28 w-28 rounded-full bg-white/40 blur-xl" />
                  <div className="absolute right-6 bottom-8 h-24 w-24 rounded-full bg-sky-300/30 blur-xl" />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="flex w-full max-w-md items-center gap-4 rounded-xl bg-white p-4 shadow-xl outline outline-1 outline-sky-700/10">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-sky-700/10">
                        <MapPin className="size-5 text-sky-700" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base leading-6 font-bold text-zinc-900">Skyline Arena</p>
                        <p className="truncate text-sm leading-5 text-gray-700">500 W 33rd St, New York, NY 10001</p>
                      </div>
                      <button type="button" className="rounded-lg bg-sky-700 p-2 text-white" aria-label="Open directions">
                        <ExternalLink className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-6 rounded-2xl bg-gray-100 p-6 outline outline-1 outline-white/40 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
                <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-700 to-violet-700 text-2xl font-black text-white shadow-md ring-4 ring-white">
                  AR
                  <Sparkles className="absolute -right-1 -bottom-1 size-5 rounded-full bg-white p-1 text-sky-700" aria-hidden="true" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl leading-8 font-black text-zinc-900">Alex Rivers</h3>
                  <p className="text-base leading-6 font-semibold text-sky-700">Kinetic Gallery Founder - Premium Member</p>
                  <p className="pt-2 text-base leading-6 text-gray-700">
                    Dedicated to bringing cutting-edge digital experiences to life through world-class event curation
                    since 2012.
                  </p>
                </div>

                <div className="flex min-w-40 flex-col gap-3">
                  <button type="button" className="rounded-lg bg-sky-700 px-6 py-2 text-sm leading-5 font-bold tracking-wide text-white uppercase">
                    Follow
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-6 py-2 text-sm leading-5 font-bold tracking-wide text-zinc-900 uppercase"
                  >
                    View Profile
                  </button>
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-6">
                <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
                  <div className="absolute -top-12 -right-10 size-32 rounded-full bg-gradient-to-r from-sky-700 to-violet-700 opacity-5" />

                  <h3 className="border-b border-gray-100 pb-4 text-xl leading-7 font-black tracking-widest text-zinc-900 uppercase">
                    Select Tickets
                  </h3>

                  <div className="mt-6 space-y-4">
                    {TICKET_TIERS.map((tier) => (
                      <article
                        key={tier.name}
                        className={[
                          "rounded-xl p-5",
                          tier.featured ? "bg-sky-700/5 outline-2 outline-sky-700" : "bg-slate-50 outline-1 outline-slate-300",
                          tier.soldOut ? "opacity-60" : "",
                          "outline outline-offset-[-1px]",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className={tier.featured ? "inline-flex items-center gap-2 text-lg leading-7 font-black text-sky-700" : "inline-flex items-center gap-2 text-lg leading-7 font-bold text-zinc-900"}>
                              <Ticket className="size-4" aria-hidden="true" />
                              {tier.name}
                            </h4>
                            <p className="text-xs leading-4 font-medium text-gray-700">{tier.description}</p>
                          </div>
                          <div className="text-right">
                            <p className={tier.featured ? "text-xl leading-7 font-black text-sky-700" : "text-xl leading-7 font-black text-zinc-900"}>
                              {tier.price}
                            </p>
                            <p
                              className={[
                                "text-[10px] leading-4 font-bold uppercase",
                                tier.status === "4 Left" ? "text-rose-700" : "",
                                tier.status === "Available" ? "text-gray-500" : "",
                                tier.status === "Sold Out" ? "text-red-700" : "",
                              ].join(" ")}
                            >
                              {tier.status}
                            </p>
                          </div>
                        </div>

                        {!tier.soldOut && (
                          <button
                            type="button"
                            className={[
                              "mt-6 w-full rounded-lg py-3 text-sm leading-5 font-bold tracking-wide uppercase",
                              tier.featured
                                ? "bg-gradient-to-r from-sky-700 to-violet-700 text-white"
                                : "bg-blue-100/40 text-sky-950",
                            ].join(" ")}
                          >
                            {tier.featured ? "Buy Ticket" : "Select"}
                          </button>
                        )}
                      </article>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4 border-t border-gray-100 pt-8">
                    <p className="text-center text-xs leading-4 text-gray-700">Secure checkout powered by Kinetic Pay</p>
                    <div className="flex items-center justify-center gap-4 opacity-40">
                      <CreditCard className="size-5 text-zinc-900" aria-hidden="true" />
                      <ShieldCheck className="size-5 text-zinc-900" aria-hidden="true" />
                      <CalendarDays className="size-5 text-zinc-900" aria-hidden="true" />
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 py-4 text-base font-bold text-gray-700">
                    <Heart className="size-5" aria-hidden="true" />
                    Save
                  </button>
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 py-4 text-base font-bold text-gray-700">
                    <Share2 className="size-5" aria-hidden="true" />
                    Share
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-[1280px] space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm leading-5 font-bold tracking-[2.8px] text-sky-700 uppercase">More Experiences</p>
              <h2 className="text-3xl leading-9 font-black text-zinc-900 sm:text-4xl sm:leading-10">You May Also Like</h2>
            </div>

            <a href="#" className="inline-flex items-center gap-2 text-base leading-6 font-bold text-sky-700">
              View All
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {RELATED_EVENTS.map((event) => (
              <article key={event.title} className="space-y-4">
                <div className="relative h-72 overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 ${event.visualClass}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.0)_40%,rgba(0,0,0,0.2)_100%)]" />
                  <span className="absolute top-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs leading-4 font-bold text-zinc-900 uppercase backdrop-blur-[6px]">
                    {event.category}
                  </span>
                </div>

                <h3 className="text-xl leading-7 font-black text-zinc-900">{event.title}</h3>

                <p className="inline-flex items-center gap-1 text-sm leading-5 text-gray-700">
                  <MapPin className="size-4" aria-hidden="true" />
                  {event.meta}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mx-auto mt-8 w-full max-w-[1280px] border-t border-slate-300/20 bg-white">
          <div className="flex flex-col gap-8 px-4 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-lg leading-7 font-bold text-zinc-900">Kinetic Gallery</p>
              <p className="text-base leading-6 font-normal text-gray-700">© 2024 Kinetic Gallery. Moments in Motion.</p>
            </div>

            <nav className="flex flex-wrap items-start gap-x-6 gap-y-3 lg:justify-center" aria-label="Footer links">
              {FOOTER_LINKS.map((item) => (
                <a key={item} href="#" className="text-base leading-6 font-normal text-gray-700 transition-colors hover:text-sky-700">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-start gap-4">
              <button
                type="button"
                aria-label="Social icon one"
                className="flex size-10 items-center justify-center rounded-full bg-gray-100"
              >
                <Instagram className="size-4 text-gray-700" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Social icon two"
                className="flex size-10 items-center justify-center rounded-full bg-gray-100"
              >
                <Youtube className="size-4 text-gray-700" aria-hidden="true" />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}