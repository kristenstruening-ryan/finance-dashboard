import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Moon, Sun, Shield, ChevronDown, LogOut } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import SecurityModal from "./SecurityModal";

const Header = () => {
  const navigate = useNavigate();
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, currency, setCurrency } = useSettings();

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { name: "Investor", email: "" };
  });

  const currencies: ("USD" | "EUR" | "GBP" | "BTC")[] = [
    "USD",
    "EUR",
    "GBP",
    "BTC",
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("vault_lab_sim");
    localStorage.removeItem("vault_lab_user_context");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-end w-full p-4 transition-colors duration-500 bg-white border-b dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 transition-all group rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Settings
            size={22}
            className={`text-slate-500 dark:text-slate-400 transition-transform duration-500 ease-out ${
              isOpen
                ? "rotate-90 text-blue-600 dark:text-blue-400"
                : "group-hover:text-slate-900 dark:group-hover:text-slate-200"
            }`}
          />
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-3 bg-white border shadow-2xl w-72 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-4xl animate-in fade-in zoom-in-95 slide-in-from-top-2">
            <div className="p-5 space-y-6">
              {/* Appearance Section */}
              <div>
                <p className="mb-3 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                  Appearance
                </p>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      theme === "light"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      theme === "dark"
                        ? "bg-slate-700 text-white shadow-inner"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>

              {/* Currency Section */}
              <div>
                <p className="mb-3 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                  Currency
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        currency === curr
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                          : "border-transparent bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsSecurityModalOpen(true);
                  }}
                  className="flex items-center w-full gap-3 px-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                >
                  <Shield size={18} className="text-blue-500" />
                  Account Security
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 px-3 py-3 text-sm font-bold transition-colors text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        user={user}
      />
    </header>
  );
};

export default Header;
