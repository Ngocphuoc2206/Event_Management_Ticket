import type {
  OrganizerEventCard,
  OrganizerNavItem,
  OrganizerOrderRow,
  OrganizerProfile,
  OrganizerSaleRow,
  OrganizerStatCard,
} from "./types";

export const organizerNavigationItems = [
  { label: "Dashboard", href: "/organizer", icon: "dashboard", active: true },
  { label: "Events", href: "/organizer/events", icon: "events" },
  { label: "Create Event", href: "/organizer/create-event", icon: "calendar" },
  { label: "Tickets", href: "/organizer/tickets", icon: "ticket" },
  { label: "Attendees", href: "/organizer/attendees", icon: "attendees" },
  { label: "Analytics", href: "#analytics", icon: "analytics" },
  { label: "Reports", href: "#reports", icon: "reports" },
  { label: "Settings", href: "#settings", icon: "settings" },
] satisfies OrganizerNavItem[];

export function getOrganizerNavigationItems(activeLabel: OrganizerNavItem["label"]) {
  return organizerNavigationItems.map((item) => ({
    ...item,
    active: item.label === activeLabel,
  }));
}

export const organizerProfile = {
  name: "Giang Đẹp Zai Ahihi",
  role: "Premium Host",
  avatarSrc: "",
} satisfies OrganizerProfile;

export const organizerStatCards = [
  { label: "Total Events", value: "24", icon: "ticket", tone: "sky", badgeText: "+2 this month" },
  { label: "Tickets Sold", value: "1,240", icon: "calendar", tone: "violet", badgeText: "+12% vs last\nweek", badgeMultiLine: true },
  { label: "Total Revenue", value: "$45,200", icon: "analytics", tone: "rose", badgeText: "Record high" },
  { label: "Upcoming Events", value: "8", icon: "events", tone: "slate", showStackedDots: true },
] satisfies OrganizerStatCard[];

export const organizerUpcomingEvents = [
  {
    title: "FutureSound Arena Night",
    date: "Apr 06, 2026 | 19:30",
    venue: "Skyline Arena, Ho Chi Minh City",
    status: "Selling Fast",
    cover: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Creative Leaders Summit",
    date: "Apr 18, 2026 | 09:00",
    venue: "Riverside Convention Hall",
    status: "Open Registration",
    cover: "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=80",
  },
] satisfies OrganizerEventCard[];

export const organizerRecentSales = [
  { id: "#EV-2401", event: "FutureSound Arena Night", sold: "3,120", revenue: "$89,400", status: "On Track" },
  { id: "#EV-2402", event: "Creative Leaders Summit", sold: "1,880", revenue: "$64,920", status: "On Track" },
  { id: "#EV-2403", event: "Startup Mixer Vol.5", sold: "640", revenue: "$11,200", status: "Needs Boost" },
] satisfies OrganizerSaleRow[];

export const organizerRecentOrders = [
  {
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@email.com",
    customerAvatar: "",
    eventName: "Neon Nights Festival",
    ticketType: "VIP",
    amount: "$249.00",
    status: "Completed",
  },
  {
    customerName: "Marcus Thorne",
    customerEmail: "m.thorne@site.com",
    customerAvatar: "",
    eventName: "Tech Summit 2024",
    ticketType: "Standard",
    amount: "$120.00",
    status: "Completed",
  },
  {
    customerName: "Elena Rodriguez",
    customerEmail: "elena.r@cloud.com",
    customerAvatar: "",
    eventName: "Rooftop Yoga Session",
    ticketType: "Standard",
    amount: "$45.00",
    status: "Pending",
  },
] satisfies OrganizerOrderRow[];
