import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { OrganizerTicketTypesEditor } from "@/features/organizer/shared/OrganizerTicketTypesEditor";
import {
  getOrganizerDraftEventId,
  setOrganizerDraftEventId,
} from "../events/services/draft-storage";

export function OrganizerCreateEventStepFourContent() {
  const router = useRouter();

  const eventId = useMemo(() => {
    const queryEventId = router.query.eventId;
    if (typeof queryEventId === "string" && queryEventId.trim()) {
      return queryEventId;
    }

    return getOrganizerDraftEventId();
  }, [router.query.eventId]);

  useEffect(() => {
    if (eventId) {
      setOrganizerDraftEventId(eventId);
    }
  }, [eventId]);

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

  if (!eventId) {
    return (
      <section className="flex-1 bg-slate-50 p-10">
        <div className="rounded-3xl bg-white p-8">
          <h1 className="text-2xl font-bold text-zinc-900">Chưa có Event ID</h1>
          <p className="mt-2 text-gray-700">
            Vui lòng quay lại Step 1 để lưu draft event trước khi tạo ticket
            type.
          </p>
          <button
            type="button"
            onClick={() => void router.push("/organizer/create-event")}
            className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            Quay lại Step 1
          </button>
        </div>
      </section>
    );
  }

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
