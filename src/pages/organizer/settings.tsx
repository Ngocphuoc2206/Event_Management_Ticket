import Head from "next/head";

import {
  OrganizerLayout,
  OrganizerSettingsContent,
} from "@/features/organizer";

export default function OrganizerSettingsPage() {
  return (
    <>
      <Head>
        <title>Organizer Settings | EventHub</title>
      </Head>

      <OrganizerLayout title="Settings" activeLabel="Settings">
        <OrganizerSettingsContent />
      </OrganizerLayout>
    </>
  );
}
