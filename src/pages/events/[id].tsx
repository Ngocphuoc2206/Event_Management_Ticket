import UserLayout from "@/components/templates/UserLayout/UserLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import { EVENT_LIST } from "../events"; // Reusing data from events.tsx

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  // Find event by ID, fallback to the first event if not found
  const event = EVENT_LIST.find(e => e.id.toString() === id) || EVENT_LIST[0]; 

  if (!event) return null; // Prevent rendering before data is loaded

  // Handle ticket selection
  const handleBuyTicket = (ticketType: string) => {
    // In a real project, store this ticket type in Context/Redux or LocalStorage here
    console.log(`Selected ${ticketType} ticket for event: ${event.title}`);
    
    // Redirect to Cart page
    router.push("/cart");
  };

  return (
    <UserLayout title={event.title}>
      <div className="bg-white min-h-screen pb-20">
        
        {/* 1. HERO IMAGE SECTION - Smooth Parallax */}
        <div className="relative h-[65vh] w-full bg-gray-900">
          <img 
            src={event.image} 
            className="w-full h-full object-cover opacity-80" 
            alt={event.title} 
          />
          {/* Bottom-to-top gradient for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="absolute bottom-12 left-0 w-full z-10">
            <div className="max-w-7xl mx-auto px-6">
              <Link href="/events" className="text-white/70 hover:text-white mb-6 flex items-center gap-2 w-max font-bold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to list
              </Link>
              
              <div className="flex gap-3 mb-5">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                  {event.type}
                </span>
                {event.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                    {event.badge}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {event.fullDate}
                </span>
                <span className="hidden md:inline text-white/40">•</span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CONTENT & TICKET STICKY BAR */}
        <div className="max-w-7xl mx-auto px-6 mt-16">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left Column: Event details */}
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-900 mb-6">About this event</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-12">
                {event.description} This is one of the most highly anticipated events of the year. With careful preparation from the organizers, you will experience a world-class venue, state-of-the-art sound and lighting systems, and very special guest appearances. Don't miss out on this amazing opportunity to join us with your friends and family.
              </p>
              
              {/* Organized by */}
              <div className="bg-[#F9FAFB] p-8 rounded-[32px] border border-gray-100 flex items-center justify-between gap-6 mb-12 shadow-sm">
                   <div className="flex items-center gap-5">
                     <img src="https://i.pravatar.cc/150?img=33" alt="Organizer" className="w-16 h-16 rounded-full shadow-md border-2 border-white" />
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Organized by</p>
                       <p className="text-xl font-black text-gray-900">EventHub Studio</p>
                     </div>
                   </div>
                   <button className="hidden md:block bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:border-gray-400 transition-all shadow-sm">
                     Follow
                   </button>
              </div>

              {/* Set Times */}
              <div className="border-t border-gray-100 pt-12">
                <h3 className="text-2xl font-black text-gray-900 mb-8">Event Schedule</h3>
                <div className="space-y-4">
                  {[
                    { time: "18:00", act: "Welcome & Check-in" },
                    { time: "19:00", act: "Opening Ceremony" },
                    { time: "20:00", act: "Main Activities" },
                    { time: "22:00", act: "Networking & Closing" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-colors">
                      <p className="font-black text-indigo-600 text-xl w-24">{item.time}</p>
                      <p className="font-bold text-gray-800 flex-1">{item.act}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Ticket Booking (Sticky) */}
            <div className="w-full lg:w-[420px]">
              <div className="sticky top-28 bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8">
                <h3 className="text-2xl font-black text-gray-900 mb-8">Select Tickets</h3>
                
                <div className="space-y-5 mb-10">
                   {/* VIP Ticket */}
                   <div className="bg-[#F9FAFB] border border-gray-100 p-6 rounded-3xl group hover:border-indigo-600 hover:shadow-md transition-all">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <p className="font-black text-lg text-gray-900">VIP Ticket (Front Row)</p>
                         <p className="text-xs text-red-500 font-bold mt-1 bg-red-50 w-max px-2 py-1 rounded-md">Only 12 left</p>
                       </div>
                       <span className="text-2xl font-black text-gray-900">${event.price + 50}</span>
                     </div>
                     <button 
                        onClick={() => handleBuyTicket('VIP')}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold group-hover:bg-indigo-600 transition-colors shadow-md active:scale-[0.98]">
                        Select Ticket
                     </button>
                   </div>

                   {/* Standard Ticket */}
                   <div className="bg-[#F9FAFB] border border-gray-100 p-6 rounded-3xl group hover:border-indigo-600 hover:shadow-md transition-all">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <p className="font-black text-lg text-gray-900">Standard Ticket</p>
                         <p className="text-xs text-green-600 font-bold mt-1 bg-green-50 w-max px-2 py-1 rounded-md">Available</p>
                       </div>
                       <span className="text-2xl font-black text-gray-900">{event.price === 0 ? "Free" : `$${event.price}`}</span>
                     </div>
                     <button 
                        onClick={() => handleBuyTicket('STANDARD')}
                        className="w-full bg-white border border-gray-200 text-gray-900 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition-colors active:scale-[0.98]">
                        Select Ticket
                     </button>
                   </div>
                </div>

                {/* Security Promise */}
                <div className="text-center text-xs text-gray-400 font-bold flex flex-col items-center gap-2">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  100% Secure Payment via EventHub
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </UserLayout>
  );
}
