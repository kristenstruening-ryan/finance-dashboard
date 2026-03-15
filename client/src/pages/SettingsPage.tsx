import { useSettings } from "../hooks/useSettings";
import { Moon, Sun, Globe, Shield, User } from "lucide-react";

const SettingsPage = () => {
  const { currency, setCurrency, theme, setTheme } = useSettings();

  const currencies: {
    code: "USD" | "EUR" | "GBP" | "BTC";
    label: string;
    symbol: string;
  }[] = [
    { code: "USD", label: "US Dollar", symbol: "$" },
    { code: "EUR", label: "Euro", symbol: "€" },
    { code: "GBP", label: "British Pound", symbol: "£" },
    { code: "BTC", label: "Bitcoin", symbol: "₿" },
  ];

  return (
    <div className="max-w-4xl p-6 mx-auto md:p-12">
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your global preferences and account security.
        </p>
      </header>

      <div className="space-y-8">
        {/* Preferences Section */}
        <section className="overflow-hidden bg-white border shadow-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-800">
            <Globe className="text-blue-500 dark:text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Preferences
            </h2>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <label className="block mb-4 text-xs font-semibold tracking-wider uppercase text-slate-500">
                Primary Currency
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      currency === curr.code
                        ? "bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xl font-bold">{curr.symbol}</span>
                    <span className="text-xs font-medium">{curr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border bg-slate-50 dark:bg-slate-950 rounded-2xl border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="text-blue-400" />
                ) : (
                  <Sun className="text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Interface Theme
                  </p>
                  <p className="text-xs text-slate-500">
                    Current: {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-6 py-2 text-xs font-bold text-white transition-all bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 rounded-xl"
              >
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="overflow-hidden bg-white border shadow-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-800">
            <Shield className="text-rose-500 dark:text-rose-400" size={20} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Security & Account
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm italic font-bold text-slate-900 dark:text-white">
                    Update Profile Details
                  </p>
                  <p className="text-xs italic text-slate-500">
                    Coming soon: Email and password management
                  </p>
                </div>
              </div>
              <button
                disabled
                className="text-xs font-bold underline cursor-not-allowed text-slate-400"
              >
                Edit
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
