/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useMemo, useState } from "react";
import {
  Compass,
  LayoutDashboard,
  Ticket,
  Heart,
  Settings,
  LifeBuoy,
  Plus,
  CalendarDays,
  MapPin,
  Search,
  Bell,
  MessagesSquare,
  LayoutGrid,
  CalendarRange,
  BadgeDollarSign,
  Radio,
  Check,
  SlidersHorizontal,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  active?: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

type EventCardItem = {
  id: number;
  titleLines: string[];
  dateLabel: string;
  dateISO: string;
  time24h: string;
  locationLines: string[];
  locationText: string;
  categoryLines: string[];
  category: string;
  metaLines?: string[];
  popularity: number;
  price: string;
  priceValue: number;
  image: string;
  badge?: {
    text: string;
    className: string;
    withDot?: boolean;
  };
  categoryClassName?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Explore", active: true, icon: Compass },
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Tickets", icon: Ticket },
  { label: "Favorites", icon: Heart },
  { label: "Settings", icon: Settings },
];

const EVENT_CARDS: EventCardItem[] = [
  {
    id: 1,
    titleLines: ["Neon Horizon", "Tour: 2024", "Global Leg"],
    dateLabel: "Aug 24 • 9:00 PM",
    dateISO: "2026-08-24",
    time24h: "21:00",
    locationLines: ["The Glass Arena,", "London"],
    locationText: "The Glass Arena, London",
    categoryLines: ["Music &", "Arts"],
    category: "Music & Arts",
    metaLines: ["2.4k", "attending"],
    popularity: 2400,
    price: "$75",
    priceValue: 75,
    image:
      "https://images.unsplash.com/photo-1540039155732-61ee01518f8e?w=900&q=80",
    badge: {
      text: "Selling Fast",
      className: "bg-red-500",
      withDot: true,
    },
    categoryClassName: "text-blue-600",
  },
  {
    id: 2,
    titleLines: ["Future AI", "Global", "Summit: San", "Francisco"],
    dateLabel: "Sept 12 • 10:00 AM",
    dateISO: "2026-09-12",
    time24h: "10:00",
    locationLines: ["Innovation Hub, SF"],
    locationText: "Innovation Hub, SF",
    categoryLines: ["Technology"],
    category: "Technology",
    metaLines: ["500 tickets", "left"],
    popularity: 500,
    price: "$299",
    priceValue: 299,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80",
    badge: {
      text: "New",
      className: "bg-violet-600",
    },
    categoryClassName: "text-violet-600",
  },
  {
    id: 3,
    titleLines: ["Bite of the", "City: Annual", "Food Expo"],
    dateLabel: "Oct 05 • 11:00 AM",
    dateISO: "2026-10-05",
    time24h: "11:00",
    locationLines: ["Central Park South,", "NY"],
    locationText: "Central Park South, NY",
    categoryLines: ["Lifestyle"],
    category: "Lifestyle",
    metaLines: ["Outdoor Event"],
    popularity: 900,
    price: "$15",
    priceValue: 15,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80",
    categoryClassName: "text-blue-600",
  },
  {
    id: 4,
    titleLines: ["Symphony Under", "the Stars", "Night Gala"],
    dateLabel: "Nov 21 • 7:30 PM",
    dateISO: "2026-11-21",
    time24h: "19:30",
    locationLines: ["Royal Hall,", "Vienna"],
    locationText: "Royal Hall, Vienna",
    categoryLines: ["Classical", "Music"],
    category: "Classical Music",
    metaLines: ["1.1k", "attending"],
    popularity: 1100,
    price: "$120",
    priceValue: 120,
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&q=80",
    categoryClassName: "text-blue-600",
  },
  {
    id: 5,
    titleLines: ["Web3 Builder", "Bootcamp", "Live Session"],
    dateLabel: "Dec 04 • 1:00 PM",
    dateISO: "2026-12-04",
    time24h: "13:00",
    locationLines: ["Crypto Center,", "Miami"],
    locationText: "Crypto Center, Miami",
    categoryLines: ["Technology"],
    category: "Technology",
    metaLines: ["220 seats", "left"],
    popularity: 220,
    price: "$199",
    priceValue: 199,
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f4fc244?w=900&q=80",
    badge: {
      text: "Hot",
      className: "bg-indigo-600",
    },
    categoryClassName: "text-violet-600",
  },
  {
    id: 6,
    titleLines: ["Urban Street", "Food Market", "Weekend"],
    dateLabel: "Dec 12 • 10:00 AM",
    dateISO: "2026-12-12",
    time24h: "10:00",
    locationLines: ["Central Pier,", "Singapore"],
    locationText: "Central Pier, Singapore",
    categoryLines: ["Lifestyle"],
    category: "Lifestyle",
    metaLines: ["Outdoor", "festival"],
    popularity: 700,
    price: "$25",
    priceValue: 25,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
    categoryClassName: "text-blue-600",
  },
  {
    id: 7,
    titleLines: ["Code & Coffee", "Founder", "Networking"],
    dateLabel: "Jan 08 • 9:30 AM",
    dateISO: "2026-01-08",
    time24h: "09:30",
    locationLines: ["Riverside Lab,", "Berlin"],
    locationText: "Riverside Lab, Berlin",
    categoryLines: ["Technology"],
    category: "Technology",
    metaLines: ["320", "attending"],
    popularity: 320,
    price: "$39",
    priceValue: 39,
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80",
    badge: {
      text: "Community",
      className: "bg-cyan-600",
    },
    categoryClassName: "text-violet-600",
  },
  {
    id: 8,
    titleLines: ["Sunset Jazz", "Rooftop", "Series"],
    dateLabel: "Jan 19 • 6:45 PM",
    dateISO: "2026-01-19",
    time24h: "18:45",
    locationLines: ["Skyline Deck,", "Tokyo"],
    locationText: "Skyline Deck, Tokyo",
    categoryLines: ["Music &", "Arts"],
    category: "Music & Arts",
    metaLines: ["850", "attending"],
    popularity: 850,
    price: "$68",
    priceValue: 68,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
    badge: {
      text: "Limited",
      className: "bg-rose-600",
      withDot: true,
    },
    categoryClassName: "text-blue-600",
  },
  {
    id: 9,
    titleLines: ["Marathon Prep", "Wellness", "Camp"],
    dateLabel: "Feb 02 • 7:00 AM",
    dateISO: "2026-02-02",
    time24h: "07:00",
    locationLines: ["Greenfield Track,", "Sydney"],
    locationText: "Greenfield Track, Sydney",
    categoryLines: ["Lifestyle"],
    category: "Lifestyle",
    metaLines: ["Outdoor", "session"],
    popularity: 640,
    price: "$22",
    priceValue: 22,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
    categoryClassName: "text-blue-600",
  },
  {
    id: 10,
    titleLines: ["Opera Night", "Legacy", "Performance"],
    dateLabel: "Feb 23 • 8:00 PM",
    dateISO: "2026-02-23",
    time24h: "20:00",
    locationLines: ["Imperial Theater,", "Milan"],
    locationText: "Imperial Theater, Milan",
    categoryLines: ["Classical", "Music"],
    category: "Classical Music",
    metaLines: ["1.6k", "attending"],
    popularity: 1600,
    price: "$140",
    priceValue: 140,
    image:
      "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=900&q=80",
    badge: {
      text: "Premium",
      className: "bg-slate-800",
    },
    categoryClassName: "text-blue-600",
  },
  {
    id: 11,
    titleLines: ["Design Sprint", "Product", "Studio Live"],
    dateLabel: "Mar 10 • 2:00 PM",
    dateISO: "2026-03-10",
    time24h: "14:00",
    locationLines: ["Makers District,", "Seoul"],
    locationText: "Makers District, Seoul",
    categoryLines: ["Technology"],
    category: "Technology",
    metaLines: ["90 seats", "left"],
    popularity: 410,
    price: "$89",
    priceValue: 89,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80",
    categoryClassName: "text-violet-600",
  },
  {
    id: 12,
    titleLines: ["Taste of Asia", "Night Market", "Special"],
    dateLabel: "Mar 28 • 5:30 PM",
    dateISO: "2026-03-28",
    time24h: "17:30",
    locationLines: ["Lantern Square,", "Bangkok"],
    locationText: "Lantern Square, Bangkok",
    categoryLines: ["Lifestyle"],
    category: "Lifestyle",
    metaLines: ["Family", "friendly"],
    popularity: 980,
    price: "$18",
    priceValue: 18,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&q=80",
    badge: {
      text: "Top Rated",
      className: "bg-emerald-600",
    },
    categoryClassName: "text-blue-600",
  },
];

const FEATURED_CARD = {
  titleLines: ["The Grand", "New Year's", "Prelude"],
  descriptionLines: [
    "Experience the most exclusive",
    "countdown event of the year...",
  ],
  dateLines: ["Dec 31 •", "8:00 PM"],
  locationLines: ["Platinum", "Harbor,", "Dubai"],
  ctaLines: ["Book", "VIP", "Lounge"],
  price: "$550",
  passLines: ["Premium", "Pass"],
  image:
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80",
};

const CATEGORY_OPTIONS = [
  "Music & Arts",
  "Technology",
  "Lifestyle",
  "Classical Music",
];
const DATE_OPTIONS = ["any", "weekend", "next_month"] as const;
const TIME_OPTIONS = ["any", "morning", "afternoon", "evening"] as const;
const SORT_OPTIONS = ["popularity", "date", "price"] as const;

type DateFilter = (typeof DATE_OPTIONS)[number];
type TimeFilter = (typeof TIME_OPTIONS)[number];
type SortBy = (typeof SORT_OPTIONS)[number];

export default function HomePage() {
  const [hoveredViewCardId, setHoveredViewCardId] = useState<number | null>(
    null,
  );
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("any");
  const [locationQuery, setLocationQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = isFilterOpen ? 3 : 4;

  const filteredEvents = useMemo(() => {
    const now = new Date("2026-03-21T00:00:00");

    const result = EVENT_CARDS.filter((event) => {
      const title = event.titleLines.join(" ").toLowerCase();
      const location = event.locationText.toLowerCase();
      const search = searchQuery.trim().toLowerCase();

      if (search && !title.includes(search) && !location.includes(search)) {
        return false;
      }

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(event.category)
      ) {
        return false;
      }

      if (
        locationQuery.trim() &&
        !location.includes(locationQuery.trim().toLowerCase())
      ) {
        return false;
      }

      const date = new Date(`${event.dateISO}T00:00:00`);
      if (dateFilter === "weekend") {
        const day = date.getDay();
        if (day !== 0 && day !== 6) {
          return false;
        }
      }

      if (dateFilter === "next_month") {
        const nextMonthDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1,
        );
        if (
          date.getMonth() !== nextMonthDate.getMonth() ||
          date.getFullYear() !== nextMonthDate.getFullYear()
        ) {
          return false;
        }
      }

      const hour = Number(event.time24h.split(":")[0]);
      if (timeFilter === "morning" && !(hour >= 6 && hour < 12)) {
        return false;
      }
      if (timeFilter === "afternoon" && !(hour >= 12 && hour < 18)) {
        return false;
      }
      if (timeFilter === "evening" && !(hour >= 18 || hour < 6)) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
      }
      if (sortBy === "price") {
        return a.priceValue - b.priceValue;
      }
      return b.popularity - a.popularity;
    });

    return result;
  }, [
    searchQuery,
    selectedCategories,
    dateFilter,
    timeFilter,
    locationQuery,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEvents = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, safePage, itemsPerPage]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
    setExpandedCardId(null);
  };

  return (
    <>
      <Head>
        <title>Explore Events</title>
      </Head>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen w-full max-w-384 flex-col lg:flex-row">
          <aside className="w-full border-b border-slate-200/60 bg-slate-50 px-6 py-6 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
            <div className="pb-8">
              <h1 className="text-2xl font-black leading-8 text-slate-900">
                EventFlow
              </h1>
              <p className="mt-1 text-xs font-medium uppercase tracking-tight text-slate-500">
                Premium Ticketing
              </p>
            </div>

            <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={[
                      "inline-flex min-w-fit items-center gap-3 rounded-3xl px-4 py-3 text-sm leading-5 transition",
                      item.active
                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-100"
                        : "text-slate-500 hover:bg-white/70",
                    ].join(" ")}
                  >
                    <Icon className={item.active ? "h-5 w-5" : "h-4 w-4"} />
                    <span
                      className={item.active ? "font-semibold" : "font-normal"}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-slate-200/60 pt-6 lg:mt-8">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-blue-600 px-4 py-3 text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(59,130,246,0.20),0px_4px_6px_-4px_rgba(59,130,246,0.20)] transition hover:bg-blue-700">
                <Plus className="h-5 w-5" />
                Create Event
              </button>
              <button className="mt-4 inline-flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-normal text-slate-500 transition hover:bg-white/70">
                <LifeBuoy className="h-4 w-4" />
                Support
              </button>
            </div>
          </aside>

          <main className="flex-1 overflow-hidden">
            <div className="inline-flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/80 px-4 shadow-[0px_1px_2px_0px_rgba(30,58,138,0.05)] backdrop-blur-md sm:px-8">
              <div className="relative flex-1">
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                    setExpandedCardId(null);
                  }}
                  placeholder="Search events, artists, or venues..."
                  className="w-full rounded-2xl bg-slate-100 pb-2.5 pl-10 pr-3 pt-2 text-sm text-gray-500 outline-none ring-0 placeholder:text-gray-500"
                />
                <div className="absolute inset-y-0 left-0 inline-flex h-9 items-center pl-3 text-slate-400">
                  <Search className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="ml-4 hidden items-center gap-6 lg:flex">
                <button className="inline-flex items-center justify-center text-slate-500 transition hover:text-slate-700">
                  <Bell className="h-5 w-4" />
                </button>
                <button className="inline-flex items-center justify-center text-slate-500 transition hover:text-slate-700">
                  <MessagesSquare className="h-5 w-5" />
                </button>
                <div className="h-8 w-px bg-slate-200" />

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold leading-5 text-slate-900">
                      Alex Rivers
                    </p>
                    <p className="text-xs font-normal leading-4 text-slate-500">
                      Pro Member
                    </p>
                  </div>
                  <img
                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                    src="https://placehold.co/40x40"
                    alt="User profile"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex">
              {isFilterOpen && (
                <button
                  aria-label="Close filters"
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 z-30 bg-slate-900/20 xl:hidden"
                />
              )}

              <aside
                className={[
                  "fixed inset-y-0 left-0 z-40 w-[320px] overflow-y-auto border-r border-slate-200/50 bg-white p-6 shadow-xl transition-transform sm:p-8",
                  "xl:static xl:z-10 xl:h-[calc(100vh-64px)] xl:w-72 xl:shadow-none",
                  isFilterOpen
                    ? "translate-x-0"
                    : "-translate-x-full xl:hidden",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold leading-7 text-slate-900">
                      Filters
                    </h3>
                    <p className="text-xs font-medium leading-4 text-slate-500">
                      Narrow your search results
                    </p>
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                    aria-label="Hide filters"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2">
                      <LayoutGrid className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-sm font-semibold leading-5 text-blue-600">
                        Category
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      {CATEGORY_OPTIONS.map((category) => {
                        const isChecked = selectedCategories.includes(category);

                        return (
                          <button
                            key={category}
                            onClick={() => handleCategoryToggle(category)}
                            className={[
                              "inline-flex items-center gap-2.5 rounded-3xl px-2 py-2.5 text-left",
                              isChecked
                                ? "bg-slate-50 pr-16 outline-1 outline-slate-100"
                                : "px-2.5",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "inline-flex h-4 w-4 items-center justify-center rounded-sm border",
                                isChecked
                                  ? "border-transparent bg-blue-600"
                                  : "border-slate-300 bg-white",
                              ].join(" ")}
                            >
                              {isChecked && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </span>
                            <span
                              className={
                                isChecked
                                  ? "text-sm font-medium leading-5 text-slate-700"
                                  : "text-sm font-medium leading-5 text-slate-600"
                              }
                            >
                              {category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2">
                      <CalendarRange className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-sm font-semibold leading-5 text-slate-500">
                        Date
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 xl:grid-cols-1">
                      <button
                        onClick={() => {
                          setDateFilter("any");
                          setCurrentPage(1);
                          setExpandedCardId(null);
                        }}
                        className={[
                          "inline-flex items-center rounded-2xl px-3 py-2 text-sm leading-5",
                          dateFilter === "any"
                            ? "bg-blue-50 font-bold text-blue-600"
                            : "font-medium text-slate-600",
                        ].join(" ")}
                      >
                        Anytime
                      </button>
                      <button
                        onClick={() => {
                          setDateFilter("weekend");
                          setCurrentPage(1);
                          setExpandedCardId(null);
                        }}
                        className={[
                          "inline-flex items-center rounded-2xl px-3 py-2 text-sm leading-5",
                          dateFilter === "weekend"
                            ? "bg-blue-50 font-bold text-blue-600"
                            : "font-medium text-slate-600",
                        ].join(" ")}
                      >
                        This Weekend
                      </button>
                      <button
                        onClick={() => {
                          setDateFilter("next_month");
                          setCurrentPage(1);
                          setExpandedCardId(null);
                        }}
                        className={[
                          "inline-flex items-center rounded-2xl px-3 py-2 text-sm leading-5",
                          dateFilter === "next_month"
                            ? "bg-blue-50 font-bold text-blue-600"
                            : "font-medium text-slate-600",
                        ].join(" ")}
                      >
                        Next Month
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-sm font-semibold leading-5 text-slate-500">
                        Time
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 xl:grid-cols-2">
                      {TIME_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setTimeFilter(option);
                            setCurrentPage(1);
                            setExpandedCardId(null);
                          }}
                          className={[
                            "rounded-2xl px-3 py-2 font-semibold capitalize",
                            timeFilter === option
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-50 text-slate-500",
                          ].join(" ")}
                        >
                          {option === "any" ? "Any" : option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-sm font-semibold leading-5 text-slate-500">
                        Location
                      </span>
                    </div>
                    <input
                      value={locationQuery}
                      onChange={(event) => {
                        setLocationQuery(event.target.value);
                        setCurrentPage(1);
                        setExpandedCardId(null);
                      }}
                      placeholder="City or venue"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
                    />
                  </div>

                  <div className="relative h-20">
                    <div className="inline-flex items-center gap-2">
                      <BadgeDollarSign className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-sm font-semibold leading-5 text-slate-500">
                        Price Range
                      </span>
                    </div>
                    <div className="absolute left-0 top-11 h-1.5 w-full max-w-56 rounded-full bg-slate-200" />
                    <div className="absolute left-0 top-14.5 inline-flex w-full max-w-56 items-start justify-between text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-400">
                      <span>$0</span>
                      <span>$500+</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2">
                      <Radio className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-sm font-semibold leading-5 text-slate-500">
                        Status
                      </span>
                    </div>
                    <div className="inline-flex w-full items-start rounded-3xl bg-slate-100 p-1">
                      <button className="flex-1 rounded-2xl bg-white py-1.5 text-center text-xs font-bold leading-4 text-blue-600 shadow-sm">
                        Online
                      </button>
                      <button className="flex-1 py-1.5 text-center text-xs font-bold leading-4 text-slate-500">
                        In-Person
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12">
                <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                      Trending Worldwide
                    </p>
                    <h2 className="text-4xl font-black leading-10 text-slate-900">
                      Explore Events
                    </h2>
                    <p className="max-w-xl text-lg leading-7 text-slate-500">
                      Discover curated experiences designed to
                      <br className="hidden sm:block" />
                      inspire and connect.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsFilterOpen((prev) => !prev)}
                      className={[
                        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition",
                        isFilterOpen
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 outline outline-slate-200/70 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        {isFilterOpen ? "Hide Filters" : "Show Filters"}
                      </span>
                    </button>

                    <div className="inline-flex items-center gap-2 rounded-3xl bg-white p-1.5 outline outline-1 outline-slate-200/50">
                      <button
                        onClick={() => setSortBy("popularity")}
                        className={[
                          "rounded-2xl px-4 py-2 text-xs font-bold",
                          sortBy === "popularity"
                            ? "bg-blue-600 text-white shadow-[0px_4px_6px_-1px_rgba(59,130,246,0.20)]"
                            : "text-slate-500",
                        ].join(" ")}
                      >
                        Popularity
                      </button>
                      <button
                        onClick={() => setSortBy("date")}
                        className={[
                          "rounded-2xl px-4 py-2 text-xs font-bold",
                          sortBy === "date"
                            ? "bg-blue-600 text-white"
                            : "text-slate-500",
                        ].join(" ")}
                      >
                        Date
                      </button>
                      <button
                        onClick={() => setSortBy("price")}
                        className={[
                          "rounded-2xl px-4 py-2 text-xs font-bold",
                          sortBy === "price"
                            ? "bg-blue-600 text-white"
                            : "text-slate-500",
                        ].join(" ")}
                      >
                        Price
                      </button>
                    </div>
                  </div>
                </section>

                <section
                  className={[
                    "mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2",
                    isFilterOpen
                      ? "xl:grid-cols-2 2xl:grid-cols-3"
                      : "xl:grid-cols-3 2xl:grid-cols-4",
                  ].join(" ")}
                >
                  {paginatedEvents.map((event) => {
                    const isExpanded = expandedCardId === event.id;
                    const isHoveringView = hoveredViewCardId === event.id;

                    if (isExpanded) {
                      return (
                        <article
                          key={event.id}
                          className="relative inline-flex h-151.5 w-full overflow-hidden rounded-2xl bg-white shadow-[0px_2px_10px_-2px_rgba(0,0,0,0.02),0px_4px_20px_-2px_rgba(37,99,235,0.05)] outline outline-1 outline-slate-200/50 md:col-span-2 xl:col-span-2"
                        >
                          <button
                            onClick={() => {
                              setExpandedCardId(null);
                            }}
                            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-500 shadow"
                          >
                            Close
                          </button>

                          <div className="relative w-36">
                            <img
                              src={FEATURED_CARD.image}
                              alt="New Year"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent" />
                          </div>

                          <div className="flex w-72 flex-col justify-center p-8">
                            <div className="pb-4">
                              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase leading-4 tracking-wide text-blue-600">
                                Editor&apos;s Pick
                              </span>
                            </div>

                            <div className="pb-4">
                              <h3 className="text-3xl font-black leading-9 text-slate-900">
                                {FEATURED_CARD.titleLines.map((line) => (
                                  <span key={line} className="block">
                                    {line}
                                  </span>
                                ))}
                              </h3>
                            </div>

                            <div className="pb-8 text-sm leading-6 text-slate-500">
                              {FEATURED_CARD.descriptionLines.map((line) => (
                                <span key={line} className="block">
                                  {line}
                                </span>
                              ))}
                            </div>

                            <div className="pb-8">
                              <div className="space-y-2 text-xs font-semibold leading-4 text-slate-600">
                                <p className="inline-flex items-center gap-3">
                                  <CalendarDays className="h-4 w-3.5 text-blue-600" />
                                  <span>
                                    {FEATURED_CARD.dateLines.map((line) => (
                                      <span key={line} className="block">
                                        {line}
                                      </span>
                                    ))}
                                  </span>
                                </p>
                                <p className="inline-flex items-center gap-3">
                                  <MapPin className="h-4 w-4 text-blue-600" />
                                  <span>
                                    {FEATURED_CARD.locationLines.map((line) => (
                                      <span key={line} className="block">
                                        {line}
                                      </span>
                                    ))}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="inline-flex items-center gap-6">
                              <button className="rounded-3xl bg-blue-600 px-8 py-3 text-base font-bold text-white shadow-[0px_4px_6px_-4px_rgba(59,130,246,0.20),0px_10px_15px_-3px_rgba(59,130,246,0.20)]">
                                {FEATURED_CARD.ctaLines.map((line) => (
                                  <span key={line} className="block">
                                    {line}
                                  </span>
                                ))}
                              </button>

                              <div>
                                <p className="text-2xl font-black leading-8 text-slate-900">
                                  {FEATURED_CARD.price}
                                </p>
                                <p className="text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-400">
                                  {FEATURED_CARD.passLines.map((line) => (
                                    <span key={line} className="block">
                                      {line}
                                    </span>
                                  ))}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    }

                    return (
                      <article
                        key={event.id}
                        className="w-full overflow-hidden rounded-2xl bg-white shadow-[0px_2px_10px_-2px_rgba(0,0,0,0.02),0px_4px_20px_-2px_rgba(37,99,235,0.05)] outline outline-1 outline-slate-200/50"
                      >
                        <div className="relative h-60 overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.titleLines.join(" ")}
                            className="h-full w-full object-cover"
                          />
                          {event.badge && (
                            <div className="absolute right-4 top-4">
                              <div
                                className={`${event.badge.className} inline-flex items-center gap-1.5 rounded-2xl px-2.5 py-1`}
                              >
                                {event.badge.withDot && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-wide text-white">
                                  {event.badge.text}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          className={
                            event.id === 3
                              ? "px-6 pb-14 pt-6"
                              : "px-6 pb-11 pt-6"
                          }
                        >
                          <div className="flex items-center justify-between pb-3">
                            <p
                              className={`${event.categoryClassName} text-[10px] font-black uppercase leading-4 tracking-wide`}
                            >
                              {event.categoryLines.map((line) => (
                                <span key={line} className="block">
                                  {line}
                                </span>
                              ))}
                            </p>
                            <p className="text-[10px] font-bold leading-4 text-slate-400">
                              {event.metaLines?.map((line) => (
                                <span key={line} className="block">
                                  {line}
                                </span>
                              ))}
                            </p>
                          </div>

                          <h3 className="pb-4 text-xl font-bold leading-6 text-slate-900">
                            {event.titleLines.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))}
                          </h3>

                          <div className="space-y-2.5 pb-6 text-xs font-medium text-slate-500">
                            <p className="inline-flex items-center gap-2">
                              <CalendarDays className="h-3.5 w-3.5 opacity-60" />
                              {event.dateLabel}
                            </p>
                            <p className="inline-flex items-start gap-2">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 opacity-60" />
                              <span>
                                {event.locationLines.map((line) => (
                                  <span key={line} className="block">
                                    {line}
                                  </span>
                                ))}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                            <div>
                              <p className="text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-400">
                                Tickets from
                              </p>
                              <p className="text-xl font-black leading-7 text-slate-900">
                                {event.price}
                              </p>
                            </div>

                            <button
                              onMouseEnter={() =>
                                setHoveredViewCardId(event.id)
                              }
                              onMouseLeave={() => setHoveredViewCardId(null)}
                              onClick={() => {
                                setExpandedCardId(event.id);
                                setHoveredViewCardId(null);
                              }}
                              className={[
                                "rounded-3xl px-7 py-2.5 text-xs font-bold transition",
                                isHoveringView
                                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0px_10px_15px_-3px_rgba(59,130,246,0.20)]"
                                  : "text-slate-600 outline outline-2 outline-slate-200",
                              ].join(" ")}
                            >
                              {(isHoveringView
                                ? ["Get", "Tickets"]
                                : ["View", "Event"]
                              ).map((line) => (
                                <span key={line} className="block">
                                  {line}
                                </span>
                              ))}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </section>

                <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40"
                    disabled={safePage === 1}
                  >
                    Prev
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    Page {safePage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40"
                    disabled={safePage === totalPages}
                  >
                    Next
                  </button>
                </div>

                <footer className="mt-16 w-full border-t border-slate-200/50 pt-12">
                  <div className="grid w-full grid-cols-1 gap-10 pb-12 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-6">
                      <p className="text-2xl font-black leading-8 text-blue-600">
                        EventFlow
                      </p>
                      <p className="text-sm font-normal leading-6 text-slate-500">
                        <span className="block">The global</span>
                        <span className="block">platform for</span>
                        <span className="block">meaningful</span>
                        <span className="block">connections and</span>
                        <span className="block">unforgettable</span>
                        <span className="block">moments. Join the</span>
                        <span className="block">flow today.</span>
                      </p>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-900">
                        Company
                      </p>
                      <div className="space-y-3">
                        <p className="py-[1.5px] text-sm font-normal leading-5 text-slate-500">
                          About Us
                        </p>
                        <p className="py-[1.5px] text-sm font-normal leading-5 text-slate-500">
                          Careers
                        </p>
                        <p className="py-[1.5px] text-sm font-normal leading-5 text-slate-500">
                          Press
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-900">
                        Support
                      </p>
                      <div className="space-y-3">
                        <p className="py-[1.5px] text-sm font-normal leading-5 text-slate-500">
                          Help Center
                        </p>
                        <p className="py-[1.5px] text-sm font-normal leading-5 text-slate-500">
                          Privacy
                        </p>
                        <p className="py-[1.5px] text-sm font-normal leading-5 text-slate-500">
                          Terms
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-900">
                        Connect
                      </p>
                      <div className="inline-flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-100">
                          <div className="h-3.5 w-3.5 rounded-sm bg-slate-500" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-100">
                          <div className="h-3 w-3.5 rounded-sm bg-slate-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex w-full flex-col items-start gap-4 border-t border-slate-100 py-6 lg:flex-row lg:items-center lg:justify-between">
                    <p className="text-[10px] font-medium uppercase leading-4 tracking-wide text-slate-400">
                      © 2024 EventFlow Inc. All rights reserved.
                    </p>
                    <div className="inline-flex items-start gap-8">
                      <p className="text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-400">
                        Global Access
                      </p>
                      <p className="text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-400">
                        Safe &amp; Secure
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
