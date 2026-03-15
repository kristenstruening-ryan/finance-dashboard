import { useState } from "react";
import {
  X,
  Shield,
  Mail,
  User,
  Key,
  Loader2,
  Lock,
  AlertCircle,
} from "lucide-react";
import type { User as UserProfile } from "../types";
import api from "../api/axios";
import axios from "axios";
import toast from "react-hot-toast";

const SecurityModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}) => {
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
  });

  if (!isOpen) return null;

  const isGuest = user.email === "guest@example.com";

  const handleSave = async () => {
    // Extra safety guard
    if (isGuest) return;

    try {
      setLoading(true);
      const { data: updatedUser } = await api.put("/auth/profile", formData);
      const currentStored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentStored, ...updatedUser }),
      );

      toast.success("Profile updated successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to update profile";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-100 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <Shield className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Account Security
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* GUEST WARNING BANNER */}
          {isGuest && (
            <div className="flex items-center gap-3 p-4 border bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20 rounded-2xl animate-in slide-in-from-top-4">
              <AlertCircle className="shrink-0 text-amber-500" size={18} />
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-tight">
                Demo Account: Security settings and profile modifications are
                restricted in guest mode.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  disabled={isGuest}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full py-3.5 pl-12 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  disabled={isGuest}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full py-3.5 pl-12 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Toggle: Only show if NOT guest */}
            {!isGuest && (
              <>
                {!showPasswordFields ? (
                  <button
                    onClick={() => setShowPasswordFields(true)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <Key size={14} /> Change Password
                  </button>
                ) : (
                  <div className="pt-2 space-y-4 duration-300 animate-in slide-in-from-top-2">
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-3.5 text-slate-400"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="Current Password"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full py-3.5 pl-12 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-3.5 text-slate-400"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full py-3.5 pl-12 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold text-sm"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleSave}
            disabled={loading || isGuest}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center ${
              isGuest
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                : "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
            }`}
          >
            {isGuest ? (
              <div className="flex items-center gap-2">
                <Lock size={12} />
                <span>ReadOnly Access</span>
              </div>
            ) : loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;
