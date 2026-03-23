import UserLayout from "@/components/templates/UserLayout/UserLayout";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const [quantity, setQuantity] = useState(2);
  const price = 120; // Giá vé VIP

  return (
    <UserLayout title="Giỏ Hàng">
      <div className="bg-[#F9FAFB] min-h-screen py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-10">Giỏ hàng của bạn</h1>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cột trái: Danh sách item */}
            <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <img 
                  src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=300&auto=format&fit=crop" 
                  alt="Event" 
                  className="w-full md:w-40 h-32 object-cover rounded-2xl"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-black px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-widest mb-2 inline-block">VIP PASS</span>
                  <h3 className="text-xl font-black text-gray-900">Neon Nights: Underground Techno</h3>
                  <p className="text-sm text-gray-500 mt-1">Oct 18, 2024 • Warehouse 42, LA</p>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-gray-600 hover:text-indigo-600">-</button>
                  <span className="w-6 text-center font-black text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-gray-600 hover:text-indigo-600">+</button>
                </div>

                <div className="text-right ml-4">
                  <p className="text-2xl font-black text-gray-900">${price * quantity}</p>
                  <button className="text-xs text-red-500 font-bold mt-2 hover:underline">Xóa</button>
                </div>
              </div>
            </div>

            {/* Cột phải: Tổng quan đơn hàng */}
            <div className="w-full lg:w-[400px]">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 sticky top-28">
                <h3 className="text-xl font-black text-gray-900 mb-6">Tổng đơn hàng</h3>
                
                <div className="space-y-4 text-sm font-bold text-gray-600 border-b border-gray-100 pb-6 mb-6">
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
                    <span className="text-gray-900">${((price * quantity) * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-4xl font-black text-indigo-600">${(price * quantity + 18.50 + (price * quantity * 0.1)).toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
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