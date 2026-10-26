import { MONTHS } from "../constants";

export default function Filters({ month, status, count, total, onMonth, onStatus }) {
  const noMonth = month === "";
  return (
    <section aria-label="Filters" className="mb-5 sm:mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Tick status"
          className={
            "inline-flex rounded-lg bg-gray-200/70 p-1 transition dark:bg-white/5" +
            (noMonth ? " pointer-events-none opacity-40" : "")
          }
        >
          {[["no", "Not ticked"], ["yes", "Ticked"]].map(([v, label]) => {
            const on = status === v;
            return (
              <button
                key={v}
                aria-pressed={on}
                disabled={noMonth}
                onClick={() => onStatus(v)}
                className={
                  "h-8 rounded-md px-4 text-sm font-medium transition duration-200 active:scale-95 " +
                  (on
                    ? "bg-white text-gray-950 shadow-sm dark:bg-gray-700 dark:text-gray-200"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white")
                }
              >
                {label}
              </button>
            );
          })}
        </div>
        <span aria-live="polite" className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
          {count} of {total} people
        </span>
      </div>

      <div role="group" aria-label="Filter by month" className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 py-1 sm:flex-wrap sm:overflow-visible">
        {["All", ...MONTHS].map((label, idx) => {
          const val = idx === 0 ? "" : String(idx - 1);
          const on = month === val;
          return (
            <button
              key={label}
              aria-pressed={on}
              onClick={() => onMonth(val)}
              className={
                "inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3.5 text-sm font-medium transition duration-200 active:scale-95 " +
                (on
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10 dark:hover:bg-white/10")
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
