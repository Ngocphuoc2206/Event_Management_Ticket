import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CustomerDashboardIcon,
  CustomerDashboardSidebar,
  getCustomerNavigationItems,
  customerProfile,
} from "@/features/customer";
import {
  getMyOrder,
  getMyOrders,
  type OrderResponse,
} from "@/features/customer/orders.service";

type HistoryStatus = "Completed" | "Pending" | "Cancelled";
type TimeFilter = "all" | "30days" | "6months" | "2024";
type StatusFilter = "all" | "PENDING_PAYMENT" | "PAID" | "CANCELLED";
type AmountSort = "default" | "asc" | "desc";

type OrderHistoryItem = {
  id: string;
  eventName: string;
  purchaseDate: string;
  isoDate: string;
  amount: string;
  status: HistoryStatus;
  rawStatus: string;
  paymentStatus: string;
  ticketType: string;
  quantity: number;
  userName: string;
};

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

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function escapeCsvValue(value: string | number) {
  const normalizedValue = String(value).replace(/"/g, '""');
  return `"${normalizedValue}"`;
}

function resolveHistoryStatus(status: string): HistoryStatus {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus.includes("PAID") ||
    normalizedStatus.includes("SUCCESS") ||
    normalizedStatus.includes("COMPLETED")
  ) {
    return "Completed";
  }

  if (
    normalizedStatus.includes("CANCEL") ||
    normalizedStatus.includes("FAILED") ||
    normalizedStatus.includes("EXPIRED")
  ) {
    return "Cancelled";
  }

  return "Pending";
}

