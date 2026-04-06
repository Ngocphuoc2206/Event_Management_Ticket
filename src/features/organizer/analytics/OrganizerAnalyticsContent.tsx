import {
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  Search,
  Settings,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type DateRange = "7d" | "30d" | "90d";

type KpiCard = {
  title: string;
  value: string;
  change: string;
  tone: "sky" | "violet" | "rose";
};

type EventPerformanceCard = {
  label: string;
  value: string;
  note: string;
  tone: "sky" | "violet" | "rose";
};

type RevenueByEvent = {
  event: string;
  revenue: string;
  progress: number;
};

type TopEvent = {
  name: string;
  image: string;
  capacity: number;
  revenue: string;
  growth: string;
  growthUp: boolean;
};

type ChartSeries = {
  labels: string[];
  revenue: number[];
  ticketsSold: number[];
};

const KPI_CARDS: KpiCard[] = [
  { title: "Sales growth %", value: "14,280", change: "+24.5%", tone: "sky" },
  { title: "Revenue growth %", value: "$284,590", change: "+18.2%", tone: "violet" },
  { title: "New attendees %", value: "3,842", change: "+12.4%", tone: "rose" },
];

const EVENT_PERFORMANCE_CARDS: EventPerformanceCard[] = [
  { label: "Best Conversion", value: "Neon Nights", note: "92% sell-through", tone: "sky" },
  { label: "Fastest Growth", value: "Future Tech", note: "+18% week-over-week", tone: "violet" },
  { label: "Needs Boost", value: "Global Webinar", note: "Retargeting suggested", tone: "rose" },
];

const REVENUE_BARS: RevenueByEvent[] = [
  { event: "Neon Nights Music Festival", revenue: "$142,000", progress: 100 },
  { event: "Future Tech Summit 2024", revenue: "$98,400", progress: 69 },
  { event: "Gourmet Food & Wine Expo", revenue: "$76,500", progress: 53 },
  { event: "Global Leaders Webinar", revenue: "$12,300", progress: 9 },
];

const TOP_EVENTS: TopEvent[] = [
  {
    name: "Neon Nights...",
    image: "https://placehold.co/40x40",
    capacity: 92,
    revenue: "$142k",
    growth: "12%",
    growthUp: true,
  },
  {
    name: "Future Tech...",
    image: "https://placehold.co/40x40",
    capacity: 78,
    revenue: "$98k",
    growth: "8%",
    growthUp: true,
  },
  {
    name: "Gourmet Food...",
    image: "https://placehold.co/40x40",
    capacity: 64,
    revenue: "$76k",
    growth: "2%",
    growthUp: false,
  },
];

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

const CHART_DATA_BY_RANGE: Record<DateRange, ChartSeries> = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [42, 52, 48, 58, 66, 62, 72],
    ticketsSold: [31, 36, 34, 41, 44, 42, 50],
  },
  "30d": {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
    revenue: [35, 44, 42, 53, 57, 60, 68],
    ticketsSold: [25, 31, 30, 35, 39, 41, 47],
  },
  "90d": {
    labels: ["M1", "M2", "M3", "M4", "M5", "M6", "M7"],
    revenue: [24, 30, 37, 45, 49, 56, 64],
    ticketsSold: [18, 23, 28, 33, 36, 41, 46],
  },
};

function kpiToneClasses(tone: KpiCard["tone"]) {
  if (tone === "sky") {
    return { iconBg: "bg-sky-700/10 text-sky-700" };
  }

  if (tone === "violet") {
    return { iconBg: "bg-violet-700/10 text-violet-700" };
  }

  return { iconBg: "bg-rose-700/10 text-rose-700" };
}

function toPolylinePoints(values: number[]) {
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(1, maxValue - minValue);

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 36 - ((value - minValue) / range) * 26;
      return `${x},${y}`;
    })
    .join(" ");
}

