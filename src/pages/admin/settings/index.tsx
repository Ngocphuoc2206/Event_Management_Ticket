import { useState, useEffect } from "react";
import AdminLayout from "@/components/templates/AdminLayout/AdminLayout";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
  Blocks,
  Upload,
  Trash2,
  Camera,
  Mail,
  Phone,
  Lock,
  UserPlus,
  Download,
  MoreVertical,
  X,
  Pencil,
  Pause,
  AlertCircle,
  UserMinus,
  Key,
  Smartphone,
  Monitor,
  CheckCircle2,
  MessageSquare,
  Github,
  Layout,
  PenTool,
  Database,
  ArrowUpRight,
} from "lucide-react";

const SETTINGS_TABS = [
  { id: "general", label: "General", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing & Plans", icon: CreditCard },
  { id: "team", label: "Team Members", icon: Users },
  { id: "integrations", label: "Integrations", icon: Blocks },
];

// Mock data cho Team Members
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex.m@example.com",
    initials: "AM",
    avatarColor: "bg-blue-100 text-blue-600",
    role: "Admin",
    roleColor: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
    status: "Active",
    date: "Oct 24, 2023",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.c@example.com",
    initials: "SC",
    avatarColor: "bg-purple-100 text-purple-600",
    role: "Editor",
    roleColor:
      "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-600/20",
    status: "Active",
    date: "Oct 12, 2023",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    initials: "MB",
    avatarColor: "bg-slate-100 text-slate-600",
    role: "Viewer",
    roleColor:
      "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20",
    status: "Inactive",
    date: "Sep 05, 2023",
  },
];

