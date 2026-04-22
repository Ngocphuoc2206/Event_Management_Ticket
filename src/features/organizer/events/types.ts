export type OrganizerEventVisibility = "PUBLIC";
export type OrganizerEventStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type OrganizerCreateEventPayload = {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  venueName: string;
  address: string;
  city: string;
  bannerUrl: string;
  startTime: string;
  endTime: string;
  visibility: OrganizerEventVisibility;
  minPrice: number;
  status?: OrganizerEventStatus;
};

export type OrganizerUpdateEventPayload = Partial<OrganizerCreateEventPayload>;

export type OrganizerTicketTypeStatus = "ACTIVE" | "INACTIVE";

export type OrganizerTicketType = {
  id: string;
  eventId?: string;
  name: string;
  price: number;
  quantity: number;
  saleStart: string;
  saleEnd: string;
  status?: OrganizerTicketTypeStatus;
};

export type OrganizerCreateTicketTypePayload = {
  name: string;
  price: number;
  quantity: number;
  saleStart: string;
  saleEnd: string;
};

export type OrganizerUpdateTicketTypePayload = Partial<
  OrganizerCreateTicketTypePayload & { status: OrganizerTicketTypeStatus }
>;

export type OrganizerEvent = OrganizerCreateEventPayload & {
  id?: string;
  organizerId?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: OrganizerEventStatus | string;
};

export type OrganizerEventsPageData = {
  items: OrganizerEvent[];
  hasNext: boolean;
};

export type OrganizerTicketTypesPageData = {
  items: OrganizerTicketType[];
  hasNext?: boolean;
};
