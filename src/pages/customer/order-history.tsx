import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CustomerDashboardIcon, CustomerDashboardSidebar, customerProfile } from "@/features/customer";
import type { CustomerNavItem } from "@/features/customer";

type HistoryStatus = "Completed" | "Pending" | "Cancelled";
type TimeFilter = "all" | "30days" | "6months" | "2024";
type StatusFilter = "all" | HistoryStatus;
type AmountSort = "default" | "asc" | "desc";

type OrderHistoryItem = {
  id: string;
  eventName: string;
  purchaseDate: string;
  isoDate: string;
  amount: string;
  status: HistoryStatus;
  paymentMethod: string;
  ticketType: string;
  quantity: number;
  venue: string;
  imageSrc: string;
};

const customerOrderHistoryNavigationItems: CustomerNavItem[] = [
  { label: "Dashboard", href: "/customer", icon: "grid" },
  { label: "My Tickets", href: "/customer/my-tickets", icon: "ticket" },
  { label: "Order History", href: "/customer/order-history", icon: "history", active: true },
  { label: "Notifications", href: "/customer/notifications", icon: "bell" },
  { label: "Profile Settings", href: "/customer/profile-settings", icon: "settings" },
];

const ORDER_HISTORY: OrderHistoryItem[] = [
  {
    id: "#RD-9021-X1",
    eventName: "Neon Pulse Music Festival",
    purchaseDate: "Sep 24, 2024",
    isoDate: "2024-09-24",
    amount: "$245.00",
    status: "Completed",
    paymentMethod: "Visa •••• 8842",
    ticketType: "VIP Pass",
    quantity: 2,
    venue: "Grand Arena, LA",
    imageSrc: "/images/upc1.png",
  },
  {
    id: "#RD-8842-P3",
    eventName: "Global Tech Summit 2024",
    purchaseDate: "Aug 12, 2024",
    isoDate: "2024-08-12",
    amount: "$599.00",
    status: "Pending",
    paymentMethod: "Mastercard •••• 1024",
    ticketType: "Standard Admission",
    quantity: 1,
    venue: "Convention Center",
    imageSrc: "/images/upc2.png",
  },
  {
    id: "#RD-7651-B9",
    eventName: "Midnight Jazz Collective",
    purchaseDate: "Jul 28, 2024",
    isoDate: "2024-07-28",
    amount: "$45.00",
    status: "Cancelled",
    paymentMethod: "PayPal",
    ticketType: "General Admission",
    quantity: 1,
    venue: "Riverside Hall",
    imageSrc: "/images/upc1.png",
  },
  {
    id: "#RD-4410-Q1",
    eventName: "Modern Art Expo 2024",
    purchaseDate: "Jun 15, 2024",
    isoDate: "2024-06-15",
    amount: "$35.00",
    status: "Completed",
    paymentMethod: "Visa •••• 8842",
    ticketType: "Entry Pass",
    quantity: 1,
    venue: "City Gallery",
    imageSrc: "/images/upc2.png",
  },
  {
    id: "#RD-3104-N7",
    eventName: "Designers Meetup Tokyo",
    purchaseDate: "May 30, 2024",
    isoDate: "2024-05-30",
    amount: "$128.80",
    status: "Completed",
    paymentMethod: "Apple Pay",
    ticketType: "Workshop Bundle",
    quantity: 2,
    venue: "Studio Forum",
    imageSrc: "/images/upc2.png",
  },
];

