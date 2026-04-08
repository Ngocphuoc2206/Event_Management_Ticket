import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useId, useMemo, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { changeUserPassword, getUserProfile, updateUserProfile } from "@/features/auth/services/profile.service";
import type { UserProfileResponse } from "@/features/auth/types";
import {
  getApiErrorMessage,
  getApiResultData,
  getApiResultMessage,
  getStoredAccessToken,
  resolveAuthPayload,
} from "@/features/auth/utils";
import { CustomerDashboardSidebar, customerProfile } from "@/features/customer";
import type { CustomerNavItem, CustomerProfile } from "@/features/customer";

type ProfileFormValues = {
  fullName: string;
  phone: string;
  bio: string;
  avatar: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type NoticeTone = "error" | "success" | "warning";

type ToggleSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const customerProfileNavigationItems: CustomerNavItem[] = [
  { label: "Dashboard", href: "/customer", icon: "grid" },
  { label: "My Tickets", href: "/customer/my-tickets", icon: "ticket" },
  { label: "Order History", href: "/customer/order-history", icon: "history" },
  { label: "Notifications", href: "/customer/notifications", icon: "bell" },
  { label: "Profile Settings", href: "/customer/profile-settings", icon: "settings", active: true },
];

const PHONE_PATTERN = /^[0-9+\s()-]{8,20}$/;

const INITIAL_PROFILE_VALUES: ProfileFormValues = {
  fullName: customerProfile.name,
  phone: "",
  bio: "",
  avatar: "",
};

const INITIAL_PASSWORD_VALUES: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const INITIAL_NOTIFICATION_SETTINGS: ToggleSetting[] = [
  { id: "order-confirmations", title: "Order confirmations", description: "Get receipts via email", enabled: true },
  { id: "event-reminders", title: "Event reminders", description: "24h before event starts", enabled: true },
  { id: "marketing", title: "Marketing", description: "New events near you", enabled: false },
  { id: "sms", title: "SMS Notifications", description: "Text alerts to your number", enabled: false },
  { id: "push", title: "Push Notifications", description: "Browser and app alerts", enabled: true },
];

function NoticeBanner({ message, tone }: { message: string; tone: NoticeTone }) {
  const toneStyles = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  } as const;

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneStyles[tone]}`}>{message}</div>;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{children}</div>;
}

function InputField({
  hasError,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      className={`h-14 w-full rounded-xl border bg-[#f3f5f9] px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
        hasError ? "border-rose-300 focus:border-rose-400" : "border-transparent focus:border-blue-400"
      } ${className}`}
    />
  );
}

function TextAreaField({
  hasError,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) {
  return (
    <textarea
      {...props}
      className={`min-h-[92px] w-full resize-none rounded-xl border bg-[#f3f5f9] px-4 py-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
        hasError ? "border-rose-300 focus:border-rose-400" : "border-transparent focus:border-blue-400"
      } ${className}`}
    />
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
    </label>
  );
}

function ToggleRow({ item, onToggle }: { item: ToggleSetting; onToggle: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm font-semibold text-slate-800">{item.title}</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">{item.description}</div>
      </div>
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        aria-pressed={item.enabled}
        className={`relative h-7 w-12 rounded-full transition ${
          item.enabled ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            item.enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = useMemo(() => {
    let nextScore = 0;
    if (password.length >= 8) nextScore += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) nextScore += 1;
    if (/[0-9]/.test(password)) nextScore += 1;
    if (/[^A-Za-z0-9]/.test(password)) nextScore += 1;
    return nextScore;
  }, [password]);

  const widthClass = ["w-0", "w-1/4", "w-2/4", "w-3/4", "w-full"][score];
  const colorClass = ["bg-slate-200", "bg-rose-400", "bg-amber-400", "bg-blue-500", "bg-emerald-500"][score];
  const label = ["Too weak", "Weak", "Fair", "Strong", "Very strong"][score];

  return (
    <div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className={`h-2 rounded-full transition-all ${widthClass} ${colorClass}`} />
      </div>
      <div className="mt-2 text-xs text-slate-500">{label}</div>
    </div>
  );
}

