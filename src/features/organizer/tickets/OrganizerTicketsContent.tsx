import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage, getApiResultData, isApiResponse } from "@/features/auth/utils";
import type { ApiResult } from "@/features/auth/types";
import { getOrganizerEvents } from "@/features/organizer/events/services/create-event.service";
import type { OrganizerEvent } from "@/features/organizer/events/types";
import {
  createOrganizerTicketType,
  deleteOrganizerTicketType,
  getOrganizerTicketTypes,
  type OrganizerTicketType,
  type OrganizerTicketTypeStatus,
  updateOrganizerTicketType,
} from "@/features/organizer/tickets/services/ticket-types.service";

type OrganizerTicketsContentProps = {
  initialEventId?: string;
  lockEventSelection?: boolean;
};

type TicketFormState = {
  name: string;
  price: string;
  quantity: string;
  saleStart: string;
  saleEnd: string;
  status: OrganizerTicketTypeStatus;
};

type Notice = {
  tone: "success" | "error";
  message: string;
};

const DEFAULT_TICKET_FORM: TicketFormState = {
  name: "",
  price: "",
  quantity: "",
  saleStart: "",
  saleEnd: "",
  status: "ACTIVE",
};

const STATUS_FILTER_OPTIONS = ["ALL", "ACTIVE", "INACTIVE"] as const;

type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number];

