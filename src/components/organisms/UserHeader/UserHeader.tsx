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
    <header className="w-full flex justify-center border-b border-slate-300/20 bg-white/80 backdrop-blur-md">
      <div data-layer="TopNavBar" className="Topnavbar w-full max-w-[1280px] px-6 py-4 inline-flex justify-between items-center">
        <div data-layer="Container" className="Container flex-1 flex justify-start items-center gap-8">
          <div data-layer="Container" className="Container inline-flex flex-col justify-start items-start">
            <Link href="/" data-layer="Text" className="Text justify-center bg-gradient-to-r from-[#0058BE] to-[#6B38D4] bg-clip-text text-transparent text-2xl font-bold font-['Inter'] leading-8">
              EventHub
            </Link>
          </div>
          <div data-layer="Container" className="Container w-96 max-w-96 relative inline-flex flex-col justify-start items-start relative">
            <div data-layer="Input" className="Input self-stretch pl-10 pr-3 py-2.5 bg-zinc-200 rounded-2xl flex flex-col justify-start items-start overflow-hidden">
              <input 
                type="text" 
                placeholder="Search events, artists, or venues..."
                className="w-full bg-transparent outline-none text-gray-500 text-base font-normal font-['Inter']"
              />
            </div>
            <div data-layer="Container" className="Container h-full left-3 top-0 absolute inline-flex justify-start items-center pointer-events-none">
              <div data-layer="Icon" className="Icon size-4 bg-gray-500 rounded-full" />
            </div>
          </div>
        </div>
        <div data-layer="Container" className="Container flex justify-start items-center gap-8">
          <div data-layer="Container" className="Container flex justify-start items-center gap-6">
            <Link href="/explore" data-layer="Link" className="Link inline-flex flex-col justify-start items-start">
              <span data-layer="Text" className="Text justify-center text-zinc-900 text-base font-medium font-['Inter'] leading-6">Explore</span>
            </Link>
            <Link href="/help" data-layer="Link" className="Link inline-flex flex-col justify-start items-start">
              <span data-layer="Text" className="Text justify-center text-zinc-900 text-base font-medium font-['Inter'] leading-6">Help</span>
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                data-layer="Button"
                className="text-zinc-900 text-base font-medium font-['Inter'] leading-6"
              >
                Log Out
              </button>
            ) : (
              <Link href="/auth/login" data-layer="Link" className="Link inline-flex flex-col justify-start items-start">
                <span data-layer="Text" className="Text justify-center text-zinc-900 text-base font-medium font-['Inter'] leading-6">Sign In</span>
              </Link>
            )}
          </div>
          <button data-layer="Button" className="Button px-6 py-2.5 bg-gradient-to-r from-sky-700 to-violet-700 rounded-2xl shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] inline-flex flex-col justify-center items-center">
            <span data-layer="Text" className="Text text-center justify-center text-white text-base font-semibold font-['Inter'] leading-6">Create Event</span>
          </button>
          <div data-layer="Overlay+Border+Shadow" className="OverlayBorderShadow size-10 bg-white/0 rounded-full shadow-[0px_0px_0px_2px_rgba(247,249,251,1.00)] outline outline-2 outline-offset-[-2px] outline-blue-100 inline-flex flex-col justify-center items-start overflow-hidden">
            {isLoggedIn ? (
              <div className="flex h-full w-full items-center justify-center bg-sky-100 text-sm font-semibold text-sky-800">
                {(fullName?.trim().charAt(0) || "U").toUpperCase()}
              </div>
            ) : (
              <img alt="User Avatar" src="https://placehold.co/36x36" className="self-stretch flex-1 w-full h-full object-cover" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
