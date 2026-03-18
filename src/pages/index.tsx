import UserLayout from "@/components/templates/UserLayout/UserLayout";

export default function HomePage() {
  return (
    <UserLayout title="Home">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold">Discover Amazing Events</h1>
        <p className="mt-4 text-gray-600">
          Explore, book tickets, and manage events in one platform.
        </p>
      </section>
    </UserLayout>
  );
}
