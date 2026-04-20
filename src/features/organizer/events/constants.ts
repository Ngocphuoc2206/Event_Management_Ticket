export const ORGANIZER_EVENTS_ENDPOINT =
  process.env.NEXT_PUBLIC_ORGANIZER_CREATE_EVENT_ENDPOINT ||
  "http://localhost:8080/api/organizer/events";

export const ORGANIZER_CREATE_EVENT_ENDPOINT = ORGANIZER_EVENTS_ENDPOINT;

export const ORGANIZER_EVENT_MEDIA_UPLOAD_ENDPOINT =
  process.env.NEXT_PUBLIC_ORGANIZER_EVENT_MEDIA_UPLOAD_ENDPOINT ||
  "http://localhost:8080/api/organizer/events/upload";
