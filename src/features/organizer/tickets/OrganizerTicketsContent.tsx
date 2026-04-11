import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

type TicketStatus = "Active" | "Sold Out" | "Paused";

type TicketRow = {
  id: string;
  name: string;
  ref: string;
  event: string;
  category: string;
  price: number;
  sold: number;
  total: number;
  status: TicketStatus;
};

const TICKET_ROWS: TicketRow[] = [
  {
    id: "tkt-001-nnf",
    name: "Main Stage VIP",
    ref: "TKT-001-NNF",
    event: "Neon Nights Festival 2024",
    category: "VIP",
    price: 299,
    sold: 480,
    total: 500,
    status: "Active",
  },
  {
    id: "tkt-004-tec",
    name: "Early Bird Pass",
    ref: "TKT-004-TEC",
    event: "Tech Summit Global",
    category: "Early Bird",
    price: 150,
    sold: 1000,
    total: 1000,
    status: "Sold Out",
  },
  {
    id: "tkt-012-acs",
    name: "General Admission",
    ref: "TKT-012-ACS",
    event: "Acoustic Soul Sessions",
    category: "GA",
    price: 45,
    sold: 156,
    total: 300,
    status: "Paused",
  },
  {
    id: "tkt-098-nnf",
    name: "Backstage Discovery",
    ref: "TKT-098-NNF",
    event: "Neon Nights Festival 2024",
    category: "Add-On",
    price: 500,
    sold: 12,
    total: 20,
    status: "Active",
  },
];

type TicketFormState = {
  name: string;
  event: string;
  category: string;
  price: string;
  sold: string;
  total: string;
  status: TicketStatus;
};

const DEFAULT_TICKET_FORM: TicketFormState = {
  name: "",
  event: "",
  category: "",
  price: "",
  sold: "0",
  total: "100",
  status: "Active",
};

const STATUS_FILTER_OPTIONS = ["Any Status", "Active", "Sold Out", "Paused"] as const;
const ALL_CATEGORIES_OPTION = "All Categories";

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getDerivedStatus(sold: number, total: number, status: TicketStatus) {
  if (total > 0 && sold >= total) {
    return "Sold Out";
  }

  return status;
}

