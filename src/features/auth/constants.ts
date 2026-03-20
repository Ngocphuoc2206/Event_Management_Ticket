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

export const AUTH_SOCIAL_BUTTON_CLASSNAME =
  "flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white";

export const AUTH_DIVIDER_TEXT_CLASSNAME =
  "text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400";