export function OrganizerAnalyticsContent() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const chartSeries = useMemo(() => CHART_DATA_BY_RANGE[dateRange], [dateRange]);
  const revenuePolyline = useMemo(() => toPolylinePoints(chartSeries.revenue), [chartSeries.revenue]);
  const ticketsPolyline = useMemo(() => toPolylinePoints(chartSeries.ticketsSold), [chartSeries.ticketsSold]);

  return (
    <section className="flex-1 bg-slate-50 text-zinc-900">
      <header className="flex min-h-20 w-full flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-slate-50 px-5 py-4 sm:px-8 lg:px-10">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-gray-700" />
          <input
            type="text"
            placeholder="Search analytics..."
            className="w-full rounded-full bg-gray-100 py-3 pl-12 pr-5 text-sm text-gray-700 placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button type="button" className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>

          <button type="button" className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>

          <div className="h-8 w-px bg-slate-300/30" />

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-zinc-900 outline outline-1 outline-slate-300/10"
          >
            <span>Dashboard</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 p-5 sm:p-8 lg:p-10">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[2.4px] text-sky-700">Performance Insights</p>
            <h1 className="text-4xl font-bold leading-10 text-zinc-900">Analytics Overview</h1>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative">
              <select
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value as DateRange)}
                className="h-10 appearance-none rounded-2xl bg-zinc-200 py-2.5 pl-5 pr-10 text-sm font-semibold text-zinc-900"
                aria-label="Select date range"
              >
                <option value="7d">{DATE_RANGE_LABELS["7d"]}</option>
                <option value="30d">{DATE_RANGE_LABELS["30d"]}</option>
                <option value="90d">{DATE_RANGE_LABELS["90d"]}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-zinc-900" />
            </label>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0px_8px_10px_-6px_rgba(0,88,190,0.1),0px_20px_25px_-5px_rgba(0,88,190,0.1)]"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {KPI_CARDS.map((card) => {
            const tone = kpiToneClasses(card.tone);
            const icon =
              card.tone === "sky" ? <TrendingUp className="h-5 w-5" /> : card.tone === "violet" ? <Wallet className="h-5 w-5" /> : <Users className="h-5 w-5" />;

            return (
              <article
                key={card.title}
                className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/5"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className={`rounded-3xl p-3 ${tone.iconBg}`}>{icon}</div>
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">{card.change}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">{card.title}</p>
                  <p className="text-3xl font-bold leading-9 text-zinc-900">{card.value}</p>
                  <div className="inline-flex items-center gap-1 pt-3 text-xs text-gray-700/60">
                    <Zap className="h-3 w-3" />
                    <span>vs. previous period</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {EVENT_PERFORMANCE_CARDS.map((card) => {
            const tone = kpiToneClasses(card.tone);
            return (
              <article
                key={card.label}
                className="rounded-3xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/5"
              >
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tone.iconBg}`}>{card.label}</span>
                <p className="mt-4 text-xl font-bold text-zinc-900">{card.value}</p>
                <p className="mt-1 text-sm text-gray-700">{card.note}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <article className="rounded-3xl bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/5">
            <h3 className="mb-6 text-lg font-bold text-zinc-900">Revenue Chart</h3>
            <div className="relative h-56 overflow-hidden rounded-2xl bg-white">
              <div className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={`revenue-grid-${index}`} className="border-b border-slate-300/20" />
                ))}
              </div>
              <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full">
                <polyline fill="none" stroke="#6d28d9" strokeWidth="2" points={revenuePolyline} />
              </svg>
            </div>
            <div className="mt-3 grid grid-cols-7 px-1 text-[10px] font-bold uppercase tracking-wide text-gray-700">
              {chartSeries.labels.map((label) => (
                <span key={`rev-label-${label}`}>{label}</span>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/5">
            <h3 className="mb-6 text-lg font-bold text-zinc-900">Tickets Sold Chart</h3>
            <div className="relative h-56 overflow-hidden rounded-2xl bg-white">
              <div className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={`tickets-grid-${index}`} className="border-b border-slate-300/20" />
                ))}
              </div>
              <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full">
                <polyline fill="none" stroke="#0369a1" strokeWidth="2" points={ticketsPolyline} />
              </svg>
            </div>
            <div className="mt-3 grid grid-cols-7 px-1 text-[10px] font-bold uppercase tracking-wide text-gray-700">
              {chartSeries.labels.map((label) => (
                <span key={`ticket-label-${label}`}>{label}</span>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
          <article className="rounded-3xl bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/5">
            <h3 className="mb-6 text-xl font-bold leading-7 text-zinc-900">Revenue by Event</h3>
            <div className="space-y-6">
              {REVENUE_BARS.map((bar) => (
                <div key={bar.event} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                    <span>{bar.event}</span>
                    <span>{bar.revenue}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-3 rounded-full bg-gradient-to-r from-sky-700 to-violet-700" style={{ width: `${bar.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/5">
            <div className="border-b border-slate-300/10 p-6">
              <h3 className="text-xl font-bold leading-7 text-zinc-900">Top Performing Events</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[520px] w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wide text-gray-700">Event Name</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wide text-gray-700">Capacity</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wide text-gray-700">Revenue</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wide text-gray-700">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_EVENTS.map((event, index) => (
                    <tr key={event.name} className={index === 0 ? "" : "border-t border-slate-300/10"}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-2xl bg-gray-100">
                            <img src={event.image} alt={event.name} className="h-10 w-10 object-cover" />
                          </div>
                          <span className="text-sm font-semibold text-zinc-900">{event.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-16">
                          <p className="text-sm font-medium text-zinc-900">{event.capacity}%</p>
                          <div className="mt-1 h-1 rounded-full bg-gray-100">
                            <div className="h-1 rounded-full bg-sky-700" style={{ width: `${event.capacity}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-zinc-900">{event.revenue}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${event.growthUp ? "text-green-600" : "text-rose-700"}`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${event.growthUp ? "bg-green-600" : "bg-rose-700"}`} />
                          {event.growth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-gray-200 p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-16 w-64 bg-gradient-to-l from-sky-700/5 to-sky-700/0" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-700/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                <span className="h-2 w-2 rounded-full bg-rose-700" />
                Live Updates
              </span>
              <p className="text-sm font-medium text-zinc-900">
                &quot;Midnight Jazz Festival&quot; tickets are selling fast - 85% capacity reached.
              </p>
            </div>

            <button type="button" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700">
              View Details
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
