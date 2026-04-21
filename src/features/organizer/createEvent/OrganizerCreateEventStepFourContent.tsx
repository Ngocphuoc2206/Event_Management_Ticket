import { useMemo } from "react";
import { useRouter } from "next/router";

import { OrganizerTicketTypesEditor } from "@/features/organizer/shared/OrganizerTicketTypesEditor";

export function OrganizerCreateEventStepFourContent() {
  const router = useRouter();

  const eventId = useMemo(() => {
    const queryEventId = router.query.eventId;
    return typeof queryEventId === "string" ? queryEventId : null;
  }, [router.query.eventId]);

  const previousHref = eventId
    ? {
        pathname: "/organizer/create-event/visuals",
        query: { eventId },
      }
    : "/organizer/create-event/visuals";

  const nextHref = eventId
    ? {
        pathname: "/organizer/create-event/review-publish",
        query: { eventId },
      }
    : "/organizer/create-event/review-publish";

  return (
    <OrganizerTicketTypesEditor
      title="Tickets & Pricing"
      description="Use organizer ticket-type APIs to create, search, update, and delete ticket types for this event."
      eventId={eventId}
      previousHref={previousHref}
      nextHref={nextHref}
      nextLabel="Review & Publish"
    />
  );
}
