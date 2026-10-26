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
      className={
        mobile
          ? "grid grid-cols-3 gap-1 border-t border-white/10 p-2 lg:hidden"
          : "hidden space-y-1 px-3 lg:block"
      }
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
                ? "flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-center text-[11px] font-medium transition"
                : "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition ") +
              (active
                ? "bg-white/10 text-white shadow-inner ring-1 ring-white/10"
                : "text-white/65 hover:bg-white/5 hover:text-white")
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
    <div className="min-h-dvh bg-canvas text-ink">
      <aside className="border-b border-white/10 bg-ink text-paper lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brass text-sm font-bold tracking-tight text-ink">
            MT
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-paper">Month Tracker</p>
            <p className="text-xs text-white/55">A year, thoughtfully tracked</p>
          </div>
        </div>

        <Navigation activeTab={activeTab} onNavigate={onNavigate} />
        <Navigation activeTab={activeTab} onNavigate={onNavigate} mobile />

        <div className="mt-auto hidden border-t border-white/10 p-5 lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brass">Shared tracker</p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">Updates stay in sync for everyone signed in.</p>
        </div>
      </aside>

      <div className="min-h-dvh lg:ml-64">
        <header className="border-b border-line bg-paper px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">{title === "Dashboard" ? "Overview" : "Month Tracker"}</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">{title}</h1>
              <p className="mt-1 text-sm text-muted">{description}</p>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
              <div className="flex min-w-0 items-center gap-2.5 rounded-full border border-line bg-white/70 py-1 pl-1 pr-3">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold uppercase text-accent-deep">
                  {email?.slice(0, 1) || "U"}
                </span>
                <p className="min-w-0 truncate text-xs font-medium text-ink sm:text-sm">{email}</p>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="h-9 shrink-0 rounded-lg px-3 text-sm font-medium text-muted transition hover:bg-accent-soft hover:text-ink"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
          <footer className="mt-10 border-t border-line pt-5 text-xs text-muted sm:mt-12">
            Changes are shared with signed-in tracker members.
          </footer>
        </main>
      </div>
    </div>
  );
}
