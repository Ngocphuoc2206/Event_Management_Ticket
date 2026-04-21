import { useRouter } from "next/router";

import { OrganizerTicketTypesEditor } from "@/features/organizer/shared/OrganizerTicketTypesEditor";

function getEventIdFromQuery(eventId: string | string[] | undefined) {
  if (Array.isArray(eventId)) {
    return eventId[0] ?? "";
  }

  return eventId ?? "";
}

export function OrganizerEditEventStepFourContent() {
  const router = useRouter();
  const eventId = getEventIdFromQuery(router.query.eventId);
  const basePath = `/organizer/events/edit/${eventId}`;

  return (
    <OrganizerTicketTypesEditor
      title="Ticket Setup"
      description="Manage ticket types of this event with organizer ticket-type APIs."
      eventId={eventId || null}
      previousHref={`${basePath}/ticket-tiers`}
      nextHref="/organizer/events"
      nextLabel="Complete Editing"
    />
  );
}
