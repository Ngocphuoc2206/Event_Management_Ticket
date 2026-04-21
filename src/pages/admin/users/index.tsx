/* eslint-disable @next/next/no-img-element */
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import type { AdminUser } from "@/features/admin/users.service";
import { getAdminUsers } from "@/features/admin/users.service";
import { UserPlus, Search, Edit2, Trash2, Eye, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  ORGANIZER: "Organizer",
  CUSTOMER: "Customer",
};

function getRoleLabel(role?: string | null) {
  return role ? (ROLE_LABELS[role] ?? role) : "Unknown";
}

function getUserName(user: AdminUser) {
  return user.fullName?.trim() || user.email || user.id;
}

function getUserStatus(user: AdminUser) {
  return user.status || "ACTIVE";
}

function getUserAvatar(user: AdminUser) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(user.id || user.email)}`;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextUsers = await getAdminUsers();
      setUsers(nextUsers);
    } catch {
      setErrorMessage("Cannot load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
  }, []);

  const handleDeleteUser = () => {
    alert("Delete user API is not available yet.");
  };

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const roleLabel = getRoleLabel(user.role);
      const matchesSearch =
        !keyword ||
        getUserName(user).toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.phone?.toLowerCase().includes(keyword) ||
        user.id.toLowerCase().includes(keyword);
      const matchesRole =
        roleFilter === "All Roles" || roleLabel === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [roleFilter, searchTerm, users]);

  return (
    <AdminLayout title="">
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Managing {users.length} registered platform members
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadUsers}
              className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-full transition-all text-sm border border-slate-100 active:scale-95"
              disabled={isLoading}
            >
              <RefreshCcw
                size={17}
                strokeWidth={2.5}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <Link href="/admin/users/create">
              <button className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm shadow-lg shadow-indigo-100 active:scale-95">
                <UserPlus size={18} strokeWidth={2.5} />
                Add New User
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone or ID..."
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
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
              {errorMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 px-4">User Profile</th>
                  <th className="pb-6 text-center">Role</th>
                  <th className="pb-6 text-center">Phone</th>
                  <th className="pb-6 text-center">Status</th>
                  <th className="pb-6 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-xs font-black uppercase tracking-widest text-slate-400"
                    >
                      Loading users...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-xs font-black uppercase tracking-widest text-slate-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredUsers.map((user) => {
                    const roleLabel = getRoleLabel(user.role);
                    const userName = getUserName(user);
                    const status = getUserStatus(user);

                    return (
                      <tr
                        key={user.id}
                        className="group hover:bg-slate-50/50 transition-all"
                      >
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-slate-50">
                              <img
                                src={getUserAvatar(user)}
                                className="w-full h-full object-cover"
                                alt={userName}
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                {userName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                {user.id} - {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-6 text-center">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              roleLabel === "Admin"
                                ? "bg-purple-50 text-purple-600 border-purple-100"
                                : roleLabel === "Organizer"
                                  ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                  : "bg-slate-50 text-slate-600 border-slate-100"
                            }`}
                          >
                            * {roleLabel}
                          </span>
                        </td>

                        <td className="py-6 text-center">
                          <p className="text-sm font-black text-slate-700">
                            {user.phone || "N/A"}
                          </p>
                        </td>

                        <td className="py-6 text-center">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-rose-50 text-rose-600 border-rose-100"
                            }`}
                          >
                            * {status}
                          </span>
                        </td>

                        <td className="py-6 px-4">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Link href={`/admin/users/${user.id}`}>
                              <button
                                title="View Details"
                                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all active:scale-90"
                              >
                                <Eye size={18} />
                              </button>
                            </Link>
                            <button
                              title="Edit User"
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-100 transition-all active:scale-90"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={handleDeleteUser}
                              title="Delete User"
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-90"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
