import Head from "next/head";

import { APP_NAME, DEFAULT_PAGE_TITLE } from "@/features/auth/constants";
import Header from "@/components/organisms/UserHeader/UserHeader";
import Footer from "@/components/organisms/UserFooter/UserFooter";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function UserLayout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ${APP_NAME}` : DEFAULT_PAGE_TITLE}</title>
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
