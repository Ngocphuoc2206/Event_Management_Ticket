import UserLayout from "@/components/templates/UserLayout/UserLayout";
import { createOrder, type OrderResponse } from "@/features/customer/orders.service";
import { initPayment, mockPaymentWebhook, type PaymentResponse } from "@/features/customer/payments.service";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const DEFAULT_QUANTITY = 1;

function getOrderErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  const responseData = (error as { response?: { data?: { code?: number; message?: string } } })?.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.code === 1017) {
    return "Ticket type not found";
  }

  if (responseData?.code === 1019) {
    return "Not enough tickets available";
  }

  return "Could not create order. Please try again.";
}

function formatCurrency(amount?: number) {
  if (typeof amount !== "number") return "Pending";

  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    style: "currency",
  }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);
  const [createdOrderEventId, setCreatedOrderEventId] = useState("");
  const [createdPayment, setCreatedPayment] = useState<PaymentResponse | null>(null);
  const [isMockingWebhook, setIsMockingWebhook] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ticketTypeId =
    typeof router.query.ticketTypeId === "string" && router.query.ticketTypeId.trim()
      ? router.query.ticketTypeId.trim()
      : "";
  const eventIdFromQuery =
    typeof router.query.eventId === "string" && router.query.eventId.trim()
      ? router.query.eventId.trim()
      : "";
  const quantityQuery = typeof router.query.quantity === "string" ? Number(router.query.quantity) : DEFAULT_QUANTITY;
  const quantity = Number.isFinite(quantityQuery) && quantityQuery > 0 ? Math.floor(quantityQuery) : DEFAULT_QUANTITY;

  const handlePayment = async () => {
    if (!ticketTypeId) {
      setErrorMessage("Ticket type is missing. Please choose a valid ticket before checkout.");
      return;
    }

    if (!eventIdFromQuery) {
      setErrorMessage("Event information is missing. Please start checkout from the event details page.");
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

      setCreatedOrder(order ?? null);
      setCreatedOrderEventId(eventIdFromQuery);
      if (!order?.id) {
        throw new Error("Order response does not include an order id.");
      }

      const payment = await initPayment({
        orderId: order.id,
        method: "MOCK",
      });

      setCreatedPayment(payment ?? null);
      setShowModal(true);
    } catch (error) {
      setErrorMessage(getOrderErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMockPaymentSuccess = async () => {
    if (!createdPayment?.paymentId || !createdPayment.orderId) {
      setErrorMessage("Payment information is missing.");
      return;
    }

    setIsMockingWebhook(true);
    setErrorMessage("");
    setWebhookMessage("");

    const amount = createdPayment.amount ?? createdOrder?.totalAmount ?? 0;
    const providerTransactionId =
      createdPayment.providerTransactionId ??
      `mock-txn-${createdPayment.paymentId}`;
    const eventId = createdOrderEventId || eventIdFromQuery;

    if (!eventId) {
      setErrorMessage("Missing event information for payment callback.");
      setIsMockingWebhook(false);
      return;
    }

    try {
      const response = await mockPaymentWebhook({
        paymentId: createdPayment.paymentId,
        orderId: createdPayment.orderId,
        providerTransactionId,
        provider: createdPayment.provider || "MOCK_GATEWAY",
        status: "SUCCESS",
        amount,
        signature: `${createdPayment.paymentId}|${createdPayment.orderId}|SUCCESS|${amount}`,
        eventId,
        rawData: JSON.stringify({ demo: true }),
      });

      setCreatedPayment((current) =>
        current ? { ...current, providerTransactionId, status: "SUCCESS" } : current,
      );
      setCreatedOrder((current) =>
        current ? { ...current, status: "PAID", paymentStatus: "SUCCESS" } : current,
      );
      setWebhookMessage(response?.message || "Webhook processed successfully");
    } catch (error) {
      setErrorMessage(getOrderErrorMessage(error));
    } finally {
      setIsMockingWebhook(false);
    }
  };

  return (
    <UserLayout title="Secure Checkout">
      <div className="bg-[#F9FAFB] min-h-screen py-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900">Secure Checkout</h1>
            <p className="text-gray-500 mt-2 font-medium">Please review your information and complete your ticket purchase.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT COLUMN: INFORMATION FORM */}
            <div className="flex-1 space-y-8">
              {/* Buyer Info */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">👤</span>
                  Buyer Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" defaultValue="Alex Johnson" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" defaultValue="alex@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">💳</span>
                  Payment Method
                </h3>
                
                <div className="space-y-4">
                  {/* Credit Card Active */}
                  <div className="border-2 border-indigo-500 rounded-2xl p-6 bg-indigo-50/30">
                    <label className="flex items-center gap-3 cursor-pointer mb-5">
                      <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" />
                      <span className="font-bold text-gray-900">Credit / Debit Card</span>
                    </label>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                          <input type="text" placeholder="123" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paypal Inactive */}
                  <div className="border border-gray-200 rounded-2xl p-4 hover:border-indigo-300 transition-colors">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" />
                        <span className="font-bold text-gray-700">PayPal</span>
                      </div>
                      <span className="text-xl">🅿️</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BILLING SUMMARY */}
            <div className="w-full lg:w-[400px]">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden sticky top-28">
                {/* Image header */}
                <div className="relative h-40 bg-gray-900 p-6 flex flex-col justify-end">
                  <img src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Event" />
                  <div className="relative z-10">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">Concert</span>
                    <h3 className="text-xl font-black text-white leading-tight">Neon Nights: Underground Techno</h3>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                    <div>
                      <p className="font-black text-gray-900">{ticketTypeId}</p>
                      <p className="text-sm text-gray-500 font-medium">Quantity: {quantity}</p>
                    </div>
                    <p className="font-black text-gray-900">Calculated by server</p>
                  </div>

                  {/* Promo code */}
                  <div className="flex bg-gray-50 rounded-xl p-1 mb-6 border border-gray-100">
                    <input type="text" placeholder="Discount code" className="bg-transparent flex-1 px-4 text-sm outline-none font-medium" />
                    <button className="bg-white text-indigo-600 text-xs font-black px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-50">APPLY</button>
                  </div>

                  <div className="space-y-3 text-sm font-bold text-gray-500 mb-6">
                    <div className="flex justify-between"><span>Ticket Type</span><span className="text-gray-900">{ticketTypeId}</span></div>
                    <div className="flex justify-between"><span>Quantity</span><span className="text-gray-900">{quantity}</span></div>
                    <div className="flex justify-between"><span>Payment Method</span><span className="text-gray-900">MOCK</span></div>
                    <div className="flex justify-between"><span>Status</span><span className="text-gray-900">Pending payment</span></div>
                  </div>

                  <div className="flex justify-between items-end mb-8 pt-6 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-black text-indigo-600">Server total</span>
                  </div>

                  {errorMessage ? (
                    <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                      {errorMessage}
                    </div>
                  ) : null}

                  {/* PAYMENT BUTTON WITH LOADING STATE */}
                  <button 
                    onClick={() => void handlePayment()}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${
                      isProcessing 
                        ? "bg-indigo-400 text-white cursor-not-allowed" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Purchase <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-gray-400 mt-4 font-bold">
                    By confirming, you agree to our Terms and Refund Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUCCESS MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative transform transition-all duration-300 scale-100">
              
              {/* Green checkmark circle */}
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Success!</h2>
              <p className="text-gray-500 text-center font-medium mb-8 leading-relaxed">
                Order <strong className="text-gray-900">{createdOrder?.id}</strong> was created with status <strong className="text-indigo-600">{createdOrder?.status ?? "PENDING_PAYMENT"}</strong>. Payment <strong className="text-gray-900">{createdPayment?.paymentId}</strong> is <strong className="text-indigo-600">{createdPayment?.status ?? "PENDING"}</strong> for <strong className="text-gray-900">{formatCurrency(createdPayment?.amount ?? createdOrder?.totalAmount)}</strong>.
              </p>

              <div className="space-y-3">
                {webhookMessage ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-600">
                    {webhookMessage}
                  </div>
                ) : null}
                {createdPayment?.paymentUrl ? (
                  <a href={createdPayment.paymentUrl}>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-base hover:bg-slate-800 transition-colors shadow-md">
                      Open Payment Link
                    </button>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleMockPaymentSuccess()}
                  disabled={isMockingWebhook || createdPayment?.status === "SUCCESS"}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-base hover:bg-emerald-700 transition-colors shadow-md disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {isMockingWebhook ? "Processing Webhook..." : createdPayment?.status === "SUCCESS" ? "Payment Success" : "Mock Payment Success"}
                </button>
                <Link href="/events">
                  <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-base hover:bg-indigo-700 transition-colors shadow-md">
                    Continue Browsing
                  </button>
                </Link>
                <Link href="/customer/my-tickets">
                  <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-base hover:bg-indigo-50 transition-colors border border-indigo-100">
                    View My Tickets
                  </button>
                </Link>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold text-base hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  );
}
