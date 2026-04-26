/* eslint-disable @next/next/no-img-element */
import UserLayout from "@/components/templates/UserLayout/UserLayout";
import {
  getPublicEventDetail,
  type CustomerEventDetail,
  type CustomerEventTicketType,
} from "@/features/customer/events.service";
import {
  getMyTickets,
  type CustomerTicketResponse,
} from "@/features/customer/tickets.service";
import { createOrder } from "@/features/customer/orders.service";
import {
  initPayment,
  mockPaymentWebhook,
} from "@/features/customer/payments.service";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  Check,
  ChevronLeft,
  CircleDollarSign,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Receipt,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

const DEFAULT_QUANTITY = 1;
const DEFAULT_EVENT_BANNER =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop";
const DEFAULT_EVENT_CARD =
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop";

type BuyerFormState = {
  fullName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
};

type PaymentOption = {
  id: "card" | "wallet" | "bank";
  label: string;
  helper: string;
  icon: typeof CreditCard;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "card",
    label: "Card",
    helper: "Visa, MasterCard",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "Wallet",
    helper: "Apple Pay, Momo",
    icon: Smartphone,
  },
  {
    id: "bank",
    label: "Bank Transfer",
    helper: "Instant transfer",
    icon: Banknote,
  },
];

const INITIAL_FORM_STATE: BuyerFormState = {
  fullName: "",
  email: "",
  phone: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  saveCard: false,
};

function getOrderErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  const responseData = (
    error as {
      response?: { data?: { code?: number; message?: string } };
    }
  )?.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.code === 1017) {
    return "Ticket type not found.";
  }

  if (responseData?.code === 1019) {
    return "Not enough tickets available.";
  }

  return "Could not complete checkout. Please try again.";
}