function formatOrderDate(orderDate: string) {
  const date = new Date(orderDate);

  if (Number.isNaN(date.getTime())) {
    return orderDate;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getOrderIsoDate(orderDate: string) {
  const date = new Date(orderDate);
  return Number.isNaN(date.getTime()) ? orderDate : date.toISOString();
}

function mapOrderToHistoryItem(order: OrderResponse): OrderHistoryItem {
  const firstItem = order.items[0];
  const ticketType = firstItem?.ticketTypeName || firstItem?.ticketTypeId || "Ticket";
  const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: order.id,
    eventName: ticketType,
    purchaseDate: formatOrderDate(order.orderDate),
    isoDate: getOrderIsoDate(order.orderDate),
    amount: formatVnd(order.totalAmount),
    status: resolveHistoryStatus(order.status),
    rawStatus: order.status,
    paymentStatus: order.paymentStatus || "PENDING",
    ticketType,
    quantity,
    userName: order.userName || "Current user",
  };
}

function isWithinTimeFilter(order: OrderHistoryItem, filter: TimeFilter) {
  if (filter === "all") {
    return true;
  }

  const orderDate = new Date(order.isoDate);
  if (Number.isNaN(orderDate.getTime())) {
    return true;
  }

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

function StatCard({
  label,
  value,
  accent,
  note,
}: {
  label: string;
  value: string;
  accent: string;
  note: string;
}) {
  return (
    <article className="rounded-[22px] border border-white/90 bg-white/95 p-5 shadow-[0_18px_44px_rgba(148,163,184,0.14)]">
      <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">{label}</div>
      <div className={`mt-3 text-[1.65rem] font-bold tracking-tight ${accent}`}>{value}</div>
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
        className="h-12 w-full appearance-none rounded-[18px] border border-slate-200 bg-white px-4 pr-11 text-sm font-semibold text-slate-700 outline-none"
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
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const loadOrders = async () => {
        setIsLoadingOrders(true);
        setOrdersError(null);

        try {
          const response = await getMyOrders({
            search: query,
            orderStatus: statusFilter === "all" ? undefined : statusFilter,
          });
          setOrders(response.items.map(mapOrderToHistoryItem));
          setHasNextPage(response.hasNext);
        } catch {
          setOrdersError("Could not load order history.");
          setOrders([]);
          setHasNextPage(false);
        } finally {
          setIsLoadingOrders(false);
        }
      };

      void loadOrders();
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query, statusFilter]);

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
    const visibleOrders = orders.filter((order) => isWithinTimeFilter(order, timeFilter));

    if (amountSort === "default") {
      return visibleOrders;
    }

    return [...visibleOrders].sort((left, right) => {
      const amountDelta = parseAmount(left.amount) - parseAmount(right.amount);
      return amountSort === "asc" ? amountDelta : -amountDelta;
    });
  }, [amountSort, orders, timeFilter]);

  const totalSpent = useMemo(
    () =>
      formatVnd(
        orders.filter((order) => order.status === "Completed").reduce((sum, order) => sum + parseAmount(order.amount), 0),
      ),
    [orders],
  );

  const eventsAttended = orders.filter((order) => order.status === "Completed").length.toString();
  const activeOrders = orders.filter((order) => order.status === "Pending").length.toString();

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  const handleViewOrder = async (order: OrderHistoryItem) => {
    setIsLoadingOrderDetail(true);
    setOrdersError(null);

    try {
      const response = await getMyOrder(order.id);
      setSelectedOrder(response ? mapOrderToHistoryItem(response) : order);
    } catch {
      setSelectedOrder(order);
      setOrdersError("Could not load order detail.");
    } finally {
      setIsLoadingOrderDetail(false);
    }
  };

  const handleExportCsv = () => {
    if (filteredOrders.length === 0 || typeof window === "undefined") {
      return;
    }

    const header = [
      "Order ID",
      "Ticket Type",
      "Purchase Date",
      "Amount",
      "Order Status",
      "Payment Status",
      "Quantity",
      "Customer",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.ticketType,
      order.purchaseDate,
      order.amount,
      order.rawStatus,
      order.paymentStatus,
      order.quantity,
      order.userName,
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
            navigationItems={getCustomerNavigationItems("/customer/order-history")}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="mx-auto w-full max-w-[1600px]">
            <div className="text-xs font-medium text-slate-500">Dashboard &nbsp;&rsaquo;&nbsp; Order History</div>
            <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">Order History</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex h-12 min-w-[260px] items-center gap-3 rounded-full bg-slate-200/80 px-4 text-sm text-slate-500 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
                  <CustomerDashboardIcon type="search" className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by ticket type..."
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
                >
                  <CustomerDashboardIcon type="logout" className="h-4 w-4" />
                </button>
              </div>
            </header>

            <section className="mt-10">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review Your Experiences</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Access and manage all your ticket purchases, statuses, and order details in one place.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <StatCard label="Total Spent" value={totalSpent} accent="text-blue-600" note="Across paid purchases" />
                <StatCard label="Paid Orders" value={eventsAttended} accent="text-violet-600" note="Orders marked paid" />
                <StatCard label="Pending Orders" value={activeOrders} accent="text-rose-600" note="Orders awaiting payment" />
              </div>

              <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div ref={filterPanelRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-200/80 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                      <path d="M4 7h16M7.5 12h9M10.5 17h3" strokeLinecap="round" />
                    </svg>
                    Filter
                  </button>

                  {isFilterOpen ? (
                    <div className="absolute left-0 top-[calc(100%+12px)] z-20 grid w-[260px] gap-3 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(148,163,184,0.2)]">
                      <FilterSelect value={timeFilter} onChange={(value) => setTimeFilter(value as TimeFilter)}>
                        <option value="all">All Time</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="2024">Year 2024</option>
                      </FilterSelect>
                      <FilterSelect value={statusFilter} onChange={(value) => setStatusFilter(value as StatusFilter)}>
                        <option value="all">All Statuses</option>
                        <option value="PENDING_PAYMENT">Pending Payment</option>
                        <option value="PAID">Paid</option>
                        <option value="CANCELLED">Cancelled</option>
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
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(76,92,193,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CustomerDashboardIcon type="download" className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </section>

            <section className="mt-8 overflow-hidden rounded-[28px] border border-white/90 bg-white/95 shadow-[0_24px_60px_rgba(148,163,184,0.14)]">
              {ordersError ? (
                <div className="border-b border-rose-100 bg-rose-50 px-6 py-4 text-sm font-semibold text-rose-600">
                  {ordersError}
                </div>
              ) : null}
              {isLoadingOrders ? (
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-8 text-center text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  Loading orders...
                </div>
              ) : null}

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Order ID</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Ticket Type</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Order Date</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Amount</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Status</th>
                      <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isLoadingOrders && filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-6 py-5 text-sm font-semibold text-slate-700">{order.id}</td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-semibold text-slate-900">{order.ticketType}</div>
                          <div className="mt-1 text-xs text-slate-500">Quantity: {order.quantity}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">{order.purchaseDate}</td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-900">{order.amount}</td>
                        <td className="px-6 py-5">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => void handleViewOrder(order)}
                            disabled={isLoadingOrderDetail}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isLoadingOrderDetail ? "Loading..." : "View"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!isLoadingOrders && filteredOrders.length === 0 ? (
                <div className="border-t border-slate-100 px-6 py-10 text-center text-sm font-semibold text-slate-500">
                  No orders found.
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  Showing {filteredOrders.length} of {orders.length} orders
                  {hasNextPage ? " - more available" : ""}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400">{"<"}</button>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">1</button>
                  <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400">{">"}</button>
                </div>
              </div>
            </section>
            </div>
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
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{selectedOrder.ticketType}</h2>
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

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Order Status</div>
                  <div className="mt-2"><OrderStatusBadge status={selectedOrder.status} /></div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Payment Status</div>
                  <div className="mt-1">{selectedOrder.paymentStatus}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Order Date</div>
                  <div className="mt-1">{selectedOrder.purchaseDate}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Amount</div>
                  <div className="mt-1">{selectedOrder.amount}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Ticket Type</div>
                  <div className="mt-1">{selectedOrder.ticketType}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Quantity</div>
                  <div className="mt-1">{selectedOrder.quantity}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:col-span-2">
                  <div className="font-semibold text-slate-900">Customer</div>
                  <div className="mt-1">{selectedOrder.userName}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
