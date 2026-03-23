export type CustomerDashboardIconName =
  | "bell"
  | "calendar"
  | "download"
  | "grid"
  | "help"
  | "history"
  | "logout"
  | "pin"
  | "profile"
  | "search"
  | "settings"
  | "star"
  | "ticket";

export type CustomerNavItem = {
  label: string;
  href: string;
  icon: CustomerDashboardIconName;
  active?: boolean;
};

export type CustomerStatCard = {
  label: string;
  value: string;
  note: string;
  accent: string;
  icon: Extract<CustomerDashboardIconName, "calendar" | "history" | "star" | "ticket">;
};

export type CustomerTicketCard = {
  status: string;
  title: string;
  date: string;
  venue: string;
  palette: string;
  artTitle: string;
  imageSrc?: string;
};

export type CustomerOrderStatus = "Completed" | "Pending";

export type CustomerOrderRow = {
  id: string;
  event: string;
  date: string;
  amount: string;
  status: CustomerOrderStatus;
};

export type CustomerProfile = {
  name: string;
  membership: string;
  avatarSrc: string;
};
