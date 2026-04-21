import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { 
  MessageSquare, BarChart3, Mail, Send, Search, Bell, HelpCircle, 
  Calendar, FileText, Download, Plus, Play, Clock, MoreVertical, 
  LayoutGrid, Share2 
} from "lucide-react";

// --- MOCK DATA ---
const RECENTLY_GENERATED = [
  { name: "Q3_Revenue_Forecast.pdf", date: "Oct 24, 2023", time: "14:20", size: "2.4 MB", type: "pdf" },
  { name: "User_Engagement_Logs.csv", date: "Oct 22, 2023", time: "09:15", size: "12.8 MB", type: "csv" },
  { name: "Monthly_Tax_Export.pdf", date: "Oct 20, 2023", time: "23:45", size: "1.1 MB", type: "pdf" },
];

const SCHEDULED_REPORTS = [
  { title: "Weekly Sales Summary", schedule: "Every Monday, 06:00 AM", tags: ["PDF + CSV"], avatars: ["AM", "JD"] },
  { title: "Investor Dashboard Export", schedule: "Monthly, 1st Day", tags: ["EXCEL"], avatars: ["RS"] },
];

export default function SupportHubPage() {
  const [activeTab, setActiveTab] = useState<'support' | 'report'>('support');
  const [mounted, setMounted] = useState(false);
  const [granularity, setGranularity] = useState("Daily");

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // --- SUB-COMPONENTS (RENDER HELPERS) ---
  
  const renderSupportTab = () => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-3xl animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Submit a Support Request</h2>
      <form className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Support Topic</label>
          <select className="p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100">
            <option>System Bug Report</option>
            <option>Feature Request</option>
            <option>Billing / Account Issue</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Detailed Description</label>
          <textarea rows={5} className="p-3 border border-slate-200 rounded-xl bg-slate-50 resize-none outline-none focus:ring-2 focus:ring-blue-100" placeholder="Describe the issue..." />
        </div>
        <div className="flex justify-end pt-2">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3b49df] hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm">
            <Send size={16} /> Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );

  const renderReportsTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      {/* Search & Header */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search report parameters..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="flex items-center gap-5 text-slate-500">
          <div className="relative cursor-pointer"><Bell size={22} /><span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span></div>
          <HelpCircle size={22} className="cursor-pointer" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 text-slate-900 font-black rounded-[20px] shadow-sm"><Clock className="text-indigo-600" size={20} /> Schedule Report</button>
        <button className="flex items-center gap-3 px-6 py-4 bg-[#3b49df] text-white font-black rounded-[20px] shadow-lg shadow-indigo-100"><Plus size={20} /> Generate Custom</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h2 className="text-xl font-[1000] text-slate-900">Generate Custom Report</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"><option>Financial Summary</option></select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Granularity</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  {["Daily", "Monthly"].map(t => (
                    <button key={t} onClick={() => setGranularity(t)} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${granularity === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 italic">Estimated: 45 seconds</p>
              <button className="flex items-center gap-3 px-10 py-4 bg-[#3b49df] text-white font-black rounded-2xl shadow-xl">Run Engine <Play size={16} fill="white" /></button>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
            <h2 className="text-xl font-[1000] text-slate-900 mb-6">Recently Generated</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50"><th className="pb-4">Name</th><th className="pb-4">Date</th><th className="text-right pb-4">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENTLY_GENERATED.map((r, i) => (
                  <tr key={i} className="group">
                    <td className="py-5 font-black text-slate-700 text-sm">{r.name}</td>
                    <td className="py-5 text-sm text-slate-500">{r.date}</td>
                    <td className="py-5 text-right"><button className="p-2 text-indigo-600 bg-indigo-50 rounded-xl"><Download size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100 h-full">
             <div className="flex items-center gap-3 mb-8"><Calendar className="text-indigo-600" /><h3 className="font-black text-slate-900">Scheduled Reports</h3></div>
             {SCHEDULED_REPORTS.map((item, i) => (
               <div key={i} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm mb-4">
                 <h4 className="font-black text-slate-800 text-sm mb-1">{item.title}</h4>
                 <p className="text-[11px] text-slate-400 font-bold">{item.schedule}</p>
               </div>
             ))}
             <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-6 text-center cursor-pointer hover:bg-white transition-all">
                <Plus className="mx-auto text-slate-300 mb-2" />
                <p className="font-black text-sm text-slate-800">New Automation</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <AdminLayout>
      <div className="p-6 max-w-[1600px] mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Support & Information Center</h1>
          <p className="text-slate-500 text-sm">Please select a category to view or send us your feedback.</p>
        </header>

        {/* Tabs Navigation */}
        <nav className="flex border-b border-slate-200 mb-6">
          {[
            { id: 'support', label: 'Feedback & Support', icon: MessageSquare },
            { id: 'report', label: 'Platform Reports', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${
                activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        {/* Dynamic Content */}
        <main>
          {activeTab === 'support' ? renderSupportTab() : renderReportsTab()}
        </main>

        {/* Footer actions */}
        <footer className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400">© 2023 EventHub Admin Panel. <span className="text-emerald-500">System Stable</span></p>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500"><Share2 size={18}/></button>
            <button className="flex items-center gap-3 px-8 py-4 bg-[#3b49df] text-white font-black rounded-2xl shadow-lg shadow-indigo-100"><Mail size={18} /> Send Archive</button>
          </div>
        </footer>
      </div>
    </AdminLayout>
  );
}