import { FULL } from "../constants";

export default function Filters({
  month,
  status,
  count,
  total,
  query,
  birthYear,
  years,
  onQuery,
  onBirthYear,
  onMonth,
  onStatus,
}) {
  const noMonth = month === "";

  return (
    <section aria-label="People filters" className="mb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm text-muted sm:pt-2" aria-live="polite">
          Showing <span className="font-semibold tabular-nums text-ink">{count}</span> of {total} people
        </p>

        <div className="grid min-w-0 gap-2 sm:flex-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
          <label htmlFor="people-search" className="sr-only">Search people by name</label>
          <input
            id="people-search"
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search by name"
            className="h-10 min-w-0 rounded-xl border border-line bg-paper px-3.5 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10 sm:col-span-2 lg:w-48"
          />

          <label htmlFor="birth-year-filter" className="sr-only">Filter by birth year</label>
          <select
            id="birth-year-filter"
            value={birthYear}
            onChange={(event) => onBirthYear(event.target.value)}
            className="h-10 w-full rounded-xl border border-line bg-paper px-3.5 text-sm font-medium text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 lg:w-36"
          >
            <option value="">All birth years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <label htmlFor="month-filter" className="sr-only">Filter by month</label>
          <select
            id="month-filter"
            value={month}
            onChange={(event) => onMonth(event.target.value)}
            className="h-10 w-full rounded-xl border border-line bg-paper px-3.5 text-sm font-medium text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 lg:w-40"
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
              className="inline-flex h-10 rounded-xl border border-line bg-paper p-1 sm:col-span-2 lg:col-span-1"
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
                      "rounded-lg px-3 text-sm font-medium transition " +
                      (selected
                        ? "bg-accent-deep text-white"
                        : "text-muted hover:bg-accent-soft hover:text-ink")
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
