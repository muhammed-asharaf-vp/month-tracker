import Summary from "./Summary";

export default function DashboardOverview({ pending, total, done, currentMonth, onNavigate }) {
  const completedThisMonth = total - pending;
  const progress = total === 0 ? 0 : Math.round((completedThisMonth / total) * 100);

  return (
    <div className="space-y-6">
      <Summary pending={pending} total={total} done={done} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <article className="relative isolate overflow-hidden rounded-2xl bg-ink px-6 py-6 text-paper shadow-[0_18px_42px_rgba(40,40,33,0.12)] sm:px-8 sm:py-8">
          <div aria-hidden="true" className="absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-4 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Monthly overview</p>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
              {currentMonth}
            </span>
          </div>

          <div className="mt-8 flex items-center justify-between gap-5 sm:mt-10">
            <div>
              <p className="text-sm text-white/65">People marked complete</p>
              <p className="mt-2 text-5xl font-semibold leading-none tracking-[-0.05em] tabular-nums sm:text-6xl">
                {completedThisMonth}
                <span className="ml-2 text-xl font-medium tracking-normal text-white/40">/ {total}</span>
              </p>
            </div>
            <div
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full p-[5px] sm:h-24 sm:w-24"
              style={{ background: "conic-gradient(#AA8B5F " + progress + "%, rgba(255,255,255,0.13) " + progress + "%)" }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-ink text-sm font-semibold tabular-nums text-brass sm:text-base">
                {progress}%
              </div>
            </div>
          </div>

          <div
            className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label={currentMonth + " completion"}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <div className="h-full rounded-full bg-brass transition-[width]" style={{ width: progress + "%" }} />
          </div>
          <p className="mt-3 text-xs text-white/55">
            {total === 0
              ? "Add people to begin tracking this month."
              : completedThisMonth + " of " + total + " people marked for " + currentMonth + "."}
          </p>
        </article>

        <article className="surface p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Quick access</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Where to next?</h2>
          <p className="mt-1 text-sm text-muted">Jump straight into your tracker.</p>

          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => onNavigate("add")}
              className="group flex w-full items-center gap-3 rounded-xl border border-line bg-white/50 p-3 text-left transition hover:border-accent/30 hover:bg-accent-soft"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-sm font-semibold text-accent-deep">01</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">Add a person</span>
                <span className="mt-0.5 block text-xs text-muted">Create a new tracker entry</span>
              </span>
              <span aria-hidden="true" className="pr-1 text-lg text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">↗</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("people")}
              className="group flex w-full items-center gap-3 rounded-xl border border-line bg-white/50 p-3 text-left transition hover:border-accent/30 hover:bg-accent-soft"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3EDE2] text-sm font-semibold text-brass">02</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">View people</span>
                <span className="mt-0.5 block text-xs text-muted">Review monthly progress</span>
              </span>
              <span aria-hidden="true" className="pr-1 text-lg text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">↗</span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
