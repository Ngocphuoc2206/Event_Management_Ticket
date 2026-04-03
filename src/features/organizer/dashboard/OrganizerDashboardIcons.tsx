import type { SVGProps } from "react";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CircleEllipsis,
  FileText,
  LayoutGrid,
  LineChart,
  PieChart,
  Search,
  Settings,
  Ticket,
  Users,
} from "lucide-react";

import type { OrganizerDashboardIconName } from "../types";

type IconProps = {
  type: OrganizerDashboardIconName;
  className?: string;
} & SVGProps<SVGSVGElement>;

const iconMap: Record<OrganizerDashboardIconName, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  analytics: PieChart,
  attendees: Users,
  bell: Bell,
  calendar: CalendarDays,
  dashboard: LayoutGrid,
  events: LineChart,
  more: CircleEllipsis,
  reports: FileText,
  search: Search,
  settings: Settings,
  ticket: Ticket,
};

export function OrganizerDashboardIcon({ type, className, ...props }: IconProps) {
  const Icon = iconMap[type];
  return <Icon className={className} {...props} />;
}
