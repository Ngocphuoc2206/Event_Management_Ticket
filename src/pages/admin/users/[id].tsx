import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import {
  getAdminUser,
  updateAdminUserStatus,
  type AdminUser,
  type AdminUserStatus,
} from "@/features/admin/users.service";
import {
  AlertCircle,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  RefreshCcw,
  Unlock,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

function normalizeStatus(status?: string | null): AdminUserStatus {
  if (status === "INACTIVE" || status === "PENDING_VERIFICATION") {
    return status;
  }

  return "ACTIVE";
}

function getRoleLabel(role?: string | null) {
  if (!role) {
    return "Unknown";
  }

  return role;
}

function getAvatarSeed(user: AdminUser) {
  return user.email || user.id;
}

export default function UserDetailPage() {
  const router = useRouter();
  const userId = useMemo(() => {
    if (!router.isReady || !router.query.id) {
      return "";
    }

    return String(router.query.id);
  }, [router.isReady, router.query.id]);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUser = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextUser = await getAdminUser(userId);
      setUser(nextUser ?? null);
    } catch (error) {
      setUser(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải thông tin người dùng.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      void loadUser();
    }
  }, [loadUser, userId]);

  const handleToggleStatus = async () => {
    if (!user) {
      return;
    }

    const currentStatus = normalizeStatus(user.status);
    const nextStatus: AdminUserStatus =
      currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setIsStatusLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updated = await updateAdminUserStatus(user.id, nextStatus);
      if (updated) {
        setUser(updated);
        setSuccessMessage("Cập nhật trạng thái thành công.");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Cập nhật trạng thái thất bại.",
      );
    } finally {
      setIsStatusLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="User Detail">
        <div className="p-10 text-slate-500 font-black uppercase tracking-widest text-xs">
          Loading user profile...
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Not Found">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <AlertCircle size={64} className="text-slate-300" />
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tight">
            User not found
          </h2>
          <Link
            href="/admin/users"
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const status = normalizeStatus(user.status);

  return (
    <AdminLayout title="User Profile">
      <div className="max-w-3xl mx-auto pb-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-indigo-600 font-bold"
          >
            <ArrowLeft size={18} /> Back to Users
          </Link>

          <button
            onClick={() => void loadUser()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-4">
            <img
              src={`https://i.pravatar.cc/160?u=${encodeURIComponent(getAvatarSeed(user))}`}
              className="w-20 h-20 rounded-2xl border border-slate-100"
              alt={user.fullName || user.email}
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {user.fullName || user.email}
              </h1>
              <p className="text-sm text-slate-500 font-bold">{user.id}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Email
              </p>
              <p className="mt-2 text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail size={14} /> {user.email || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Phone
              </p>
              <p className="mt-2 text-sm font-bold text-slate-900 flex items-center gap-2">
                <Phone size={14} /> {user.phone || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Role
              </p>
              <p className="mt-2 text-sm font-bold text-slate-900 flex items-center gap-2">
                <User size={14} /> {getRoleLabel(user.role)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Status
              </p>
              <p className="mt-2 text-sm font-bold text-slate-900">
                {status}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <button
              onClick={() => void handleToggleStatus()}
              disabled={isStatusLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {status === "ACTIVE" ? <Lock size={16} /> : <Unlock size={16} />}
              {status === "ACTIVE" ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
