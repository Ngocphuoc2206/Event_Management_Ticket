import UserLayout from "@/components/layouts/UserLayout";
import Link from "next/link";

// Giữ nguyên các hằng số dữ liệu của bạn
const FEATURED_EVENTS = [ /* ... copy data của bạn vào đây ... */ ];
const CATEGORIES = [ /* ... copy data của bạn vào đây ... */ ];

export default function HomePage() {
  return (
    <UserLayout title="Home">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-20 pb-32 px-6">
         {/* ... copy phần Hero của bạn vào đây ... */}
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-20 -mt-20">
         {/* ... copy phần Categories của bạn vào đây ... */}
      </section>

      {/* 3. FEATURED EVENTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10 bg-[#F9FAFB]">
         {/* ... copy phần Events của bạn vào đây ... */}
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         {/* ... copy phần CTA của bạn vào đây ... */}
      </section>
    </UserLayout>
  );
}