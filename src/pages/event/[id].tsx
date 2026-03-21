import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import UserLayout from "@/components/templates/UserLayout/UserLayout";
import { Calendar, MapPin, ChevronRight, Star, ArrowUpRight } from "lucide-react";

const eventData = {
  title: "Neon Nights: Underground Techno",
  date: "Friday, Oct 15, 2024",
  time: "9:00 PM",
  location: "Warehouse 42, Los Angeles",
  organizer: {
    name: "Warehouse Productions",
    logo: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200",
    description: "Pioneering the underground electronic scene since 2012. We focus on high-fidelity sound, architectural venues, and diverse lineups that push the boundaries of techno.",
  },
  image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=2000",
  tags: ["CONCERT", "ELECTRONIC", "TECHNO"],
  description: [
    "Step into the shadows of Warehouse 42 for an uncompromising night of industrial rhythms and pulsating frequencies. Neon Nights returns to its roots, bringing the raw energy of the underground techno scene to the heart of Los Angeles.",
    "Our custom-built 40,000-watt sound system has been engineered specifically for this space, ensuring every kick drum is felt as much as it is heard. Paired with a bespoke kinetic lighting installation, this is not just a party—it's a sensory immersion."
  ],
  setTimes: [
    { time: "09:00 PM", title: "Doors Open", subtitle: "Arrival & Ambient Warm-up" },
    { time: "10:00 PM", title: "Local Support", subtitle: "Curated selectas from the LA scene" },
    { time: "12:00 AM", title: "Main Act", subtitle: "Extended 2-hour headline set", isMain: true },
    { time: "02:00 AM", title: "Closing Set", subtitle: "Deep grooves until lights up" },
  ],
  tickets: [
    { id: 'vip', title: "VIP", description: "BACKSTAGE ACCESS • LOUNGE", price: 120, status: "Only 12 left!", alert: true },
    { id: 'std', title: "Standard", description: "GENERAL ADMISSION", price: 45, status: "Available", alert: false },
    { id: 'eb', title: "Early Bird", description: "PRE-SALE ACCESS", price: 30, status: "Sold Out", disabled: true },
  ],
  address: "800 E 4th St, Los Angeles, CA 90013"
};

export default function EventDetail() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>{eventData.title} - EventHub</title>
      </Head>

      <div className="font-['Inter',sans-serif] bg-white min-h-screen">
        {/* Header Hero (Dark Zinc) */}
        <section className="bg-zinc-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="max-w-6xl w-full">
            {/* Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {eventData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-bold tracking-widest bg-zinc-800 text-zinc-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-6 leading-tight">
              {eventData.title}
            </h1>

            {/* Event Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-zinc-400 mb-12">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-zinc-300" />
                <span className="font-medium">
                  {eventData.date} • {eventData.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-zinc-300" />
                <span className="font-medium">{eventData.location}</span>
              </div>
            </div>

            {/* Ticket-shaped Banner */}
            <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
              {/* Left & Right cutouts for physical ticket look */}
              <div className="absolute top-1/2 -left-6 w-12 h-12 bg-zinc-950 rounded-full -translate-y-1/2 z-10 hidden sm:block"></div>
              <div className="absolute top-1/2 -right-6 w-12 h-12 bg-zinc-950 rounded-full -translate-y-1/2 z-10 hidden sm:block"></div>

              <img
                src={eventData.image}
                alt={eventData.title}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Presented By Pill */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 bg-zinc-100 text-zinc-900 pr-4 pl-2 py-2 rounded-full flex items-center gap-3 shadow-lg max-w-[80%] sm:max-w-none">
                <img
                  src={eventData.organizer.logo}
                  alt={eventData.organizer.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Presented By
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {eventData.organizer.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content (White background) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Column (70%) */}
            <div className="flex-1 lg:w-[70%] space-y-14">
              
              {/* Event Description */}
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 mb-6">The Experience</h2>
                <div className="space-y-4 text-zinc-600 text-lg leading-relaxed">
                  {eventData.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Set Times */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-zinc-900">Set Times</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="text-red-700 font-bold uppercase tracking-widest text-sm">Live Updates</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {eventData.setTimes.map((set, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-6 rounded-2xl border transition-colors ${
                        set.isMain
                          ? "border-blue-500 bg-blue-50/30 shadow-sm"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-6 sm:gap-8">
                        <div className={`text-xl sm:text-2xl font-bold font-mono w-24 leading-none ${set.isMain ? "text-blue-600" : "text-emerald-600"}`}>
                          {set.time.replace(" ", "\n")}
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold flex items-center gap-2 mb-1 ${set.isMain ? "text-blue-900" : "text-zinc-900"}`}>
                            {set.title}
                            {set.isMain && <Star className="w-5 h-5 fill-blue-500 text-blue-500" />}
                          </h3>
                          <p className="text-zinc-500 text-sm sm:text-base">{set.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-zinc-300 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizer Profile */}
              <div className="bg-zinc-100 p-8 rounded-3xl flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <img
                  src={eventData.organizer.logo}
                  alt={eventData.organizer.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-white shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                    {eventData.organizer.name}
                  </h3>
                  <p className="text-zinc-600 mb-4 leading-relaxed">
                    {eventData.organizer.description}
                  </p>
                  <button className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-700 transition">
                    View Profile <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column (30%) */}
            <div className="lg:w-[30%] lg:min-w-[340px] space-y-8">
              
              {/* Tickets Container */}
              <div className="bg-zinc-100 rounded-3xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Select Tickets</h2>
                
                <div className="space-y-4">
                  {eventData.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-6 rounded-2xl border ${
                        ticket.disabled 
                          ? "bg-zinc-200/50 border-zinc-200 opacity-60" 
                          : "bg-white border-zinc-200 shadow-sm"
                      } flex flex-col relative overflow-hidden`}
                    >
                      {/* Ticket cutouts mock */}
                      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-100 rounded-full -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-zinc-100 rounded-full -translate-y-1/2"></div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-zinc-900 mb-1">{ticket.title}</h4>
                          <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                            {ticket.description}
                          </span>
                        </div>
                        <span className="text-3xl font-extrabold text-zinc-900">
                          ${ticket.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-sm font-bold ${
                            ticket.alert ? "text-red-600" : ticket.disabled ? "text-red-700 uppercase tracking-widest" : "text-zinc-600"
                          }`}
                        >
                          {ticket.status}
                        </span>
                        
                        <button
                          disabled={ticket.disabled}
                          className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                            ticket.disabled
                              ? "bg-zinc-300 text-white cursor-not-allowed"
                              : "bg-[#6B38D4] text-white hover:bg-[#582cb3] hover:shadow-lg hover:shadow-purple-500/30"
                          }`}
                        >
                          {ticket.disabled ? "Unavailable" : "Buy Ticket"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Card */}
              <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
                <div className="h-48 bg-zinc-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                    alt="Map"
                    className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-zinc-900 mb-1">Warehouse 42</h4>
                  <p className="text-zinc-500 text-sm mb-4">{eventData.address}</p>
                  <button className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition">
                    <ArrowUpRight className="w-4 h-4" />
                    Get Directions
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </UserLayout>
  );
}
