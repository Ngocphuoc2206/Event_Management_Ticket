import React, { useState } from "react";
import { X } from "lucide-react";

interface RejectEventModalProps {
  isOpen: boolean;
  eventTitle: string;
  isLoading: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RejectEventModal({
  isOpen,
  eventTitle,
  isLoading,
  onConfirm,
  onCancel,
}: RejectEventModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      return;
    }
    onConfirm(reason.trim());
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900">Reject Event</h2>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-6">
            You are about to reject:{" "}
            <span className="font-bold text-slate-900">{eventTitle}</span>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
              Rejection Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm font-semibold resize-none"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !reason.trim()}
              className="flex-1 px-5 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all disabled:opacity-60 active:scale-95"
            >
              {isLoading ? "Rejecting..." : "Reject Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
