import type { OrganizerCreateEventPayload } from "@/features/organizer/events/types";

const ORGANIZER_DRAFT_KEY = "organizer-create-event-draft";
const ORGANIZER_DRAFT_ID_KEY = "organizer-create-event-id";

export function getOrganizerDraftPayload() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ORGANIZER_DRAFT_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as Partial<OrganizerCreateEventPayload>;
  } catch {
    return null;
  }
}

export function setOrganizerDraftPayload(payload: Partial<OrganizerCreateEventPayload>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORGANIZER_DRAFT_KEY, JSON.stringify(payload));
}

export function getOrganizerDraftEventId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ORGANIZER_DRAFT_ID_KEY);
}

export function setOrganizerDraftEventId(eventId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORGANIZER_DRAFT_ID_KEY, eventId);
}
