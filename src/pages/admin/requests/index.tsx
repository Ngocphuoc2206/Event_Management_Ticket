import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import {
  Building2,
  BadgeCheck,
  ShieldAlert,
  DollarSign,
  Calendar,
  MoreVertical,
  CheckCircle,
  Ban,
} from "lucide-react";

// Mock data: Danh sách Ban tổ chức
const ORGANIZERS = [
  {
    id: "ORG-001",
    name: "Prism Events Inc.",
    email: "contact@prismevents.co",
    eventsCount: 12,
    totalRevenue: "$450,200",
    status: "VERIFIED", // Đã xác minh có tick xanh
  },
  {
    id: "ORG-002",
    name: "Next Ventures",
    email: "hello@nextventures.io",
    eventsCount: 3,
    totalRevenue: "$82,500",
    status: "PENDING_KYC", // Đang chờ duyệt hồ sơ
  },
  {
    id: "ORG-003",
    name: "Street Beatz",
    email: "admin@streetbeatz.com",
    eventsCount: 5,
    totalRevenue: "$15,000",
    status: "ACTIVE", // Đang hoạt động bình thường (chưa verified)
  },
  {
    id: "ORG-004",
    name: "Scammy Tickets LLC",
    email: "fake@scamevents.net",
    eventsCount: 0,
    totalRevenue: "$0",
    status: "SUSPENDED", // Bị khóa
  },
];

export default function OrganizerManagementPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AdminLayout title="">
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10 relative">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Organizer Directory
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1.5">
              Verify organizers, monitor platform partners, and manage account
              statuses.
            </p>
          </div>
        </div>

        {/* KPI CARDS (Gradient Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl shadow-indigo-200/50 group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Building2 size={24} className="text-indigo-200" />
                </div>
                <h3 className="text-xl font-black mb-1.5 leading-tight text-white">
                  Total Organizers
                </h3>
                <p className="text-indigo-200/80 text-[11px] font-bold uppercase tracking-widest mb-6">
                  Registered entities
                </p>
              </div>
              <span className="text-4xl font-black text-white tracking-tight">
                1,248
              </span>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <BadgeCheck size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1.5">
                Verified Partners
              </h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">
                KYC Approved
              </p>
            </div>
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              856
            </span>
          </div>

          <div className="bg-gradient-to-b from-rose-50 to-white p-8 rounded-[32px] border border-rose-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-100/50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={24} className="text-rose-600" />
              </div>
              <h3 className="text-xl font-black text-rose-950 mb-1.5">
                Pending Review
              </h3>
              <p className="text-rose-700/60 text-[11px] font-bold uppercase tracking-widest mb-6">
                Action Required
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-rose-600 tracking-tight">
                14
              </span>
              <span className="text-xs font-black text-rose-700 bg-rose-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Requests
              </span>
            </div>
          </div>
        </div>

        {/* ORGANIZER TABLE */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-8 pb-6 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Partner List
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                  <th className="py-5 px-8 font-black">Organizer Profile</th>
                  <th className="py-5 px-4 text-center font-black">
                    Events Hosted
                  </th>
                  <th className="py-5 px-4 text-center font-black">
                    Gross Revenue
                  </th>
                  <th className="py-5 px-8 text-center font-black">Status</th>
                  <th className="py-5 px-4 text-center font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {ORGANIZERS.map((org) => (
                  <tr
                    key={org.id}
                    className="group hover:bg-slate-50/70 transition-colors duration-200"
                  >
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <Building2 size={18} className="text-slate-400" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm flex items-center gap-1.5">
                            {org.name}
                            {org.status === "VERIFIED" && (
                              <BadgeCheck
                                size={14}
                                className="text-blue-500"
                                fill="#eff6ff"
                              />
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-semibold mt-1">
                            {org.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                        <Calendar size={14} className="text-slate-400" />{" "}
                        {org.eventsCount}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <p className="text-base font-black text-emerald-600 tracking-tight">
                        {org.totalRevenue}
                      </p>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <span
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 ${
                          org.status === "VERIFIED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : org.status === "PENDING_KYC"
                              ? "bg-amber-50/50 text-amber-700 border-amber-200"
                              : org.status === "SUSPENDED"
                                ? "bg-rose-50/50 text-rose-700 border-rose-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            org.status === "VERIFIED"
                              ? "bg-blue-500"
                              : org.status === "PENDING_KYC"
                                ? "bg-amber-500"
                                : org.status === "SUSPENDED"
                                  ? "bg-rose-500"
                                  : "bg-slate-400"
                          }`}
                        ></span>
                        {org.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      {org.status === "PENDING_KYC" ? (
                        <button className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm active:scale-95 flex items-center gap-1 mx-auto">
                          <CheckCircle size={12} /> Verify
                        </button>
                      ) : (
                        <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm mx-auto">
                          <Ban size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
