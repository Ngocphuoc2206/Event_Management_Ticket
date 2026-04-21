/* eslint-disable @next/next/no-img-element */
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { getPublicEvents, type PublicEventsQuery } from "@/features/admin/events.service";
import { Eye, RefreshCcw, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;

const CATEGORIES = [
  "All Categories",
  "Music",
  "Technology",
  "Sports",
  "Conference",
  "Workshop",
  "Food & Beverage",
];

export default function EventsListingPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const query: PublicEventsQuery = {
        search: searchTerm.trim() || undefined,
        category: category !== "All Categories" ? category : undefined,
        location: location.trim() || undefined,
        page,
        size: PAGE_SIZE,
        sortBy: sortBy !== "latest" ? sortBy : undefined,
      };

      const data = await getPublicEvents(query);
      setEvents(data.items);
      setTotalPages(Math.max(1, data.totalPages));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách sự kiện.");
      setEvents([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [category, location, page, searchTerm, sortBy]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, category, location, sortBy]);

  return (
    <AdminLayout title="Events Listing">
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Published Events
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Browse all published events on the platform
            </p>
          </div>

          <button
            onClick={loadEvents}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-full transition-all text-sm border border-slate-100 active:scale-95"
            disabled={isLoading}
          >
            <RefreshCcw
              size={17}
              strokeWidth={2.5}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-sm font-black outline-none focus:border-indigo-500 text-slate-600 cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filter by location..."
              className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select
              className="bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-sm font-black outline-none focus:border-indigo-500 text-slate-600 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="trending">Trending</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full py-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">
              Đang tải danh sách sự kiện...
            </div>
          )}

          {!isLoading && events.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">
              Không có sự kiện phù hợp
            </div>
          )}

          {!isLoading &&
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  <img
                    src={
                      event.bannerUrl ||
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&auto=format&fit=crop"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    alt={event.title}
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-black text-slate-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-bold mb-4 line-clamp-2">
                    {event.location || "Online Event"}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-slate-700">
                      {event.price ? `$${event.price}` : "Free"}
                    </span>
                    {event.category && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-bold mb-4">
                    {event.attendeeCount ? `${event.attendeeCount} attendees` : "No attendance data"}
                  </div>

                  <Link href={`/admin/events/${event.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 text-sm">
                      <Eye size={16} />
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {!isLoading && events.length > 0 && (
          <div className="flex items-center justify-between gap-4 mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Page {page + 1} / {Math.max(1, totalPages)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
                className="px-4 py-2 rounded-xl border border-slate-100 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(Math.max(0, totalPages - 1), p + 1))}
                disabled={page + 1 >= totalPages || isLoading}
                className="px-4 py-2 rounded-xl border border-slate-100 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
