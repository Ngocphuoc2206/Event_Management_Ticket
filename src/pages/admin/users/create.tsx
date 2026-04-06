import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { ArrowLeft, User, Shield, Lock, Save, Mail, Phone, Info } from "lucide-react";
import Link from "next/link";

export default function CreateUserPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto pb-10">
        {/* Navigation */}
        <Link href="/admin/users" className="group flex items-center gap-2 text-indigo-600 mb-6 w-fit transition-all">
          <div className="p-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold">Back to User Management</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New User</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure account settings and platform permissions.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Section 1: Personal Info */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <User size={80} />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-inner"><User size={20} /></div>
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="e.g. Jonathan Doe" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" placeholder="jonathan@example.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 h-[50px]">
                  <span className="text-sm font-bold text-slate-700">Account Status</span>
                  <label className="relative inline-flex items-center cursor-pointer ml-auto">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-bold text-emerald-600">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Role & Permissions */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shadow-inner"><Shield size={20} /></div>
              <h2 className="text-xl font-bold text-slate-900">Account Role & Permissions</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">User Role</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium">
                  <option>Customer</option>
                  <option>Admin</option>
                  <option>Organizer</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Financial Access", desc: "View revenue reports" },
                  { label: "Event Editor", desc: "Can modify event details" },
                  { label: "User Support", desc: "Access to help tickets" },
                  { label: "Global Approval", desc: "Approve public events" }
                ].map((perm) => (
                  <label key={perm.label} className="flex items-start gap-4 p-4 border border-slate-100 bg-slate-50/30 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">{perm.label}</div>
                      <div className="text-xs text-slate-500">{perm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Credentials */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm border-l-4 border-l-amber-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shadow-inner"><Lock size={20} /></div>
              <h2 className="text-xl font-bold text-slate-900">Security & Credentials</h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 bg-amber-50/50 rounded-2xl">
              <div className="p-3 bg-white rounded-xl shadow-sm"><Info className="text-amber-600" size={24} /></div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">Initial Password</div>
                <div className="text-xs text-slate-600">An invitation link will be sent to the user's email to set their password.</div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600" defaultChecked />
                <span className="text-sm font-bold text-slate-700">Force password change</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/admin/users">
              <button type="button" className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
            </Link>
            <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <Save size={18} />
              Create User
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}