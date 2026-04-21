import { AlertCircle, CheckCircle2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ApiResult } from "@/features/auth/types";
import { getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import { getOrganizerEvents } from "@/features/organizer/events/services/create-event.service";
import {
  createOrganizerTicketType,
  deleteOrganizerTicketType,
  getOrganizerTicketTypes,
  updateOrganizerTicketType,
} from "@/features/organizer/events/services/ticket-types.service";
import type {
  OrganizerEvent,
  OrganizerEventsPageData,
  OrganizerTicketType,
  OrganizerTicketTypeStatus,
  OrganizerUpdateTicketTypePayload,
} from "@/features/organizer/events/types";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

type TicketFormState = {
  name: string;
  price: string;
  quantity: string;
  saleStart: string;
  saleEnd: string;
};

const DEFAULT_FORM: TicketFormState = {
  name: "",
  price: "",
  quantity: "",
  saleStart: "",
  saleEnd: "",
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function toDateTimeLocal(value?: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const shifted = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 16);
}

function toIsoString(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normalizeEventsPayload(payload: unknown): OrganizerEvent[] {
  if (Array.isArray(payload)) {
    return payload as OrganizerEvent[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as Partial<OrganizerEventsPageData> & {
    events?: OrganizerEvent[];
    content?: OrganizerEvent[];
    data?: OrganizerEvent[];
    results?: OrganizerEvent[];
  };

  const candidate =
    objectPayload.items ??
    objectPayload.events ??
    objectPayload.content ??
    objectPayload.data ??
    objectPayload.results;

  return Array.isArray(candidate) ? candidate : [];
}

export function OrganizerTicketsContent() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [tickets, setTickets] = useState<OrganizerTicketType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrganizerTicketTypeStatus>("ALL");
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [form, setForm] = useState<TicketFormState>(DEFAULT_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingById, setIsDeletingById] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const apiResult = await getOrganizerEvents({ page: 1, size: 100 });
      const data = getApiResultData(apiResult as ApiResult<unknown>);
      const eventItems = normalizeEventsPayload(data);
      setEvents(eventItems);

      if (!selectedEventId && eventItems[0]?.id) {
        setSelectedEventId(eventItems[0].id);
      }
    } catch (error) {
      showToast({ tone: "error", message: getApiErrorMessage(error, "Cannot load organizer events.") });
    }
  }, [selectedEventId, showToast]);

  const loadTickets = useCallback(async () => {
    if (!selectedEventId) {
      setTickets([]);
      return;
    }

    setIsLoading(true);
    try {
      const apiResult = await getOrganizerTicketTypes(selectedEventId, {
        search: searchTerm.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      const data = getApiResultData(apiResult as ApiResult<OrganizerTicketType[]>);
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      setTickets([]);
      showToast({ tone: "error", message: getApiErrorMessage(error, "Cannot load ticket types.") });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedEventId, showToast, statusFilter]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const selectedEventName = useMemo(() => {
    const found = events.find((event) => event.id === selectedEventId);
    return found?.title ?? "-";
  }, [events, selectedEventId]);

  const resetForm = () => {
    setEditingTicketId(null);
    setForm(DEFAULT_FORM);
    setIsFormOpen(false);
  };

  const openCreateForm = () => {
    setEditingTicketId(null);
    setForm(DEFAULT_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (ticket: OrganizerTicketType) => {
    setEditingTicketId(ticket.id);
    setForm({
      name: ticket.name,
      price: String(ticket.price),
      quantity: String(ticket.quantity),
      saleStart: toDateTimeLocal(ticket.saleStart),
      saleEnd: toDateTimeLocal(ticket.saleEnd),
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!selectedEventId || isSaving) {
      return;
    }

    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const saleStart = toIsoString(form.saleStart);
    const saleEnd = toIsoString(form.saleEnd);
    const name = form.name.trim();

    if (!name || Number.isNaN(price) || Number.isNaN(quantity) || !saleStart || !saleEnd) {
      showToast({ tone: "error", message: "Please provide valid name, price, quantity, and sales dates." });
      return;
    }

    setIsSaving(true);
    try {
      if (editingTicketId) {
        const existing = tickets.find((ticket) => ticket.id === editingTicketId);
        if (!existing) {
          throw new Error("Ticket type no longer exists.");
        }

        const payload: OrganizerUpdateTicketTypePayload = {};
        if (name !== existing.name) {
          payload.name = name;
        }
        if (price !== existing.price) {
          payload.price = price;
        }
        if (quantity !== existing.quantity) {
          payload.quantity = quantity;
        }
        if (saleStart !== existing.saleStart) {
          payload.saleStart = saleStart;
        }
        if (saleEnd !== existing.saleEnd) {
          payload.saleEnd = saleEnd;
        }

        if (Object.keys(payload).length > 0) {
          await updateOrganizerTicketType(editingTicketId, payload);
          showToast({ tone: "success", message: "Ticket type updated." });
        } else {
          showToast({ tone: "success", message: "No changes to update." });
        }
      } else {
        await createOrganizerTicketType(selectedEventId, {
          name,
          price,
          quantity,
          saleStart,
          saleEnd,
        });
        showToast({ tone: "success", message: "Ticket type created." });
      }

      resetForm();
      await loadTickets();
    } catch (error) {
      showToast({ tone: "error", message: getApiErrorMessage(error, "Unable to save ticket type.") });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (ticketId: string) => {
    if (isDeletingById[ticketId]) {
      return;
    }

    if (!window.confirm("Delete this ticket type?")) {
      return;
    }

    setIsDeletingById((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await deleteOrganizerTicketType(ticketId);
      showToast({ tone: "success", message: "Ticket type deleted." });
      await loadTickets();
    } catch (error) {
      showToast({ tone: "error", message: getApiErrorMessage(error, "Unable to delete ticket type.") });
    } finally {
      setIsDeletingById((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const totalQuantity = useMemo(() => tickets.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0), [tickets]);
  const minPrice = useMemo(() => (tickets.length > 0 ? Math.min(...tickets.map((ticket) => ticket.price || 0)) : 0), [tickets]);

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      {toast ? (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.tone === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
            }`}
          >
            {toast.tone === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.message}
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1104px] px-5 py-8 sm:px-8 lg:px-10">
        <section className="space-y-3">
          <h1 className="text-4xl font-bold leading-10 text-zinc-900">Tickets Management</h1>
          <p className="text-base text-gray-700">Manage ticket types with organizer APIs directly on this page.</p>
        </section>

        <section className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] md:grid-cols-4">
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Event</span>
            <select
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
              className="h-11 w-full rounded-2xl bg-gray-100 px-4 text-sm font-medium text-zinc-900"
            >
              <option value="">Select event</option>
              {events.map((eventItem) => (
                <option key={eventItem.id} value={eventItem.id}>
                  {eventItem.title}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name"
                className="w-full rounded-2xl bg-gray-100 py-3 pl-10 pr-4 text-sm text-zinc-900"
              />
            </div>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "ALL" | OrganizerTicketTypeStatus)}
              className="h-11 w-full rounded-2xl bg-gray-100 px-4 text-sm font-medium text-zinc-900"
            >
              <option value="ALL">ALL</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </section>

        <section className="mt-4 grid gap-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Event</p>
            <p className="text-sm font-semibold text-zinc-900">{selectedEventName}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Types</p>
            <p className="text-lg font-bold text-zinc-900">{tickets.length}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Min Price</p>
            <p className="text-sm font-bold text-zinc-900">{formatCurrency(minPrice)}</p>
            <p className="text-xs text-gray-700">Total quantity: {totalQuantity}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">Ticket Types</h2>
              <button
                type="button"
                onClick={openCreateForm}
                disabled={!selectedEventId}
                className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </div>

            {!selectedEventId ? <p className="text-sm text-gray-700">Select an event to load ticket types.</p> : null}
            {selectedEventId && isLoading ? <p className="text-sm text-gray-700">Loading ticket types...</p> : null}
            {selectedEventId && !isLoading && tickets.length === 0 ? <p className="text-sm text-gray-700">No ticket types found.</p> : null}

            <div className="space-y-3">
              {tickets.map((ticket) => {
                const isDeleting = Boolean(isDeletingById[ticket.id]);
                return (
                  <article key={ticket.id} className="rounded-2xl bg-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-zinc-900">{ticket.name}</p>
                        <p className="text-xs text-gray-700">
                          {formatCurrency(ticket.price)} • Qty {ticket.quantity} • {ticket.status ?? "ACTIVE"}
                        </p>
                        <p className="mt-1 text-xs text-gray-700">
                          {new Date(ticket.saleStart).toLocaleString()} - {new Date(ticket.saleEnd).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(ticket)}
                          className="rounded-full p-2 text-gray-700 transition hover:bg-white"
                          aria-label="Edit ticket type"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(ticket.id)}
                          disabled={isDeleting}
                          className="rounded-full p-2 text-rose-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Delete ticket type"
                        >
                          {isDeleting ? <span className="text-[11px] font-semibold">...</span> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="space-y-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <h2 className="text-lg font-bold text-zinc-900">{editingTicketId ? "Update Ticket Type" : "Create Ticket Type"}</h2>

            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Price</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Sale Start</span>
                <input
                  type="datetime-local"
                  value={form.saleStart}
                  onChange={(event) => setForm((prev) => ({ ...prev, saleStart: event.target.value }))}
                  className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Sale End</span>
                <input
                  type="datetime-local"
                  value={form.saleEnd}
                  onChange={(event) => setForm((prev) => ({ ...prev, saleEnd: event.target.value }))}
                  className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={!selectedEventId || isSaving || isLoading}
                className="rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : editingTicketId ? "Update" : "Create"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl bg-gray-200 px-6 py-3 text-sm font-bold text-zinc-900"
              >
                Reset
              </button>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}
