import type {
  CustomerNavItem,
  CustomerOrderRow,
  CustomerProfile,
  CustomerStatCard,
  CustomerTicketCard,
} from "./types";

export const customerNavigationItems = [
  { label: "Dashboard", href: "/customer", icon: "grid", active: true },
  { label: "My Tickets", href: "/customer/my-tickets", icon: "ticket" },
  { label: "Order History", href: "#orders", icon: "history" },
  { label: "Notifications", href: "#notifications", icon: "bell" },
  { label: "Profile Settings", href: "#settings", icon: "settings" },
] satisfies CustomerNavItem[];

export const customerStatCards = [
  { label: "Total Tickets", value: "24", note: "+3 from last month", accent: "text-blue-600", icon: "ticket" },
  { label: "Upcoming Events", value: "03", note: "Next: Tonight, 8 PM", accent: "text-violet-600", icon: "calendar" },
  { label: "Past Events", value: "21", note: "Life-long attendee", accent: "text-rose-600", icon: "history" },
  { label: "Loyalty Points", value: "1,250", note: "Gold Status Member", accent: "text-blue-600", icon: "star" },
] satisfies CustomerStatCard[];

export const customerUpcomingTickets = [
  {
    status: "Live Now",
    title: "Neon Pulse Music Festival",
    date: "Oct 12, 2024 • 8:00 PM",
    venue: "Skyline Arena, New York",
    ticketCode: "EVH-NPF-8240",
    palette: "from-white via-white to-slate-100",
    artTitle: "NPMF",
    imageSrc: "/images/upc1.png",
  },
  {
    status: "Featured",
    title: "Global Tech Summit 2024",
    date: "Nov 05, 2024 • 9:00 AM",
    venue: "Convention Center, Austin",
    ticketCode: "EVH-GTS-0912",
    palette: "from-[#76c6bf] via-[#7cc7c0] to-[#b9ece6]",
    artTitle: "Tech Future",
    imageSrc: "/images/upc2.png",
  },
] satisfies CustomerTicketCard[];

export const customerRecentOrders = [
  { id: "#ORD-9021-X1", event: "Neon Pulse Music Festival", date: "Sep 24, 2024", amount: "$245.00", status: "Completed" },
  { id: "#ORD-8842-B5", event: "Global Tech Summit 2024", date: "Sep 18, 2024", amount: "$1,200.00", status: "Completed" },
  { id: "#ORD-7712-M9", event: "Designers Meetup Tokyo", date: "Aug 30, 2024", amount: "$45.00", status: "Pending" },
] satisfies CustomerOrderRow[];

export const customerProfile = {
  name: "Alex Johnson",
  membership: "Pro Member",
  avatarSrc: "/images/avt.jpg",
} satisfies CustomerProfile;
