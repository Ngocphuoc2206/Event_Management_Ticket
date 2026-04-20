import Head from "next/head";

import NewHomeStandalone from "@/features/homePreview/components/NewHomeStandalone";

export default function NewHomePreviewPage() {
  return (
    <>
      <Head>
        <title>New Home Preview</title>
      </Head>
      <NewHomeStandalone />
    </>
  );
}