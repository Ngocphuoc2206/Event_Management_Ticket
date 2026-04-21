import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CustomerDashboardIcon,
  CustomerDashboardSidebar,
  getCustomerNavigationItems,
  customerProfile,
} from "@/features/customer";
import type { CustomerNotification } from "@/features/customer/notifications.service";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "@/features/customer/notifications.service";

type NotificationFilter = "all" | "unread";
type NotificationTone =
  | "info"
  | "ticket"
  | "success"
  | "vip"
  | "important"
  | "lineup";
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

function getNotificationGroup(type?: string) {
  if (type === "TICKET_PURCHASE_SUCCESS") return "Ticket Confirmations";
  if (type?.includes("ORDER")) return "Order Updates";
  if (type?.includes("EVENT")) return "Event Updates";
  return "Notifications";
}

function getNotificationTone(type?: string): NotificationTone {
  if (type === "TICKET_PURCHASE_SUCCESS") return "success";
  if (type?.includes("TICKET")) return "ticket";
  if (type?.includes("EVENT")) return "important";
  return "info";
}

function getNotificationTime(createdAt?: string) {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function mapNotification(notification: CustomerNotification): NotificationItem {
  const tone = getNotificationTone(notification.type);

  return {
    id: notification.id,
    group: getNotificationGroup(notification.type),
    title: notification.title,
    description: notification.content,
    time: getNotificationTime(notification.createdAt),
    unread: !notification.read,
    tone,
    layout: tone === "important" ? "feature" : "list",
    badgeLabel: tone === "important" ? "Important" : undefined,
    actionLabel: notification.orderId ? "View order" : undefined,
  };
}

const TONE_STYLES: Record<
  NotificationTone,
  {
    iconBg: string;
    iconColor: string;
    accent: string;
    badge?: string;
    featureBg?: string;
  }
> = {
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
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.9"
      >
        <path d="M7 7.25h10a2 2 0 0 0 2-2V5H5v.25a2 2 0 0 0 2 2Z" />
        <path d="M5 8.25h14v2.1a2.1 2.1 0 0 1 0 4.2v2.2H5v-2.2a2.1 2.1 0 0 1 0-4.2Z" />
        <path
          d="M12 8.75v7.5"
          strokeDasharray="1.8 1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (tone === "success") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.9"
      >
        <circle cx="12" cy="12" r="6.5" />
        <path
          d="m9.25 12 1.75 1.75 3.75-3.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.8"
      >
        <circle cx="8.5" cy="9" r="2.5" />
        <circle cx="15.5" cy="9" r="2.5" />
        <path
          d="M4.75 17a3.75 3.75 0 0 1 7.5 0M11.75 17a3.75 3.75 0 0 1 7.5 0"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 9v4" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function NotificationListCard({
  item,
  onMarkAsRead,
}: {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
}) {
  const toneStyle = TONE_STYLES[item.tone];

  return (
    <article className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_42px_rgba(148,163,184,0.14)]">
      <div
        className={`absolute inset-y-4 left-0 w-1 rounded-full ${toneStyle.accent}`}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneStyle.iconBg} ${toneStyle.iconColor}`}
          >
            <NotificationGlyph tone={item.tone} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-bold tracking-tight text-slate-900">
                {item.title}
              </h3>
              {item.unread ? (
                <span
                  className="h-2.5 w-2.5 rounded-full bg-blue-500"
                  aria-label="Unread notification"
                />
              ) : null}
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {item.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {item.actionLabel ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
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
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
          <div className="text-xs font-medium text-slate-400">{item.time}</div>
          {item.unread ? (
            <div className="mt-3 hidden h-2.5 w-2.5 rounded-full bg-blue-500 sm:inline-flex" />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function NotificationFeatureCard({
  item,
  onMarkAsRead,
}: {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
}) {
  const toneStyle = TONE_STYLES[item.tone];

  return (
    <article
      className={`overflow-hidden rounded-[24px] border border-white/80 p-5 shadow-[0_18px_42px_rgba(148,163,184,0.14)] ${toneStyle.featureBg ?? "bg-white"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneStyle.iconBg} ${toneStyle.iconColor}`}
        >
          <NotificationGlyph tone={item.tone} />
        </div>
        <div className="flex items-center gap-2">
          {item.badgeLabel ? (
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] ${toneStyle.badge ?? "bg-slate-100 text-slate-500"}`}
            >
              {item.badgeLabel}
            </span>
          ) : null}
          {item.unread ? (
            <span
              className="h-2.5 w-2.5 rounded-full bg-blue-500"
              aria-label="Unread notification"
            />
          ) : null}
        </div>
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        {item.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {item.actionLabel ? (
          <button
            type="button"
            className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
          >
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
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200/70 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Update
          </span>
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
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 fill-none stroke-current"
          strokeWidth="1.8"
        >
          <path
            d="M12 6.5v5l3 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M4.5 4.5V9H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-700">
        All caught up
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
        There are no notifications in this view right now. Switch back to all
        notifications to review your recent updates and ticket activity.
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [markingReadIds, setMarkingReadIds] = useState<Set<string>>(new Set());

  const loadNotifications = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextNotifications = await getMyNotifications();
      setNotifications(nextNotifications.map(mapNotification));
    } catch {
      setErrorMessage("Cannot load notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNotifications();
  }, []);

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
    const groups = filteredItems.reduce<Record<string, NotificationItem[]>>(
      (accumulator, item) => {
        accumulator[item.group] ??= [];
        accumulator[item.group].push(item);
        return accumulator;
      },
      {},
    );

    return Object.entries(groups);
  }, [filter, notifications, query]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  const handleMarkAsRead = async (id: string) => {
    setMarkingReadIds((current) => new Set(current).add(id));
    setErrorMessage("");

    try {
      const updatedNotification = await markNotificationAsRead(id);
      const mappedNotification = updatedNotification
        ? mapNotification(updatedNotification)
        : null;

      setNotifications((current) =>
        current.map((item) =>
          item.id === id
            ? (mappedNotification ?? { ...item, unread: false })
            : item,
        ),
      );
    } catch {
      setErrorMessage("Cannot mark notification as read. Please try again.");
    } finally {
      setMarkingReadIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((item) => item.unread)
      .map((item) => item.id);
    await Promise.all(unreadIds.map((id) => handleMarkAsRead(id)));
  };

  const handleResetFilters = () => {
    setFilter("all");
    setQuery("");
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
            navigationItems={getCustomerNavigationItems("/customer/notifications")}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="mx-auto w-full max-w-[1600px]">
            <div className="text-xs font-medium text-slate-500">
              Dashboard &nbsp;&rsaquo;&nbsp; Notifications
            </div>
            <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:ml-auto">
                <label className="flex h-12 min-w-65 items-center gap-3 rounded-full bg-slate-200/80 px-4 text-sm text-slate-500 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
                  <CustomerDashboardIcon type="search" className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search notifications..."
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </label>
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
                  <div className="text-xs font-bold uppercase tracking-[0.34em] text-blue-600">
                    Customer Area
                  </div>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Notifications
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                    Stay updated with your latest event activities, venue
                    changes, and ticket status.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="inline-flex rounded-full bg-white p-1 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        filter === "all"
                          ? "bg-slate-900 text-white"
                          : "text-slate-500"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter("unread")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        filter === "unread"
                          ? "bg-slate-900 text-white"
                          : "text-slate-500"
                      }`}
                    >
                      Unread {unreadCount > 0 ? `(${unreadCount})` : ""}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleMarkAllAsRead()}
                    disabled={unreadCount === 0 || markingReadIds.size > 0}
                    className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-[0_10px_24px_rgba(148,163,184,0.12)] transition hover:border-blue-300 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>

              {hasVisibleNotifications ? (
                <div className="space-y-10">
                  {errorMessage ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
                      {errorMessage}
                    </div>
                  ) : null}
                  {groupedNotifications.map(([group, items]) => {
                    const listItems = items.filter(
                      (item) => item.layout === "list",
                    );
                    const featureItems = items.filter(
                      (item) => item.layout === "feature",
                    );

                    return (
                      <section key={group}>
                        <div className="text-[11px] font-bold uppercase tracking-[0.34em] text-slate-500">
                          {group}
                        </div>

                        {listItems.length > 0 ? (
                          <div className="mt-5 space-y-4">
                            {listItems.map((item) => (
                              <NotificationListCard
                                key={item.id}
                                item={item}
                                onMarkAsRead={(notificationId) =>
                                  void handleMarkAsRead(notificationId)
                                }
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
                                onMarkAsRead={(notificationId) =>
                                  void handleMarkAsRead(notificationId)
                                }
                              />
                            ))}
                          </div>
                        ) : null}
                      </section>
                    );
                  })}
                </div>
              ) : isLoading ? (
                <div className="rounded-[30px] border border-slate-100 bg-white/70 px-6 py-16 text-center text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
                  Loading notifications...
                </div>
              ) : (
                <>
                  {errorMessage ? (
                    <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
                      {errorMessage}
                    </div>
                  ) : null}
                  <EmptyNotificationState onReset={handleResetFilters} />
                </>
              )}
            </section>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
