import { FULL } from "../constants";

export default function Filters({ month, status, count, total, query, onQuery, onMonth, onStatus }) {
  const noMonth = month === "";

  return (
    <section aria-label="People filters" className="mb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600" aria-live="polite">
          Showing <span className="font-semibold tabular-nums text-gray-950">{count}</span> of {total} people
        </p>

        <div className="flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-center">
          <label htmlFor="people-search" className="sr-only">Search people by name</label>
          <input
            id="people-search"
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search by name"
            className="h-10 min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 min-[480px]:w-52"
          />

          <label htmlFor="month-filter" className="sr-only">Filter by month</label>
          <select
            id="month-filter"
            value={month}
            onChange={(event) => onMonth(event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-800 outline-none focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 min-[480px]:w-40"
          >
            <option value="">All months</option>
            {FULL.map((label, idx) => (
              <option key={label} value={String(idx)}>{label}</option>
            ))}
          </select>

          {!noMonth && (
            <div
              role="group"
              aria-label="Filter by completion status"
              className="inline-flex h-10 rounded-lg border border-gray-300 bg-white p-1"
            >
              {[["no", "Pending"], ["yes", "Complete"]].map(([value, label]) => {
                const selected = status === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onStatus(value)}
                    className={
                      "rounded-md px-3 text-sm font-medium transition " +
                      (selected
                        ? "bg-gray-950 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-950")
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
