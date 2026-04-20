import Head from "next/head";

import { APP_NAME, DEFAULT_PAGE_TITLE } from "@/features/auth/constants";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function DefaultLayoutWithoutAuth({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ${APP_NAME}` : DEFAULT_PAGE_TITLE}</title>
      </Head>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </>
  );
}
