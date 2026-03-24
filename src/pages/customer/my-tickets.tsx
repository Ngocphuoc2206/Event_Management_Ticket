import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/customer",
      permanent: false,
    },
  };
};

export default function CustomerMyTicketsPage() {
  return null;
}
