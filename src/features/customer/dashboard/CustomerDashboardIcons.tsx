import type { JSX } from "react";

import type { CustomerDashboardIconName } from "../types";

const ICONS: Record<CustomerDashboardIconName, JSX.Element> = {
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 18h8" strokeLinecap="round" />
      <path d="M6.5 17c1.2-1.25 1.75-3.2 1.75-5.2V10a3.75 3.75 0 1 1 7.5 0v1.8c0 2 .55 3.95 1.75 5.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="6.5" width="14" height="12.5" rx="2.5" />
      <path d="M8 4.75v3.5M16 4.75v3.5M5 10.25h14" strokeLinecap="round" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5.5v8" strokeLinecap="round" />
      <path d="m8.75 10.5 3.25 3.25 3.25-3.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 17.5h12" strokeLinecap="round" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" opacity="0.7" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" opacity="0.7" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M9.75 9.5a2.5 2.5 0 1 1 4.28 1.77c-.82.82-1.53 1.37-1.53 2.48" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="16.7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12a8 8 0 1 0 2.35-5.65L4 8.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4.5v4.2h4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v4l2.75 1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 6H6.75A1.75 1.75 0 0 0 5 7.75v8.5C5 17.22 5.78 18 6.75 18H10" strokeLinecap="round" />
      <path d="M13 8.5 17 12l-4 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12h8" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s5-4.3 5-8.75A5 5 0 1 0 7 11.25C7 15.7 12 20 12 20Z" />
      <circle cx="12" cy="11.25" r="1.75" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="8.25" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="11" cy="11" r="5.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
      <path d="m19.4 15.1-.95 1.65-1.9-.1a6.97 6.97 0 0 1-1.1 1.1l.1 1.9-1.65.95-1.3-1.35a7.6 7.6 0 0 1-1.2 0L10.1 20.6l-1.65-.95.1-1.9a6.97 6.97 0 0 1-1.1-1.1l-1.9.1-.95-1.65 1.35-1.3a7.6 7.6 0 0 1 0-1.2L4.6 11.35l.95-1.65 1.9.1c.33-.4.7-.77 1.1-1.1l-.1-1.9 1.65-.95 1.3 1.35a7.6 7.6 0 0 1 1.2 0l1.3-1.35 1.65.95-.1 1.9c.4.33.77.7 1.1 1.1l1.9-.1.95 1.65-1.35 1.3c.04.4.04.8 0 1.2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="5.5" />
      <path d="m12 4.5.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9L12 4.5ZM19.5 12l-1.45.62L17.43 14 16.8 12.62 15.35 12l1.45-.62L17.43 10l.62 1.38L19.5 12ZM12 19.5l-.62-1.45L10 17.43l1.38-.62L12 15.35l.62 1.45 1.38.62-1.38.62L12 19.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 7.25h10a2 2 0 0 0 2-2V5H5v.25a2 2 0 0 0 2 2Z" />
      <path d="M5 8.25h14v2.1a2.1 2.1 0 0 1 0 4.2v2.2H5v-2.2a2.1 2.1 0 0 1 0-4.2Z" />
      <path d="M12 8.75v7.5" strokeDasharray="1.8 1.8" strokeLinecap="round" />
    </svg>
  ),
};

export function BrandIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-[0_10px_24px_rgba(60,92,214,0.28)]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
        <path d="M7 7.75h10M7 12h10M7 16.25h6" strokeLinecap="round" />
        <rect x="5" y="4.75" width="14" height="14.5" rx="3.5" />
      </svg>
    </div>
  );
}

type CustomerDashboardIconProps = {
  type: CustomerDashboardIconName;
  className?: string;
};

export function CustomerDashboardIcon({ type, className = "h-5 w-5" }: CustomerDashboardIconProps) {
  return <span className={className}>{ICONS[type]}</span>;
}