export function OrganizerTicketsContent() {
  const [tickets, setTickets] = useState<TicketRow[]>(TICKET_ROWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_OPTION);
  const [selectedStatus, setSelectedStatus] = useState<(typeof STATUS_FILTER_OPTIONS)[number]>("Any Status");
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [form, setForm] = useState<TicketFormState>(DEFAULT_TICKET_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const eventOptions = useMemo(() => {
    const uniqueEvents = Array.from(new Set(tickets.map((ticket) => ticket.event)));
    return ["All Events", ...uniqueEvents];
  }, [tickets]);

  const categoryOptions = useMemo(() => {
    const uniqueCategories = Array.from(new Set(tickets.map((ticket) => ticket.category)));
    return [ALL_CATEGORIES_OPTION, ...uniqueCategories];
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesEvent = selectedEvent === "All Events" || ticket.event === selectedEvent;
      const matchesCategory = selectedCategory === ALL_CATEGORIES_OPTION || ticket.category === selectedCategory;
      const matchesStatus = selectedStatus === "Any Status" || ticket.status === selectedStatus;
      const matchesSearch =
        !normalizedSearch
        || ticket.name.toLowerCase().includes(normalizedSearch)
        || ticket.event.toLowerCase().includes(normalizedSearch)
        || ticket.ref.toLowerCase().includes(normalizedSearch);

      return matchesEvent && matchesCategory && matchesStatus && matchesSearch;
    });
  }, [tickets, searchTerm, selectedEvent, selectedCategory, selectedStatus]);

  const totals = useMemo(() => {
    const totalRevenue = filteredTickets.reduce((sum, ticket) => sum + (ticket.sold * ticket.price), 0);
    const totalSold = filteredTickets.reduce((sum, ticket) => sum + ticket.sold, 0);
    const totalCapacity = filteredTickets.reduce((sum, ticket) => sum + ticket.total, 0);
    const soldPercent = totalCapacity === 0 ? 0 : Math.round((totalSold / totalCapacity) * 100);
    const activeEvents = new Set(filteredTickets.map((ticket) => ticket.event)).size;
    const soldOutCount = filteredTickets.filter((ticket) => ticket.status === "Sold Out").length;

    return {
      totalRevenue,
      totalSold,
      totalCapacity,
      soldPercent,
      activeEvents,
      soldOutCount,
    };
  }, [filteredTickets]);

  const openCreateForm = () => {
    setEditingTicketId(null);
    setForm(DEFAULT_TICKET_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (ticket: TicketRow) => {
    setEditingTicketId(ticket.id);
    setForm({
      name: ticket.name,
      event: ticket.event,
      category: ticket.category,
      price: String(ticket.price),
      sold: String(ticket.sold),
      total: String(ticket.total),
      status: ticket.status,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTicketId(null);
    setForm(DEFAULT_TICKET_FORM);
  };

  const handleSubmitTicket = () => {
    const nextPrice = Number(form.price);
    const nextSold = Number(form.sold);
    const nextTotal = Number(form.total);

    if (!form.name.trim() || !form.event.trim() || !form.category.trim() || Number.isNaN(nextPrice) || Number.isNaN(nextSold) || Number.isNaN(nextTotal)) {
      return;
    }

    const safeSold = Math.max(0, nextSold);
    const safeTotal = Math.max(1, nextTotal);
    const resolvedStatus = getDerivedStatus(safeSold, safeTotal, form.status);

    if (editingTicketId) {
      setTickets((prev) => prev.map((ticket) => {
        if (ticket.id !== editingTicketId) {
          return ticket;
        }

        return {
          ...ticket,
          name: form.name.trim(),
          event: form.event.trim(),
          category: form.category.trim(),
          price: nextPrice,
          sold: safeSold,
          total: safeTotal,
          status: resolvedStatus,
        };
      }));
    } else {
      const numericRef = 100 + tickets.length + 1;
      const eventCode = (form.event.trim().split(" ").map((word) => word.charAt(0)).join("") || "EVT").slice(0, 3).toUpperCase();
      const ref = `TKT-${numericRef}-${eventCode}`;

      setTickets((prev) => [
        {
          id: `${ref.toLowerCase()}-${Date.now()}`,
          ref,
          name: form.name.trim(),
          event: form.event.trim(),
          category: form.category.trim(),
          price: nextPrice,
          sold: safeSold,
          total: safeTotal,
          status: resolvedStatus,
        },
        ...prev,
      ]);
    }

    closeForm();
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex h-20 items-center justify-between bg-slate-50 px-5 sm:px-8 lg:px-10">
        <div className="relative w-full max-w-[620px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search tickets, events or buyers..."
            className="inline-flex w-full items-center rounded-full bg-gray-100 py-3 pl-12 pr-6 text-sm text-gray-700 placeholder:text-gray-500"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-700" />
        </div>

        <div className="ml-8 flex items-center gap-6">
          <button type="button" className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>
          <button type="button" className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-10 w-px bg-slate-300/30" />
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900">Giang Đẹp Zai Ahihi</p>
              <p className="text-xs text-gray-700">Lead Organizer</p>
            </div>
            <img src="https://placehold.co/40x40" alt="Organizer profile" className="h-10 w-10 rounded-full border-2 border-gray-100" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1104px] flex-col gap-8 px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        <section className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-[650px]">
            <h1 className="text-4xl font-bold leading-10 text-zinc-900">Tickets Management</h1>
            <p className="mt-2 max-w-[620px] text-lg leading-7 text-gray-700">
              Monitor sales performance, adjust pricing strategies, and manage inventory across all your live experiences.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 lg:justify-self-end">
            <button type="button" className="inline-flex items-center gap-3 rounded-2xl bg-zinc-200 px-6 py-3 text-base font-semibold text-zinc-900">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Ticket Type
            </button>
          </div>
        </section>

        {isFormOpen ? (
          <section className="rounded-[32px] bg-white p-6 shadow-sm outline outline-1 outline-slate-300/10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{editingTicketId ? "Edit Ticket Type" : "Create Ticket Type"}</h3>
                <p className="text-xs text-gray-700">Set pricing, inventory, and status for this ticket type.</p>
              </div>
              <button type="button" onClick={closeForm} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">Cancel</button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Ticket Name</span>
                <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Main Stage VIP" className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Event</span>
                <input value={form.event} onChange={(event) => setForm((prev) => ({ ...prev, event: event.target.value }))} placeholder="Neon Nights Festival 2024" className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Category</span>
                <input value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} placeholder="VIP" className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Price (USD)</span>
                <input value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="299" className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Sold</span>
                <input value={form.sold} onChange={(event) => setForm((prev) => ({ ...prev, sold: event.target.value }))} placeholder="480" className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Total Inventory</span>
                <input value={form.total} onChange={(event) => setForm((prev) => ({ ...prev, total: event.target.value }))} placeholder="500" className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as TicketStatus }))}
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex justify-end">
              <button type="button" onClick={handleSubmitTicket} className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white">
                {editingTicketId ? "Update Ticket Type" : "Create Ticket Type"}
              </button>
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Total Revenue</p>
            <p className="mt-4 text-3xl font-bold text-zinc-900">{formatCurrency(totals.totalRevenue)}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-sky-700"><TrendingUp className="h-3.5 w-3.5" />+12.5% from last month</p>
          </article>

          <article className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Tickets Sold</p>
            <p className="mt-4 text-3xl font-bold text-zinc-900">{totals.totalSold.toLocaleString()}</p>
            <p className="mt-4 text-xs font-medium text-sky-700">{totals.soldPercent}% total capacity sold</p>
          </article>

          <article className="rounded-[32px] border-l-4 border-violet-700 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Active Events</p>
            <p className="mt-4 text-3xl font-bold text-zinc-900">{totals.activeEvents}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-gray-700"><span className="h-2 w-2 rounded-full bg-rose-700" />{totals.activeEvents} events in current view</p>
          </article>

          <article className="rounded-[32px] border-l-4 border-rose-700 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Waitlisted</p>
            <p className="mt-4 text-3xl font-bold text-zinc-900">{totals.soldOutCount}</p>
            <p className="mt-4 text-xs text-gray-700">Sold-out categories in filtered result</p>
          </article>
        </section>

        <section className="rounded-2xl bg-gray-100 p-4 outline outline-1 outline-slate-300/10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
            <label className="space-y-1">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700"><Filter className="h-3.5 w-3.5" />Event</span>
              <div className="relative">
                <select value={selectedEvent} onChange={(event) => setSelectedEvent(event.target.value)} className="w-full appearance-none rounded-2xl bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-zinc-900 outline outline-1 outline-slate-300/10">
                {eventOptions.map((eventName) => (
                  <option key={eventName} value={eventName}>{truncateText(eventName, 28)}</option>
                ))}
              </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </label>

            <label className="space-y-1">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">Category</span>
              <div className="relative">
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full appearance-none rounded-2xl bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-zinc-900 outline outline-1 outline-slate-300/10">
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </label>

            <label className="space-y-1">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">Status</span>
              <div className="relative">
                <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as (typeof STATUS_FILTER_OPTIONS)[number])} className="w-full appearance-none rounded-2xl bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-zinc-900 outline outline-1 outline-slate-300/10">
                {STATUS_FILTER_OPTIONS.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>{statusOption}</option>
                ))}
              </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </label>

            <button
              type="button"
              onClick={() => {
                setSelectedEvent("All Events");
                setSelectedCategory(ALL_CATEGORIES_OPTION);
                setSelectedStatus("Any Status");
                setSearchTerm("");
              }}
              className="justify-self-end rounded-xl px-3 py-2 text-sm font-bold text-sky-700 hover:bg-white/60"
            >
              Clear All Filters
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full">
              <thead className="border-b border-gray-100 bg-gray-100/50">
                <tr>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Ticket Name</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Event Name</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Category</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Price</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Sold / Remaining</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-bold uppercase tracking-wide text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((row, index) => {
                  const remaining = Math.max(0, row.total - row.sold);
                  const percent = row.total === 0 ? 0 : Math.round((row.sold / row.total) * 100);
                  const statusColor = row.status === "Active" ? "text-sky-700" : row.status === "Sold Out" ? "text-rose-700" : "text-gray-500";
                  const dotColor = row.status === "Active" ? "bg-sky-700" : row.status === "Sold Out" ? "bg-rose-700" : "bg-gray-500";
                  const barColor = row.status === "Sold Out" ? "bg-rose-700" : row.status === "Paused" ? "bg-violet-700" : "bg-sky-700";

                  return (
                    <tr key={row.ref} className={index > 0 ? "border-t border-gray-100" : ""}>
                      <td className="px-6 py-6">
                        <p className="text-base font-bold text-zinc-900">{row.name}</p>
                        <p className="mt-1 text-xs text-gray-700">Ref: {row.ref}</p>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-zinc-900" title={row.event}>{truncateText(row.event, 30)}</td>
                      <td className="px-6 py-6">
                        <span className="inline-flex rounded-full bg-zinc-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-700">{row.category}</span>
                      </td>
                      <td className="px-6 py-6 text-base font-bold text-zinc-900">{formatCurrency(row.price)}</td>
                      <td className="px-6 py-6">
                        <div className="w-40 space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-zinc-900">
                            <span>{row.sold} sold / {remaining} remaining</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                            <div className={`h-full ${barColor}`} style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-2 text-sm font-medium ${statusColor}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEditForm(row)} className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Edit ticket type">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => handleDeleteTicket(row.id)} className="rounded-2xl p-2 text-rose-700 transition hover:bg-rose-50" aria-label="Delete ticket type">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5">
            <p className="text-xs text-gray-700">Showing {filteredTickets.length} ticket types</p>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-2xl bg-gray-100 p-2 text-zinc-900/30" aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-2xl bg-gray-100 p-2 text-zinc-900" aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <article className="rounded-[32px] bg-white/80 p-8 shadow-sm outline outline-1 outline-white/40 backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900">Inventory Alerts</h3>
              <TriangleAlert className="h-5 w-5 text-rose-700" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-rose-200/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-200 text-red-700"><TriangleAlert className="h-4 w-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-zinc-900">Almost Sold Out</p>
                  <p className="text-xs text-gray-700">Neon Nights VIP has only 4 tickets remaining.</p>
                </div>
                <button type="button" className="text-xs font-bold text-sky-700">Add Stock</button>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-gray-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-900"><TriangleAlert className="h-4 w-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-zinc-900">Stagnant Sales</p>
                  <p className="text-xs text-gray-700">Early Bird tickets for Indie Fest haven&apos;t moved in 48h.</p>
                </div>
                <button type="button" className="text-xs font-bold text-sky-700">Run Promo</button>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[32px] bg-indigo-600 p-8 text-white shadow-sm">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <h3 className="text-2xl font-bold">Automated Dynamic Pricing</h3>
            <p className="mt-2 max-w-xl text-base text-white/80">Boost your revenue by enabling AI-driven price adjustments based on demand velocity.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" className="rounded-2xl bg-white px-6 py-3 text-base font-bold text-sky-700">Configure AI Rules</button>
              <button type="button" className="rounded-2xl border border-white/30 px-6 py-3 text-base font-bold text-white">Learn More</button>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}
