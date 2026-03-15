import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 p-4 overflow-y-auto lg:p-8 custom-scrollbar">
          <div className="h-full mx-auto max-w-350">
            <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
