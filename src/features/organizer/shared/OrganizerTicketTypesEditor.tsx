import {
  AlertCircle,
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { LinkProps } from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "@/features/auth/utils";
import {
  createOrganizerTicketType,
  deleteOrganizerTicketType,
  getOrganizerTicketTypes,
  updateOrganizerTicketType,
} from "@/features/organizer/events/services/ticket-types.service";
import type {
  OrganizerUpdateTicketTypePayload,
  OrganizerTicketType,
  OrganizerTicketTypeStatus,
} from "@/features/organizer/events/types";

import {
  getOrganizerEventById,
  updateOrganizerEvent,
} from "@/features/organizer/events/services/create-event.service";

type ToastState = {
  tone: "success" | "error";
  message: string;
};

type TicketTypeFormState = {
  name: string;
  price: string;
  quantity: string;
  saleStart: string;
  saleEnd: string;
};

type OrganizerTicketTypesEditorProps = {
  title: string;
  description: string;
  eventId: string | null;
  previousHref: LinkProps["href"];
  nextHref: LinkProps["href"];
  nextLabel: string;
};

const DEFAULT_FORM: TicketTypeFormState = {
  name: "",
  price: "",
  quantity: "",
  saleStart: "",
  saleEnd: "",
};

function toDateTimeLocal(value?: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const shifted = new Date(
    parsed.getTime() - parsed.getTimezoneOffset() * 60000,
  );
  return shifted.toISOString().slice(0, 16);
}

function toIsoString(value: string): string | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const offset = parsed.getTimezoneOffset() * 60000;
  const localISOTime = new Date(parsed.getTime() - offset).toISOString().slice(0, 19);
  return localISOTime;
}

