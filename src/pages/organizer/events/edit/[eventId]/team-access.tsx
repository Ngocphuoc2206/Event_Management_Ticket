import Head from "next/head";
import {
  OrganizerLayout,
} from "@/features/organizer";
import { OrganizerEditEventStepFourContent } from "../../../../../features/organizer/editEvent/OrganizerEditEventStepFourContent";

export default function OrganizerEditEventStepFourPage() {
  return (
    <>
      <Head>
        <title>Edit Event - Ticket Setup | EventHub</title>
      </Head>

      <OrganizerLayout title="Edit Event - Ticket Setup" activeLabel="Events">
        <OrganizerEditEventStepFourContent />
      </OrganizerLayout>
    </>
  );
}
