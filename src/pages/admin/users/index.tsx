import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { UserPlus, Search, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MOCK_USERS = [
  { 
    id: "USR-9921", 
    name: "Sarah Jenkins", 
    email: "sarah.j@eventhub.com", 
    role: "Organizer", 
    status: "ACTIVE", 
    joinDate: "Oct 24, 2023",
    time: "10:45 AM",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  { 
    id: "USR-9918", 
    name: "Alex Admin", 
    email: "alex.admin@eventhub.com", 
    role: "Admin", 
    status: "ACTIVE", 
    joinDate: "Oct 23, 2023",
    time: "03:20 PM",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  { 
    id: "USR-9915", 
    name: "Jonathan Doe", 
    email: "jonathan@example.com", 
    role: "Customer", 
    status: "INACTIVE", 
    joinDate: "Oct 21, 2023",
    time: "09:12 AM",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop"
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user: ${name}?`)) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title=""> 
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
        
        {/* HEADER SECTION - Đồng bộ H1 3xl font-black và Subtitle như Events */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Managing {users.length} registered platform members
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/users/create">
              <button className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm shadow-lg shadow-indigo-100 active:scale-95">
                <UserPlus size={18} strokeWidth={2.5} />
                Add New User
              </button>
            </Link>
          </div>
        </div>

        {/* SEARCH BAR - Đồng bộ khối bo góc 32px và thẻ input bo tròn như Events */}
        <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-50 border border-slate-100 rounded-full px-8 py-4 text-sm font-black outline-none focus:border-indigo-500 text-slate-600 cursor-pointer w-full md:w-auto"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All Roles">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Organizer">Organizer</option>
            <option value="Customer">Customer</option>
          </select>
        </div>

        {/* TABLE SECTION - Đồng bộ khối bo góc 40px và style text y hệt Events */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 px-4">User Profile</th>
                  <th className="pb-6 text-center">Role</th>
                  <th className="pb-6 text-center">Join Date & Time</th>
                  <th className="pb-6 text-center">Status</th>
                  <th className="pb-6 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar đồng bộ với Event Image */}
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-slate-50">
                          <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{user.id} • {user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        user.role === 'Organizer' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        • {user.role}
                      </span>
                    </td>

                    <td className="py-6 text-center">
                      <p className="text-sm font-black text-slate-700">{user.joinDate}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{user.time}</p>
                    </td>

                    <td className="py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        • {user.status}
                      </span>
                    </td>

                    <td className="py-6 px-4">
                      {/* ACTION BUTTONS - Đồng bộ w-9 h-9 bo góc 12px giống Events */}
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Link href={`/admin/users/${user.id}`}>
                          <button title="View Details" className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all active:scale-90">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <button title="Edit User" className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-100 transition-all active:scale-90">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id, user.name)} title="Delete User" className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-90">
                          <Trash2 size={18} />
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
    </AdminLayout>
  );
}