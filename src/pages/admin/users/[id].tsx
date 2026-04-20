import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import type { AdminUser, AdminUserStatus } from "@/features/admin/users.service";
import { getAdminUser, updateAdminUserStatus } from "@/features/admin/users.service";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Mail,
  Key,
  ShieldAlert,
  CheckCircle2,
  Ban,
  Activity,
  Phone,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  ORGANIZER: "Organizer",
  CUSTOMER: "Customer",
};

function getRoleLabel(role?: string | null) {
  return role ? ROLE_LABELS[role] ?? role : "Unknown";
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

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!router.isReady || !id || Array.isArray(id)) {
      return;
    }

    let isMounted = true;

    const loadUser = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const user = await getAdminUser(id);
        if (isMounted) {
          setCurrentUser(user ?? null);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Cannot load user profile. Please try again.");
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [router.isReady, id]);

  const toggleUserStatus = async () => {
    if (!currentUser) return;

    const nextStatus: AdminUserStatus =
      getUserStatus(currentUser) === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setIsSavingStatus(true);
    setErrorMessage("");

    try {
      const updatedUser = await updateAdminUserStatus(currentUser.id, nextStatus);
      setCurrentUser(updatedUser ?? { ...currentUser, status: nextStatus });
    } catch {
      setErrorMessage("Cannot update user status. Please try again.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="User Profile">
        <div className="p-10 text-slate-500 font-black uppercase tracking-widest text-xs">Loading User Profile...</div>
      </AdminLayout>
    );
  }

  if (!currentUser) {
    return (
      <AdminLayout title="User Not Found">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <ShieldAlert size={64} className="text-slate-300" />
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tight">
            {errorMessage || "User not found!"}
          </h2>
          <Link href="/admin/users" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const roleLabel = getRoleLabel(currentUser.role);
  const status = getUserStatus(currentUser);
  const userName = getUserName(currentUser);

  return (
    <AdminLayout title="User Profile">
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link href="/admin/users" className="hover:text-indigo-600 transition-colors">Users</Link>
              <ChevronRight size={12} strokeWidth={3} />
              <span className="text-slate-900">{roleLabel} Profile</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin/users">
                <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95">
                  <ArrowLeft size={20} strokeWidth={3} />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{userName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    roleLabel === "Admin" ? "bg-purple-50 text-purple-600 border-purple-100" :
                    roleLabel === "Organizer" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                    "bg-slate-50 text-slate-600 border-slate-100"
                  }`}>
                    * {roleLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{currentUser.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${currentUser.email}`}
              className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Mail size={16} /> Contact User
            </a>
            <button className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2">
              <Key size={16} /> Reset Password
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Mail size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 break-all">{currentUser.email}</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <Phone size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{currentUser.phone || "N/A"}</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-600" /> Account Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</p>
                  <p className="font-black text-slate-900">{currentUser.fullName || "N/A"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Role</p>
                  <p className="font-black text-slate-900">{roleLabel}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">User ID</p>
                  <p className="font-black text-slate-900 break-all">{currentUser.id}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status</p>
                  <p className="font-black text-slate-900">{status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0 relative">
                  <img src={getUserAvatar(currentUser)} className="w-full h-full object-cover" alt={userName} />
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-tight">{userName}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{currentUser.email}</p>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                    <UserRound size={10} /> {roleLabel}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5 flex justify-between items-center border border-slate-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Status</p>
                  <p className="font-black text-slate-900 text-sm">{status}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  status === "ACTIVE" ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status === "ACTIVE" ? "bg-indigo-600" : "bg-rose-600"}`}></span>
                  {status}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Risk Management</h3>

              <button
                onClick={toggleUserStatus}
                disabled={isSavingStatus}
                className={`w-full py-4 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border disabled:opacity-60 ${
                  status === "ACTIVE"
                    ? "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <Ban size={16} strokeWidth={3} />
                {isSavingStatus
                  ? "Updating..."
                  : status === "ACTIVE"
                    ? "Suspend Account"
                    : "Activate Account"}
              </button>

              <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed mt-4 px-2">
                {status === "ACTIVE"
                  ? "Account suspension will disable this user's access."
                  : "Activating this account will restore access."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
