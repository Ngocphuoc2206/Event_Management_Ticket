/* eslint-disable @next/next/no-img-element */
import UserLayout from "@/components/templates/UserLayout/UserLayout";
import {
  getPublicEventDetail,
  type CustomerEventDetail,
} from "@/features/customer/events.service";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Home,
  Mail,
  MapPin,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const DEFAULT_QUANTITY = 1;
const DEFAULT_EVENT_CARD =
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop";

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

function isAbsoluteUrl(value?: string) {
  if (!value) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function getQrImageSource(qrCode?: string, fallbackText?: string) {
  if (qrCode?.trim()) {
    return isAbsoluteUrl(qrCode)
      ? qrCode
      : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrCode)}`;
  }

  if (fallbackText?.trim()) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(fallbackText)}`;
  }

  return "";
}

export default function CheckoutResultPage() {
  const router = useRouter();
  const [eventDetail, setEventDetail] = useState<CustomerEventDetail | null>(
    null,
  );
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);

  const status =
    router.query.status === "failed" ? "failed" : "success";
  const eventId =
    typeof router.query.eventId === "string" ? router.query.eventId : "";
  const ticketTypeId =
    typeof router.query.ticketTypeId === "string" ? router.query.ticketTypeId : "";
  const buyerEmail =
    typeof router.query.buyerEmail === "string" ? router.query.buyerEmail : "";
  const orderId =
    typeof router.query.orderId === "string" ? router.query.orderId : "";
  const paymentId =
    typeof router.query.paymentId === "string" ? router.query.paymentId : "";
  const ticketId =
    typeof router.query.ticketId === "string" ? router.query.ticketId : "";
  const ticketCode =
    typeof router.query.ticketCode === "string" ? router.query.ticketCode : "";
  const qrCode =
    typeof router.query.qrCode === "string" ? router.query.qrCode : "";
  const provider =
    typeof router.query.provider === "string"
      ? router.query.provider
      : "MOCK_GATEWAY";
  const paymentStatus =
    typeof router.query.paymentStatus === "string"
      ? router.query.paymentStatus
      : status === "success"
        ? "SUCCESS"
        : "FAILED";
  const message =
    typeof router.query.message === "string" && router.query.message.trim()
      ? router.query.message.trim()
      : status === "success"
        ? "Payment confirmed and tickets are ready."
        : "Payment was not completed.";
  const amountQuery =
    typeof router.query.amount === "string"
      ? Number(router.query.amount)
      : undefined;
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

      try {
        const response = await getPublicEventDetail(eventId);
        if (isMounted) {
          setEventDetail(response);
        }
      } catch {
        if (isMounted) {
          setEventDetail(null);
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

  const amount = Number.isFinite(amountQuery) ? amountQuery : undefined;
  const ticketLabel =
    selectedTicketType?.name || selectedTicketType?.id || "Selected ticket";
  const qrImageSource = getQrImageSource(
    qrCode,
    [orderId, ticketCode, eventDetail?.title, ticketLabel]
      .filter(Boolean)
      .join("|"),
  );
  const pageTitle =
    status === "success" ? "Purchase Complete" : "Payment Failed";
  const headline =
    status === "success"
      ? `You're going to ${eventDetail?.title || "your event"}!`
      : "Your payment could not be completed";
  const supportingText =
    status === "success"
      ? qrCode
        ? `Your tickets have been sent to ${buyerEmail || "your email"} and your QR code is ready below.`
        : `Your payment is confirmed for ${buyerEmail || "your email"}. Ticket delivery is being finalized in My Tickets.`
      : "No ticket was issued yet. Review your payment details and try checkout again.";

  return (
    <UserLayout title={pageTitle}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#f5f7fb_45%,_#f8fafc_100%)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[38px] border border-white/70 bg-white/85 px-6 py-8 shadow-[0_30px_100px_rgba(148,163,184,0.18)] backdrop-blur sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/customer/events"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to events
              </Link>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] ${
                  status === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {status === "success" ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <CircleAlert className="h-4 w-4" />
                )}
                {status === "success" ? "Payment successful" : "Payment failed"}
              </div>
            </div>

            <div className="mt-10 text-center">
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white shadow-[0_20px_40px_rgba(15,23,42,0.12)] ${
                  status === "success" ? "bg-blue-600" : "bg-rose-500"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="h-9 w-9" />
                ) : (
                  <AlertTriangle className="h-9 w-9" />
                )}
              </div>

              <div
                className={`mt-6 text-[11px] font-black uppercase tracking-[0.3em] ${
                  status === "success" ? "text-blue-600" : "text-rose-600"
                }`}
              >
                Secure notification
              </div>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                {headline}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-500">
                {supportingText}
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div className="rounded-[30px] border border-slate-100 bg-white p-5 shadow-[0_18px_44px_rgba(148,163,184,0.14)] sm:p-6">
                <div className="grid gap-5 sm:grid-cols-[108px_minmax(0,1fr)]">
                  <img
                    src={eventDetail?.bannerUrl || DEFAULT_EVENT_CARD}
                    alt={eventDetail?.title || "Event ticket"}
                    className="h-28 w-full rounded-[24px] object-cover sm:w-28"
                  />

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${
                          status === "success"
                            ? "bg-violet-50 text-violet-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {eventDetail?.category ||
                          (status === "success"
                            ? "Ticket Purchase"
                            : "Payment Review")}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {orderId ? `Order #${orderId}` : "Order pending"}
                      </div>
                    </div>

                    <h2 className="mt-4 text-2xl font-black leading-tight text-slate-900">
                      {eventDetail?.title || "Your event selection"}
                    </h2>

                    <div className="mt-4 grid gap-3 text-sm font-medium text-slate-500 sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <CalendarDays className="mt-0.5 h-4 w-4 text-blue-600" />
                        <span>
                          {isLoadingEvent
                            ? "Loading event schedule..."
                            : formatEventSchedule(
                                eventDetail?.startTime,
                                eventDetail?.endTime,
                              )}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-blue-600" />
                        <span>{getEventLocation(eventDetail)}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 rounded-[24px] bg-slate-50 p-4 sm:grid-cols-3">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          Ticket type
                        </div>
                        <div className="mt-2 text-base font-black text-slate-900">
                          {ticketLabel}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          Quantity
                        </div>
                        <div className="mt-2 text-base font-black text-slate-900">
                          {quantity} tickets
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          Total amount
                        </div>
                        <div className="mt-2 text-2xl font-black text-slate-900">
                          {formatCurrency(amount)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {status === "success" ? (
                        <>
                          <Link
                            href={`/customer/my-tickets?purchase=success${orderId ? `&orderId=${encodeURIComponent(orderId)}` : ""}${eventDetail?.title ? `&event=${encodeURIComponent(eventDetail.title)}` : ""}`}
                            className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                          >
                            <Ticket className="h-4 w-4" />
                            View my tickets
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                          >
                            <Receipt className="h-4 w-4" />
                            Download receipt
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/checkout?eventId=${eventId}&ticketTypeId=${ticketTypeId}&quantity=${quantity}`}
                            className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-600"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Retry payment
                          </Link>
                          <Link
                            href="/customer/events"
                            className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                          >
                            <Home className="h-4 w-4" />
                            Browse events
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                    Quick reference
                  </div>
                  <div className="mt-4 rounded-[24px] bg-white p-4 text-center shadow-sm">
                    {status === "success" && qrImageSource ? (
                      <img
                        src={qrImageSource}
                        alt={ticketCode || ticketId || "Your ticket QR"}
                        className="mx-auto h-32 w-32 rounded-2xl border border-slate-100 object-cover p-2"
                      />
                    ) : (
                      <img
                        src={eventDetail?.bannerUrl || DEFAULT_EVENT_CARD}
                        alt={eventDetail?.title || "Event"}
                        className="mx-auto h-24 w-24 rounded-2xl object-cover"
                      />
                    )}
                    <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                      {status === "success"
                        ? qrCode
                          ? "This is your ticket QR from the API response. You can also open it later in My Tickets."
                          : "Payment succeeded, but the QR code has not been returned yet. Check My Tickets shortly."
                        : "No QR ticket is issued until payment succeeds. Retry checkout when ready."}
                    </p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                    Payment status
                  </div>
                  <div className="mt-4 space-y-3 text-sm font-semibold text-slate-500">
                    <div className="flex items-center justify-between gap-3">
                      <span>Payment status</span>
                      <span
                        className={
                          status === "success" ? "text-emerald-600" : "text-rose-600"
                        }
                      >
                        {paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Provider</span>
                      <span className="text-slate-900">{provider}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Payment ID</span>
                      <span className="text-slate-900">
                        {paymentId || "Unavailable"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Ticket ID</span>
                      <span className="text-slate-900">
                        {ticketId || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      status === "success"
                        ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border border-rose-100 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {message}
                  </div>
                </div>

                <div
                  className={`rounded-[28px] border p-5 ${
                    status === "success"
                      ? "border-blue-100 bg-blue-50"
                      : "border-amber-100 bg-amber-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Mail
                      className={`mt-0.5 h-4 w-4 ${
                        status === "success" ? "text-blue-600" : "text-amber-600"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium leading-6 ${
                        status === "success" ? "text-blue-900" : "text-amber-900"
                      }`}
                    >
                      {status === "success"
                        ? `Confirmation has been sent to ${buyerEmail || "your email address"}.`
                        : "You can retry with the same event and ticket selection from checkout."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
