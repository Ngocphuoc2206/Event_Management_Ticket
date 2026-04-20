import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { 
  Search, TrendingUp, DollarSign, CreditCard, 
  ArrowUpRight, ArrowDownRight, Download, Activity,
  Filter, X, CheckCircle, XCircle, Building
} from "lucide-react";

// Mock data cho giao dịch tài chính
const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-8821",
    date: "Oct 24, 2023",
    time: "10:45 AM",
    description: "Ticket Sales: Neon Nights Festival",
    organizer: "Prism Events Inc.",
    amount: "+$12,500.00",
    type: "INCOME",
    status: "COMPLETED",
  },
  {
    id: "TXN-8820",
    date: "Oct 23, 2023",
    time: "04:20 PM",
    description: "Organizer Payout",
    organizer: "Next Ventures",
    amount: "-$8,400.00",
    type: "PAYOUT",
    status: "PENDING",
  },
  {
    id: "TXN-8819",
    date: "Oct 23, 2023",
    time: "11:15 AM",
    description: "Platform Fee Deduction",
    organizer: "System",
    amount: "+$450.00",
    type: "FEE",
    status: "COMPLETED",
  },
  {
    id: "TXN-8818",
    date: "Oct 22, 2023",
    time: "09:30 AM",
    description: "Ticket Sales: Gala Charity Dinner",
    organizer: "Hope Foundation",
    amount: "+$1,450.00",
    type: "INCOME",
    status: "COMPLETED",
  },
  {
    id: "TXN-8815",
    date: "Oct 20, 2023",
    time: "02:00 PM",
    description: "Refund: Art & Wine Walk",
    organizer: "Urban Creative",
    amount: "-$150.00",
    type: "REFUND",
    status: "PROCESSED",
  }
];

