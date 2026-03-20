import UserLayout from "@/components/templates/UserLayout/UserLayout";
import Link from "next/link";

// Dữ liệu phong phú và sinh động hơn
const FEATURED_EVENTS = [
  {
    id: 1,
    title: "Neon Nights: Techno Festival",
    type: "CONCERT",
    date: "Oct 18 • 9:00 PM",
    location: "Warehouse 42, Los Angeles",
    price: "$45",
    badge: "🔥 HOT",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop",
    attendees: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3"
    ]
  },
  {
    id: 2,
    title: "Global AI & Tech Summit 2024",
    type: "CONFERENCE",
    date: "Nov 02 • 8:00 AM",
    location: "Innovation Hub, SF",
    price: "$199",
    badge: "SELLING FAST",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    attendees: [
      "https://i.pravatar.cc/150?img=4",
      "https://i.pravatar.cc/150?img=5",
      "https://i.pravatar.cc/150?img=6"
    ]
  },
  {
    id: 3,
    title: "Midnight Food & Wine Expo",
    type: "LIFESTYLE",
    date: "Oct 20 • 6:00 PM",
    location: "Waterfront Park, Seattle",
    price: "$25",
    badge: null,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
    attendees: [
      "https://i.pravatar.cc/150?img=7",
      "https://i.pravatar.cc/150?img=8",
      "https://i.pravatar.cc/150?img=9"
    ]
  }
];

const CATEGORIES = [
  { name: "Music", icon: "🎸", bg: "bg-rose-100", text: "text-rose-600" },
  { name: "Tech", icon: "💻", bg: "bg-blue-100", text: "text-blue-600" },
  { name: "Art", icon: "🎨", bg: "bg-purple-100", text: "text-purple-600" },
  { name: "Food", icon: "🍔", bg: "bg-orange-100", text: "text-orange-600" },
  { name: "Sports", icon: "⚽", bg: "bg-emerald-100", text: "text-emerald-600" },
  { name: "Business", icon: "💼", bg: "bg-slate-100", text: "text-slate-600" },
];

export default function HomePage() {
  return (
    <UserLayout title="Home">
      {/* 1. HERO SECTION - CỰC KỲ SINH ĐỘNG VỚI ẢNH NỀN VÀ KÍNH MỜ */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-20 pb-32 px-6">
        {/* Ảnh nền */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAFB] to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full mt-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-bold tracking-widest uppercase mb-6 shadow-xl">
            🎉 Mở ra thế giới sự kiện
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] drop-shadow-2xl">
            Trải Nghiệm <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Không Giới Hạn</span>
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto font-medium drop-shadow-md">
            Tìm kiếm hàng ngàn sự kiện âm nhạc, hội thảo công nghệ và lễ hội ẩm thực đỉnh cao đang diễn ra quanh bạn.
          </p>

          {/* SEARCH BAR - Glassmorphism cao cấp */}
          <div className="mt-12 flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-xl p-2 rounded-3xl md:rounded-[32px] shadow-2xl max-w-4xl mx-auto border border-white/20">
            <div className="flex items-center flex-1 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-white/20 text-white">
              <svg className="w-6 h-6 mr-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Tìm tên sự kiện, nghệ sĩ..." className="w-full bg-transparent outline-none text-white placeholder:text-white/70 font-medium text-lg" />
            </div>
            <div className="flex items-center flex-1 px-6 py-4 w-full text-white">
              <svg className="w-6 h-6 mr-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <input type="text" placeholder="Hồ Chí Minh" className="w-full bg-transparent outline-none text-white placeholder:text-white/70 font-medium text-lg" />
            </div>
            <Link href="/events" className="w-full md:w-auto p-2">
              <button className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg text-lg">
                Tìm Kiếm Ngay
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION - Dạng Pill sinh động */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-20 -mt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-white border border-gray-100 p-4 rounded-3xl flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group shadow-sm">
              <div className={`w-12 h-12 ${cat.bg} ${cat.text} rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <p className="font-bold text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED EVENTS SECTION - THẺ SỰ KIỆN CAO CẤP */}
      <section className="max-w-7xl mx-auto px-6 py-10 bg-[#F9FAFB]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-indigo-600 font-black text-sm uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full inline-block mb-4">Mới Nhất</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Sự Kiện Nổi Bật</h2>
          </div>
          <Link href="/events">
            <button className="text-indigo-600 font-bold hover:bg-indigo-50 px-6 py-3 rounded-full transition-all flex items-center gap-2 border border-indigo-100">
              Xem tất cả sự kiện
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_EVENTS.map((event) => (
            <div key={event.id} className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col">
              
              {/* Nút thả tim góc phải */}
              <button className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>

              <div className="relative h-60 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {/* Gradient đen dưới chân ảnh để làm nổi bật text nếu có */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {event.badge && (
                  <div className="absolute top-5 left-5 bg-red-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-white shadow-lg">
                    {event.badge}
                  </div>
                )}
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                    {event.type}
                  </span>
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {event.date}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-base text-gray-500 flex items-center gap-2 mb-6">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {event.location}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                   {/* Dải Avatar những người tham gia */}
                   <div className="flex -space-x-3">
                     {event.attendees.map((avt, idx) => (
                       <img key={idx} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src={avt} alt="Attendee" />
                     ))}
                     <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                       +99
                     </div>
                   </div>

                   <Link href={`/events/${event.id}`}>
                      <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-colors text-sm shadow-md active:scale-95">
                        Mua vé {event.price}
                      </button>
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION - Nền gradient sống động */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-[40px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Họa tiết trang trí */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg">Bạn không muốn bỏ lỡ?</h2>
            <p className="text-indigo-200 mb-10 text-xl max-w-2xl mx-auto">Nhận thông báo sớm nhất về các sự kiện giảm giá và vé early bird ngay trong tuần này.</p>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/20">
              <input type="email" placeholder="Nhập email của bạn..." className="bg-transparent border-none outline-none flex-1 px-6 py-4 text-white placeholder:text-indigo-200 text-lg" />
              <button className="bg-white text-indigo-900 px-10 py-4 rounded-full font-black hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}