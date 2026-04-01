import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CustomerDashboardIcon, CustomerDashboardSidebar, customerProfile } from "@/features/customer";
import type { CustomerNavItem } from "@/features/customer";

type NotificationFilter = "all" | "unread";
type NotificationTone = "info" | "ticket" | "success" | "vip" | "important" | "lineup";
type NotificationLayout = "list" | "feature";

type NotificationItem = {
  id: string;
  group: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  tone: NotificationTone;
  layout: NotificationLayout;
  actionLabel?: string;
  badgeLabel?: string;
  collaborators?: string[];
};

const customerNotificationNavigationItems: CustomerNavItem[] = [
  { label: "Dashboard", href: "/customer", icon: "grid" },
  { label: "My Tickets", href: "/customer/my-tickets", icon: "ticket" },
  { label: "Order History", href: "/customer/order-history", icon: "history" },
  { label: "Notifications", href: "/customer/notifications", icon: "bell", active: true },
  { label: "Profile Settings", href: "/customer/profile-settings", icon: "settings" },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "neon-pulse-reminder",
    group: "Event Reminders",
    title: "Neon Pulse Music Festival starts in 2 hours!",
    description: "Get your gear ready. Gates open at 6:00 PM. Don't forget to have your digital ticket ready at the entrance.",
    time: "2 mins ago",
    unread: true,
    tone: "info",
    layout: "list",
    actionLabel: "View Entry Info",
  },
  {
    id: "global-tech-reminder",
    group: "Event Reminders",
    title: "Don't forget your tickets for Global Tech Summit tomorrow.",
    description: "The summit starts at 9:00 AM at the Metropolitan Center. We recommend arriving 30 minutes early for badge collection.",
    time: "3 hours ago",
    unread: true,
    tone: "ticket",
    layout: "list",
  },
  {
    id: "order-confirmed",
    group: "Ticket Confirmations",
    title: "Order #ORD-9021-u1 Confirmed",
    description: "Success! Your order for 'Midnight Jazz Collective' has been processed. You can find your tickets in the 'My Tickets' section.",
    time: "Yesterday, 4:15 PM",
    unread: true,
    tone: "success",
    layout: "list",
  },
  {
    id: "vip-upgrade",
    group: "Ticket Confirmations",
    title: "Your VIP Upgrade for Designers Meetup is ready.",
    description: "Your request for a VIP upgrade has been approved. Your new digital badge includes access to the Lounge and Speaker Meet-and-Greet.",
    time: "Oct 12, 11:20 AM",
    unread: false,
    tone: "vip",
    layout: "list",
  },
  {
    id: "venue-change",
    group: "Event Updates",
    title: "Venue Change: Midnight Jazz Collective",
    description: "The event has moved from 'The Blue Note' to 'The Grand Atrium' due to capacity demands. All existing tickets remain valid.",
    time: "Oct 11, 2:45 PM",
    unread: true,
    tone: "important",
    layout: "feature",
    badgeLabel: "Important",
    actionLabel: "View New Map",
  },
  {
    id: "artist-lineup",
    group: "Event Updates",
    title: "Artist Lineup Update for Neon Pulse.",
    description: "We've added two new surprise guests to the Saturday night stage. Check the updated schedule now.",
    time: "Oct 10, 9:00 AM",
    unread: false,
    tone: "lineup",
    layout: "feature",
    badgeLabel: "Lineup",
    collaborators: ["/images/avt.jpg", "/images/upc1.png", "/images/upc2.png"],
  },
];

const TONE_STYLES: Record<NotificationTone, { iconBg: string; iconColor: string; accent: string; badge?: string; featureBg?: string }> = {
  info: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "bg-blue-600",
  },
  ticket: {
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    accent: "bg-sky-500",
  },
  success: {
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    accent: "bg-violet-500",
  },
  vip: {
    iconBg: "bg-fuchsia-100",
    iconColor: "text-fuchsia-600",
    accent: "bg-fuchsia-500",
  },
  important: {
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    accent: "bg-rose-500",
    badge: "bg-rose-100 text-rose-600",
    featureBg: "bg-[linear-gradient(180deg,#fff7fb_0%,#fff1f4_100%)]",
  },
  lineup: {
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    accent: "bg-slate-400",
    badge: "bg-slate-100 text-slate-500",
    featureBg: "bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]",
  },
};