function normalizeTicketTypesPayload(payload: unknown): OrganizerTicketType[] {
  if (Array.isArray(payload)) {
    return payload as OrganizerTicketType[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as {
    items?: OrganizerTicketType[];
    data?: OrganizerTicketType[];
    content?: OrganizerTicketType[];
    results?: OrganizerTicketType[];
  };

  const itemsCandidate =
    objectPayload.items ??
    objectPayload.data ??
    objectPayload.content ??
    objectPayload.results;

  return Array.isArray(itemsCandidate) ? itemsCandidate : [];
}

function normalizeEventsPayload(payload: unknown): OrganizerEvent[] {
  if (Array.isArray(payload)) {
    return payload as OrganizerEvent[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as {
    items?: OrganizerEvent[];
    events?: OrganizerEvent[];
    content?: OrganizerEvent[];
    data?: OrganizerEvent[];
    results?: OrganizerEvent[];
  };

  const itemsCandidate =
    objectPayload.items ??
    objectPayload.events ??
    objectPayload.content ??
    objectPayload.data ??
    objectPayload.results;

  return Array.isArray(itemsCandidate) ? itemsCandidate : [];
}

function toInputDateTime(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function toIsoString(value: string) {
  return new Date(value).toISOString();
}

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function OrganizerTicketsContent({
  initialEventId,
  lockEventSelection = false,
}: OrganizerTicketsContentProps) {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId ?? "");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [ticketTypes, setTicketTypes] = useState<OrganizerTicketType[]>([]);
  const [editingTicket, setEditingTicket] = useState<OrganizerTicketType | null>(null);
  const [form, setForm] = useState<TicketFormState>(DEFAULT_TICKET_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const selectedEventName = useMemo(() => {
    const found = events.find((event) => event.id === selectedEventId);
    return found?.title ?? "";
  }, [events, selectedEventId]);

  const totalInventory = useMemo(
    () => ticketTypes.reduce((sum, ticketType) => sum + (ticketType.quantity || 0), 0),
    [ticketTypes],
  );

  const showNotice = useCallback((tone: Notice["tone"], message: string) => {
    setNotice({ tone, message });
    window.setTimeout(() => {
      setNotice(null);
    }, 2200);
  }, []);

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);

    try {
      const response = await getOrganizerEvents({ page: 1, size: 100 });
      const data = getApiResultData(response as ApiResult<unknown>);
      const normalizedEvents = normalizeEventsPayload(data);

      setEvents(normalizedEvents);

      if (lockEventSelection && initialEventId) {
        setSelectedEventId(initialEventId);
      } else if (!selectedEventId && normalizedEvents[0]?.id) {
        setSelectedEventId(normalizedEvents[0].id);
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Khong the tai danh sach su kien."));
    } finally {
      setIsLoadingEvents(false);
    }
  }, [initialEventId, lockEventSelection, selectedEventId]);

  const loadTicketTypes = useCallback(async () => {
    if (!selectedEventId) {
      setTicketTypes([]);
      return;
    }

    setIsLoadingTickets(true);
    setErrorMessage(null);

    try {
      const response = await getOrganizerTicketTypes(selectedEventId, {
        search: searchTerm.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });

      const data = getApiResultData(response as ApiResult<unknown>);
      setTicketTypes(normalizeTicketTypesPayload(data));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Khong the tai danh sach ticket types."));
      setTicketTypes([]);
    } finally {
      setIsLoadingTickets(false);
    }
  }, [searchTerm, selectedEventId, statusFilter]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTicketTypes();
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTicketTypes]);

  const openCreateForm = () => {
    setEditingTicket(null);
    setForm(DEFAULT_TICKET_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (ticketType: OrganizerTicketType) => {
    setEditingTicket(ticketType);
    setForm({
      name: ticketType.name,
      price: String(ticketType.price ?? ""),
      quantity: String(ticketType.quantity ?? ""),
      saleStart: toInputDateTime(ticketType.saleStart),
      saleEnd: toInputDateTime(ticketType.saleEnd),
      status: (ticketType.status?.toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE"),
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTicket(null);
    setForm(DEFAULT_TICKET_FORM);
    setIsFormOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedEventId || isSubmittingForm) {
      return;
    }

    const name = form.name.trim();
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (
      !name ||
      Number.isNaN(price) ||
      price < 0 ||
      Number.isNaN(quantity) ||
      quantity <= 0 ||
      !form.saleStart ||
      !form.saleEnd
    ) {
      showNotice("error", "Vui long nhap day du thong tin hop le.");
      return;
    }

    if (new Date(form.saleStart).getTime() >= new Date(form.saleEnd).getTime()) {
      showNotice("error", "Sale end phai sau sale start.");
      return;
    }

    setIsSubmittingForm(true);

    try {
      if (editingTicket?.id) {
        const response = await updateOrganizerTicketType(editingTicket.id, {
          name,
          price,
          quantity,
          saleStart: toIsoString(form.saleStart),
          saleEnd: toIsoString(form.saleEnd),
          status: form.status,
        });

        if (isApiResponse(response) && typeof response.code === "number" && response.code !== 0) {
          throw new Error(response.message || "Cap nhat ticket type that bai.");
        }

        showNotice("success", "Cap nhat ticket type thanh cong.");
      } else {
        const response = await createOrganizerTicketType(selectedEventId, {
          name,
          price,
          quantity,
          saleStart: toIsoString(form.saleStart),
          saleEnd: toIsoString(form.saleEnd),
        });

        if (isApiResponse(response) && typeof response.code === "number" && response.code !== 0) {
          throw new Error(response.message || "Tao ticket type that bai.");
        }

        showNotice("success", "Tao ticket type thanh cong.");
      }

      closeForm();
      await loadTicketTypes();
    } catch (error) {
      showNotice("error", getApiErrorMessage(error, "Khong the luu ticket type."));
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDelete = async (ticketTypeId: string) => {
    if (deletingId) {
      return;
    }

    setDeletingId(ticketTypeId);

    try {
      const response = await deleteOrganizerTicketType(ticketTypeId);

      if (isApiResponse(response) && typeof response.code === "number" && response.code !== 0) {
        throw new Error(response.message || "Xoa ticket type that bai.");
      }

      showNotice("success", "Da xoa ticket type.");
      await loadTicketTypes();
    } catch (error) {
      showNotice("error", getApiErrorMessage(error, "Khong the xoa ticket type."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex h-20 items-center justify-between bg-slate-50 px-5 sm:px-8 lg:px-10">
        <div className="relative w-full max-w-[620px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search ticket type by name..."
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
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1104px] flex-col gap-8 px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        {notice ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              notice.tone === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <section className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-[700px]">
            <h1 className="text-4xl font-bold leading-10 text-zinc-900">Ticket Types Management</h1>
            <p className="mt-2 text-lg leading-7 text-gray-700">
              Tao, tim kiem, cap nhat, va xoa ticket types theo tung event organizer.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            disabled={!selectedEventId || isLoadingEvents}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 py-3 text-base font-semibold text-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New Ticket Type
          </button>
        </section>

        <section className="rounded-2xl bg-gray-100 p-4 outline outline-1 outline-slate-300/10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Event</span>
              <div className="relative">
                <select
                  value={selectedEventId}
                  onChange={(event) => setSelectedEventId(event.target.value)}
                  disabled={isLoadingEvents || lockEventSelection}
                  className="w-full appearance-none rounded-2xl bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-zinc-900 outline outline-1 outline-slate-300/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  {!selectedEventId ? <option value="">Select event</option> : null}
                  {events.map((eventItem) => (
                    <option key={eventItem.id ?? eventItem.title} value={eventItem.id ?? ""}>
                      {eventItem.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Status</span>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="w-full appearance-none rounded-2xl bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-zinc-900 outline outline-1 outline-slate-300/10"
                >
                  {STATUS_FILTER_OPTIONS.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </label>

            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setSearchTerm("");
              }}
              className="justify-self-end rounded-xl px-3 py-2 text-sm font-bold text-sky-700 hover:bg-white/60"
            >
              Clear Filters
            </button>
          </div>
        </section>

        {isFormOpen ? (
          <section className="rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] outline outline-1 outline-slate-300/10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{editingTicket ? "Edit Ticket Type" : "Create Ticket Type"}</h3>
                <p className="text-xs text-gray-700">Event: {selectedEventName || "-"}</p>
              </div>
              <button type="button" onClick={closeForm} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                Cancel
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="VIP"
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Price</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="100"
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Quantity</span>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  placeholder="500"
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Sale Start</span>
                <input
                  type="datetime-local"
                  value={form.saleStart}
                  onChange={(event) => setForm((prev) => ({ ...prev, saleStart: event.target.value }))}
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Sale End</span>
                <input
                  type="datetime-local"
                  value={form.saleEnd}
                  onChange={(event) => setForm((prev) => ({ ...prev, saleEnd: event.target.value }))}
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value as OrganizerTicketTypeStatus }))
                  }
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmittingForm}
                className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingForm ? "Saving..." : editingTicket ? "Update" : "Create"}
              </button>
            </div>
          </section>
        ) : null}

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
          {errorMessage ? <div className="border-b border-gray-100 px-6 py-4 text-sm font-medium text-rose-700">{errorMessage}</div> : null}

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full">
              <thead className="border-b border-gray-100 bg-gray-100/50">
                <tr>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Name</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Price</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Quantity</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Sale Window</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-700">Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-bold uppercase tracking-wide text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoadingTickets ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-gray-700">
                      Loading ticket types...
                    </td>
                  </tr>
                ) : !selectedEventId ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-gray-700">
                      Select an event to continue.
                    </td>
                  </tr>
                ) : ticketTypes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-gray-700">
                      No ticket types found.
                    </td>
                  </tr>
                ) : (
                  ticketTypes.map((ticketType, index) => {
                    const status = (ticketType.status ?? "ACTIVE").toUpperCase();
                    const isActive = status === "ACTIVE";

                    return (
                      <tr key={ticketType.id} className={index > 0 ? "border-t border-gray-100" : ""}>
                        <td className="px-6 py-6">
                          <p className="text-base font-bold text-zinc-900">{ticketType.name}</p>
                          <p className="mt-1 text-xs text-gray-700">ID: {ticketType.id}</p>
                        </td>
                        <td className="px-6 py-6 text-base font-bold text-zinc-900">{formatCurrency(ticketType.price)}</td>
                        <td className="px-6 py-6 text-sm font-semibold text-zinc-900">{ticketType.quantity}</td>
                        <td className="px-6 py-6 text-sm text-gray-700">
                          <p>{formatDateTime(ticketType.saleStart)}</p>
                          <p>{formatDateTime(ticketType.saleEnd)}</p>
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(ticketType)}
                              className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100"
                              aria-label="Edit ticket type"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(ticketType.id)}
                              disabled={deletingId === ticketType.id}
                              className="rounded-2xl p-2 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Delete ticket type"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5">
            <p className="text-xs text-gray-700">
              Showing {ticketTypes.length} ticket types | Total inventory: {totalInventory}
            </p>
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
      </div>
    </section>
  );
}
