import Link from "next/link";
import type { ReactNode } from "react";

import { AUTH_COPYRIGHT_TEXT, AUTH_FOOTER_LINKS } from "@/features/auth/constants";

type AuthPageLayoutProps = {
  children: ReactNode;
  headerAction?: ReactNode;
  logo: ReactNode;
  logoHref?: string;
  logoText: string;
  topSpacingClassName?: string;
};

export function AuthPageLayout({
  children,
  headerAction,
  logo,
  logoHref = "/",
  logoText,
  topSpacingClassName = "pb-16 pt-10",
}: AuthPageLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9ff] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(86,120,255,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.12),_transparent_30%)]" />

      <div className="relative flex min-h-screen flex-col">
        {headerAction ? (
          <header className="w-full border-b border-white/60 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-5 sm:px-8">
              <Link href={logoHref} className="flex items-center gap-3">
                {logo}
                <span className="text-xl font-bold tracking-tight text-slate-900">{logoText}</span>
              </Link>
              {headerAction}
            </div>
          </header>
        ) : null}

        <section
          className={`mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center px-4 sm:px-6 ${topSpacingClassName}`}
        >
          {!headerAction ? (
            <Link href={logoHref} className="mb-10 flex items-center gap-3">
              {logo}
              <span className="text-[2rem] font-bold tracking-tight text-slate-900 sm:text-3xl">{logoText}</span>
            </Link>
          ) : null}

          {children}
        </section>

        <footer className="w-full border-t border-slate-200/80">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>{AUTH_COPYRIGHT_TEXT}</p>
            <div className="flex flex-wrap items-center gap-5">
              {AUTH_FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-slate-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
