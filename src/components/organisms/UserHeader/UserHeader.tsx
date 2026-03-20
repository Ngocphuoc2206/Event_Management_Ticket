import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
          EventHub
        </Link>

        {/* Menu chính */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-600">
          <Link href="/events" className="hover:text-indigo-600 transition-colors">Khám phá</Link>
          <Link href="/profile" className="hover:text-indigo-600 transition-colors">Vé của tôi</Link>
          <Link href="/organize" className="hover:text-indigo-600 transition-colors">Tổ chức sự kiện</Link>
        </nav>

        {/* Cụm Giỏ Hàng & Người Dùng */}
        <div className="flex items-center gap-6">
          {/* Nút Giỏ Hàng */}
          <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {/* Chấm đỏ thông báo có hàng */}
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              1
            </span>
          </Link>

          {/* Avatar User (Dẫn đến trang Profile) */}
          <Link href="/profile" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:border-indigo-500 transition-colors">
              <img src="https://i.pravatar.cc/150?u=alex" alt="User" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}