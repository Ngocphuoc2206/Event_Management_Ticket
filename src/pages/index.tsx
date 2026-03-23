import Head from "next/head";
import Link from "next/link";
import Footer from "../components/footer";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Cpu,
  GraduationCap,
  MapPin,
  Music,
  PartyPopper,
  Search,
  Ticket,
  Wrench,
} from "lucide-react";

type CategoryItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconWrapClass: string;
  iconClass: string;
};

type FeaturedEvent = {
  category: string;
  categoryClass: string;
  date: string;
  title: string;
  location: string;
  price: string;
  image: string;
  badge?: string;
};

type TrendingCard = {
  title: string;
  subtitle?: string;
  image: string;
  large?: boolean;
  tag?: string;
};

const CATEGORY_ITEMS: CategoryItem[] = [
  { title: "Music", icon: Music, iconWrapClass: "bg-blue-100", iconClass: "text-sky-700" },
  { title: "Business", icon: Briefcase, iconWrapClass: "bg-purple-200", iconClass: "text-violet-700" },
  { title: "Technology", icon: Cpu, iconWrapClass: "bg-red-100", iconClass: "text-rose-700" },
  { title: "Workshop", icon: Wrench, iconWrapClass: "bg-blue-100", iconClass: "text-sky-700" },
  { title: "Festival", icon: PartyPopper, iconWrapClass: "bg-purple-200", iconClass: "text-violet-700" },
  { title: "Education", icon: GraduationCap, iconWrapClass: "bg-red-100", iconClass: "text-rose-700" },
];

const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    category: "Concert",
    categoryClass: "bg-purple-200 text-violet-950",
    date: "Oct 15, 2024",
    title: "Neon Nights: Underground Techno",
    location: "Warehouse 42, Los Angeles",
    price: "$45.00",
    image: "https://placehold.co/640x420?text=Neon+Nights",
    badge: "SELLING FAST",
  },
  {
    category: "Conference",
    categoryClass: "bg-blue-100 text-sky-950",
    date: "Nov 02, 2024",
    title: "Future Tech Summit 2024",
    location: "Convention Center, SF",
    price: "$199.00",
    image: "https://placehold.co/640x420?text=Future+Tech+Summit",
  },
  {
    category: "Lifestyle",
    categoryClass: "bg-red-100 text-red-950",
    date: "Oct 20, 2024",
    title: "Global Food & Wine Expo",
    location: "Waterfront Park, Seattle",
    price: "$25.00",
    image: "https://placehold.co/640x420?text=Food+%26+Wine+Expo",
  },
];

