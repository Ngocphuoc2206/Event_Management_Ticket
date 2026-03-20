import type { ReactNode } from "react";

import { AUTH_DIVIDER_TEXT_CLASSNAME, AUTH_SOCIAL_BUTTON_CLASSNAME } from "@/features/auth/constants";

type AuthFieldProps = {
  children: ReactNode;
  error?: string;
  label: string;
  trailing?: ReactNode;
};

export function AuthField({ children, error, label, trailing }: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
        {trailing}
      </span>
      {children}
      {error ? <span className="mt-2 block text-sm text-rose-500">{error}</span> : null}
    </label>
  );
}

type AuthInputShellProps = {
  children: ReactNode;
  hasError?: boolean;
  borderClassName?: string;
};

export function AuthInputShell({
  children,
  hasError = false,
  borderClassName = "border-slate-200 focus-within:border-blue-400",
}: AuthInputShellProps) {
  return (
    <div
      className={[
        "flex h-12 items-center rounded-2xl border bg-slate-100/90 px-4 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition",
        hasError ? "border-rose-300 focus-within:border-rose-400" : borderClassName,
        "focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

type AuthAlertProps = {
  message: string;
  tone?: "error" | "success" | "warning";
};

const AUTH_ALERT_TONE_CLASSNAMES = {
  error: "border-rose-200 bg-rose-50 text-rose-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

export function AuthAlert({ message, tone = "warning" }: AuthAlertProps) {
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${AUTH_ALERT_TONE_CLASSNAMES[tone]}`}>{message}</div>;
}

type AuthDividerProps = {
  label: string;
};

export function AuthDivider({ label }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-slate-200" />
      <span className={AUTH_DIVIDER_TEXT_CLASSNAME}>{label}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

type AuthSocialButtonProps = {
  icon: ReactNode;
  label: string;
};

export function AuthSocialButton({ icon, label }: AuthSocialButtonProps) {
  return (
    <button type="button" className={AUTH_SOCIAL_BUTTON_CLASSNAME}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
