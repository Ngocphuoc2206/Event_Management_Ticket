import type { UserRole } from "@/features/auth/types";

export const APP_NAME = "EventHub";
export const DEFAULT_PAGE_TITLE = "Event Ticketing System";
export const DEFAULT_API_BASE_URL = "http://localhost:8080";

export const AUTH_STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  userRole: "userRole",
} as const;

export const AUTH_REDIRECT_ROUTES: Record<UserRole, string> = {
  ADMIN: "/admin",
  ORGANIZER: "/organizer",
  CUSTOMER: "/customer",
};

export const LOGIN_ENDPOINT = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || "/auth/login";
export const REGISTER_ENDPOINT = process.env.NEXT_PUBLIC_REGISTER_ENDPOINT || "/auth/register";
export const LOGOUT_ENDPOINT = process.env.NEXT_PUBLIC_LOGOUT_ENDPOINT || "/auth/logout";
export const BACKEND_HEALTH_ENDPOINT = "/api/health";

export const AUTH_FOOTER_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/help-center", label: "Help Center" },
] as const;

export const AUTH_COPYRIGHT_TEXT = "@ 2024 EventHub. All rights reserved.";

export const AUTH_SHELL_CLASSNAME =
  "w-full max-w-lg rounded-[28px] border border-white/70 bg-white/88 p-6 shadow-[0_30px_80px_rgba(76,93,156,0.18)] backdrop-blur-xl sm:p-8";

export const AUTH_TEXT_INPUT_CLASSNAME =
  "ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400";

export const AUTH_PRIMARY_BUTTON_CLASSNAME =
  "h-14 w-full rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 text-base font-semibold text-white shadow-[0_12px_30px_rgba(76,92,193,0.32)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(76,92,193,0.4)] disabled:cursor-not-allowed disabled:opacity-70";

export const AUTH_CHECKBOX_CLASSNAME =
  "h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500";

export const AUTH_PASSWORD_TOGGLE_CLASSNAME =
  "ml-3 transition hover:text-slate-700";

export const AUTH_TEXT_LINK_CLASSNAME =
  "font-semibold text-blue-700 transition hover:text-violet-600";

export const AUTH_SECONDARY_LINK_CLASSNAME =
  "font-medium text-blue-700 transition hover:text-violet-600";

export const AUTH_DIVIDER_TEXT_CLASSNAME =
  "text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400";

export const AUTH_SOCIAL_BUTTON_CLASSNAME =
  "flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white";
