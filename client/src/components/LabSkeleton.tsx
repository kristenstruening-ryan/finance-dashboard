const LabSkeleton = () => {
  return (
    <div className="relative min-h-screen pb-20 space-y-8 md:space-y-10 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
        <div className="h-12 w-full lg:w-72 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
        {/* Left Column: Allocation List */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8">
          <div className="flex justify-between items-center">
            <div className="h-6 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
                <div className="h-3 w-8 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
              </div>
              <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full animate-pulse" />
            </div>
          ))}
        </div>

        {/* Right Column: Diagnostics Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 h-[400px] flex flex-col items-center justify-center space-y-8">
            {/* Gauge Placeholder */}
            <div className="relative w-48 h-24 border-t-8 border-l-8 border-r-8 border-white/5 rounded-t-full animate-pulse" />
            <div className="h-12 w-24 bg-white/5 rounded-2xl animate-pulse" />

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="h-24 bg-white/5 rounded-3xl animate-pulse" />
              <div className="h-24 bg-white/5 rounded-3xl animate-pulse" />
            </div>
          </div>

          {/* Footer Action Placeholder */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 h-24 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LabSkeleton;