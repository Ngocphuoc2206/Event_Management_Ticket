import { Zap } from "lucide-react";

type OrganizerBrandLogoProps = {
  variant?: "sidebar" | "compact";
};

export function OrganizerBrandLogo({ variant = "compact" }: OrganizerBrandLogoProps) {
  if (variant === "sidebar") {
    return (
      <div className="mb-10 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-100">
          <Zap size={20} fill="white" />
        </div>
        <div>
          <h1 className="text-xl font-black leading-none tracking-tighter text-slate-900">EventHub</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-blue-500">Organizer Panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
        <Zap size={14} fill="white" />
      </div>
      <p className="text-sm font-bold tracking-wide text-slate-700">EventHub Organizer</p>
    </div>
  );
}