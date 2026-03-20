import { useState, useMemo } from "react";
import UserLayout from "@/components/templates/UserLayout/UserLayout";
import { LayoutGrid, Calendar, MapPin, Tag, Globe, X, Search, ChevronLeft, ChevronRight } from "lucide-react";

const MOCK_EVENTS = [
  {
    id: 1, title: "Neon Horizon Tour: 2024", category: "Music & Concerts", stats: "2.4k attending", badgeLabel: "Selling Fast", badgeColor: "bg-rose-700", badgePulse: true, date: "Aug 24 • 9:00 PM", timestamp: 1724533200000, dateCode: "next_month", location: "The Glass Arena, London", price: 75, priceLabel: "From", image: "https://images.unsplash.com/photo-1540039155732-61ee01518f8e?w=800&q=80", description: "Experience the most exclusive music event of the year with live performances from top artists and stunning visual effects."
  },
  {
    id: 2, title: "Future AI Global Summit", category: "Tech Conferences", stats: "500 tickets left", badgeLabel: "New Addition", badgeColor: "bg-violet-700", badgePulse: false, date: "Sept 12 • 10:00 AM", timestamp: 1726135200000, dateCode: "next_month", location: "Innovation Hub, SF", price: 299, priceLabel: "From", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", description: "Join industry leaders to discuss the next generation of artificial intelligence, machine learning, and their impact on global markets."
  },
  {
    id: 3, title: "Bite of the City: Food Expo", category: "Art & Theater", stats: "Outdoor", badgeLabel: "Limited Slots", badgeColor: "bg-zinc-600", badgePulse: false, date: "Oct 05 • 11:00 AM", timestamp: 1728126000000, dateCode: "other", location: "Central Park South, NY", price: 15, priceLabel: "From", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80", description: "A culinary journey featuring the best street food, fine dining, and dessert masters from all around the world in an open-air festival."
  },
  {
    id: 4, title: "The Grand New Year's Prelude", category: "Music & Concerts", stats: "VIP Only", badgeLabel: "Featured", badgeColor: "bg-amber-600", badgePulse: false, date: "Dec 31 • 8:00 PM", timestamp: 1735675200000, dateCode: "other", location: "Platinum Harbor, Dubai", price: 550, priceLabel: "/ VIP", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80", description: "Experience the most exclusive countdown event of the year with live entertainment, five-star dining, and spectacular fireworks."
  },
  {
    id: 5, title: "Global Art & Design Fair", category: "Art & Theater", stats: "1.2k attending", badgeLabel: "Trending", badgeColor: "bg-blue-600", badgePulse: false, date: "Nov 15 • 9:00 AM", timestamp: 1731661200000, dateCode: "other", location: "Louvre Convention, Paris", price: 120, priceLabel: "From", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80", description: "Discover contemporary masterpieces from top emerging artists around the world, featuring exclusive gallery exhibitions and auctions."
  },
  {
    id: 6, title: "StartUp Crunch Pitch Day", category: "Tech Conferences", stats: "In-Person", badgeLabel: "Free Entry", badgeColor: "bg-emerald-600", badgePulse: false, date: "Jan 10 • 1:00 PM", timestamp: 1736514000000, dateCode: "other", location: "Tech Valley, Berlin", price: 0, priceLabel: "Free", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80", description: "Watch the top 10 promising startups pitch their revolutionary ideas to leading angel investors and venture capitalists in a vivid showdown."
  },
  {
    id: 7, title: "Symphony Under The Stars", category: "Music & Concerts", stats: "Family Friendly", badgeLabel: "Tonight", badgeColor: "bg-sky-600", badgePulse: true, date: "Mar 23 • 7:00 PM", timestamp: 1774292400000, dateCode: "weekend", location: "Hollywood Bowl, LA", price: 45, priceLabel: "From", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80", description: "A magical evening of classical music performed by the city's finest orchestra under the open night sky."
  },
  {
    id: 8, title: "Web3 & Blockchain Summit", category: "Tech Conferences", stats: "Online & Offline", badgeLabel: "Hot", badgeColor: "bg-indigo-600", badgePulse: false, date: "Mar 24 • 9:00 AM", timestamp: 1774342800000, dateCode: "weekend", location: "Crypto Center, Miami", price: 150, priceLabel: "From", image: "https://images.unsplash.com/photo-1639762681485-074b7f4fc244?w=800&q=80", description: "Deep dive into the future of decentralized finance, smart contracts, and Web3 innovations with leading blockchain pioneers."
  },
  {
    id: 9, title: "Broadway: The Phantom", category: "Art & Theater", stats: "Final Shows", badgeLabel: "Must See", badgeColor: "bg-purple-600", badgePulse: false, date: "Apr 10 • 8:00 PM", timestamp: 1775851200000, dateCode: "next_month", location: "Majestic Theatre, NY", price: 85, priceLabel: "From", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80", description: "Don't miss the hauntingly beautiful final performances of the legendary Broadway musical."
  },
  {
    id: 10, title: "Electronic Dance Carnival", category: "Music & Concerts", stats: "18+ Only", badgeLabel: "Sold Out Soon", badgeColor: "bg-rose-600", badgePulse: true, date: "May 05 • 10:00 PM", timestamp: 1778018400000, dateCode: "other", location: "Desert Arena, Vegas", price: 210, priceLabel: "From", image: "https://images.unsplash.com/photo-1470229722913-7c090be5f5be?w=800&q=80", description: "Three days of non-stop electronic dance music featuring top DJs, incredible stage designs, and immersive experiences."
  },
  {
    id: 11, title: "React NEXT Developer Conf", category: "Tech Conferences", stats: "Dev Community", badgeLabel: "Early Bird", badgeColor: "bg-blue-500", badgePulse: false, date: "Jun 12 • 9:00 AM", timestamp: 1781294400000, dateCode: "other", location: "Convention Center, Seattle", price: 199, priceLabel: "From", image: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?w=800&q=80", description: "The ultimate gathering for React and Next.js developers. Learn about Server Components, state management, and modern UI."
  },
  {
    id: 12, title: "Immersive Van Gogh Exibit", category: "Art & Theater", stats: "All Ages", badgeLabel: "Opening Week", badgeColor: "bg-yellow-600", badgePulse: false, date: "Mar 22 • 10:00 AM", timestamp: 1774202400000, dateCode: "weekend", location: "Art District, Chicago", price: 35, priceLabel: "From", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80", description: "Step directly into Van Gogh's masterpieces in this 360-degree digital art exhibition that brings his paintings to life."
  }
];