function formatCurrency(amount?: number, fallback = "Pending") {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return fallback;
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatEventSchedule(startTime?: string, endTime?: string) {
  if (!startTime) {
    return "Schedule will be announced soon";
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) {
    return startTime;
  }

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(start);
  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(start);

  if (!endTime) {
    return `${dateLabel} • ${timeLabel}`;
  }

  const end = new Date(endTime);
  if (Number.isNaN(end.getTime())) {
    return `${dateLabel} • ${timeLabel}`;
  }

  const endTimeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(end);

  return `${dateLabel} • ${timeLabel} - ${endTimeLabel}`;
}

function getEventLocation(
  event?: Pick<CustomerEventDetail, "venueName" | "address" | "city"> | null,
) {
  if (!event) {
    return "Venue details will be updated";
  }

  const location = [event.venueName, event.address, event.city]
    .filter(Boolean)
    .join(", ");

  return location || "Venue details will be updated";
}

function getTicketLabel(ticketType?: CustomerEventTicketType | null) {
  if (!ticketType) {
    return "Selected ticket";
  }

  return ticketType.name || ticketType.id || "Selected ticket";
}

function getTicketQrValue(ticket: CustomerTicketResponse) {
  return (
    ticket.qrPublicUrl ||
    ticket.qrCodeUrl ||
    ticket.qrImageUrl ||
    ticket.publicUrl ||
    ticket.imageUrl ||
    ticket.qrCode ||
    ""
  );
}

async function waitForIssuedTicket(orderId: string) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const [upcomingTickets, pastTickets] = await Promise.all([
      getMyTickets({ type: "upcoming" }),
      getMyTickets({ type: "past" }),
    ]);
    const matchedTicket = [...upcomingTickets, ...pastTickets].find(
      (ticket) => ticket.orderId === orderId,
    );

    if (matchedTicket) {
      return matchedTicket;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });
  }

  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [buyerForm, setBuyerForm] = useState(INITIAL_FORM_STATE);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentOption["id"]>("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [eventDetail, setEventDetail] = useState<CustomerEventDetail | null>(
    null,
  );
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [eventError, setEventError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const ticketTypeId =
    typeof router.query.ticketTypeId === "string" &&
    router.query.ticketTypeId.trim()
      ? router.query.ticketTypeId.trim()
      : "";
  const eventId =
    typeof router.query.eventId === "string" && router.query.eventId.trim()
      ? router.query.eventId.trim()
      : "";
  const quantityQuery =
    typeof router.query.quantity === "string"
      ? Number(router.query.quantity)
      : DEFAULT_QUANTITY;
  const quantity =
    Number.isFinite(quantityQuery) && quantityQuery > 0
      ? Math.floor(quantityQuery)
      : DEFAULT_QUANTITY;

  useEffect(() => {
    if (!eventId) {
      return;
    }

    let isMounted = true;

    const loadEventDetail = async () => {
      setIsLoadingEvent(true);
      setEventError("");

      try {
        const response = await getPublicEventDetail(eventId);
        if (isMounted) {
          setEventDetail(response);
        }
      } catch {
        if (isMounted) {
          setEventDetail(null);
          setEventError("Cannot load event details right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingEvent(false);
        }
      }
    };

    void loadEventDetail();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const selectedTicketType = useMemo(
    () =>
      eventDetail?.ticketTypes.find(
        (ticketType) => ticketType.id === ticketTypeId,
      ) || null,
    [eventDetail, ticketTypeId],
  );

  const eventTitle = eventDetail?.title || "Secure ticket purchase";
  const eventImage = eventDetail?.bannerUrl || DEFAULT_EVENT_BANNER;
  const ticketLabel = getTicketLabel(selectedTicketType);
  const subtotal = (selectedTicketType?.price || 0) * quantity;
  const serviceFee = selectedTicketType ? 12000 * quantity : 0;
  const taxAmount = Math.round(subtotal * 0.08);
  const previewTotal = subtotal + serviceFee + taxAmount;

  const handleFieldChange =
    (field: keyof BuyerFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "saveCard" ? event.target.checked : event.target.value;

      setBuyerForm((current) => ({
        ...current,
        [field]: value,
      }));
    };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoMessage("Enter a promo code to continue.");
      return;
    }

    setPromoMessage("Promo validation will be added with backend support.");
  };

  const navigateToResult = async (
    status: "success" | "failed",
    extras?: {
      amount?: number;
      orderId?: string;
      paymentId?: string;
      provider?: string;
      paymentStatus?: string;
      qrCode?: string;
      ticketId?: string;
      ticketCode?: string;
      message?: string;
    },
  ) => {
    await router.push({
      pathname: "/checkout/result",
      query: {
        status,
        eventId,
        ticketTypeId,
        quantity: String(quantity),
        buyerEmail: buyerForm.email,
        amount:
          typeof extras?.amount === "number"
            ? String(extras.amount)
            : String(previewTotal),
        ...(extras?.orderId ? { orderId: extras.orderId } : {}),
        ...(extras?.paymentId ? { paymentId: extras.paymentId } : {}),
        ...(extras?.provider ? { provider: extras.provider } : {}),
        ...(extras?.paymentStatus
          ? { paymentStatus: extras.paymentStatus }
          : {}),
        ...(extras?.qrCode ? { qrCode: extras.qrCode } : {}),
        ...(extras?.ticketId ? { ticketId: extras.ticketId } : {}),
        ...(extras?.ticketCode ? { ticketCode: extras.ticketCode } : {}),
        ...(extras?.message ? { message: extras.message } : {}),
      },
    });
  };

  const handlePayment = async () => {
    if (!ticketTypeId) {
      setErrorMessage(
        "Ticket type is missing. Please choose a valid ticket before checkout.",
      );
      return;
    }

    if (!buyerForm.fullName.trim() || !buyerForm.email.trim()) {
      setErrorMessage("Please complete your full name and email address.");
      return;
    }

    if (!eventId) {
      setErrorMessage(
        "Event information is missing. Please start checkout from the event page.",
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const order = await createOrder({
        items: [
          {
            ticketTypeId,
            quantity,
          },
        ],
      });

      if (!order?.id) {
        throw new Error("Order response does not include an order id.");
      }

      const payment = await initPayment({
        orderId: order.id,
        paymentMethod: "MOCK",
      });

      if (!payment?.paymentId || !payment.orderId) {
        throw new Error("Payment information is missing.");
      }

      const amount = payment.amount ?? order.totalAmount ?? previewTotal;
      const providerTransactionId =
        payment.providerTransactionId ?? `mock-txn-${payment.paymentId}`;
      const webhookResponse = await mockPaymentWebhook({
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        providerTransactionId,
        provider: payment.provider || "MOCK_GATEWAY",
        status: "SUCCESS",
        amount,
        signature: `${payment.paymentId}|${payment.orderId}|SUCCESS|${amount}`,
        eventId,
        rawData: JSON.stringify({
          buyer: buyerForm.email,
          paymentMethod: selectedPaymentMethod,
        }),
      });
      const issuedTicket = await waitForIssuedTicket(order.id);

      await navigateToResult("success", {
        amount,
        orderId: order.id,
        paymentId: payment.paymentId,
        provider: payment.provider || "MOCK_GATEWAY",
        paymentStatus: "SUCCESS",
        qrCode: issuedTicket ? getTicketQrValue(issuedTicket) : "",
        ticketId: issuedTicket?.id,
        ticketCode: issuedTicket?.ticketCode || issuedTicket?.code,
        message: issuedTicket
          ? webhookResponse?.message ||
            "Payment confirmed and your QR ticket is ready."
          : "Payment confirmed, but the ticket QR is still being generated.",
      });
    } catch (error) {
      const message = getOrderErrorMessage(error);
      await navigateToResult("failed", {
        amount: previewTotal,
        paymentStatus: "FAILED",
        message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <UserLayout title="Secure Checkout">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#f5f7fb_45%,_#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[36px] border border-white/70 bg-white/80 shadow-[0_30px_100px_rgba(148,163,184,0.18)] backdrop-blur">
            <div className="flex flex-col gap-5 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-600">
                  Secure Checkout
                </div>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  Complete your ticket purchase
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Review attendee details, choose a payment method, and confirm
                  your order.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={eventId ? "/customer/events" : "/events"}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white">
                  <Lock className="h-3.5 w-3.5" />
                  SSL Protected
                </div>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
              <div className="space-y-6">
                <section className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_44px_rgba(148,163,184,0.12)] sm:p-7">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
                        Step 1
                      </div>
                      <h2 className="text-xl font-black text-slate-900">
                        Buyer information
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={buyerForm.fullName}
                        onChange={handleFieldChange("fullName")}
                        placeholder="Nguyen Van A"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={buyerForm.email}
                        onChange={handleFieldChange("email")}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={buyerForm.phone}
                        onChange={handleFieldChange("phone")}
                        placeholder="+84 912 345 678"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_44px_rgba(148,163,184,0.12)] sm:p-7">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <CircleDollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
                        Step 2
                      </div>
                      <h2 className="text-xl font-black text-slate-900">
                        Payment method
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {PAYMENT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isSelected = option.id === selectedPaymentMethod;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(option.id)}
                          className={`rounded-[24px] border px-4 py-4 text-left transition ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 shadow-[0_16px_32px_rgba(59,130,246,0.12)]"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon
                              className={`h-5 w-5 ${
                                isSelected ? "text-blue-600" : "text-slate-500"
                              }`}
                            />
                            {isSelected ? (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            ) : null}
                          </div>
                          <div className="mt-5 text-sm font-black text-slate-900">
                            {option.label}
                          </div>
                          <div className="mt-1 text-xs font-medium text-slate-500">
                            {option.helper}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                          Card number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={buyerForm.cardNumber}
                            onChange={handleFieldChange("cardNumber")}
                            placeholder="0000 0000 0000 0000"
                            disabled={selectedPaymentMethod !== "card"}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm font-medium text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          />
                          <CreditCard className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                          Expiry date
                        </label>
                        <input
                          type="text"
                          value={buyerForm.expiryDate}
                          onChange={handleFieldChange("expiryDate")}
                          placeholder="MM/YY"
                          disabled={selectedPaymentMethod !== "card"}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={buyerForm.cvv}
                          onChange={handleFieldChange("cvv")}
                          placeholder="123"
                          disabled={selectedPaymentMethod !== "card"}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    <label className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-500">
                      <input
                        type="checkbox"
                        checked={buyerForm.saveCard}
                        onChange={handleFieldChange("saveCard")}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Securely save card information for future bookings.
                    </label>
                  </div>
                </section>

                <div className="grid gap-3 rounded-[28px] border border-slate-100 bg-white px-5 py-5 text-sm font-semibold text-slate-500 shadow-[0_18px_44px_rgba(148,163,184,0.1)] sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Secure SSL
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <Lock className="h-4 w-4 text-blue-600" />
                    PCI aligned
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <Receipt className="h-4 w-4 text-blue-600" />
                    Instant e-ticket
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <section className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-[0_22px_60px_rgba(148,163,184,0.18)]">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={eventImage}
                      alt={eventTitle}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white backdrop-blur">
                        {eventDetail?.category || "Event"}
                      </div>
                      <h2 className="mt-3 text-xl font-black leading-tight text-white">
                        {eventTitle}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="flex gap-4 rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                      <img
                        src={eventDetail?.bannerUrl || DEFAULT_EVENT_CARD}
                        alt={eventTitle}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.26em] text-blue-600">
                          Order summary
                        </div>
                        <div className="mt-2 text-base font-black text-slate-900">
                          {ticketLabel}
                        </div>
                        <div className="mt-2 flex items-start gap-2 text-sm font-medium text-slate-500">
                          <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                          <span>
                            {formatEventSchedule(
                              eventDetail?.startTime,
                              eventDetail?.endTime,
                            )}
                          </span>
                        </div>
                        <div className="mt-2 flex items-start gap-2 text-sm font-medium text-slate-500">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                          <span>{getEventLocation(eventDetail)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 border-b border-slate-100 pb-5 text-sm font-semibold text-slate-500">
                      <div className="flex items-center justify-between gap-4">
                        <span>
                          {ticketLabel} x {quantity}
                        </span>
                        <span className="text-slate-900">
                          {formatCurrency(subtotal, "TBD")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Service fee</span>
                        <span className="text-slate-900">
                          {formatCurrency(serviceFee, "TBD")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Tax</span>
                        <span className="text-slate-900">
                          {formatCurrency(taxAmount, "TBD")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(event) => setPromoCode(event.target.value)}
                        placeholder="Promo code"
                        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-blue-600"
                      >
                        Apply
                      </button>
                    </div>

                    {promoMessage ? (
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                        {promoMessage}
                      </div>
                    ) : null}

                    {eventError ? (
                      <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                        {eventError}
                      </div>
                    ) : null}

                    {isLoadingEvent ? (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-500">
                        Loading event summary...
                      </div>
                    ) : null}

                    <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-200">
                            Total amount
                          </div>
                          <div className="mt-2 text-3xl font-black tracking-tight">
                            {formatCurrency(previewTotal)}
                          </div>
                        </div>
                        <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">
                          Estimated before payment
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handlePayment()}
                        disabled={isProcessing || !ticketTypeId || !eventId}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[22px] bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? "Processing..." : "Confirm purchase"}
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <p className="mt-4 text-xs leading-5 text-slate-300">
                        By confirming, you agree to the terms of service and
                        privacy policy. Tickets are sent to your email after
                        payment succeeds.
                      </p>
                    </div>

                    {errorMessage ? (
                      <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                        {errorMessage}
                      </div>
                    ) : null}

                    <div className="rounded-[24px] border border-blue-100 bg-blue-50 px-4 py-4">
                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium leading-6 text-blue-900">
                          Confirmation email and QR ticket will be issued
                          immediately after successful payment.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
