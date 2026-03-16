import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  LogOut,
  TrendingUp,
  Menu,
  X,
  PieChart,
  Beaker,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : { name: "Investor" };
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return { name: "Investor" };
    }
  });

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Portfolio", path: "/portfolio", icon: Wallet },
    { name: "Analytics", path: "/analytics", icon: PieChart },
    { name: "Vault Lab", path: "/lab", icon: Beaker },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("vault_lab_sim");
    localStorage.removeItem("vault_lab_user_context");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between p-4 transition-colors bg-white border-b lg:hidden dark:bg-slate-950 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <TrendingUp size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight dark:text-white">
            <span className="text-blue-600">Fin</span>Vault
          </h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 duration-300 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out border-r
        bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 w-[80vw] lg:w-72
        lg:translate-x-0 lg:sticky lg:block shrink-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full p-8">
          {/* Logo Area - Desktop */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="p-2.5 bg-blue-600 shadow-xl rounded-2xl shadow-blue-500/30">
              <TrendingUp size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              <span className="text-blue-600">Fin</span>Vault
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                        : "text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }
                  `}
                >
                  <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* User Identity Block */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-blue-600 shadow-lg rounded-xl shadow-blue-500/20 shrink-0">
                {user.name?.charAt(0).toUpperCase() || "I"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {user.plan || "Pro Member"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
