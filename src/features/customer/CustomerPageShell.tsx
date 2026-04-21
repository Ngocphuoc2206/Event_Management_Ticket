import type { ReactNode } from "react";

import { CustomerDashboardSidebar } from "./dashboard";
import { customerProfile, getCustomerNavigationItems } from "./constants";
import type { CustomerProfile } from "./types";

type CustomerPageShellProps = {
  activeHref: string;
  onLogout: () => void;
  children: ReactNode;
  profile?: CustomerProfile;
};

export function CustomerPageShell({
  activeHref,
  onLogout,
  children,
  profile = customerProfile,
}: CustomerPageShellProps) {
  return (
    <main className="min-h-screen w-full bg-[#FDFDFF] font-sans text-slate-900">
      <div className="flex min-h-screen w-full flex-col xl:flex-row">
        <CustomerDashboardSidebar
          navigationItems={getCustomerNavigationItems(activeHref)}
          profile={profile}
          onLogout={onLogout}
        />

        <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
