/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CustomerPageShell } from "@/features/customer";
import {
  getPublicEventDetail,
  getPublicEvents,
  type CustomerEventDetail,
  type CustomerEventSummary,
  type CustomerEventTicketType,
} from "@/features/customer/events.service";

const DEFAULT_EVENT_BANNER =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop";
const ATTENDEE_PLACEHOLDERS = Array.from({ length: 3 }, (_, index) =>
  `https://i.pravatar.cc/150?u=customer-events-${index + 1}`,
);

type EventDateFilter = "All" | "This Weekend" | "This Month" | "Next Month";

type EventCard = CustomerEventSummary & {
  type: string;
  image: string;
  badge: string | null;
  dateFilter: Exclude<EventDateFilter, "All"> | null;
  dateLabel: string;
  location: string;
  attendees: string[];
};

function formatDateTimeRange(startTime?: string, endTime?: string) {
  if (!startTime) {
    return "Schedule will be updated soon";
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) {
    return startTime;
  }

  const startLabel = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(start);

  if (!endTime) {
    return startLabel;
  }

  const end = new Date(endTime);
  if (Number.isNaN(end.getTime())) {
    return startLabel;
  }

  const endLabel = new Intl.DateTimeFormat("vi-VN", {
    timeStyle: "short",
  }).format(end);

  return `${startLabel} - ${endLabel}`;
}