function formatPrice(price: number) {
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calculateTicketCounters(ticketTypes: OrganizerTicketType[]) {
  const totalTickets = ticketTypes.reduce(
    (sum, ticketType) => sum + Math.max(Number(ticketType.quantity) || 0, 0),
    0,
  );
  const availableTickets = ticketTypes.reduce((sum, ticketType) => {
    const quantity = Math.max(Number(ticketType.quantity) || 0, 0);
    const sold = Math.max(Number(ticketType.soldQuantity) || 0, 0);
    return sum + Math.max(quantity - sold, 0);
  }, 0);

  return { totalTickets, availableTickets };
}

export function OrganizerTicketTypesEditor({
  title,
  description,
  eventId,
  previousHref,
  nextHref,
  nextLabel,
}: OrganizerTicketTypesEditorProps) {
  const [tickets, setTickets] = useState<OrganizerTicketType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | OrganizerTicketTypeStatus
  >("ALL");
  const [form, setForm] = useState<TicketTypeFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingById, setIsDeletingById] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const refreshTickets = useCallback(async () => {
    if (!eventId) {
      setTickets([]);
      return;
    }

    setIsLoading(true);
    try {
      const items = await getOrganizerTicketTypes(eventId, {
        search: debouncedSearch || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setTickets(items);
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Cannot load ticket types."),
      });
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, debouncedSearch, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshTickets();
  }, [refreshTickets]);

  const syncEventTicketCounters = useCallback(async () => {
    if (!eventId) {
      return;
    }

    const latestTicketTypes = await getOrganizerTicketTypes(eventId);

    const totalTickets = latestTicketTypes.reduce(
      (sum, ticket) => sum + Math.max(Number(ticket.quantity) || 0, 0),
      0,
    );

    const availableTickets = latestTicketTypes.reduce((sum, ticket) => {
      const quantity = Math.max(Number(ticket.quantity) || 0, 0);
      const soldQuantity = Math.max(Number(ticket.soldQuantity) || 0, 0);

      return sum + Math.max(quantity - soldQuantity, 0);
    }, 0);

    const minPrice =
      latestTicketTypes.length > 0
        ? Math.min(
            ...latestTicketTypes.map((ticket) => Number(ticket.price) || 0),
          )
        : 0;

    const eventResponse = await getOrganizerEventById(eventId);
    console.log(eventResponse);

    await updateOrganizerEvent(eventId, {
      ...eventResponse,
      minPrice,
      totalTickets,
      availableTickets,
    });
  }, [eventId]);

  const metrics = useMemo(() => {
    const totalQuantity = tickets.reduce(
      (sum, ticket) => sum + (ticket.quantity || 0),
      0,
    );
    const minPrice =
      tickets.length > 0
        ? Math.min(...tickets.map((ticket) => ticket.price || 0))
        : 0;

    return {
      totalQuantity,
      minPrice,
    };
  }, [tickets]);

  const resetForm = () => {
    setEditingId(null);
    setForm(DEFAULT_FORM);
  };

  const openCreate = () => {
    resetForm();
  };

  const openEdit = (ticket: OrganizerTicketType) => {
    setEditingId(ticket.id);
    setForm({
      name: ticket.name,
      price: String(ticket.price),
      quantity: String(ticket.quantity),
      saleStart: toDateTimeLocal(ticket.saleStart),
      saleEnd: toDateTimeLocal(ticket.saleEnd),
    });
  };

  const handleSave = async () => {
    if (!eventId || isSaving) {
      return;
    }

    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const saleStart = toIsoString(form.saleStart);
    const saleEnd = toIsoString(form.saleEnd);

    if (
      !form.name.trim() ||
      Number.isNaN(price) ||
      Number.isNaN(quantity) ||
      !saleStart ||
      !saleEnd
    ) {
      showToast({
        tone: "error",
        message: "Please provide valid name, price, quantity, and sales dates.",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        const existingTicket = tickets.find(
          (ticket) => ticket.id === editingId,
        );
        if (!existingTicket) {
          throw new Error("Ticket type no longer exists.");
        }

        const updatePayload: OrganizerUpdateTicketTypePayload = {};
        const nextName = form.name.trim();
        if (nextName !== existingTicket.name) {
          updatePayload.name = nextName;
        }
        if (price !== existingTicket.price) {
          updatePayload.price = price;
        }
        if (quantity !== existingTicket.quantity) {
          updatePayload.quantity = quantity;
        }
        if (saleStart !== existingTicket.saleStart) {
          updatePayload.saleStart = saleStart;
        }
        if (saleEnd !== existingTicket.saleEnd) {
          updatePayload.saleEnd = saleEnd;
        }

        if (Object.keys(updatePayload).length === 0) {
          showToast({ tone: "success", message: "No changes to update." });
          setIsSaving(false);
          return;
        }

        await updateOrganizerTicketType(editingId, updatePayload);
      } else {
        await createOrganizerTicketType(eventId, {
          name: form.name.trim(),
          price,
          quantity,
          saleStart,
          saleEnd,
        });
      }

      await syncEventTicketCounters();

      resetForm();
      await refreshTickets();

      showToast({
        tone: "success",
        message: editingId
          ? "Ticket type updated and event totals synced."
          : "Ticket type created and event totals synced.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Unable to save ticket type."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (ticketTypeId: string) => {
    if (isDeletingById[ticketTypeId]) {
      return;
    }

    if (!window.confirm("Delete this ticket type?")) {
      return;
    }

    setIsDeletingById((prev) => ({ ...prev, [ticketTypeId]: true }));
    try {
      await deleteOrganizerTicketType(ticketTypeId);
      await syncEventTicketCounters();
      await refreshTickets();
      showToast({
        tone: "success",
        message: "Ticket type deleted and event totals synced.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        message: getApiErrorMessage(error, "Unable to delete ticket type."),
      });
    } finally {
      setIsDeletingById((prev) => ({ ...prev, [ticketTypeId]: false }));
    }
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      {toast ? (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.tone === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            {toast.tone === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.message}
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1104px] px-5 py-8 sm:px-8 lg:px-10">
        <section className="space-y-3">
          <h1 className="text-4xl font-bold leading-10 text-zinc-900">
            {title}
          </h1>
          <p className="text-base text-gray-700">{description}</p>
          <p className="text-sm text-gray-700">
            Event ID: {eventId ?? "(none - save draft first)"}
          </p>
        </section>

        {!eventId ? (
          <section className="mt-8 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
            <p className="text-sm text-gray-700">
              Please save draft at step 1 to generate eventId before creating
              ticket types.
            </p>
          </section>
        ) : (
          <>
            <section className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Search
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by ticket name"
                    className="w-full rounded-2xl bg-gray-100 py-3 pl-10 pr-4 text-sm text-zinc-900"
                  />
                </div>
              </label>

              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Status Filter
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "ALL" | OrganizerTicketTypeStatus,
                    )
                  }
                  className="h-11 w-full rounded-2xl bg-gray-100 px-4 text-sm font-medium text-zinc-900"
                >
                  <option value="ALL">ALL</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </label>

              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-gray-100 p-3 text-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                    Types
                  </p>
                  <p className="text-lg font-bold text-zinc-900">
                    {tickets.length}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                    Min
                  </p>
                  <p className="text-sm font-bold text-zinc-900">
                    {formatPrice(metrics.minPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                    Qty
                  </p>
                  <p className="text-sm font-bold text-zinc-900">
                    {metrics.totalQuantity}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="space-y-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900">
                    Ticket Types
                  </h2>
                  <button
                    type="button"
                    onClick={openCreate}
                    disabled={isSaving || isLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                </div>

                {isLoading ? (
                  <p className="text-sm text-gray-700">
                    Loading ticket types...
                  </p>
                ) : null}
                {!isLoading && tickets.length === 0 ? (
                  <p className="text-sm text-gray-700">
                    No ticket types found.
                  </p>
                ) : null}

                <div className="space-y-3">
                  {tickets.map((ticket) => {
                    const isDeleting = Boolean(isDeletingById[ticket.id]);

                    return (
                      <article
                        key={ticket.id}
                        className="rounded-2xl bg-gray-100 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-bold text-zinc-900">
                              {ticket.name}
                            </p>
                            <p className="text-xs text-gray-700">
                              {formatPrice(ticket.price)} • Qty{" "}
                              {ticket.quantity} • {ticket.status ?? "ACTIVE"}
                            </p>
                            <p className="mt-1 text-xs text-gray-700">
                              {new Date(ticket.saleStart).toLocaleString()} -{" "}
                              {new Date(ticket.saleEnd).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(ticket)}
                              disabled={isSaving || isDeleting}
                              className="rounded-full p-2 text-gray-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Edit ticket type"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(ticket.id)}
                              disabled={isSaving || isDeleting}
                              className="rounded-full p-2 text-rose-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Delete ticket type"
                            >
                              {isDeleting ? (
                                <span className="text-[11px] font-semibold">
                                  ...
                                </span>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </article>

              <article className="space-y-4 rounded-3xl bg-white p-6 shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)]">
                <h2 className="text-lg font-bold text-zinc-900">
                  {editingId ? "Update Ticket Type" : "Create Ticket Type"}
                </h2>

                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Name
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Price
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Quantity
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          quantity: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Sale Start
                    </span>
                    <input
                      type="datetime-local"
                      value={form.saleStart}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          saleStart: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Sale End
                    </span>
                    <input
                      type="datetime-local"
                      value={form.saleEnd}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          saleEnd: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    // Đảm bảo chỉ khóa khi đang thực hiện lưu (isSaving)
                  disabled={isSaving}
                    className="rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
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
          </>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-8">
          <Link
            href={previousHref}
            className="rounded-2xl px-8 py-3 text-base font-bold text-gray-700"
          >
            Previous Step
          </Link>

          <Link
            href={nextHref}
            className="rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-3 text-base font-bold text-white"
          >
            {nextLabel}
          </Link>
        </footer>
      </div>
    </section>
  );
}