export default function CustomerProfileSettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const fileInputId = useId();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
  const [profileNotice, setProfileNotice] = useState<{ tone: NoticeTone; message: string } | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<{ tone: Exclude<NoticeTone, "warning">; message: string } | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string>(customerProfile.avatarSrc);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState(INITIAL_NOTIFICATION_SETTINGS);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    setValue: setProfileValue,
    watch: watchProfile,
    formState: { errors: profileErrors, isSubmitting: isSavingProfile },
  } = useForm<ProfileFormValues>({
    defaultValues: INITIAL_PROFILE_VALUES,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch: watchPassword,
    getValues: getPasswordValues,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
  } = useForm<PasswordFormValues>({
    defaultValues: INITIAL_PASSWORD_VALUES,
  });

  const watchedAvatar = watchProfile("avatar");
  const watchedPassword = watchPassword("newPassword");

  useEffect(() => {
    const accessToken = getStoredAccessToken();
    const authPayload = resolveAuthPayload({ accessToken: accessToken ?? undefined });

    if (!accessToken || !authPayload?.id) {
      setProfileNotice({
        tone: "warning",
        message: "Your login session is missing. Please sign in again before editing your profile.",
      });
      setIsFetchingProfile(false);
      return;
    }

    setUserId(authPayload.id);
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadProfile = async () => {
      setIsFetchingProfile(true);
      setProfileNotice(null);

      try {
        const response = await getUserProfile(userId);
        const profile = getApiResultData<UserProfileResponse>(response);

        if (!profile) {
          throw new Error("Empty profile");
        }

        setProfileData(profile);
        resetProfileForm({
          fullName: profile.fullName ?? customerProfile.name,
          phone: profile.phone ?? "",
          bio: profile.bio ?? "",
          avatar: profile.avatar ?? "",
        });
        setAvatarPreview(profile.avatar || customerProfile.avatarSrc);
      } catch (error) {
        setProfileNotice({
          tone: "error",
          message: getApiErrorMessage(error, "Could not load profile information."),
        });
      } finally {
        setIsFetchingProfile(false);
      }
    };

    void loadProfile();
  }, [resetProfileForm, userId]);

  useEffect(() => {
    if (!watchedAvatar) {
      if (!avatarFileName) {
        setAvatarPreview(profileData?.avatar || customerProfile.avatarSrc);
      }
      return;
    }

    if (watchedAvatar.startsWith("data:image/") || watchedAvatar.startsWith("/")) {
      setAvatarPreview(watchedAvatar);
      return;
    }

    try {
      const parsedUrl = new URL(watchedAvatar);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        setAvatarPreview(watchedAvatar);
      }
    } catch {
      // Keep the current preview if the URL is incomplete.
    }
  }, [avatarFileName, profileData?.avatar, watchedAvatar]);

  const sidebarProfile: CustomerProfile = {
    name: profileData?.fullName || customerProfile.name,
    membership: customerProfile.membership,
    avatarSrc: avatarPreview || customerProfile.avatarSrc,
  };

  const accountInitials = (profileData?.fullName || customerProfile.name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileNotice({
        tone: "error",
        message: "Avatar must be an image file.",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileNotice({
        tone: "error",
        message: "Avatar must be 2MB or smaller.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfileValue("avatar", result, { shouldDirty: true, shouldValidate: true });
      setAvatarPreview(result);
      setAvatarFileName(file.name);
      setProfileNotice(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileValue("avatar", "", { shouldDirty: true, shouldValidate: true });
    setAvatarPreview(customerProfile.avatarSrc);
    setAvatarFileName(null);
  };

  const handleToggleNotification = (id: string) => {
    setNotificationSettings((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  const onSubmitProfile = async (values: ProfileFormValues) => {
    if (!userId) {
      setProfileNotice({
        tone: "error",
        message: "Current user could not be identified.",
      });
      return;
    }

    setProfileNotice(null);

    try {
      const response = await updateUserProfile(userId, {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        bio: values.bio.trim() || null,
        avatar: values.avatar.trim() || null,
      });

      const nextProfile = getApiResultData<UserProfileResponse>(response) ?? {
        ...profileData,
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        bio: values.bio.trim() || null,
        avatar: values.avatar.trim() || null,
      };

      setProfileData(nextProfile);
      resetProfileForm({
        fullName: nextProfile.fullName ?? values.fullName.trim(),
        phone: nextProfile.phone ?? values.phone.trim(),
        bio: nextProfile.bio ?? values.bio.trim(),
        avatar: nextProfile.avatar ?? values.avatar.trim(),
      });
      setAvatarPreview(nextProfile.avatar || customerProfile.avatarSrc);
      setAvatarFileName(null);
      setProfileNotice({
        tone: "success",
        message: getApiResultMessage(response) || "Profile updated successfully.",
      });
    } catch (error) {
      setProfileNotice({
        tone: "error",
        message: getApiErrorMessage(error, "Failed to update profile."),
      });
    }
  };

  const onSubmitPassword = async (values: PasswordFormValues) => {
    if (!userId) {
      setPasswordNotice({
        tone: "error",
        message: "Current user could not be identified.",
      });
      return;
    }

    setPasswordNotice(null);

    try {
      const response = await changeUserPassword(userId, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      resetPasswordForm(INITIAL_PASSWORD_VALUES);
      setPasswordNotice({
        tone: "success",
        message: getApiResultMessage(response) || "Password changed successfully.",
      });
    } catch (error) {
      setPasswordNotice({
        tone: "error",
        message: getApiErrorMessage(error, "Failed to change password."),
      });
    }
  };

  return (
    <>
      <Head>
        <title>Profile Settings | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#f4f7fb] text-slate-900">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          <CustomerDashboardSidebar
            navigationItems={customerProfileNavigationItems}
            profile={sidebarProfile}
            onLogout={() => void handleLogout()}
          />

          <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="text-xs font-medium text-slate-500">Dashboard &nbsp;&rsaquo;&nbsp; Profile Settings</div>
            <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:ml-auto">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
                  aria-label="Help"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="7" />
                    <path d="M9.75 9.75a2.25 2.25 0 1 1 3.18 2.05c-.86.42-1.43 1.02-1.43 1.95v.25" strokeLinecap="round" />
                    <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
                  aria-label="Logout"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M10 7.5H7.75A1.75 1.75 0 0 0 6 9.25v5.5c0 .97.78 1.75 1.75 1.75H10" strokeLinecap="round" />
                    <path d="M13 8.5 17 12l-4 3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 12h7" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </header>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.85rem]">Profile Settings</h1>

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
              <div className="space-y-6">
                <section className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)] sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[1.6rem] font-bold tracking-tight text-slate-900">Personal Information</h2>
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                      ID: {profileData?.id ?? "EH-99231"}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {profileNotice ? <NoticeBanner message={profileNotice.message} tone={profileNotice.tone} /> : null}
                    {isFetchingProfile ? <NoticeBanner message="Loading profile information..." tone="warning" /> : null}
                  </div>

                  <form onSubmit={handleProfileSubmit(onSubmitProfile)} className="mt-5 grid gap-5 lg:grid-cols-[88px_1fr]">
                    <div className="space-y-3">
                      <div className="h-[88px] w-[88px] overflow-hidden rounded-2xl bg-[#ffd8ca]">
                        {avatarPreview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-500">
                            {accountInitials || "U"}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 text-[11px] font-semibold">
                        <label htmlFor={fileInputId} className="cursor-pointer text-slate-700 hover:text-slate-900">
                          Edit
                        </label>
                        <button type="button" onClick={handleRemoveAvatar} className="text-rose-500 hover:text-rose-600">
                          Remove
                        </button>
                      </div>

                      <input id={fileInputId} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField label="Full Name" error={profileErrors.fullName?.message}>
                          <InputField
                            hasError={Boolean(profileErrors.fullName)}
                            placeholder="Alex Rivera"
                            {...registerProfile("fullName", {
                              required: "Please enter your full name",
                              minLength: {
                                value: 2,
                                message: "Full name must be at least 2 characters",
                              },
                            })}
                          />
                        </FormField>

                        <FormField label="Phone Number" error={profileErrors.phone?.message}>
                          <InputField
                            hasError={Boolean(profileErrors.phone)}
                            placeholder="+1 (555) 123-4567"
                            {...registerProfile("phone", {
                              required: "Please enter your phone number",
                              pattern: {
                                value: PHONE_PATTERN,
                                message: "Please enter a valid phone number",
                              },
                            })}
                          />
                        </FormField>
                      </div>

                      <FormField label="Email Address">
                        <InputField
                          readOnly
                          value={profileData?.email ?? ""}
                          className="cursor-not-allowed bg-[#f3f5f9] text-slate-500"
                        />
                      </FormField>

                      <FormField label="Bio" error={profileErrors.bio?.message}>
                        <TextAreaField
                          hasError={Boolean(profileErrors.bio)}
                          placeholder="Tech enthusiast and regular attendee of concerts, festivals and design conferences."
                          {...registerProfile("bio", {
                            maxLength: {
                              value: 280,
                              message: "Bio must be 280 characters or fewer",
                            },
                          })}
                        />
                      </FormField>

                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px] md:items-end">
                        <FormField label="Avatar URL" error={profileErrors.avatar?.message}>
                          <InputField
                            hasError={Boolean(profileErrors.avatar)}
                            placeholder="https://example.com/avatar.png"
                            {...registerProfile("avatar", {
                              validate: (value) => {
                                const trimmedValue = value.trim();
                                if (!trimmedValue) {
                                  return true;
                                }

                                if (trimmedValue.startsWith("data:image/") || trimmedValue.startsWith("/")) {
                                  return true;
                                }

                                try {
                                  const parsedUrl = new URL(trimmedValue);
                                  return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
                                    ? true
                                    : "Avatar URL must use http or https";
                                } catch {
                                  return "Avatar URL is invalid";
                                }
                              },
                            })}
                          />
                        </FormField>

                        <button
                          type="submit"
                          disabled={isSavingProfile || isFetchingProfile}
                          className="h-14 rounded-xl bg-gradient-to-r from-blue-700 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(76,92,193,0.24)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </button>
                      </div>

                      <div className="text-xs text-slate-400">
                        {avatarFileName ? `Selected image: ${avatarFileName}` : "You can upload an avatar or paste an image URL."}
                      </div>
                    </div>
                  </form>
                </section>

                <section className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)] sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                        <path d="M12 3.5 6 6v5.1c0 3.7 2.5 7.1 6 8.4 3.5-1.3 6-4.7 6-8.4V6l-6-2.5Z" />
                        <path d="M9.75 11.75V10a2.25 2.25 0 1 1 4.5 0v1.75" strokeLinecap="round" />
                        <rect x="8.5" y="11.75" width="7" height="5.75" rx="1.25" />
                      </svg>
                    </span>
                    <h2 className="text-[1.55rem] font-bold tracking-tight text-slate-900">Security & Password</h2>
                  </div>

                  <div className="mt-5 space-y-4">
                    {passwordNotice ? <NoticeBanner message={passwordNotice.message} tone={passwordNotice.tone} /> : null}
                  </div>

                  <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="mt-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField label="Current Password" error={passwordErrors.currentPassword?.message}>
                        <InputField
                          type="password"
                          hasError={Boolean(passwordErrors.currentPassword)}
                          placeholder="........"
                          {...registerPassword("currentPassword", {
                            required: "Please enter your current password",
                          })}
                        />
                      </FormField>

                      <FormField label="New Password" error={passwordErrors.newPassword?.message}>
                        <InputField
                          type="password"
                          hasError={Boolean(passwordErrors.newPassword)}
                          placeholder="........"
                          {...registerPassword("newPassword", {
                            required: "Please enter a new password",
                            minLength: {
                              value: 8,
                              message: "New password must be at least 8 characters",
                            },
                            validate: (value) =>
                              value !== getPasswordValues("currentPassword") || "New password must differ from current password",
                          })}
                        />
                      </FormField>

                      <FormField label="Confirm New" error={passwordErrors.confirmPassword?.message}>
                        <InputField
                          type="password"
                          hasError={Boolean(passwordErrors.confirmPassword)}
                          placeholder="........"
                          {...registerPassword("confirmPassword", {
                            required: "Please confirm your new password",
                            validate: (value) => value === getPasswordValues("newPassword") || "Passwords do not match",
                          })}
                        />
                      </FormField>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px] md:items-end">
                      <div>
                        <div className="text-xs text-slate-400">Last changed: 3 months ago</div>
                        <div className="mt-3 max-w-md">
                          <PasswordStrength password={watchedPassword} />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="h-14 rounded-xl bg-[#dbe4ff] px-5 text-sm font-semibold text-slate-900 transition hover:bg-[#ccd8ff] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isChangingPassword ? "Changing..." : "Change Password"}
                      </button>
                    </div>
                  </form>
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h3>
                  <div className="mt-6 space-y-5">
                    {notificationSettings.map((item) => (
                      <ToggleRow key={item.id} item={item} onToggle={handleToggleNotification} />
                    ))}
                  </div>
                </section>

                <section className="rounded-[22px] border border-rose-100 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.12)]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-500">Danger Zone</div>
                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    Deleting your account is permanent. All your ticket history and saved data will be removed from our servers.
                  </p>
                  <button
                    type="button"
                    className="mt-5 h-12 w-full rounded-xl border border-rose-200 text-sm font-semibold text-rose-500 transition hover:border-rose-300 hover:text-rose-600"
                  >
                    Deactivate Account
                  </button>
                </section>

                <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-blue-700 to-violet-600 p-5 text-white shadow-[0_18px_45px_rgba(76,92,193,0.25)]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100">Pro Feature</div>
                  <h3 className="mt-4 text-[1.65rem] font-bold leading-tight">Unlock Early Access to Festivals</h3>
                  <button
                    type="button"
                    className="mt-5 inline-flex rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
                  >
                    Learn More
                  </button>
                </section>
              </aside>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