const TRENDING_CARDS: TrendingCard[] = [
  {
    title: "Summer Solstice Music Festival",
    subtitle: "3 Days, 50 Artists, 1 Unforgettable Experience.",
    image: "https://placehold.co/900x900?text=Summer+Solstice",
    large: true,
    tag: "Festival",
  },
  {
    title: "Innovation Summit 2024",
    subtitle: "Join world leaders in tech and design.",
    image: "https://placehold.co/900x450?text=Innovation+Summit",
  },
  {
    title: "Classical Reimagined",
    image: "https://placehold.co/450x450?text=Classical+Reimagined",
  },
  {
    title: "Midnight Food Tour",
    image: "https://placehold.co/450x450?text=Midnight+Food+Tour",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Discover",
    text: "Explore thousands of events based on your interests and location.",
    icon: Search,
    iconClass: "text-sky-700",
  },
  {
    title: "Buy",
    text: "Secure your tickets instantly with our safe and easy checkout process.",
    icon: Ticket,
    iconClass: "text-violet-700",
  },
  {
    title: "Attend",
    text: "Scan your digital ticket at the venue and enjoy the event.",
    icon: CheckCircle2,
    iconClass: "text-rose-700",
  },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>EventHub</title>
      </Head>

      <div className="min-h-screen bg-slate-50">
        <header className="w-full border-b border-slate-300/10 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-6">
            <div className="flex items-center justify-start gap-12">
              <div className="inline-flex flex-col items-start justify-start">
                <h1 className="h-8 w-28 text-2xl leading-8 font-bold text-sky-700">EventHub</h1>
              </div>
            </div>

            <div className="flex items-center justify-start gap-2 sm:gap-4">
              <Link
                href="/auth/login"
                className="inline-flex min-w-[92px] flex-col items-center justify-center rounded-2xl px-4 py-2 sm:min-w-[108px] sm:px-6 sm:py-2.5"
              >
                <span className="h-6 w-full text-center text-sm leading-6 font-medium text-zinc-900 sm:text-base">
                  Log In
                </span>
              </Link>

              <Link
                href="/auth/register"
                className="inline-flex min-w-[92px] flex-col items-center justify-center rounded-2xl bg-[linear-gradient(68deg,#0369A1_0%,#6D28D9_100%)] px-4 py-2 sm:min-w-[108px] sm:px-6 sm:py-2.5"
              >
                <span className="h-6 w-full text-center text-sm leading-6 font-medium text-white sm:text-base">
                  Sign Up
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px]">
          <section className="relative overflow-hidden px-4 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20 lg:px-6 lg:pb-24">
            <img
              src="https://placehold.co/1280x520/0f172a/94a3b8?text=EventHub+Hero+Mockup"
              alt="Hero background"
              className="pointer-events-none absolute top-0 left-0 h-[360px] w-full rounded-b-3xl object-cover opacity-20 sm:h-[420px] lg:h-[498px]"
            />

            <div className="relative z-10 flex max-w-[768px] flex-col gap-6 sm:gap-8">
              <h1 className="text-3xl leading-[1.15] font-bold text-zinc-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Discover Amazing Events
                <br />
                Near You
              </h1>

              <p className="text-base leading-7 font-medium text-gray-700 sm:text-lg md:text-xl lg:text-2xl lg:leading-8">
                Find tickets to concerts, conferences, and local gatherings. Your next unforgettable experience starts
                here.
              </p>

              <div className="w-full rounded-3xl bg-white p-2 outline outline-1 -outline-offset-1 outline-slate-300/20 shadow-xl shadow-black/5">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3">
                    <Search className="h-4 w-4 text-sky-700" />
                    <input
                      type="text"
                      placeholder="Search events, artists, or venues"
                      className="w-full bg-transparent text-base text-gray-600 outline-none placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3">
                    <MapPin className="h-5 w-4 text-sky-700" />
                    <input
                      type="text"
                      defaultValue="San Francisco, CA"
                      className="w-full bg-transparent text-base text-gray-600 outline-none"
                    />
                  </div>
                  <button className="rounded-2xl bg-[linear-gradient(72deg,#0369A1_0%,#6D28D9_100%)] px-8 py-4 text-base font-semibold text-white md:col-span-2 lg:col-span-1 lg:text-lg">
                    Browse Events
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-6 lg:py-20">
            <div className="flex flex-col gap-12">
              <div>
                <p className="text-xs leading-4 font-semibold tracking-wide text-sky-700 uppercase">Explore</p>
                <h2 className="mt-2 text-3xl leading-9 font-bold text-zinc-900 sm:text-4xl sm:leading-10">By Category</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {CATEGORY_ITEMS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 outline outline-1 -outline-offset-1 outline-black/0"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconWrapClass}`}>
                        <Icon className={`h-5 w-5 ${item.iconClass}`} />
                      </div>
                      <p className="text-base leading-6 font-semibold text-zinc-900">{item.title}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-gray-100 px-4 py-14 sm:px-6 sm:py-16 lg:px-6 lg:py-20">
            <div className="flex flex-col gap-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs leading-4 font-semibold tracking-wide text-violet-700 uppercase">Editor&apos;s Pick</p>
                  <h2 className="mt-2 text-3xl leading-9 font-bold text-zinc-900 sm:text-4xl sm:leading-10">Featured Events</h2>
                </div>
                <Link href="/event" className="inline-flex items-center gap-2 text-base leading-6 font-semibold text-sky-700">
                  View all events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {FEATURED_EVENTS.map((event) => (
                  <article key={event.title} className="overflow-hidden rounded-2xl bg-white">
                    <div className="relative">
                      <img src={event.image} alt={event.title} className="h-72 w-full object-cover" />
                      {event.badge ? (
                        <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-[6px]">
                          <span className="h-2 w-2 rounded-full bg-rose-700" />
                          <span className="text-xs leading-4 font-bold text-zinc-900">{event.badge}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-6 p-6">
                      <div className="inline-flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] leading-4 font-bold tracking-wide uppercase ${event.categoryClass}`}>
                          {event.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {event.date}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl leading-7 font-bold text-zinc-900">{event.title}</h3>
                        <p className="mt-2 inline-flex items-center gap-1 text-sm leading-5 text-gray-700">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs leading-4 text-gray-700">Starting from</p>
                          <p className="text-2xl leading-8 font-bold text-zinc-900">{event.price}</p>
                        </div>
                        <button className="w-full rounded-2xl bg-[linear-gradient(70deg,#0369A1_0%,#6D28D9_100%)] px-6 py-3 text-base font-semibold text-white sm:w-auto">
                          Buy Ticket
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-6 lg:py-24">
            <p className="text-xs leading-4 font-semibold tracking-wide text-rose-700 uppercase">What&apos;s Hot</p>
            <h2 className="mt-2 text-3xl leading-9 font-bold text-zinc-900 sm:text-4xl sm:leading-10">Trending Right Now</h2>

            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-2">
              {TRENDING_CARDS.map((card, index) => {
                const layoutClass =
                  index === 0
                    ? "lg:col-span-2 lg:row-span-2"
                    : index === 1
                      ? "lg:col-span-2 lg:row-span-1"
                      : "lg:col-span-1 lg:row-span-1";
                const imageHeightClass =
                  index === 0 ? "h-[420px] md:h-[600px]" : index === 1 ? "h-72" : "h-72 lg:h-[288px]";

                return (
                  <article key={card.title} className={`group relative overflow-hidden rounded-3xl ${layoutClass}`}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageHeightClass}`}
                  />

                  <div className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(270deg,rgba(24,24,27,0)_0%,rgba(24,24,27,0.8)_100%)] p-5 sm:p-6 md:p-8">
                    {card.tag ? (
                      <span className="mb-4 inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] leading-4 font-bold tracking-wide text-white uppercase backdrop-blur-[6px]">
                        {card.tag}
                      </span>
                    ) : null}
                    <h3 className={`${card.large ? "text-2xl leading-8 sm:text-3xl sm:leading-9" : "text-lg leading-7 sm:text-xl"} font-bold text-white`}>
                      {card.title}
                    </h3>
                    {card.subtitle ? <p className="mt-2 text-sm text-white/80 sm:text-base">{card.subtitle}</p> : null}
                    {card.large ? (
                      <button className="mt-5 w-fit rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 sm:mt-6 sm:px-8 sm:text-base">
                        Learn More
                      </button>
                    ) : null}
                  </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="bg-gray-100 px-4 py-16 sm:px-6 sm:py-20 lg:px-6 lg:py-24">
            <div className="text-center">
              <p className="text-xs leading-4 font-semibold tracking-wide text-sky-700 uppercase">Simplicity First</p>
              <h2 className="mt-2 text-3xl leading-9 font-bold text-zinc-900 sm:text-4xl sm:leading-10">How EventHub Works</h2>
            </div>

            <div className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="pointer-events-none absolute top-12 left-1/2 hidden h-0.5 w-[60%] -translate-x-1/2 bg-slate-300/30 md:block" />

              {HOW_IT_WORKS.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white outline outline-1 -outline-offset-1 outline-slate-300/10">
                      <Icon className={`h-7 w-7 ${item.iconClass}`} />
                    </div>
                    <h3 className="mt-4 text-xl leading-7 font-bold text-zinc-900">{item.title}</h3>
                    <p className="mt-3 max-w-80 text-base leading-6 text-gray-700">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-6 lg:py-24">
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(77deg,#0369A1_0%,#6D28D9_100%)] p-6 sm:p-8 md:p-12 lg:p-20">
              <div className="absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-[32px]" />

              <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,576px)_minmax(0,384px)] lg:justify-between">
                <div>
                  <h2 className="text-3xl leading-9 font-bold text-white sm:text-4xl sm:leading-10">Never miss a beat.</h2>
                  <p className="mt-4 text-base leading-7 text-white/80 sm:mt-6 sm:text-xl">
                    Subscribe to our newsletter and get curated event recommendations delivered to your inbox every
                    week.
                  </p>
                </div>

                <div>
                  <div className="flex w-full flex-col items-stretch gap-2 rounded-3xl bg-white/10 p-2 outline outline-1 -outline-offset-1 outline-white/20 backdrop-blur-[6px] sm:flex-row sm:items-center">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="min-h-12 flex-1 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-white/60"
                    />
                    <button className="rounded-2xl bg-white px-8 py-3 text-base leading-6 font-bold text-sky-700">
                      Join
                    </button>
                  </div>
                  <p className="mt-4 text-xs leading-4 text-white/50">We respect your privacy. Unsubscribe at any time.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
