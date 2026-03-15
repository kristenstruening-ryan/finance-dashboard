import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("vault_lab_sim");
    localStorage.removeItem("vault_lab_user_context");

    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 transition-all bg-white border rounded-full dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg active:scale-95 group"
      >
        <div className="flex items-center justify-center w-8 h-8 text-xs font-black text-white rounded-full shadow-lg bg-linear-to-br from-blue-600 to-blue-700 ring-2 ring-white dark:ring-slate-900">
          {user ? getInitials(user.name) : <User size={14} />}
        </div>

        <span className="hidden text-sm font-black tracking-tight sm:block text-slate-700 dark:text-slate-200">
          {user?.name || "Guest"}
        </span>

        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-300 mr-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 z-20 w-64 py-2 mt-4 duration-200 origin-top-right bg-white border shadow-2xl dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            {/* User Info Header */}
            <div className="px-5 py-4 mb-1 border-b bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800">
              <p className="mb-1 text-sm font-black tracking-tight text-slate-900 dark:text-white">
                {user?.name || "Guest User"}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">
                {user?.email || "No email provided"}
              </p>
            </div>

            <div className="p-1.5 space-y-1">
              <button className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-bold transition-all rounded-xl text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400">
                <User size={18} />
                Profile Settings
              </button>

              <button className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-bold transition-all rounded-xl text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400">
                <Globe size={18} />
                <span className="flex justify-between w-full">
                  Currency{" "}
                  <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    USD
                  </span>
                </span>
              </button>

              <button className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-bold transition-all rounded-xl text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400">
                <Settings size={18} />
                Appearance
              </button>
            </div>

            <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

            <div className="p-1.5">
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-rose-500 transition-all rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <LogOut size={16} strokeWidth={3} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
