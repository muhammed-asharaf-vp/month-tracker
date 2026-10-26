const items = [
  { id: "overview", label: "Dashboard", icon: "overview" },
  { id: "add", label: "Add Person", icon: "add" },
  { id: "people", label: "View People", icon: "people" },
];

function NavIcon({ kind }) {
  const content = {
    overview: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    add: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
    people: (
      <>
        <path d="M16 20v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 004 18.5V20" />
        <circle cx="10" cy="7.5" r="3.5" />
        <path d="M17 4.5a3.5 3.5 0 010 6.8M20 20v-1.5a3.5 3.5 0 00-2.5-3.35" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {content[kind]}
    </svg>
  );
}

function Navigation({ activeTab, onNavigate, mobile = false }) {
  return (
    <nav
      aria-label="Main navigation"
      className={mobile ? "grid grid-cols-3 gap-1 border-t border-gray-200 p-2 dark:border-gray-800 lg:hidden" : "hidden space-y-1 px-3 lg:block"}
    >
      {items.map((item) => {
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate(item.id)}
            className={
              (mobile
                ? "flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-center text-[11px] font-medium transition"
                : "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition ") +
              (active
                ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white")
            }
          >
            <NavIcon kind={item.icon} />
            <span className={mobile ? "truncate" : ""}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function DashboardShell({
  activeTab,
  onNavigate,
  email,
  onSignOut,
  title,
  description,
  children,
}) {
  return (
    <div className="min-h-dvh bg-[#f7f7f6] text-gray-950 dark:bg-[#111111] dark:text-gray-100">
      <aside className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold tracking-tight text-white dark:bg-white dark:text-gray-950">
            MT
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">Month Tracker</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Yearly checklist</p>
          </div>
        </div>

        <Navigation activeTab={activeTab} onNavigate={onNavigate} />
        <Navigation activeTab={activeTab} onNavigate={onNavigate} mobile />

        <div className="mt-auto hidden border-t border-gray-200 p-5 dark:border-gray-800 lg:block">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">SHARED TRACKER</p>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Changes sync for everyone signed in.</p>
        </div>
      </aside>

      <div className="min-h-dvh lg:ml-64">
        <header className="border-b border-gray-200 bg-white px-4 py-5 dark:border-gray-800 dark:bg-gray-950 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">{title}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
              <p className="min-w-0 truncate text-sm text-gray-600 dark:text-gray-400">
                <span className="hidden sm:inline">Signed in as </span>
                <span className="font-medium text-gray-900 dark:text-gray-200">{email}</span>
              </p>
              <button
                type="button"
                onClick={onSignOut}
                className="h-9 shrink-0 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
          <footer className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:mt-12">
            Changes are shared with signed-in tracker members.
          </footer>
        </main>
      </div>
    </div>
  );
}
