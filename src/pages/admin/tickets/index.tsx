import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { 
  Ticket, Tag, QrCode, TrendingUp, Search, 
  Settings, PauseCircle, PlayCircle, Edit3, X
} from "lucide-react";

// Mock data: Quản lý Hạng vé theo Sự kiện
const TICKET_TIERS = [
  {
    id: "TIER-01",
    event: "Neon Nights Festival",
    tierName: "EARLY BIRD",
    price: "$45.00",
    sold: 1500,
    capacity: 1500,
    revenue: "$67,500",
    status: "SOLD_OUT",
    scanRate: "0%"
  },
  {
    id: "TIER-02",
    event: "Neon Nights Festival",
    tierName: "VIP PASS",
    price: "$150.00",
    sold: 420,
    capacity: 500,
    revenue: "$63,000",
    status: "ON_SALE",
    scanRate: "0%"
  },
  {
    id: "TIER-03",
    event: "Tech Innovators Summit",
    tierName: "STANDARD",
    price: "$299.00",
    sold: 1850,
    capacity: 2000,
    revenue: "$553,150",
    status: "ON_SALE",
    scanRate: "85%"
  },
  {
    id: "TIER-04",
    event: "Underground Rap Battle",
    tierName: "GENERAL",
    price: "$25.00",
    sold: 120,
    capacity: 300,
    revenue: "$3,000",
    status: "PAUSED",
    scanRate: "0%"
  }
];

export default function TicketManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hàm xử lý khi submit form (Hiện tại chỉ mock alert và đóng modal)
  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Discount code created successfully!");
    setIsModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <AdminLayout title=""> 
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10 relative">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ticket Pricing & Tiers</h1>
            <p className="text-sm text-slate-500 font-medium mt-1.5">
              Manage ticket categories, adjust pricing, and monitor sales capacity.
            </p>
          </div>
          {/* Nút kích hoạt Modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:translate-y-0 flex items-center gap-2"
          >
            <Tag size={16} /> Create Discount Code
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Ticket size={24} className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1.5">Total Tickets Sold</h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">Across all active events</p>
            <span className="text-4xl font-black text-slate-900 tracking-tight">38,450</span>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={24} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1.5">Avg. Ticket Price</h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">Platform average</p>
            <span className="text-4xl font-black text-slate-900 tracking-tight">$85.50</span>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
              <QrCode size={24} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1.5">Global Scan Rate</h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">Attendees checked in</p>
            <span className="text-4xl font-black text-slate-900 tracking-tight">76.2%</span>
          </div>
        </div>

        {/* TICKET TIERS TABLE */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-8 pb-6 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Ticket Tiers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                  <th className="py-5 px-8 font-black">Event & Tier</th>
                  <th className="py-5 px-4 text-center font-black">Price</th>
                  <th className="py-5 px-4 text-center font-black">Sold / Capacity</th>
                  <th className="py-5 px-8 text-center font-black">Status</th>
                  <th className="py-5 px-4 text-center font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {TICKET_TIERS.map((tier) => (
                  <tr key={tier.id} className="group hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-5 px-8">
                      <div className="flex flex-col justify-center">
                        <p className="font-bold text-slate-900 text-sm">{tier.event}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                            tier.tierName.includes('VIP') ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {tier.tierName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">{tier.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <p className="text-base font-black text-emerald-600 tracking-tight">{tier.price}</p>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <p className="text-sm font-black text-slate-900 tracking-tight">{tier.sold} <span className="text-slate-400 text-xs font-semibold">/ {tier.capacity}</span></p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${tier.sold === tier.capacity ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${(tier.sold / tier.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 ${
                        tier.status === 'ON_SALE' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200' :
                        tier.status === 'PAUSED' ? 'bg-amber-50/50 text-amber-700 border-amber-200' :
                        'bg-rose-50/50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          tier.status === 'ON_SALE' ? 'bg-emerald-500' :
                          tier.status === 'PAUSED' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}></span>
                        {tier.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm">
                          <Edit3 size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all shadow-sm">
                          {tier.status === 'ON_SALE' ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE DISCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Create Discount Code</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateDiscount}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Discount Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SUMMER2024" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold text-slate-900 uppercase"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold text-slate-900 cursor-pointer">
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Value</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 20" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Apply To Tier</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold text-slate-900 cursor-pointer">
                    <option value="all">All Active Tiers</option>
                    {TICKET_TIERS.filter(t => t.status === 'ON_SALE').map(tier => (
                      <option key={tier.id} value={tier.id}>{tier.event} - {tier.tierName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Usage Limit</label>
                  <input 
                    type="number" 
                    placeholder="Leave empty for unlimited" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[24px]">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Create Code
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}