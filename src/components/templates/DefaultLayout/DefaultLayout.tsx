import Head from "next/head";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function DefaultLayoutWithoutAuth({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title || "Event Ticketing System"}</title>
      </Head>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </>
  );
}