const STATUS_STYLES: Record<HistoryStatus, string> = {
  Completed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const STATUS_DOT_STYLES: Record<HistoryStatus, string> = {
  Completed: "bg-emerald-500",
  Pending: "bg-amber-500",
  Cancelled: "bg-rose-500",
};

function parseAmount(amount: string) {
  const value = Number.parseFloat(amount.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function escapeCsvValue(value: string | number) {
  const normalizedValue = String(value).replace(/"/g, '""');
  return `"${normalizedValue}"`;
}

function isWithinTimeFilter(order: OrderHistoryItem, filter: TimeFilter) {
  if (filter === "all") {
    return true;
  }

  const orderDate = new Date(order.isoDate);
  if (filter === "2024") {
    return orderDate.getFullYear() === 2024;
  }

  const now = new Date();
  const thresholdDate = new Date(now);

  if (filter === "30days") {
    thresholdDate.setDate(now.getDate() - 30);
  } else if (filter === "6months") {
    thresholdDate.setMonth(now.getMonth() - 6);
  }

  return orderDate >= thresholdDate && orderDate <= now;
}

function StatCard({ label, value, accent, note }: { label: string; value: string; accent: string; note: string }) {
  return (
    <article className="rounded-[24px] border border-white/90 bg-white/95 p-6 shadow-[0_18px_44px_rgba(148,163,184,0.14)]">
      <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">{label}</div>
      <div className={`mt-4 text-[2rem] font-bold tracking-tight ${accent}`}>{value}</div>
      <div className="mt-1 text-sm text-slate-500">{note}</div>
    </article>
  );
}

function OrderStatusBadge({ status }: { status: HistoryStatus }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      <span className={`h-2 w-2 rounded-full ${STATUS_DOT_STYLES[status]}`} />
      {status}
    </span>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full appearance-none rounded-[20px] border border-slate-200 bg-white px-5 pr-12 text-base font-semibold text-slate-700 outline-none"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-slate-400">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
          <path d="m6.75 9.75 5.25 5.25 5.25-5.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

export default function CustomerOrderHistoryPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const filterPanelRef = useRef<HTMLDivElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [amountSort, setAmountSort] = useState<AmountSort>("default");
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);

  useEffect(() => {
    if (!selectedOrder) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedOrder]);

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterPanelRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isFilterOpen]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const visibleOrders = ORDER_HISTORY.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesTime = isWithinTimeFilter(order, timeFilter);
      const matchesQuery =
        !normalizedQuery ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.eventName.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesTime && matchesQuery;
    });

    if (amountSort === "default") {
      return visibleOrders;
    }

    return [...visibleOrders].sort((left, right) => {
      const amountDelta = parseAmount(left.amount) - parseAmount(right.amount);
      return amountSort === "asc" ? amountDelta : -amountDelta;
    });
  }, [amountSort, query, statusFilter, timeFilter]);

  const totalSpent = useMemo(
    () =>
      formatUsd(
        ORDER_HISTORY.filter((order) => order.status === "Completed").reduce((sum, order) => sum + parseAmount(order.amount), 0),
      ),
    [],
  );

  const eventsAttended = ORDER_HISTORY.filter((order) => order.status === "Completed").length.toString();
  const activeOrders = ORDER_HISTORY.filter((order) => order.status === "Pending").length.toString();

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  const handleExportCsv = () => {
    if (filteredOrders.length === 0 || typeof window === "undefined") {
      return;
    }

    const header = [
      "Order ID",
      "Event Name",
      "Purchase Date",
      "Amount",
      "Payment Status",
      "Payment Method",
      "Ticket Type",
      "Quantity",
      "Venue",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.eventName,
      order.purchaseDate,
      order.amount,
      order.status,
      order.paymentMethod,
      order.ticketType,
      order.quantity,
      order.venue,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `order-history-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>Order History | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#eef2f8] text-slate-900">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          <CustomerDashboardSidebar
            navigationItems={customerOrderHistoryNavigationItems}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="text-xs font-medium text-slate-500">Dashboard &nbsp;&rsaquo;&nbsp; Order History</div>
            <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-3xl font-bold tracking-tight text-slate-900">Order History</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex h-12 min-w-[260px] items-center gap-3 rounded-full bg-slate-200/80 px-4 text-sm text-slate-500 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
                  <CustomerDashboardIcon type="search" className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search orders..."
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </label>
                <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  <CustomerDashboardIcon type="help" className="h-4 w-4" />
                </button>
                <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  <CustomerDashboardIcon type="logout" className="h-4 w-4" />
                </button>
              </div>
            </header>

            <section className="mt-10">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.7rem]">Review Your Experiences</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
                Access and manage all your past ticket purchases, invoices, and event details in one centralized location.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <StatCard label="Total Spent" value={totalSpent} accent="text-blue-600" note="Across completed purchases" />
                <StatCard label="Events Attended" value={eventsAttended} accent="text-violet-600" note="Orders marked completed" />
                <StatCard label="Active Orders" value={activeOrders} accent="text-rose-600" note="Orders awaiting payment" />
              </div>

              <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div ref={filterPanelRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-200/80 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                      <path d="M4 7h16M7.5 12h9M10.5 17h3" strokeLinecap="round" />
                    </svg>
                    Filter
                  </button>

                  {isFilterOpen ? (
                    <div className="absolute left-0 top-[calc(100%+12px)] z-20 grid w-[280px] gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(148,163,184,0.2)]">
                      <FilterSelect value={timeFilter} onChange={(value) => setTimeFilter(value as TimeFilter)}>
                        <option value="all">All Time</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="2024">Year 2024</option>
                      </FilterSelect>
                      <FilterSelect value={statusFilter} onChange={(value) => setStatusFilter(value as StatusFilter)}>
                        <option value="all">All Statuses</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </FilterSelect>
                      <FilterSelect value={amountSort} onChange={(value) => setAmountSort(value as AmountSort)}>
                        <option value="default">Amount</option>
                        <option value="asc">Amount: Low to High</option>
                        <option value="desc">Amount: High to Low</option>
                      </FilterSelect>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={filteredOrders.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(76,92,193,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CustomerDashboardIcon type="download" className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </section>

            <section className="mt-8 overflow-hidden rounded-[28px] border border-white/90 bg-white/95 shadow-[0_24px_60px_rgba(148,163,184,0.14)]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Order ID</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Event Name</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Purchase Date</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Amount</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Status</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-6 py-5 text-sm font-semibold text-slate-700">{order.id}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-slate-100">
                              <Image src={order.imageSrc} alt={order.eventName} fill sizes="44px" className="object-cover" />
                            </div>
                            <div className="text-sm font-semibold text-slate-900">{order.eventName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">{order.purchaseDate}</td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-900">{order.amount}</td>
                        <td className="px-6 py-5">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <div>Showing {filteredOrders.length} of {ORDER_HISTORY.length} orders</div>
                <div className="flex items-center gap-2">
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400">‹</button>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">1</button>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500">2</button>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500">3</button>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400">›</button>
                </div>
              </div>
            </section>
          </section>
        </div>

        {selectedOrder ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-[2px]" onClick={() => setSelectedOrder(null)}>
            <div
              className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600">Order Details</div>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{selectedOrder.eventName}</h2>
                  <p className="mt-2 text-sm text-slate-500">{selectedOrder.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:text-slate-900"
                  aria-label="Close order details"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-[140px_minmax(0,1fr)]">
                <div className="relative h-32 overflow-hidden rounded-2xl bg-slate-100">
                  <Image src={selectedOrder.imageSrc} alt={selectedOrder.eventName} fill sizes="140px" className="object-cover" />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Payment Status</span>
                    <OrderStatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">Purchase Date</div>
                    <div className="mt-1">{selectedOrder.purchaseDate}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">Amount</div>
                    <div className="mt-1">{selectedOrder.amount}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Payment Method</div>
                  <div className="mt-1">{selectedOrder.paymentMethod}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Ticket Type</div>
                  <div className="mt-1">{selectedOrder.ticketType}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Quantity</div>
                  <div className="mt-1">{selectedOrder.quantity}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Venue</div>
                  <div className="mt-1">{selectedOrder.venue}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