function NotificationGlyph({ tone }: { tone: NotificationTone }) {
  if (tone === "ticket") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.9">
        <path d="M7 7.25h10a2 2 0 0 0 2-2V5H5v.25a2 2 0 0 0 2 2Z" />
        <path d="M5 8.25h14v2.1a2.1 2.1 0 0 1 0 4.2v2.2H5v-2.2a2.1 2.1 0 0 1 0-4.2Z" />
        <path d="M12 8.75v7.5" strokeDasharray="1.8 1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (tone === "success") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.9">
        <circle cx="12" cy="12" r="6.5" />
        <path d="m9.25 12 1.75 1.75 3.75-3.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (tone === "vip") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="m12 4.4 1.8 3.64 4.02.58-2.91 2.83.69 4-3.6-1.9-3.6 1.9.69-4L6.18 8.62l4.02-.58L12 4.4Z" />
      </svg>
    );
  }

  if (tone === "important") {
    return <CustomerDashboardIcon type="pin" className="h-4 w-4" />;
  }

  if (tone === "lineup") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
        <circle cx="8.5" cy="9" r="2.5" />
        <circle cx="15.5" cy="9" r="2.5" />
        <path d="M4.75 17a3.75 3.75 0 0 1 7.5 0M11.75 17a3.75 3.75 0 0 1 7.5 0" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 9v4" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function NotificationListCard({
  item,
  onMarkAsRead,
  onDelete,
}: {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const toneStyle = TONE_STYLES[item.tone];

  return (
    <article className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_42px_rgba(148,163,184,0.14)] sm:p-6">
      <div className={`absolute inset-y-4 left-0 w-1 rounded-full ${toneStyle.accent}`} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneStyle.iconBg} ${toneStyle.iconColor}`}>
            <NotificationGlyph tone={item.tone} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-bold tracking-tight text-slate-900">{item.title}</h3>
              {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-blue-500" aria-label="Unread notification" /> : null}
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{item.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {item.actionLabel ? (
                <button type="button" className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
                  {item.actionLabel} {"->"}
                </button>
              ) : null}
              {item.unread ? (
                <button
                  type="button"
                  onClick={() => onMarkAsRead(item.id)}
                  className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                >
                  Mark as read
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="text-sm font-semibold text-rose-500 transition hover:text-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
          <div className="text-xs font-medium text-slate-400">{item.time}</div>
          {item.unread ? <div className="mt-3 hidden h-2.5 w-2.5 rounded-full bg-blue-500 sm:inline-flex" /> : null}
        </div>
      </div>
    </article>
  );
}

function NotificationFeatureCard({
  item,
  onMarkAsRead,
  onDelete,
}: {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const toneStyle = TONE_STYLES[item.tone];

  return (
    <article className={`overflow-hidden rounded-[26px] border border-white/80 p-5 shadow-[0_18px_42px_rgba(148,163,184,0.14)] ${toneStyle.featureBg ?? "bg-white"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneStyle.iconBg} ${toneStyle.iconColor}`}>
          <NotificationGlyph tone={item.tone} />
        </div>
        <div className="flex items-center gap-2">
          {item.badgeLabel ? (
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] ${toneStyle.badge ?? "bg-slate-100 text-slate-500"}`}>
              {item.badgeLabel}
            </span>
          ) : null}
          {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-blue-500" aria-label="Unread notification" /> : null}
        </div>
      </div>

      <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {item.actionLabel ? (
          <button type="button" className="text-sm font-semibold text-rose-600 transition hover:text-rose-700">
            {item.actionLabel}
          </button>
        ) : null}
        {item.unread ? (
          <button
            type="button"
            onClick={() => onMarkAsRead(item.id)}
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Mark as read
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-sm font-semibold text-rose-500 transition hover:text-rose-600"
        >
          Delete
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200/70 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Update</span>
          {item.collaborators ? (
            <div className="flex -space-x-2">
              {item.collaborators.map((avatarSrc, index) => (
                <span
                  key={`${item.id}-${avatarSrc}-${index}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-500"
                >
                  {index + 1}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="text-xs font-medium text-slate-400">{item.time}</div>
      </div>
    </article>
  );
}

function EmptyNotificationState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-[30px] border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth="1.8">
          <path d="M12 6.5v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 4.5V9H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-700">All caught up</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
        There are no notifications in this view right now. Switch back to all notifications to review your recent updates and ticket activity.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Show all notifications
      </button>
    </div>
  );
}

export default function CustomerNotificationsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const groupedNotifications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredItems = notifications.filter((item) => {
      const matchesFilter = filter === "all" || item.unread;
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.group.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
    const groups = filteredItems.reduce<Record<string, NotificationItem[]>>((accumulator, item) => {
      accumulator[item.group] ??= [];
      accumulator[item.group].push(item);
      return accumulator;
    }, {});

    return Object.entries(groups);
  }, [filter, notifications, query]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const handleClearVisible = () => {
    const visibleIds = new Set(groupedNotifications.flatMap(([, items]) => items.map((item) => item.id)));
    setNotifications((current) => current.filter((item) => !visibleIds.has(item.id)));
  };

  const hasVisibleNotifications = groupedNotifications.length > 0;

  return (
    <>
      <Head>
        <title>Notifications | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#eef2f8] text-slate-900">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          <CustomerDashboardSidebar
            navigationItems={customerNotificationNavigationItems}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="text-xs font-medium text-slate-500">Dashboard &nbsp;&rsaquo;&nbsp; Notifications</div>
            <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:ml-auto">
                <label className="flex h-12 min-w-[260px] items-center gap-3 rounded-full bg-slate-200/80 px-4 text-sm text-slate-500 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
                  <CustomerDashboardIcon type="search" className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search notifications..."
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </label>
                <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  <CustomerDashboardIcon type="help" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
                >
                  <CustomerDashboardIcon type="logout" className="h-4 w-4" />
                </button>
              </div>
            </header>

            <section className="mt-10">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.34em] text-blue-600">Customer Area</div>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.9rem]">Notifications</h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
                  Stay updated with your latest event activities, venue changes, and ticket status.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex rounded-full bg-white p-1 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      filter === "all" ? "bg-slate-900 text-white" : "text-slate-500"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("unread")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      filter === "unread" ? "bg-slate-900 text-white" : "text-slate-500"
                    }`}
                  >
                    Unread {unreadCount > 0 ? `(${unreadCount})` : ""}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-[0_10px_24px_rgba(148,163,184,0.12)] transition hover:border-blue-300 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  Mark all as read
                </button>

                <button
                  type="button"
                  onClick={handleClearVisible}
                  disabled={!hasVisibleNotifications}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-[0_10px_24px_rgba(148,163,184,0.12)] transition hover:border-rose-200 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  Clear visible
                </button>
              </div>
              </div>

              {hasVisibleNotifications ? (
                <div className="space-y-10">
                  {groupedNotifications.map(([group, items]) => {
                    const listItems = items.filter((item) => item.layout === "list");
                    const featureItems = items.filter((item) => item.layout === "feature");

                    return (
                      <section key={group}>
                        <div className="text-[11px] font-bold uppercase tracking-[0.34em] text-slate-500">{group}</div>

                        {listItems.length > 0 ? (
                          <div className="mt-5 space-y-4">
                            {listItems.map((item) => (
                              <NotificationListCard
                                key={item.id}
                                item={item}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDeleteNotification}
                              />
                            ))}
                          </div>
                        ) : null}

                        {featureItems.length > 0 ? (
                          <div className="mt-5 grid gap-5 xl:grid-cols-2">
                            {featureItems.map((item) => (
                              <NotificationFeatureCard
                                key={item.id}
                                item={item}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDeleteNotification}
                              />
                            ))}
                          </div>
                        ) : null}
                      </section>
                    );
                  })}
                </div>
              ) : (
                <EmptyNotificationState onReset={() => setFilter("all")} />
              )}
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
