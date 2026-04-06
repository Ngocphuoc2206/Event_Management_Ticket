import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { Users, UserPlus, Search, Filter, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MOCK_USERS = [
  { 
    id: "sarah-oenkins", 
    name: "Sarah oenkins", 
    email: "sarah.j@eventhub.com", 
    role: "Organizer", 
    status: "Active", 
    joinDate: "March 2022",
    avatar: "https://i.pravatar.cc/150?u=sarahj"
  },
  { 
    id: "alex", 
    name: "Alex", 
    email: "alex.admin@eventhub.com", 
    role: "Admin", 
    status: "Active", 
    joinDate: "December 2023",
    avatar: "https://i.pravatar.cc/150?u=alex"
  },
  { 
    id: "jonathan-doe", 
    name: "Jonathan Doe", 
    email: "jonathan@example.com", 
    role: "Customer", 
    status: "Active", 
    joinDate: "January 2024",
    avatar: "https://i.pravatar.cc/150?u=jonathan"
  },
 
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(MOCK_USERS); // Chuyển sang state để có thể xóa
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  // Logic Xử lý Xóa
  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user: ${name}?`)) {
      setUsers(users.filter(user => user.id !== id));
      alert("User deleted successfully!");
    }
  };

  // Logic lọc dữ liệu
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="User Management">
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-sm text-slate-500">Manage platform users, roles, and access levels.</p>
          </div>
          <Link href="/admin/users/create">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition-all font-bold shadow-lg shadow-blue-100">
              <UserPlus size={18} />
              Add New User
            </button>
          </Link>
        </div>

        {/* Filters bar */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              className="bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-sm font-bold outline-none focus:border-blue-500 text-slate-600 cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All Roles">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Organizer">Organizer</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">User Info</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" alt={user.name} />
                          <div>
                            <Link href={`/admin/users/${user.id}`}>
                                <div className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">{user.name}</div>
                            </Link>
                            <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 
                          user.role === 'Organizer' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          <span className={`text-sm font-bold ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-400">{user.joinDate}</td>
                      
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {/* VIEW DETAILS */}
                          <Link href={`/admin/users/${user.id}`}>
                            <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition-colors" title="View Details">
                                <Eye size={16} />
                            </button>
                          </Link>
                          {/* EDIT (Trigger alert for demo) */}
                          <button 
                            onClick={() => alert(`Edit mode for: ${user.name}`)}
                            className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition-colors" 
                            title="Edit User"
                          >
                            <Edit2 size={16} />
                          </button>
                          {/* DELETE */}
                          <button 
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors" 
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}  