// Mock data cho Recent Activity
const RECENT_ACTIVITY = [
  {
    id: 1,
    action: "User invited",
    detail: "Sarah Chen was invited as Editor by Alex Morgan",
    time: "2 mins ago",
    icon: UserPlus,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    action: "Role updated",
    detail: "Michael Brown's role was changed from Viewer to Editor",
    time: "1 hour ago",
    icon: Shield,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    id: 3,
    action: "Member deactivated",
    detail: "John Doe was deactivated by Admin",
    time: "Yesterday",
    icon: UserMinus,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

// Mock data cho Active Sessions (Security)
const SESSIONS = [
  {
    id: 1,
    device: "MacBook Pro M2",
    browser: "Chrome on macOS",
    location: "Hanoi, Vietnam",
    time: "Active now",
    icon: Monitor,
    current: true,
  },
  {
    id: 2,
    device: "iPhone 14 Pro",
    browser: "Safari on iOS",
    location: "Hanoi, Vietnam",
    time: "2 hours ago",
    icon: Smartphone,
    current: false,
  },
];

// Mock data cho Billing History
const INVOICES = [
  { id: "INV-2023-10", date: "Oct 01, 2023", amount: "$49.00", status: "Paid" },
  { id: "INV-2023-09", date: "Sep 01, 2023", amount: "$49.00", status: "Paid" },
  { id: "INV-2023-08", date: "Aug 01, 2023", amount: "$49.00", status: "Paid" },
];

// Mock data cho Integrations
const INTEGRATIONS_LIST = [
  {
    id: "slack",
    name: "Slack",
    desc: "Send notifications to Slack channels",
    connected: true,
    icon: MessageSquare,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "github",
    name: "GitHub",
    desc: "Sync code repositories and commits",
    connected: false,
    icon: Github,
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "figma",
    name: "Figma",
    desc: "Embed designs and prototypes",
    connected: true,
    icon: PenTool,
    color: "bg-rose-100 text-rose-500",
  },
  {
    id: "notion",
    name: "Notion",
    desc: "Embed and sync workspace pages",
    connected: false,
    icon: Layout,
    color: "bg-slate-100 text-slate-800",
  },
  {
    id: "database",
    name: "AWS S3",
    desc: "Connect storage for file uploads",
    connected: false,
    icon: Database,
    color: "bg-amber-100 text-amber-600",
  },
];

// Component Toggle Switch
const Toggle = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`w-11 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${active ? "bg-indigo-600" : "bg-slate-200"}`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? "translate-x-5" : "translate-x-0"}`}
    />
  </div>
);

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // States cho modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deactivateMember, setDeactivateMember] = useState<{
    name: string;
  } | null>(null);
  const [newMemberActive, setNewMemberActive] = useState(true);

  // States cho Integrations Toggle
  const [integrations, setIntegrations] = useState(INTEGRATIONS_LIST);

  const toggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int,
      ),
    );
  };

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
              Platform Settings
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1.5">
              Manage your account details, preferences, and system
              configurations.
            </p>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full md:w-64 shrink-0 bg-white p-3 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-1 sticky top-6">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-indigo-400" : "text-slate-400"}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 w-full space-y-8">
            {/* 1. GENERAL TAB */}
            {activeTab === "general" && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-8">
                  {/* ... (Giữ nguyên code General Tab của bạn) ... */}
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Profile Information
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Update your photo and personal details here.
                    </p>
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                          <span className="text-2xl font-black text-indigo-500">
                            JD
                          </span>
                          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-3">
                          <button className="px-5 py-2 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-bold rounded-full transition-all text-sm flex items-center gap-2 shadow-sm">
                            <Upload size={14} /> Change Avatar
                          </button>
                          <button className="px-5 py-2 bg-white border border-transparent hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 font-bold rounded-full transition-all text-sm">
                            Remove
                          </button>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400 mt-3">
                          JPG, GIF or PNG. Max size of 5MB.
                        </p>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold text-slate-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                            size={18}
                          />
                          <input
                            type="email"
                            defaultValue="hello@johndoe.com"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <button className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:scale-95">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] border border-rose-100 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                  <div className="p-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-2">
                      <Lock size={20} className="text-rose-500" /> Danger Zone
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">
                      Permanently delete your account and all of your content.
                    </p>
                    <button className="px-6 py-2.5 bg-white border-2 border-rose-100 hover:bg-rose-50 text-rose-600 font-bold rounded-full transition-all text-sm flex items-center gap-2 shadow-sm">
                      <Trash2 size={16} /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-8">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Notifications
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Manage how you receive alerts and updates.
                    </p>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                          Receive daily summaries and updates.
                        </p>
                      </div>
                      <Toggle active={true} />
                    </div>
                    <hr className="border-slate-100" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">
                          Push Notifications
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                          Get real-time alerts on your device.
                        </p>
                      </div>
                      <Toggle active={true} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SECURITY TAB (MỚI) */}
            {activeTab === "security" && (
              <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                {/* Change Password */}
                <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Password & Authentication
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <button className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all text-sm active:scale-95">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Key size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        Add an extra layer of security to your account using an
                        authenticator app.
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold rounded-full transition-all text-sm whitespace-nowrap">
                    Enable 2FA
                  </button>
                </div>

                {/* Active Sessions */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Active Sessions
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Devices that have logged into your account. Revoke any
                      sessions that you do not recognize.
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {SESSIONS.map((session) => {
                      const Icon = session.icon;
                      return (
                        <div
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                              <Icon size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                {session.device}
                                {session.current && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider rounded-full">
                                    This Device
                                  </span>
                                )}
                              </h4>
                              <p className="text-sm text-slate-500 font-medium mt-0.5">
                                {session.browser} • {session.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <span className="text-sm font-semibold text-slate-400">
                              {session.time}
                            </span>
                            {!session.current && (
                              <button className="text-sm font-bold text-rose-500 hover:text-rose-600 hover:underline">
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. BILLING & PLANS TAB (MỚI) */}
            {activeTab === "billing" && (
              <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                {/* Current Plan */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[100px] -z-10"></div>
                  <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6 z-10">
                    <div>
                      <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-[11px] font-black uppercase tracking-widest rounded-full mb-3">
                        Current Plan
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                        Pro Plan
                      </h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        For small teams and growing businesses.
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <div className="text-4xl font-black text-slate-900 tracking-tighter">
                        $49
                        <span className="text-lg text-slate-400 font-bold">
                          /mo
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        Next payment on Nov 01, 2023
                      </p>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-auto flex-1 max-w-md">
                      <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                        <span>Team Members (3/5)</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[60%] h-full bg-indigo-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-full transition-all text-sm">
                        Cancel
                      </button>
                      <button className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]">
                        Upgrade Plan
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                      {/* Giả lập icon Visa/Mastercard */}
                      <span className="font-black text-slate-900 text-sm italic">
                        VISA
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">
                        •••• •••• •••• 4242
                      </h4>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">
                        Expires 12/24
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-full transition-all text-sm">
                    Update Method
                  </button>
                </div>

                {/* Billing History */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        Billing History
                      </h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        Download past invoices and receipts.
                      </p>
                    </div>
                    <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                      Download All <ArrowUpRight size={16} />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {INVOICES.map((invoice, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 w-1/3">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                            <CreditCard size={18} className="text-slate-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              {invoice.id}
                            </h4>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">
                              {invoice.date}
                            </p>
                          </div>
                        </div>
                        <div className="w-1/3 text-center text-sm font-bold text-slate-900">
                          {invoice.amount}
                        </div>
                        <div className="w-1/3 flex items-center justify-end gap-4">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
                            {invoice.status}
                          </span>
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. INTEGRATIONS TAB (MỚI) */}
            {activeTab === "integrations" && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-8">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Connected Apps
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Supercharge your workflow by connecting your favorite
                      tools.
                    </p>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
                    {integrations.map((app) => {
                      const Icon = app.icon;
                      return (
                        <div
                          key={app.id}
                          className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col hover:border-indigo-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${app.color}`}
                            >
                              <Icon size={24} />
                            </div>
                            <Toggle
                              active={app.connected}
                              onClick={() => toggleIntegration(app.id)}
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                              {app.name}
                              {app.connected && (
                                <CheckCircle2
                                  size={16}
                                  className="text-emerald-500"
                                />
                              )}
                            </h4>
                            <p className="text-sm text-slate-500 font-medium mt-1 min-h-[40px]">
                              {app.desc}
                            </p>
                          </div>
                          <div className="mt-6 pt-4 border-t border-slate-100">
                            <button
                              onClick={() => toggleIntegration(app.id)}
                              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                                app.connected
                                  ? "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                              }`}
                            >
                              {app.connected
                                ? "Configure Settings"
                                : "Connect App"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 6. TEAM MEMBERS TAB (Giữ nguyên) */}
            {activeTab === "team" && (
              <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                {/* ... (Team tab cũ của bạn, mình tóm tắt để đỡ rối code) ... */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        Team Members
                      </h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        Manage your team members and their account permissions
                        here.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold rounded-full transition-all text-sm flex items-center gap-2 shadow-md"
                      >
                        <UserPlus size={16} /> Add Member
                      </button>
                    </div>
                  </div>
                  {/* Table & Recent Activity giữ nguyên như file trước */}
                  <div className="p-8 text-center text-slate-500">
                    <p>Team Management content goes here...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OVERLAY MODALS (Cho Team Tab) */}
      {/* ... (Giữ nguyên các modal IsAddModalOpen, DeactivateMember) ... */}
    </AdminLayout>
  );
}
