"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { getApiResultData, getApiResultMessage } from "@/features/auth/utils/api-result";
import { createOrganizerEvent } from "@/features/organizer/events/services/create-event.service";
import type {
  OrganizerCreateEventPayload,
  OrganizerEvent,
} from "@/features/organizer/events/types";

type OrganizerCreateEventFormProps = {
  onCreated?: (event: OrganizerEvent | undefined) => void;
  className?: string;
};

type FormState = {
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
  minPrice: string;
};

const INITIAL_FORM_STATE: FormState = {
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  venueName: "",
  address: "",
  city: "",
  bannerUrl: "",
  startTime: "",
  endTime: "",
  minPrice: "0",
};

export default function OrganizerCreateEventForm({
  onCreated,
  className,
}: OrganizerCreateEventFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.shortDescription.trim() &&
      form.description.trim() &&
      form.category.trim() &&
      form.venueName.trim() &&
      form.address.trim() &&
      form.city.trim() &&
      form.bannerUrl.trim() &&
      form.startTime &&
      form.endTime &&
      Number(form.minPrice) >= 0
    );
  }, [form]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: OrganizerCreateEventPayload = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        venueName: form.venueName.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        bannerUrl: form.bannerUrl.trim(),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        visibility: "PUBLIC",
        minPrice: Number(form.minPrice),
      };

      const apiResult = await createOrganizerEvent(payload);
      const createdEvent = getApiResultData(apiResult);
      const apiMessage = getApiResultMessage(apiResult);

      setSuccessMessage(apiMessage || "Event created successfully.");
      setForm(INITIAL_FORM_STATE);
      onCreated?.(createdEvent);
    } catch {
      setErrorMessage("Could not create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        value={form.title}
        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
        placeholder="Event title"
        required
      />
      <input
        value={form.shortDescription}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, shortDescription: event.target.value }))
        }
        placeholder="Short description"
        required
      />
      <textarea
        value={form.description}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, description: event.target.value }))
        }
        placeholder="Description"
        required
      />
      <input
        value={form.category}
        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
        placeholder="Category"
        required
      />
      <input
        value={form.venueName}
        onChange={(event) => setForm((prev) => ({ ...prev, venueName: event.target.value }))}
        placeholder="Venue name"
        required
      />
      <input
        value={form.address}
        onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
        placeholder="Address"
        required
      />
      <input
        value={form.city}
        onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
        placeholder="City"
        required
      />
      <input
        value={form.bannerUrl}
        onChange={(event) => setForm((prev) => ({ ...prev, bannerUrl: event.target.value }))}
        placeholder="Banner URL"
        type="url"
        required
      />
      <input
        value={form.startTime}
        onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))}
        type="datetime-local"
        required
      />
      <input
        value={form.endTime}
        onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))}
        type="datetime-local"
        required
      />
      <input
        value={form.minPrice}
        onChange={(event) => setForm((prev) => ({ ...prev, minPrice: event.target.value }))}
        placeholder="Minimum ticket price"
        type="number"
        min={0}
        step="0.01"
        required
      />

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}

      <button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
