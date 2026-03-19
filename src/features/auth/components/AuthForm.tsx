import type { ReactNode } from "react";

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
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {label}
        </span>
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

export function AuthAlert({ message, tone = "warning" }: AuthAlertProps) {
  const toneClasses = {
    error: "border-rose-200 bg-rose-50 text-rose-600",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone]}`}>{message}</div>;
}
