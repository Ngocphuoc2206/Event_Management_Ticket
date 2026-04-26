/* eslint-disable @next/next/no-img-element */
import UserLayout from "@/components/templates/UserLayout/UserLayout";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const [quantity, setQuantity] = useState(2);
  const price = 120;
  const eventId = "demo-neon-nights";
  const ticketTypeId = "TICKET-2";

  return (
    <UserLayout title="Giỏ Hàng">
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 text-4xl font-black text-gray-900">
            Giỏ hàng của bạn
          </h1>

          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="flex-1 space-y-6">
              <div className="flex flex-col items-center gap-6 rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:flex-row">
                <img
                  src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=300&auto=format&fit=crop"
                  alt="Event"
                  className="h-32 w-full rounded-2xl object-cover md:w-40"
                />
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded-md bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    VIP PASS
                  </span>
                  <h3 className="text-xl font-black text-gray-900">
                    Neon Nights: Underground Techno
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Oct 18, 2024 • Warehouse 42, LA
                  </p>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-gray-600 shadow-sm hover:text-indigo-600"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-black text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-gray-600 shadow-sm hover:text-indigo-600"
                  >
                    +
                  </button>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-2xl font-black text-gray-900">
                    ${price * quantity}
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-xs font-bold text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[400px]">
              <div className="sticky top-28 rounded-[32px] border border-gray-100 bg-white p-8 shadow-xl">
                <h3 className="mb-6 text-xl font-black text-gray-900">
                  Tổng đơn hàng
                </h3>

                <div className="mb-6 space-y-4 border-b border-gray-100 pb-6 text-sm font-bold text-gray-600">
                  <div className="flex justify-between">
                    <span>Tạm tính ({quantity} vé)</span>
                    <span className="text-gray-900">${price * quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí dịch vụ</span>
                    <span className="text-gray-900">$18.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (VAT 10%)</span>
                    <span className="text-gray-900">
                      ${((price * quantity) * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mb-8 flex items-end justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-4xl font-black text-indigo-600">
                    ${(price * quantity + 18.5 + price * quantity * 0.1).toFixed(2)}
                  </span>
                </div>

                <Link
                  href={`/checkout?eventId=${eventId}&ticketTypeId=${ticketTypeId}&quantity=${quantity}`}
                >
                  <button className="w-full rounded-2xl bg-indigo-600 py-4 text-lg font-black text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-700">
                    Tiến hành thanh toán
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
