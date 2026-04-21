import { Bell, Check, ChevronDown, Mail, Shield, Smartphone } from "lucide-react";
import { useState } from "react";

import { OrganizerMetaFooter } from "../shared/OrganizerMetaFooter";

type ChannelKey = "email" | "push" | "sms";
type SecurityKey = "twoFactor" | "deviceAlerts";

const CHANNEL_LABELS: Record<ChannelKey, string> = {
  email: "Email notifications",
  push: "Push notifications",
  sms: "SMS notifications",
};

const SECURITY_LABELS: Record<SecurityKey, string> = {
  twoFactor: "Require 2-factor authentication",
  deviceAlerts: "Alert when account signs in on a new device",
};

function Toggle({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-blue-600" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

export function OrganizerSettingsContent() {
  const [displayName, setDisplayName] = useState("Giang Dep Zai Ahihi");
  const [brandName, setBrandName] = useState("EventHub Premier");
  const [contactEmail, setContactEmail] = useState("organizer@eventhub.vn");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");

  const [channels, setChannels] = useState<Record<ChannelKey, boolean>>({
    email: true,
    push: true,
    sms: false,
  });

  const [security, setSecurity] = useState<Record<SecurityKey, boolean>>({
    twoFactor: true,
    deviceAlerts: true,
  });

  return (
    <section className="flex-1 text-zinc-900">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 p-5 sm:p-8 lg:p-10">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[2.4px] text-blue-600">Control Center</p>
            <h1 className="text-4xl font-bold leading-10 text-zinc-900">Organizer Settings</h1>
            <p className="max-w-2xl text-sm text-gray-700">
              Manage profile data, communication channels, and security policies for your organizer workspace.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Check className="h-4 w-4" />
            Save Changes
          </button>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-zinc-900">Public Profile</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Display Name</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Brand Name</span>
                <input
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value)}
                  className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm text-zinc-900"
                />
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Contact Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    className="w-full rounded-2xl bg-gray-100 py-3 pl-11 pr-4 text-sm text-zinc-900"
                  />
                </div>
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">Timezone</span>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    className="h-11 w-full appearance-none rounded-2xl bg-gray-100 py-2 pl-4 pr-10 text-sm font-medium text-zinc-900"
                  >
                    <option value="Asia/Ho_Chi_Minh">(GMT+7) Asia/Ho_Chi_Minh</option>
                    <option value="Asia/Bangkok">(GMT+7) Asia/Bangkok</option>
                    <option value="Asia/Singapore">(GMT+8) Asia/Singapore</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-gray-500" />
                </div>
              </label>
            </div>
          </article>

          <article className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-zinc-900">Security</h2>

            <div className="space-y-4">
              {Object.entries(SECURITY_LABELS).map(([key, label]) => {
                const feature = key as SecurityKey;
                return (
                  <div key={feature} className="flex items-center justify-between rounded-2xl bg-gray-100 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-indigo-100 p-2 text-indigo-700">
                        {feature === "twoFactor" ? <Shield className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                      </div>
                      <p className="max-w-xs text-sm font-medium text-zinc-900">{label}</p>
                    </div>
                    <Toggle
                      enabled={security[feature]}
                      onClick={() => setSecurity((prev) => ({ ...prev, [feature]: !prev[feature] }))}
                    />
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-zinc-900">Notification Channels</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(CHANNEL_LABELS).map(([key, label]) => {
              const channel = key as ChannelKey;
              const icon =
                channel === "email"
                  ? <Mail className="h-4 w-4" />
                  : channel === "push"
                    ? <Bell className="h-4 w-4" />
                    : <Smartphone className="h-4 w-4" />;

              return (
                <article key={channel} className="rounded-2xl bg-gray-100 p-4">
                  <div className="mb-5 inline-flex rounded-full bg-blue-100 p-2 text-blue-700">{icon}</div>
                  <p className="mb-4 text-sm font-semibold text-zinc-900">{label}</p>
                  <Toggle
                    enabled={channels[channel]}
                    onClick={() => setChannels((prev) => ({ ...prev, [channel]: !prev[channel] }))}
                  />
                </article>
              );
            })}
          </div>
        </section>

        <OrganizerMetaFooter />
      </div>
    </section>
  );
}
