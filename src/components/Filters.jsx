import { MONTHS } from "../constants";

export default function Filters({ month, status, count, total, onMonth, onStatus }) {
  const noMonth = month === "";

  return (
    <section aria-label="People and filters" className="mb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-950 dark:text-white">People</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
            Showing {count} of {total}
          </p>
        </div>

        <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center">
          <label htmlFor="month-filter" className="sr-only">Filter by month</label>
          <select
            id="month-filter"
            value={month}
            onChange={(event) => onMonth(event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 min-[420px]:w-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-200 dark:focus:ring-white/10"
          >
            <option value="">All months</option>
            {MONTHS.map((label, idx) => (
              <option key={label} value={String(idx)}>{label}</option>
            ))}
          </select>

          <div
            role="group"
            aria-label="Filter by completion status"
            className={"inline-flex h-10 rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900" + (noMonth ? " opacity-50" : "")}
            title={noMonth ? "Select a month to filter by status." : undefined}
          >
            {[["no", "Pending"], ["yes", "Complete"]].map(([value, label]) => {
              const selected = status === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  disabled={noMonth}
                  onClick={() => onStatus(value)}
                  className={
                    "rounded-md px-3 text-sm font-medium transition " +
                    (selected
                      ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}