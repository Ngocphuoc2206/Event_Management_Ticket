/* eslint-disable @next/next/no-img-element */
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import { getAdminProfile, updateAdminProfile, type AdminProfile } from "@/features/admin/profile.service";
import { Camera, Save, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getAdminProfile();
        if (data) {
          setProfile(data);
          setFormData({
            fullName: data.fullName || "",
            phone: data.phone || "",
            bio: data.bio || "",
          });
        }
      } catch (error) {
        console.error("[v0] Failed to load admin profile:", error);
        setErrorMessage("Không thể tải thông tin cá nhân.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updated = await updateAdminProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
      });

      if (updated) {
        setProfile(updated);
        setSuccessMessage("Cập nhật thông tin cá nhân thành công.");
        setIsEditing(false);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Admin Profile">
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400 font-bold">Đang tải...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Profile">
      <div className="max-w-2xl animate-in fade-in duration-500">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 mb-8">
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="flex items-start gap-8 mb-8">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                <img
                  src={
                    profile?.avatar ||
                    `https://i.pravatar.cc/150?u=${profile?.email}`
                  }
                  className="w-full h-full object-cover"
                  alt={profile?.fullName}
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-xl border-4 border-white shadow-lg hover:bg-indigo-700 transition-all">
                <Camera size={16} />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                {profile?.fullName || "Admin User"}
              </h1>
              <p className="text-slate-600 font-bold mb-4">{profile?.email}</p>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100">
                  {profile?.role || "ADMIN"}
                </span>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 text-sm"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6 border-t border-slate-100 pt-8">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: profile?.fullName || "",
                      phone: profile?.phone || "",
                      bio: profile?.bio || "",
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60"
                >
                  <Save size={16} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 border-t border-slate-100 pt-8">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide mb-2">
                  Email Address
                </p>
                <p className="text-slate-900 font-bold">{profile?.email}</p>
              </div>

              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide mb-2">
                  Phone Number
                </p>
                <p className="text-slate-900 font-bold">
                  {profile?.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide mb-2">
                  Bio
                </p>
                <p className="text-slate-900 font-semibold whitespace-pre-wrap">
                  {profile?.bio || "No bio provided"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-[32px] p-8">
          <h3 className="text-lg font-black text-slate-900 mb-4">Account Security</h3>
          <p className="text-slate-600 font-semibold mb-6">
            Your account is secured with a strong password and two-factor authentication is available.
          </p>
          <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all active:scale-95">
            Change Password
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