export default function HomePage() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState("Anytime");
  const [locationQuery, setLocationQuery] = useState("");
  
  const [sortBy, setSortBy] = useState("Popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const handleCategoryChange = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
    setCurrentPage(1);
    setSelectedEventId(null);
  };

  const handleDateFilter = (filter: string, code: string) => {
    setDateFilter(code);
    setCurrentPage(1);
    setSelectedEventId(null);
  };

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...MOCK_EVENTS];

    if (searchQuery) {
      result = result.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      result = result.filter(e => selectedCategories.includes(e.category));
    }
    if (locationQuery) {
      result = result.filter(e => e.location.toLowerCase().includes(locationQuery.toLowerCase()));
    }
    if (dateFilter !== "Anytime") {
      result = result.filter(e => e.dateCode === dateFilter);
    }

    if (sortBy === "Date") {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === "Price") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [searchQuery, selectedCategories, locationQuery, dateFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = filteredAndSortedEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <UserLayout title="Home">
      <section className="w-full flex justify-center bg-gray-50">
        <div data-layer="Container" className="Container w-full max-w-[1280px] relative flex flex-col md:flex-row">
          
          {/* Sidebar Filters */}
          <aside data-layer="Aside - SideNavBar (Filters)" className="w-full md:w-72 p-8 bg-gray-100 flex-shrink-0 flex flex-col justify-start items-start gap-8 border-r border-slate-200">
            <div data-layer="Container" className="Container self-stretch flex flex-col justify-start items-start gap-1">
              <div data-layer="Heading 2" className="Heading2 self-stretch flex flex-col justify-start items-start">
                <h2 data-layer="Filters" className="Filters self-stretch text-zinc-900 text-xl font-bold font-['Inter'] leading-7">Filters</h2>
              </div>
              <p className="text-gray-700 text-sm font-normal">Narrow your search</p>
            </div>
            
            <div className="self-stretch">
              <div className="flex items-center gap-3 mb-2">
                <Search className="w-4 h-5 text-gray-700" />
                <span className="text-gray-700 text-base font-semibold">Search</span>
              </div>
              <div className="Input px-3 py-2 bg-zinc-200 rounded-2xl flex items-center overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Event title..." 
                  className="w-full bg-transparent outline-none text-zinc-800 text-sm"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); setSelectedEventId(null); }}
                />
              </div>
            </div>
            
            <div data-layer="Nav" className="Nav self-stretch flex flex-col justify-start items-start gap-6">
              
              <div data-layer="Category" className="Category self-stretch flex flex-col gap-4">
                <div className="inline-flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-sky-700" />
                  <span className="text-sky-700 text-base font-semibold">Category</span>
                </div>
                <div className="flex flex-col gap-2">
                  {["Music & Concerts", "Tech Conferences", "Art & Theater"].map(cat => (
                    <label key={cat} className="Label pl-1.5 pr-4 py-2 bg-white rounded-2xl shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] inline-flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input 
                        type="checkbox" 
                        className="Input size-4 text-sky-700 rounded-sm"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <span className="text-zinc-900 text-sm font-medium">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div data-layer="Date" className="Date self-stretch flex flex-col gap-4">
                <div className="inline-flex items-center gap-3">
                  <Calendar className="w-4 h-5 text-gray-700" />
                  <span className="text-gray-700 text-base font-semibold">Date</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleDateFilter("Anytime", "Anytime")} className={`p-2 rounded-2xl text-left transition-colors ${dateFilter === "Anytime" ? "bg-zinc-300 font-bold" : "bg-zinc-200 hover:bg-zinc-300"}`}>
                    <span className="text-zinc-900 text-sm">Anytime</span>
                  </button>
                  <button onClick={() => handleDateFilter("This Weekend", "weekend")} className={`p-2 rounded-2xl text-left transition-colors ${dateFilter === "weekend" ? "bg-zinc-300 font-bold" : "bg-transparent hover:bg-zinc-200"}`}>
                    <span className="text-zinc-900 text-sm">This Weekend</span>
                  </button>
                  <button onClick={() => handleDateFilter("Next Month", "next_month")} className={`p-2 rounded-2xl text-left transition-colors ${dateFilter === "next_month" ? "bg-zinc-300 font-bold" : "bg-transparent hover:bg-zinc-200"}`}>
                    <span className="text-zinc-900 text-sm">Next Month</span>
                  </button>
                </div>
              </div>

              <div data-layer="Location" className="Location self-stretch flex flex-col gap-4">
                <div className="inline-flex items-center gap-3">
                  <MapPin className="w-4 h-5 text-gray-700" />
                  <span className="text-gray-700 text-base font-semibold">Location</span>
                </div>
                <div className="Input px-3 py-2 bg-zinc-200 rounded-2xl flex items-center overflow-hidden">
                  <input 
                    type="text" 
                    placeholder="Enter city..." 
                    className="w-full bg-transparent outline-none text-zinc-800 text-sm"
                    value={locationQuery}
                    onChange={(e) => { setLocationQuery(e.target.value); setCurrentPage(1); setSelectedEventId(null); }}
                  />
                </div>
              </div>

            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-8 lg:p-12 bg-slate-50 flex flex-col gap-12 w-full overflow-hidden">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-violet-700 text-base font-bold uppercase tracking-[3.20px]">Trending Now</span>
                <h1 className="text-zinc-900 text-4xl lg:text-5xl font-bold leading-[48px]">Explore Events</h1>
                <p className="max-w-[500px] text-gray-700 text-lg lg:text-xl font-normal leading-8">Curated experiences from around the world, designed to inspire and connect.</p>
              </div>
              
              <div className="p-2 bg-white rounded-3xl shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] flex items-center gap-2 flex-wrap">
                <div className="px-3">
                  <span className="text-gray-700 text-sm font-semibold leading-5">Sort by:</span>
                </div>
                {["Popularity", "Date", "Price"].map(sortOp => (
                  <button 
                    key={sortOp}
                    onClick={() => { setSortBy(sortOp); setSelectedEventId(null); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-2xl flex items-center transition-colors ${sortBy === sortOp ? "bg-blue-100 text-sky-950 font-bold" : "hover:bg-zinc-100 text-zinc-900 font-medium"}`}
                  >
                    <span className="text-sm">{sortOp}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-flow-dense">
              
              {paginatedEvents.map(event => {
                const isSelected = selectedEventId === event.id;

                if (isSelected) {
                  return (
                    <div key={event.id} className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-3xl shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] flex flex-col md:flex-row overflow-hidden relative border border-slate-200 animate-in fade-in zoom-in duration-300">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedEventId(null); }} 
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md text-zinc-900 rounded-full flex items-center justify-center hover:bg-white shadow transition-all"
                      >
                        <X size={20} />
                      </button>
                      
                      <div className="w-full md:w-1/2 flex-shrink-0 relative min-h-[300px]">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover absolute inset-0" />
                      </div>
                      
                      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-start">
                        <div className="mb-4">
                          <div className={`px-3 py-1 ${event.badgeColor} bg-opacity-20 rounded-full inline-flex`}>
                            <span className="text-zinc-900 text-xs font-black uppercase tracking-wider">{event.badgeLabel}</span>
                          </div>
                        </div>
                        <h3 className="text-zinc-900 text-3xl font-bold leading-9 mb-4">{event.title}</h3>
                        <p className="text-gray-700 text-base font-normal leading-6 mb-8 max-w-lg">
                          {event.description}
                        </p>
                        <div className="flex flex-col gap-4 mb-8">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-5 text-gray-700" />
                            <span className="text-gray-700 text-sm font-normal leading-5">{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-5 text-gray-700" />
                            <span className="text-gray-700 text-sm font-normal leading-5">{event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-auto">
                          {/* Expanded Button: Gradient with white text */}
                          <button className="px-8 py-3 bg-gradient-to-r from-sky-700 to-violet-700 text-white rounded-2xl shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] text-base font-bold transition-transform hover:scale-105">View Event</button>
                          <div className="flex items-baseline gap-1">
                            <span className="text-zinc-900 text-2xl font-black">{event.price === 0 ? "Free" : `$${event.price}`}</span>
                            <span className="text-gray-700 text-sm font-normal">{event.price === 0 ? "" : event.priceLabel === "From" ? "/ Ticket" : event.priceLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className="col-span-1 bg-white rounded-3xl shadow-[0px_0px_32px_0px_rgba(25,28,30,0.06)] flex flex-col overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      <div className={`absolute top-4 right-4 ${event.badgeColor} px-3 py-1 rounded-full flex items-center justify-center gap-1.5`}>
                        {event.badgePulse && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                        <span className="text-white text-xs font-bold leading-4">{event.badgeLabel}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-sky-700">{event.category}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-gray-700 text-xs font-bold">{event.stats}</span>
                      </div>
                      <h3 className="text-zinc-900 text-xl font-bold leading-7 mb-4">{event.title}</h3>
                      <div className="flex flex-col gap-2 mb-6 mt-auto">
                        <span className="text-gray-700 text-sm flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{event.date}</span>
                        <span className="text-gray-700 text-sm flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex flex-col justify-start items-start">
                          {event.price !== 0 && (
                            <span className="text-gray-700 text-xs font-medium leading-4">From</span>
                          )}
                          <span className="text-zinc-900 text-xl font-bold leading-7">{event.price === 0 ? "Free" : `$${event.price}`}</span>
                        </div>
                        {/* Normal Button: White bg, blue border, blue text */}
                        <button className="px-6 py-2.5 rounded-2xl text-base font-bold transition-all bg-white outline outline-2 outline-offset-[-2px] outline-sky-700 text-sky-700 hover:outline-none hover:bg-gradient-to-r hover:from-sky-700 hover:to-violet-700 hover:text-white">
                          View Event
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {paginatedEvents.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 flex flex-col items-center justify-center gap-4 text-gray-500">
                  <Search size={48} className="text-gray-300" />
                  <p className="text-lg">No events found matching your criteria.</p>
                </div>
              )}

            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-8 border-t border-slate-200 mt-4">
                <button 
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); setSelectedEventId(null); }}
                  disabled={currentPage === 1}
                  className="p-2 bg-white rounded-full shadow hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6 text-zinc-900" />
                </button>
                <span className="text-zinc-900 font-medium">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); setSelectedEventId(null); }}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white rounded-full shadow hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6 text-zinc-900" />
                </button>
              </div>
            )}
            
          </main>
        </div>
      </section>
    </UserLayout>
  );
}
