import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { clearPersistedAuth } from "@/features/auth/utils";
import { clearUser } from "@/stores/slices/user/user.slice";
import type { RootState } from "@/stores";

export default function UserHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, fullName } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    clearPersistedAuth();
    dispatch(clearUser());
    void router.push("/auth/login");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
          EventHub
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-600">
          <Link href="/events" className="hover:text-indigo-600 transition-colors">Khám phá</Link>
          <Link href="/profile" className="hover:text-indigo-600 transition-colors">Vé của tôi</Link>
          <Link href="/organizer" className="hover:text-indigo-600 transition-colors">Tổ chức sự kiện</Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Cart">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              1
            </span>
          </Link>

          {isLoggedIn ? (
            <button type="button" onClick={handleLogout} className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
              Log Out
            </button>
          ) : (
            <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
          )}

          <Link href="/profile" className="flex items-center gap-3" aria-label="Profile">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:border-indigo-500 transition-colors">
              {isLoggedIn ? (
                <div className="flex h-full w-full items-center justify-center bg-sky-100 text-sm font-semibold text-sky-800">
                  {(fullName?.trim().charAt(0) || "U").toUpperCase()}
                </div>
              ) : (
                <img src="https://i.pravatar.cc/150?u=alex" alt="User" className="w-full h-full object-cover" />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}