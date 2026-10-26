import Summary from "./Summary";

export default function DashboardOverview({ pending, total, done, currentMonth, onNavigate }) {
  const completedThisMonth = total - pending;
  const progress = total === 0 ? 0 : Math.round((completedThisMonth / total) * 100);

  return (
    <div className="space-y-5">
      <Summary pending={pending} total={total} done={done} />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
            {currentMonth} progress
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-3xl font-semibold leading-none tracking-tight tabular-nums text-gray-950 dark:text-white">
              {completedThisMonth}
              <span className="ml-1.5 text-base font-medium text-gray-500 dark:text-gray-400">/ {total}</span>
            </p>
            <p className="text-sm font-medium tabular-nums text-gray-600 dark:text-gray-300">{progress}%</p>
          </div>
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
            role="progressbar"
            aria-label={currentMonth + " completion"}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <div className="h-full rounded-full bg-gray-950 transition-[width] dark:bg-white" style={{ width: progress + "%" }} />
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            People marked complete for {currentMonth}.
          </p>
        </article>

        <article className="surface p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">Quick actions</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Go straight to the task you need.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate("add")}
              className="h-10 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              Add a person
            </button>
            <button
              type="button"
              onClick={() => onNavigate("people")}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              View people
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
