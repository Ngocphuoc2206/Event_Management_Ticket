export function BrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-lg shadow-blue-500/20">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          d="M8 3v2m8-2v2M5 9h14M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

export function LoginBrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-lg shadow-blue-500/20">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          d="M7.5 6.5h9a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 15V8A1.5 1.5 0 0 1 7.5 6.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M9.5 9.75h5M10.5 13h3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    </span>
  );
}

export function MailIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M4 7.5 10.94 12a2 2 0 0 0 2.12 0L20 7.5M5.2 19h13.6A1.2 1.2 0 0 0 20 17.8V6.2A1.2 1.2 0 0 0 18.8 5H5.2A1.2 1.2 0 0 0 4 6.2v11.6A1.2 1.2 0 0 0 5.2 19Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function IdentityIcon() {
  return <MailIcon />;
}

export function UserIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7a6 6 0 0 1 12 0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="m7.8 4.5 2 3.6a1.5 1.5 0 0 1-.25 1.8l-1.1 1.1a13.2 13.2 0 0 0 4.55 4.55l1.1-1.1a1.5 1.5 0 0 1 1.8-.25l3.6 2A1.5 1.5 0 0 1 20 17.5V20a1 1 0 0 1-1 1C10.72 21 3 13.28 3 4a1 1 0 0 1 1-1h2.5a1.5 1.5 0 0 1 1.3.75Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M8 10V8a4 4 0 1 1 8 0v2m-9 9h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function EyeIcon({ off = false }: { off?: boolean }) {
  if (off) {
    return (
      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          d="m3 3 18 18M10.58 10.58a2 2 0 0 0 2.84 2.84M9.88 5.09A9.8 9.8 0 0 1 12 4.86c4.44 0 8.19 2.9 9.46 6.9a9.93 9.93 0 0 1-3.06 4.64M6.1 6.11A9.96 9.96 0 0 0 2.54 11.76c1.27 4 5.02 6.9 9.46 6.9 1.55 0 3.02-.35 4.34-.97"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M2.54 12.24c1.27-4 5.02-6.9 9.46-6.9s8.19 2.9 9.46 6.9c-1.27 4-5.02 6.9-9.46 6.9s-8.19-2.9-9.46-6.9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.33-.17-1.95H12v3.69h5.39a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.98-4.28 2.98-7.26Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.22-2.5c-.9.6-2.04.96-3.4.96-2.62 0-4.84-1.77-5.63-4.14H3.05v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.37 13.89A5.98 5.98 0 0 1 6.05 12c0-.66.11-1.3.32-1.89V7.5H3.05A10 10 0 0 0 2 12c0 1.6.38 3.11 1.05 4.5l3.32-2.61Z" />
      <path fill="#EA4335" d="M12 5.97c1.47 0 2.78.5 3.81 1.48l2.86-2.86C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.05 7.5l3.32 2.61c.79-2.37 3.01-4.14 5.63-4.14Z" />
    </svg>
  );
}

export function AppleMark() {
  return (
    <svg className="h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.2 3.3c0 1-.4 2-1.1 2.7-.7.8-1.8 1.3-2.8 1.2-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.9-1.2ZM18.4 17.5c-.5 1.1-.8 1.6-1.5 2.6-.9 1.2-2.1 2.8-3.6 2.8-1.3 0-1.7-.8-3.3-.8-1.6 0-2 .8-3.3.8-1.4 0-2.5-1.4-3.4-2.6-2.6-3.5-2.9-7.7-1.3-10.1 1.1-1.7 2.9-2.8 4.6-2.8 1.4 0 2.4.8 3.4.8.9 0 2.3-.9 3.9-.9 1.2 0 2.8.3 4.1 1.7-3.6 2-3 7.1.4 8.5Z" />
    </svg>
  );
}

export function FacebookMark() {
  return <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-[10px] font-bold text-white">f</span>;
}
