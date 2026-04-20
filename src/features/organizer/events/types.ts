export type OrganizerEventVisibility = "PUBLIC";
export type OrganizerEventStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
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
};

export type OrganizerEventMutationPayload = Partial<OrganizerCreateEventPayload> & {
  status?: OrganizerEventStatus | string;
};

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