function formatCurrency(amount?: number) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "Contact us";
  }

  if (amount === 0) {
    return "Free Ticket";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatEventDate(startTime?: string) {
  if (!startTime) {
    return "Schedule TBD";
  }

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) {
    return startTime;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getEventLocation(
  event: Pick<CustomerEventSummary, "venueName" | "address" | "city">,
) {
  return [event.venueName, event.address, event.city].filter(Boolean).join(", ");
}

function getAvailableText(ticketType: CustomerEventTicketType) {
  if (ticketType.availableQuantity <= 0) {
    return "Sold out";
  }

  return `${ticketType.availableQuantity} tickets left`;
}

function getPurchaseErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Could not continue to checkout.";
}

function resolveDateFilter(startTime?: string): EventCard["dateFilter"] {
  if (!startTime) {
    return null;
  }

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const daysUntilEvent = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (isWeekend && daysUntilEvent >= 0 && daysUntilEvent <= 7) {
    return "This Weekend";
  }

  const monthGap =
    (date.getFullYear() - now.getFullYear()) * 12 +
    (date.getMonth() - now.getMonth());

  if (monthGap === 0) {
    return "This Month";
  }

  if (monthGap === 1) {
    return "Next Month";
  }

  return null;
}

function mapEventToCard(event: CustomerEventSummary): EventCard {
  const badge =
    event.availableTickets <= 0
      ? "SOLD OUT"
      : event.availableTickets < 20
        ? "SELLING FAST"
        : event.minPrice === 0
          ? "FREE"
          : null;

  return {
    ...event,
    type: event.category || "Event",
    image: event.bannerUrl || DEFAULT_EVENT_BANNER,
    badge,
    dateFilter: resolveDateFilter(event.startTime),
    dateLabel: formatEventDate(event.startTime),
    location: getEventLocation(event) || "Venue pending",
    attendees: ATTENDEE_PLACEHOLDERS,
  };
}

export default function CustomerEventsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<CustomerEventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<EventDateFilter>("All");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] =
    useState<CustomerEventDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getPublicEvents({ size: 24 });
        if (isMounted) {
          setEvents(response);
        }
      } catch {
        if (isMounted) {
          setEvents([]);
          setErrorMessage("Cannot load events right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const loadDetail = async () => {
      setIsLoadingDetail(true);
      setDetailError("");
      setPurchaseError("");
      setQuantity(1);

      try {
        const response = await getPublicEventDetail(selectedEventId);
        setSelectedEventDetail(response);

        const defaultTicketType = response.ticketTypes.find(
          (ticketType) => ticketType.availableQuantity > 0,
        );
        setSelectedTicketTypeId(
          defaultTicketType?.id || response.ticketTypes[0]?.id || "",
        );
      } catch {
        setSelectedEventDetail(null);
        setSelectedTicketTypeId("");
        setDetailError("Cannot load ticket detail for this event.");
      } finally {
        setIsLoadingDetail(false);
      }
    };

    void loadDetail();
  }, [selectedEventId]);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPurchasing) {
        setSelectedEventId(null);
        setSelectedEventDetail(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isPurchasing, selectedEventId]);

  const eventCards = useMemo(() => events.map(mapEventToCard), [events]);
  const categoryOptions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(eventCards.map((event) => event.type).filter(Boolean))),
    ],
    [eventCards],
  );

  const filteredEvents = useMemo(() => {
    return eventCards.filter((event) => {
      const matchCategory =
        selectedCategories.length === 0 || selectedCategories.includes(event.type);
      const matchDate =
        selectedDate === "All" || event.dateFilter === selectedDate;

      return matchCategory && matchDate;
    });
  }, [eventCards, selectedCategories, selectedDate]);
  const selectedTicketType = selectedEventDetail?.ticketTypes.find(
    (ticketType) => ticketType.id === selectedTicketTypeId,
  );
  const maxQuantity = Math.max(
    1,
    Math.min(selectedTicketType?.availableQuantity || 1, 10),
  );
  const safeQuantity = Math.min(quantity, maxQuantity);
  const orderPreviewTotal = (selectedTicketType?.price || 0) * safeQuantity;

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  const handleCloseDetail = () => {
    if (isPurchasing) {
      return;
    }

    setSelectedEventId(null);
    setSelectedEventDetail(null);
    setSelectedTicketTypeId("");
    setPurchaseError("");
    setDetailError("");
    setQuantity(1);
  };

  const handlePurchase = async () => {
    if (!selectedEventDetail || !selectedTicketType) {
      setPurchaseError("Please choose an available ticket.");
      return;
    }

    if (selectedTicketType.availableQuantity <= 0) {
      setPurchaseError("This ticket type is sold out.");
      return;
    }

    setIsPurchasing(true);
    setPurchaseError("");

    try {
      await router.push({
        pathname: "/checkout",
        query: {
          eventId: selectedEventDetail.id,
          ticketTypeId: selectedTicketType.id,
          quantity: String(safeQuantity),
        },
      });
    } catch (error) {
      setPurchaseError(getPurchaseErrorMessage(error));
      setIsPurchasing(false);
    }
  };

  return (
    <>
      <Head>
        <title>Events | EventHub</title>
      </Head>

      <CustomerPageShell
        activeHref="/api/organizer/events?page=1&size=10"
        onLogout={() => void handleLogout()}
      >
        <div className="relative overflow-hidden rounded-4xl bg-gray-900 px-6 pb-16 pt-16 sm:px-8">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-black text-white md:text-5xl">
              Explore Events
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Discover your next experience from events that are now available.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/70 bg-[#F9FAFB] px-6 py-8 shadow-[0_24px_60px_rgba(148,163,184,0.12)] sm:px-8">
          <div className="flex flex-col gap-10 lg:flex-row">
            <aside className="w-full flex-shrink-0 space-y-8 lg:w-72">
              <div className="rounded-[32px] border border-gray-100 bg-white p-7 shadow-sm">
                <h4 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900">
                  <svg
                    className="h-4 w-4 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Categories
                </h4>
                <div className="space-y-4">
                  {categoryOptions.map((category) => (
                    <label
                      key={category}
                      className="group flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={
                          category === "All"
                            ? selectedCategories.length === 0
                            : selectedCategories.includes(category)
                        }
                        onChange={() => handleCategoryChange(category)}
                        className="h-5 w-5 cursor-pointer rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-gray-600 transition-colors group-hover:text-indigo-600">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-gray-100 bg-white p-7 shadow-sm">
                <h4 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900">
                  <svg
                    className="h-4 w-4 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                    />
                  </svg>
                  Time
                </h4>
                <div className="space-y-4">
                  {(["All", "This Weekend", "This Month", "Next Month"] as EventDateFilter[]).map(
                    (date) => (
                      <label
                        key={date}
                        className="group flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="radio"
                          name="date"
                          checked={selectedDate === date}
                          onChange={() => setSelectedDate(date)}
                          className="h-5 w-5 cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-bold text-gray-600 transition-colors group-hover:text-indigo-600">
                          {date}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </aside>

            <main className="flex-1">
              {errorMessage ? (
                <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
                  {errorMessage}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {isLoading ? (
                  <div className="col-span-full rounded-[32px] border border-gray-100 bg-white py-20 text-center">
                    <h3 className="text-2xl font-black text-gray-900">
                      Loading events...
                    </h3>
                  </div>
                ) : null}

                {!isLoading && filteredEvents.length > 0
                  ? filteredEvents.map((event) => (
                      <article
                        key={event.id}
                        className="group relative flex flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
                      >
                        <button
                          type="button"
                          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-white shadow-sm backdrop-blur-md transition-colors hover:bg-red-500"
                          aria-label={`Save ${event.title}`}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"
                            />
                          </svg>
                        </button>

                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          {event.badge ? (
                            <div className="absolute left-4 top-4 rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-black tracking-wider text-white shadow-lg backdrop-blur-sm">
                              {event.badge}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                              {event.type}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <svg
                                className="h-4 w-4 text-indigo-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                                />
                              </svg>
                              {event.dateLabel}
                            </span>
                          </div>

                          <h3 className="min-h-[56px] text-xl font-black leading-tight text-gray-900 transition-colors group-hover:text-indigo-600 line-clamp-2">
                            {event.title}
                          </h3>

                          <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                            {event.shortDescription ||
                              event.description ||
                              "Event details will be updated soon."}
                          </p>

                          <p className="mb-6 mt-4 flex items-center gap-2 text-sm text-gray-500">
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                              />
                            </svg>
                            {event.location}
                          </p>

                          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                            <div className="flex -space-x-2">
                              {event.attendees.map((avatar, index) => (
                                <img
                                  key={`${event.id}-${index}`}
                                  className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                                  src={avatar}
                                  alt="Attendee"
                                />
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedEventId(event.id)}
                              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-indigo-600"
                            >
                              {formatCurrency(event.minPrice)}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  : null}

                {!isLoading && filteredEvents.length === 0 ? (
                  <div className="col-span-full rounded-[32px] border border-gray-100 bg-white py-20 text-center">
                    <div className="mb-4 text-6xl">No results</div>
                    <h3 className="mb-2 text-2xl font-black text-gray-900">
                      No events found
                    </h3>
                    <p className="text-gray-500">
                      Try changing the filters or check back later.
                    </p>
                  </div>
                ) : null}
              </div>
            </main>
          </div>
        </div>
      </CustomerPageShell>

      {selectedEventId ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-[2px]"
          onClick={handleCloseDetail}
        >
          <div
            className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-[#f8fbff] shadow-[0_0_0_1px_rgba(255,255,255,0.5),-30px_0_80px_rgba(15,23,42,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={selectedEventDetail?.bannerUrl || DEFAULT_EVENT_BANNER}
                alt={selectedEventDetail?.title || "Event"}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <button
                type="button"
                onClick={handleCloseDetail}
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
                aria-label="Close event detail"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[11px] font-black uppercase tracking-[0.28em] text-sky-200">
                  {selectedEventDetail?.category || "Event Detail"}
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  {selectedEventDetail?.title || "Loading..."}
                </h2>
              </div>
            </div>

            <div className="flex-1 p-6 sm:p-7">
              {isLoadingDetail ? (
                <div className="rounded-[26px] bg-white px-6 py-16 text-center text-sm font-bold uppercase tracking-[0.28em] text-slate-400 shadow-[0_18px_44px_rgba(148,163,184,0.16)]">
                  Loading event detail...
                </div>
              ) : null}

              {detailError ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
                  {detailError}
                </div>
              ) : null}

              {!isLoadingDetail && selectedEventDetail ? (
                <div className="space-y-6">
                  <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(148,163,184,0.16)]">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          Date & time
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                          {formatDateTimeRange(
                            selectedEventDetail.startTime,
                            selectedEventDetail.endTime,
                          )}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          Venue
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                          {getEventLocation(selectedEventDetail) || "Venue pending"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          Tickets available
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                          {selectedEventDetail.availableTickets}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          Ticket types
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                          {selectedEventDetail.ticketTypes.length}
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-600">
                      {selectedEventDetail.description ||
                        selectedEventDetail.shortDescription ||
                        "No detailed description is available for this event yet."}
                    </p>
                  </section>

                  <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(148,163,184,0.16)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.28em] text-indigo-600">
                          Ticket Types
                        </div>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                          Select your ticket
                        </h3>
                      </div>
                      <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                        {selectedEventDetail.availableTickets} total available
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      {selectedEventDetail.ticketTypes.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm font-semibold text-slate-500">
                          No ticket types are available for this event yet.
                        </div>
                      ) : null}

                      {selectedEventDetail.ticketTypes.map((ticketType) => {
                        const isSelected = ticketType.id === selectedTicketTypeId;
                        const isSoldOut = ticketType.availableQuantity <= 0;

                        return (
                          <button
                            key={ticketType.id}
                            type="button"
                            onClick={() => {
                              setSelectedTicketTypeId(ticketType.id);
                              setQuantity((current) =>
                                Math.max(
                                  1,
                                  Math.min(
                                    current,
                                    Math.min(ticketType.availableQuantity || 1, 10),
                                  ),
                                ),
                              );
                            }}
                            disabled={isSoldOut}
                            className={`w-full rounded-[24px] border p-5 text-left transition ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-50/70 shadow-[0_16px_28px_rgba(99,102,241,0.12)]"
                                : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                            } ${isSoldOut ? "cursor-not-allowed opacity-60" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-xl font-black text-slate-900">
                                  {ticketType.name || "Ticket"}
                                </div>
                                <div className="mt-2 text-sm font-medium text-slate-500">
                                  {ticketType.description || getAvailableText(ticketType)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-black text-slate-900">
                                  {formatCurrency(ticketType.price)}
                                </div>
                                <div
                                  className={`mt-2 text-xs font-bold uppercase tracking-[0.22em] ${
                                    isSoldOut ? "text-rose-500" : "text-emerald-600"
                                  }`}
                                >
                                  {getAvailableText(ticketType)}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_20px_52px_rgba(15,23,42,0.3)]">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-200">
                          Checkout
                        </div>
                        <h3 className="mt-3 text-2xl font-black tracking-tight">
                          Continue to checkout
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                          We will take your selected event, ticket type, and quantity
                          to checkout. After successful payment, your QR code will be
                          available in My Tickets.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                          disabled={quantity <= 1 || !selectedTicketType || isPurchasing}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 text-xl disabled:opacity-40"
                        >
                          -
                        </button>
                        <div className="min-w-16 text-center text-2xl font-black">
                          {safeQuantity}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((current) => Math.min(maxQuantity, current + 1))
                          }
                          disabled={
                            quantity >= maxQuantity ||
                            !selectedTicketType ||
                            isPurchasing ||
                            selectedTicketType.availableQuantity <= 0
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 text-xl disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 rounded-[24px] bg-white/10 p-4 sm:grid-cols-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                          Ticket Type
                        </div>
                        <div className="mt-2 text-sm font-semibold">
                          {selectedTicketType?.name || "Choose a ticket"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                          Quantity
                        </div>
                        <div className="mt-2 text-sm font-semibold">{safeQuantity}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                          Estimated Total
                        </div>
                        <div className="mt-2 text-sm font-semibold">
                          {formatCurrency(orderPreviewTotal)}
                        </div>
                      </div>
                    </div>

                    {purchaseError ? (
                      <div className="mt-4 rounded-2xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
                        {purchaseError}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => void handlePurchase()}
                      disabled={
                        isPurchasing ||
                        !selectedTicketType ||
                        selectedTicketType.availableQuantity <= 0
                      }
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[22px] bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPurchasing ? "Processing payment..." : "Buy ticket"}
                    </button>
                  </section>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
