import Link from "next/link";

export default function UserHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          EventHub
        </Link>
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/customer">Customer</Link>
          <Link href="/organizer">Organizer</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
