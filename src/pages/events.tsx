import UserLayout from "@/components/templates/UserLayout/UserLayout";
import { useState, useMemo } from "react";
import Link from "next/link";

// Dữ liệu mở rộng siêu phong phú
export const EVENT_LIST = [
  {
    id: 1,
    title: "Neon Nights: Techno Festival",
    type: "Music",
    dateFilter: "This Weekend",
    date: "Oct 18 • 9:00 PM",
    fullDate: "October 18, 2024",
    location: "Warehouse 42, Los Angeles",
    price: 45,
    badge: "🔥 HOT",
    image:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1000&auto=format&fit=crop",
    description:
      "Đắm chìm trong không gian âm nhạc điện tử huyền ảo với hệ thống ánh sáng neon và dàn loa công suất lớn.",
    attendees: [
      "https://i.pravatar.cc/150?u=1",
      "https://i.pravatar.cc/150?u=2",
      "https://i.pravatar.cc/150?u=3",
    ],
  },
  {
    id: 2,
    title: "Global AI & Tech Summit",
    type: "Tech",
    dateFilter: "This Month",
    date: "Nov 02 • 8:00 AM",
    fullDate: "November 02, 2024",
    location: "Innovation Hub, SF",
    price: 199,
    badge: "SELLING FAST",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop",
    description:
      "Hội nghị công nghệ quy tụ các chuyên gia AI và Robotics hàng đầu để thảo luận về tương lai số.",
    attendees: [
      "https://i.pravatar.cc/150?u=4",
      "https://i.pravatar.cc/150?u=5",
      "https://i.pravatar.cc/150?u=6",
    ],
  },
  {
    id: 3,
    title: "Midnight Food & Wine",
    type: "Food",
    dateFilter: "This Weekend",
    date: "Oct 20 • 6:00 PM",
    fullDate: "October 20, 2024",
    location: "Waterfront Park, Seattle",
    price: 25,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop",
    description:
      "Lễ hội ẩm thực ngoài trời với những món ăn tinh tế và các loại rượu vang trứ danh khắp thế giới.",
    attendees: [
      "https://i.pravatar.cc/150?u=7",
      "https://i.pravatar.cc/150?u=8",
      "https://i.pravatar.cc/150?u=9",
    ],
  },
  {
    id: 4,
    title: "Modern Art Exhibition",
    type: "Art",
    dateFilter: "This Month",
    date: "Oct 25 • 10:00 AM",
    fullDate: "October 25, 2024",
    location: "MOMA Gallery, New York",
    price: 15,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000&auto=format&fit=crop",
    description:
      "Khám phá các tác phẩm nghệ thuật đương đại từ những nghệ sĩ trẻ triển vọng nhất toàn cầu.",
    attendees: [
      "https://i.pravatar.cc/150?u=10",
      "https://i.pravatar.cc/150?u=11",
      "https://i.pravatar.cc/150?u=12",
    ],
  },
  {
    id: 5,
    title: "City Marathon 2024",
    type: "Sports",
    dateFilter: "Next Month",
    date: "Nov 10 • 5:00 AM",
    fullDate: "November 10, 2024",
    location: "Downtown, Chicago",
    price: 55,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1552674605-15c37042ce88?q=80&w=1000&auto=format&fit=crop",
    description:
      "Thử thách bản thân với đường chạy 42km xuyên qua những con phố đẹp nhất trung tâm Chicago.",
    attendees: [
      "https://i.pravatar.cc/150?u=13",
      "https://i.pravatar.cc/150?u=14",
      "https://i.pravatar.cc/150?u=15",
    ],
  },
  {
    id: 6,
    title: "Startup Pitch Deck",
    type: "Business",
    dateFilter: "Next Month",
    date: "Nov 15 • 2:00 PM",
    fullDate: "November 15, 2024",
    location: "Capital Tower, Austin",
    price: 0,
    badge: "FREE",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
    description:
      "Cơ hội lắng nghe và kết nối với các startup kỳ lân tương lai trong buổi gọi vốn đầy kịch tính.",
    attendees: [
      "https://i.pravatar.cc/150?u=16",
      "https://i.pravatar.cc/150?u=17",
      "https://i.pravatar.cc/150?u=18",
    ],
  },
];

export default function EventsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("All");

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const filteredEvents = useMemo(() => {
    return EVENT_LIST.filter((event) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.type);
      const matchDate =
        selectedDate === "All" || event.dateFilter === selectedDate;
      return matchCategory && matchDate;
    });
  }, [selectedCategories, selectedDate]);

  return (
    <UserLayout title="Explore Events">
      {/* Banner nhỏ trên cùng */}
      <div className="bg-gray-900 pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Khám Phá Sự Kiện
          </h1>
          <p className="text-gray-400 text-lg">
            Tìm kiếm niềm vui tiếp theo của bạn từ hàng ngàn sự kiện hấp dẫn.
          </p>
        </div>
      </div>

      <div className="bg-[#F9FAFB] min-h-screen py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR BỘ LỌC */}
          <aside className="w-full lg:w-72 space-y-8 flex-shrink-0">
            <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  ></path>
                </svg>
                Danh Mục
              </h4>
              <div className="space-y-4">
                {[
                  "All",
                  "Music",
                  "Tech",
                  "Food",
                  "Art",
                  "Sports",
                  "Business",
                ].map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={
                        cat === "All"
                          ? selectedCategories.length === 0
                          : selectedCategories.includes(cat)
                      }
                      onChange={() => handleCategoryChange(cat)}
                      className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Thời Gian
              </h4>
              <div className="space-y-4">
                {["All", "This Weekend", "This Month", "Next Month"].map(
                  (date) => (
                    <label
                      key={date}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="date"
                        checked={selectedDate === date}
                        onChange={() => setSelectedDate(date)}
                        className="w-5 h-5 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">
                        {date}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </aside>

          {/* LƯỚI SỰ KIỆN - CHUẨN PREMIUM */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col"
                  >
                    {/* Nút thả tim */}
                    <button className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-sm">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>

                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      {event.badge && (
                        <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-white shadow-lg tracking-wider">
                          {event.badge}
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 uppercase tracking-widest">
                          {event.type}
                        </span>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {event.date.split("•")[0]}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[56px]">
                        {event.title}
                      </h3>

                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-6">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        {event.location.split(",")[0]}
                      </p>

                      <div className="mt-auto pt-5 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {event.attendees.map((avt, idx) => (
                            <img
                              key={idx}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              src={avt}
                              alt="Attendee"
                            />
                          ))}
                        </div>
                        <Link href={`/events/${event.id}`}>
                          <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors text-sm shadow-md active:scale-95">
                            {event.price === 0
                              ? "Free Ticket"
                              : `$${event.price}`}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-gray-100">
                  <div className="text-6xl mb-4">🏜️</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Không tìm thấy sự kiện
                  </h3>
                  <p className="text-gray-500">
                    Thử thay đổi bộ lọc hoặc xem lại sau nhé.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </UserLayout>
  );
}
