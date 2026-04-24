function isAbsoluteHttpUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

const DEFAULT_ORGANIZER_EVENTS_ENDPOINT = "http://localhost:8080/api/organizer/events";

const organizerEventsFromEnv = process.env.NEXT_PUBLIC_ORGANIZER_EVENTS_ENDPOINT;
const organizerCreateEventFromEnv =
  process.env.NEXT_PUBLIC_ORGANIZER_CREATE_EVENT_ENDPOINT;

export const ORGANIZER_EVENTS_ENDPOINT =
  (isAbsoluteHttpUrl(organizerEventsFromEnv) && organizerEventsFromEnv) ||
  (isAbsoluteHttpUrl(organizerCreateEventFromEnv) && organizerCreateEventFromEnv) ||
  DEFAULT_ORGANIZER_EVENTS_ENDPOINT;

export const ORGANIZER_CREATE_EVENT_ENDPOINT = ORGANIZER_EVENTS_ENDPOINT;
