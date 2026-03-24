export type OrganizerDashboardIconName =
  | "analytics"
  | "attendees"
  | "bell"
  | "calendar"
  | "dashboard"
  | "events"
  | "more"
  | "reports"
  | "search"
  | "settings"
  | "ticket";

export type OrganizerNavItem = {
  label: string;
  href: string;
  icon: OrganizerDashboardIconName;
  active?: boolean;
};

export type OrganizerProfile = {
  name: string;
  role: string;
  avatarSrc?: string;
};

export type OrganizerStatCard = {
  label: string;
  value: string;
  icon: Extract<OrganizerDashboardIconName, "analytics" | "calendar" | "events" | "ticket">;
  tone: "sky" | "violet" | "rose" | "slate";
  badgeText?: string;
  badgeMultiLine?: boolean;
  showStackedDots?: boolean;
};

export type OrganizerEventCard = {
  title: string;
  date: string;
  venue: string;
  status: string;
  cover: string;
};

export type OrganizerSaleStatus = "On Track" | "Needs Boost";

export type OrganizerSaleRow = {
  id: string;
  event: string;
  sold: string;
  revenue: string;
  status: OrganizerSaleStatus;
};

export type OrganizerOrderStatus = "Completed" | "Pending";

export type OrganizerOrderRow = {
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  eventName: string;
  ticketType: "VIP" | "Standard";
  amount: string;
  status: OrganizerOrderStatus;
};
