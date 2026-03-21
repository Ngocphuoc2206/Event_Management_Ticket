import { ArrowUpRight, Calendar, ChevronRight, MapPin, Star } from "lucide-react";

export default function NewHomeStandalone() {
  const platformLinks = ["About Us", "Contact Support", "Cookie Settings"];
  const legalLinks = ["Privacy Policy", "Terms of Service"];
  const socialLinks = ["Instagram", "LinkedIn"];
  const heroTags = ["CONCERT", "ELECTRONIC", "TECHNO"];
  const experienceParagraphs = [
    "Step into the shadows of Warehouse 42 for an uncompromising night of industrial rhythms and pulsating frequencies. Neon Nights returns to its roots, bringing the raw energy of the underground techno scene to the heart of Los Angeles.",
    "Our custom-built 40,000-watt sound system has been engineered specifically for this space, ensuring every kick drum is felt as much as it is heard. Paired with a bespoke kinetic lighting installation, this is not just a party - it's a sensory immersion.",
  ];
  const setTimes = [
    { time: "09:00 PM", title: "Doors Open", subtitle: "Arrival & Ambient Warm-up", featured: false },
    { time: "10:00 PM", title: "Local Support", subtitle: "Curated selectas from the LA scene", featured: false },
    { time: "12:00 AM", title: "Main Act", subtitle: "Extended 2-hour headline set", featured: true },
    { time: "02:00 AM", title: "Closing Set", subtitle: "Deep grooves until lights up", featured: false },
  ];
  const ticketCards = [
    {
      title: "VIP",
      description: "BACKSTAGE ACCESS • LOUNGE",
      price: "$120",
      status: "Only 12 left!",
      statusClass: "text-rose-700",
      soldOut: false,
    },
    {
      title: "Standard",
      description: "GENERAL ADMISSION",
      price: "$45",
      status: "Available",
      statusClass: "text-gray-700",
      soldOut: false,
    },
    {
      title: "Early Bird",
      description: "PRE-SALE ACCESS",
      price: "$30",
      status: "Sold Out",
      statusClass: "text-red-700 uppercase tracking-wider font-bold",
      soldOut: true,
    },
  ];
  const relatedEvents = [
    {
      date: "OCT 22",
      title: "Future Bass Collective",
      location: "Echo Plex, Los Angeles",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
    },
    {
      date: "OCT 29",
      title: "Sunset Grooves: Rooftop",
      location: "Ace Hotel, Los Angeles",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    },
    {
      date: "NOV 05",
      title: "Dark Wave Synthesis",
      location: "The Belasco, Los Angeles",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c090be5f5be?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-300/40 bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-12">
            <div className="text-2xl font-extrabold leading-8 text-sky-700">EventHub</div>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              <a className="text-sm font-medium leading-5 text-gray-700 transition-colors hover:text-sky-700" href="#">
                Browse Events
              </a>
              <a className="text-sm font-medium leading-5 text-gray-700 transition-colors hover:text-sky-700" href="#">
                My Tickets
              </a>
              <a className="text-sm font-medium leading-5 text-gray-700 transition-colors hover:text-sky-700" href="#">
                Organize
              </a>
              <a className="text-sm font-medium leading-5 text-gray-700 transition-colors hover:text-sky-700" href="#">
                Help
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="rounded-2xl px-4 py-2 text-sm font-semibold leading-5 text-zinc-900 transition-colors hover:bg-slate-100 md:px-6 md:py-2.5">
              Sign In
            </button>
            <div className="size-10 overflow-hidden rounded-full bg-gray-200">
              <img
                className="size-10 max-w-10"
                src="https://placehold.co/40x40"
                alt="User Avatar"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-8">
        <section className="relative h-[600px] overflow-hidden rounded-3xl">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=1600&q=80"
            alt="Event Banner"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />

          <div className="absolute bottom-10 left-6 right-6 flex flex-col gap-8 md:left-12 md:right-12 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-4xl flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {heroTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-purple-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide text-violet-950"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl lg:leading-[72px]">
                Neon Nights:
                <br />
                Underground Techno
              </h1>

              <div className="flex flex-col gap-3 text-white/90 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-4 text-purple-300" />
                  <span className="text-base font-medium leading-7 md:text-lg">Friday, Oct 15, 2024 • 9:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-4 text-purple-300" />
                  <span className="text-base font-medium leading-7 md:text-lg">Warehouse 42, Los Angeles</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-3xl bg-white/80 p-4 outline-1 -outline-offset-1 outline-white/20 backdrop-blur-md md:self-auto">
              <div className="h-12 w-9 overflow-hidden rounded-2xl bg-gray-100">
                <img
                  className="h-9 w-9 max-w-9"
                  src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=120&q=80"
                  alt="Organizer Logo"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wide leading-[10px] text-gray-700">Presented By</span>
                <span className="text-sm font-bold leading-5 text-zinc-900">
                  Warehouse
                  <br />
                  Productions
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)] lg:gap-10">
          <div className="flex flex-col gap-16">
            <section className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold leading-9 text-zinc-900">The Experience</h2>
              <div className="flex flex-col gap-4">
                {experienceParagraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-6 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold leading-9 text-zinc-900">Set Times</h2>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-rose-700" />
                  <span className="text-sm font-bold uppercase tracking-wider text-rose-700">Live Updates</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {setTimes.map((slot) => (
                  <article
                    key={slot.time}
                    className={`flex items-center gap-6 rounded-2xl bg-white p-6 ${
                      slot.featured ? "border-l-4 border-sky-700 p-8 shadow-sm" : ""
                    }`}
                  >
                    <div className="w-24 text-xl font-bold leading-7 text-sky-700">{slot.time}</div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold leading-7 text-zinc-900 ${slot.featured ? "text-xl" : ""}`}>
                        {slot.title}
                      </h3>
                      <p className="text-sm leading-5 text-gray-700">{slot.subtitle}</p>
                    </div>
                    {slot.featured ? (
                      <Star className="size-5 fill-sky-700 text-sky-700" />
                    ) : (
                      <ChevronRight className="h-3 w-2 text-slate-300" />
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-gray-100 p-8">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <div className="size-20 overflow-hidden rounded-3xl bg-white">
                  <img
                    className="size-20 max-w-20 object-cover"
                    src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=160&q=80"
                    alt="Organizer Profile"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-2xl font-bold leading-8 text-zinc-900">Warehouse Productions</h3>
                  <p className="text-base leading-6 text-gray-700">
                    Pioneering the underground electronic scene since 2012. We focus on high-fidelity sound,
                    architectural venues, and diverse lineups that push the boundaries of techno.
                  </p>
                  <button className="inline-flex items-center gap-2 pt-2 text-base font-bold leading-6 text-sky-700">
                    View Profile
                    <ArrowUpRight className="size-3" />
                  </button>
                </div>
              </div>
            </section>
          </div>

          <aside className="pb-12 lg:pb-40">
            <div className="flex flex-col gap-8 lg:sticky lg:top-6">
              <section className="flex flex-col gap-8 rounded-3xl bg-gray-200 p-8">
                <h2 className="text-2xl font-bold leading-8 text-zinc-900">Select Tickets</h2>

                <div className="flex flex-col gap-4">
                  {ticketCards.map((ticket) => (
                    <article
                      key={ticket.title}
                      className={`relative rounded-2xl p-6 ${ticket.soldOut ? "bg-gray-100/80 opacity-60" : "bg-white"}`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h4 className={`text-xl font-bold leading-7 ${ticket.soldOut ? "text-gray-500" : "text-zinc-900"}`}>
                            {ticket.title}
                          </h4>
                          <p
                            className={`text-xs font-medium leading-4 tracking-tight ${
                              ticket.soldOut ? "text-gray-500" : "text-gray-700"
                            }`}
                          >
                            {ticket.description}
                          </p>
                        </div>
                        <div
                          className={`text-2xl font-extrabold leading-8 ${
                            ticket.soldOut ? "text-gray-500" : "text-zinc-900"
                          }`}
                        >
                          {ticket.price}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className={`text-sm leading-5 ${ticket.statusClass}`}>{ticket.status}</p>
                        <button
                          className={`rounded-2xl px-6 py-2 text-sm font-bold leading-5 text-white ${
                            ticket.soldOut
                              ? "bg-slate-300"
                              : "bg-gradient-to-br from-sky-700 to-violet-700 hover:from-sky-800 hover:to-violet-800"
                          }`}
                        >
                          {ticket.soldOut ? "Unavailable" : "Buy Ticket"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-3xl bg-white">
                <div className="h-48 bg-zinc-200">
                  <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                    alt="Map Location"
                  />
                </div>
                <div className="flex flex-col gap-1 p-6">
                  <h4 className="text-base font-bold leading-6 text-zinc-900">Warehouse 42</h4>
                  <p className="text-sm leading-5 text-gray-700">800 E 4th St, Los Angeles, CA 90013</p>
                  <button className="inline-flex items-center gap-2 pt-3 text-sm font-bold leading-5 text-sky-700">
                    <ArrowUpRight className="size-3" />
                    Get Directions
                  </button>
                </div>
              </section>
            </div>
          </aside>
        </section>

        <section className="mt-16 flex flex-col gap-10 border-t border-slate-300/20 pt-28">
          <h2 className="text-3xl font-bold leading-9 text-zinc-900">Other Events You&apos;ll Love</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {relatedEvents.map((event) => (
              <article key={event.title} className="flex flex-col">
                <div className="relative overflow-hidden rounded-3xl">
                  <img className="h-72 w-full object-cover" src={event.image} alt={event.title} />
                  <span className="absolute left-4 top-3 rounded-full bg-white/90 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-900 backdrop-blur-[6px]">
                    {event.date}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold leading-7 text-zinc-900">{event.title}</h3>
                <p className="mt-1 text-sm leading-5 text-gray-700">{event.location}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-300/20 bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-16 px-4 py-16 md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-6">
              <div className="text-2xl font-extrabold leading-8 text-sky-700">EventHub</div>
              <p className="text-sm leading-6 text-gray-700">
                The premier destination for discovering underground experiences and exclusive events across the globe.
              </p>
            </div>

            <div className="flex flex-col gap-4 pb-3">
              <h5 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Platform</h5>
              <ul className="flex flex-col gap-2">
                {platformLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm leading-5 text-gray-700 transition-colors hover:text-sky-700">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 pb-3">
              <h5 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Legal</h5>
              <ul className="flex flex-col gap-2">
                {legalLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm leading-5 text-gray-700 transition-colors hover:text-sky-700">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 pb-3">
              <h5 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Social</h5>
              <ul className="flex flex-col gap-2">
                {socialLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm leading-5 text-gray-700 transition-colors hover:text-sky-700">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300/20 pt-8">
            <p className="text-center text-xs leading-4 text-gray-700">© 2024 EventHub Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}