export default function FinanceManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [mounted, setMounted] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedPayout, setSelectedPayout] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "ALL" || tx.type === filterType;
    const matchesStatus = filterStatus === "ALL" || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleProcessPayoutsClick = () => {
    const pendingTx = transactions.find(t => t.type === 'PAYOUT' && t.status === 'PENDING');
    if (pendingTx) {
      setSelectedPayout(pendingTx);
    } else {
      alert("No pending payouts at the moment.");
    }
  };

  const handleActionPayout = (id: string, action: 'COMPLETED' | 'REJECTED') => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: action } : tx));
    setSelectedPayout(null);
  };

  if (!mounted) return null;

  return (
    <AdminLayout title=""> 
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10 relative">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Management</h1>
            <p className="text-sm text-slate-500 font-medium mt-1.5">
              Overview of platform finances, payouts, and incoming ticket sales.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-full transition-all text-sm border border-slate-200 flex items-center gap-2 shadow-sm hover:shadow">
              <Download size={16} /> Export CSV
            </button>
            <button 
              onClick={handleProcessPayoutsClick}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <CreditCard size={16} /> Process Payouts
            </button>
          </div>
        </div>

        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign size={24} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1.5 leading-tight">Total Volume</h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">Gross Ticket Sales (Oct)</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">$142,500</span>
              <span className="text-sm font-bold text-emerald-500 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full"><ArrowUpRight size={14} className="mr-0.5"/> 12.5%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl shadow-indigo-200/50 group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <TrendingUp size={24} className="text-indigo-200" />
                </div>
                <h3 className="text-xl font-black mb-1.5 leading-tight text-white">Platform Revenue</h3>
                <p className="text-indigo-200/80 text-[11px] font-bold uppercase tracking-widest mb-6">Net fees collected (5% cut)</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tight">$7,125.00</span>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-gradient-to-b from-amber-50 to-white p-8 rounded-[32px] border border-amber-100 flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
              <div className="w-12 h-12 bg-amber-100/50 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={24} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-amber-950 mb-1.5 leading-tight">Pending Payouts</h3>
              <p className="text-amber-700/60 text-[11px] font-bold uppercase tracking-widest mb-6">Owed to Organizers</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-600 tracking-tight">$24,800</span>
              <span className="text-xs font-black text-amber-700 bg-amber-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {transactions.filter(t => t.type === 'PAYOUT' && t.status === 'PENDING').length} REQs
              </span>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC CHART ĐƯỢC CHỈNH SỬA MỀM MẠI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Analytics (Bar Chart Mockup Mềm mại) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue Analytics</h3>
              <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none hover:bg-slate-100 cursor-pointer transition-colors focus:ring-2 focus:ring-indigo-500/20">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 md:gap-6 mt-4 px-2">
              {[
                { label: 'Mon', in: 40, out: 20 }, { label: 'Tue', in: 70, out: 30 },
                { label: 'Wed', in: 45, out: 15 }, { label: 'Thu', in: 90, out: 40 },
                { label: 'Fri', in: 60, out: 25 }, { label: 'Sat', in: 100, out: 50 },
                { label: 'Sun', in: 80, out: 35 }
              ].map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-full flex items-end justify-center gap-2 h-48 relative">
                    <div className="absolute w-full h-full flex items-end justify-center gap-2">
                      <div className="w-3 md:w-4 bg-slate-50 rounded-full h-full"></div>
                      <div className="w-3 md:w-4 bg-slate-50 rounded-full h-full"></div>
                    </div>
                    <div className="w-3 md:w-4 bg-indigo-200 group-hover:bg-indigo-300 transition-all duration-300 rounded-full z-10" style={{ height: `${day.out}%` }}></div>
                    <div className="w-3 md:w-4 bg-indigo-500 group-hover:bg-indigo-400 transition-all duration-300 rounded-full z-10 shadow-[0_4px_12px_rgba(99,102,241,0.25)] group-hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)]" style={{ height: `${day.in}%` }}></div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods (MỚI: Stacked Bar & Breakdown List) */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-black text-slate-900 tracking-tight">Payment Methods</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {/* Stacked Progress Bar */}
              <div className="w-full h-3 rounded-full flex overflow-hidden mb-8 shadow-inner bg-slate-100">
                <div className="bg-indigo-500 h-full shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all hover:brightness-110" style={{ width: '65%' }}></div>
                <div className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all hover:brightness-110 border-l border-white/20" style={{ width: '20%' }}></div>
                <div className="bg-amber-500 h-full shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all hover:brightness-110 border-l border-white/20" style={{ width: '15%' }}></div>
              </div>

              {/* Detailed Breakdown List */}
              <div className="space-y-5 w-full">
                
                {/* Credit Card */}
                <div className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm text-indigo-500 duration-300">
                      <CreditCard size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Credit Card</p>
                      <p className="text-[11px] font-semibold text-slate-400">Stripe & Visa</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 tracking-tight">65%</p>
                    <p className="text-[11px] font-bold text-indigo-500">+$92,625</p>
                  </div>
                </div>

                {/* PayPal */}
                <div className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm text-emerald-500 duration-300">
                       <DollarSign size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">PayPal</p>
                      <p className="text-[11px] font-semibold text-slate-400">Direct Transfers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 tracking-tight">20%</p>
                    <p className="text-[11px] font-bold text-emerald-500">+$28,500</p>
                  </div>
                </div>

                {/* Crypto */}
                <div className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm text-amber-500 duration-300">
                      <Activity size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Crypto</p>
                      <p className="text-[11px] font-semibold text-slate-400">USDC & ETH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 tracking-tight">15%</p>
                    <p className="text-[11px] font-bold text-amber-500">+$21,375</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR - NÂNG CẤP */}
        <div className="bg-white p-3 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-3 transition-all">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by TXN ID, organizer, or description..." 
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3.5 border rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shrink-0 transition-all ${
                showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
              }`}
            >
              <Filter size={16} /> Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-3 px-1 pb-1 animate-in slide-in-from-top-2 duration-300">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-sm"
              >
                <option value="ALL">All Types</option>
                <option value="INCOME">Income</option>
                <option value="PAYOUT">Payout</option>
                <option value="FEE">Fee</option>
                <option value="REFUND">Refund</option>
              </select>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSED">Processed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* TRANSACTIONS TABLE - NÂNG CẤP PIXEL-PERFECT */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-8 pb-6 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                  <th className="py-5 px-8 font-black">Transaction Details</th>
                  <th className="py-5 px-4 text-center font-black">Date & Time</th>
                  <th className="py-5 px-4 text-center font-black">Type</th>
                  <th className="py-5 px-4 text-right font-black">Amount</th>
                  <th className="py-5 px-8 text-center font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="group hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
                          txn.type === 'INCOME' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' :
                          txn.type === 'PAYOUT' ? 'bg-amber-50/50 border-amber-100 text-amber-600' :
                          txn.type === 'FEE' ? 'bg-indigo-50/50 border-indigo-100 text-indigo-600' :
                          'bg-rose-50/50 border-rose-100 text-rose-600'
                        }`}>
                          {txn.type === 'INCOME' || txn.type === 'FEE' ? <ArrowDownRight size={20} strokeWidth={2.5} /> : <ArrowUpRight size={20} strokeWidth={2.5} />}
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">{txn.description}</p>
                          <p className="text-[11px] text-slate-500 font-semibold mt-1">{txn.id} <span className="text-slate-300 mx-1">•</span> {txn.organizer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <p className="text-sm font-bold text-slate-800">{txn.date}</p>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">{txn.time}</p>
                    </td>
                    <td className="py-5 px-4 text-center">
                       <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-widest">{txn.type}</span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <p className={`text-base font-black tracking-tight ${
                        txn.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {txn.amount}
                      </p>
                    </td>
                    <td className="py-5 px-8 text-center">
                      {txn.status === 'PENDING' && txn.type === 'PAYOUT' ? (
                         <button 
                           onClick={() => setSelectedPayout(txn)}
                           className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all inline-block cursor-pointer shadow-sm hover:shadow active:scale-95"
                         >
                           Review Payout
                         </button>
                      ) : (
                        <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 ${
                          txn.status === 'COMPLETED' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200' :
                          txn.status === 'PROCESSED' ? 'bg-blue-50/50 text-blue-700 border-blue-200' :
                          txn.status === 'REJECTED' ? 'bg-rose-50/50 text-rose-700 border-rose-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            txn.status === 'COMPLETED' ? 'bg-emerald-500' :
                            txn.status === 'PROCESSED' ? 'bg-blue-500' :
                            txn.status === 'REJECTED' ? 'bg-rose-500' :
                            'bg-slate-400'
                          }`}></span>
                          {txn.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="text-slate-300 mb-3" size={32} />
                        <p className="text-slate-500 font-bold text-sm">No transactions found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- MODAL PAYOUT REVIEW - NÂNG CẤP PIXEL-PERFECT --- */}
      {selectedPayout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPayout(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            
            <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Payout Review</h2>
              <button onClick={() => setSelectedPayout(null)} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 bg-slate-50/50">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                 <div className="w-12 h-12 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-center">
                    <Building size={24} className="text-indigo-600" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Organizer</p>
                    <p className="font-bold text-slate-900 text-sm">{selectedPayout.organizer}</p>
                 </div>
              </div>

              <div className="text-center py-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Requested Amount</p>
                 <p className="text-5xl font-black text-slate-900 tracking-tighter">{selectedPayout.amount.replace('-', '')}</p>
                 <span className="inline-flex items-center justify-center gap-1.5 mt-4 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {selectedPayout.status}
                 </span>
              </div>

              <div className="space-y-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="flex justify-between items-center p-4 border-b border-slate-50 text-sm">
                    <span className="font-semibold text-slate-500">Transaction ID</span>
                    <span className="font-black text-slate-800">{selectedPayout.id}</span>
                 </div>
                 <div className="flex justify-between items-center p-4 text-sm">
                    <span className="font-semibold text-slate-500">Bank Account</span>
                    <span className="font-black text-slate-800">**** 4452 (Chase)</span>
                 </div>
              </div>
            </div>

            <div className="p-6 pt-4 flex gap-3 bg-white border-t border-slate-100">
               <button 
                 onClick={() => handleActionPayout(selectedPayout.id, 'REJECTED')}
                 className="flex-[1] py-3.5 flex items-center justify-center gap-2 rounded-xl bg-white border border-rose-200 text-rose-600 font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 transition-colors shadow-sm"
               >
                 <XCircle size={18} /> Reject
               </button>
               <button 
                 onClick={() => handleActionPayout(selectedPayout.id, 'COMPLETED')}
                 className="flex-[1.5] py-3.5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all active:scale-95"
               >
                 <CheckCircle size={18} /> Approve
               </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}