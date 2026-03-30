import { Bell, ChevronDown, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

type OrganizerEditEventStepScaffoldContentProps = {
  step: number;
  title: string;
  subtitle: string;
  previousHref: string;
  nextHref: string;
  nextLabel: string;
};

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "event";
  }

  return eventId ?? "event";
}

export function OrganizerEditEventStepScaffoldContent({
  step,
  title,
  subtitle,
  previousHref,
  nextHref,
  nextLabel,
}: OrganizerEditEventStepScaffoldContentProps) {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const progress = Math.min(step * 20, 100);

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <header className="flex h-20 items-center justify-between border-b border-slate-300/10 bg-slate-50/80 px-5 backdrop-blur-[6px] sm:px-8 lg:px-10">
        <div className="flex-1 max-w-[576px]">
          <div className="relative">
            <div className="inline-flex h-11 w-full items-start justify-center overflow-hidden rounded-2xl bg-gray-100 py-3.5 pl-12 pr-4">
              <div className="flex-1 overflow-hidden text-sm font-normal text-gray-500">Search events, orders, or attendees...</div>
            </div>
            <div className="absolute left-4 top-[10px] flex h-6 items-center">
              <Search className="h-4 w-4 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-6">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute left-6 top-2 h-2 w-2 rounded-full border-2 border-slate-50 bg-rose-700" />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-slate-100">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-px bg-slate-300/30" />
          <p className="text-sm font-bold tracking-wider text-gray-700">EDIT EVENT</p>
        </div>
      </header>

      <div className="px-5 py-8 sm:px-8 lg:px-10 xl:px-10">
        <div className="w-full space-y-12">
          <section className="space-y-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-[2.4px] text-sky-700">Step 0{step} of 05</p>
                <h1 className="text-4xl font-bold leading-10 text-zinc-900">{title}</h1>
                <p className="pt-1 text-lg text-gray-700">{subtitle}</p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-2xl font-bold leading-8 text-zinc-900">{progress}%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Progress</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-700 to-violet-700" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-8 pb-12">
              <article className="space-y-6 rounded-3xl bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-slate-300/20">
                <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
                <p className="text-base leading-7 text-gray-700">
                  This step screen is ready for your next editing requirements. It follows the same spacing and ratio as the Create Event flow,
                  and keeps navigation scoped to the selected event id.
                </p>
                <div className="rounded-2xl bg-gray-100 p-5 text-sm leading-6 text-gray-700">
                  Active event id: <span className="font-semibold text-zinc-900">{eventId}</span>
                </div>
              </article>

              <div className="flex items-center justify-between pt-4">
                <Link href={previousHref} className="rounded-2xl px-8 py-3 text-base font-bold text-sky-700">
                  Back
                </Link>
                <Link
                  href={nextHref}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-violet-700 px-10 py-4 text-base font-bold text-white shadow-[0px_8px_10px_-6px_rgba(0,88,190,0.20),0px_20px_25px_-5px_rgba(0,88,190,0.20)]"
                >
                  {nextLabel}
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Link>
              </div>
            </div>

            <aside className="space-y-6">
              <article className="rounded-3xl bg-gray-100 p-8 outline outline-1 outline-slate-300/10">
                <h4 className="text-lg font-bold text-zinc-900">Editing Workflow</h4>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li>1. Basic Information</li>
                  <li>2. Date & Venue</li>
                  <li>3. Ticket Tiers</li>
                  <li>4. Team Access</li>
                  <li>5. Review & Publish</li>
                </ul>
              </article>
            </aside>
          </section>
        </div>
      </div>
    </section>
  );
}
