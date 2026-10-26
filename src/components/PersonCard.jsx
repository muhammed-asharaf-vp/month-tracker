import { FULL, MONTHS } from "../constants";
import { age, fmt, initials } from "../utils";
import { CheckIcon, TrashIcon } from "./Icons";

export default function PersonCard({
  person,
  index,
  currentMonth,
  confirming,
  onToggle,
  onAskDelete,
  onCancelDelete,
  onDelete,
}) {
  const done = person.months.filter(Boolean).length;

  return (
    <article className="surface p-4 sm:p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
          {initials(person.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold leading-tight tracking-tight text-gray-950 dark:text-white">{person.name}</h3>
          <p className="mt-1 truncate text-sm tabular-nums text-gray-500 dark:text-gray-400">
            {fmt(person.dob)} <span aria-hidden="true">·</span> {age(person.dob)} yrs
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {confirming ? (
            <>
              <button
                onClick={onDelete}
                className="h-9 rounded-lg bg-gray-950 px-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                Delete
              </button>
              <button
                onClick={onCancelDelete}
                className="h-9 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Keep
              </button>
            </>
          ) : (
            <button
              aria-label={"Delete " + person.name}
              onClick={onAskDelete}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 mt-5 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {person.months.map((on, i) => (
            <div
              key={i}
              className={"h-1 flex-1 rounded-full " + (on ? "bg-gray-950 dark:bg-gray-100" : "bg-gray-200 dark:bg-gray-700")}
            />
          ))}
        </div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
          {done} / 12 months
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-6">
        {MONTHS.map((m, i) => {
          const on = !!person.months[i];
          return (
            <button
              key={m}
              type="button"
              aria-pressed={on}
              aria-label={FULL[i] + " for " + person.name}
              onClick={() => onToggle(i)}
              className={
                "flex min-h-10 items-center justify-center gap-1 rounded-lg border px-2 text-sm font-medium transition " +
                (on
                  ? "border-gray-950 bg-gray-950 text-white hover:bg-gray-800 dark:border-white dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800") +
                (!on && i === currentMonth ? " ring-1 ring-inset ring-gray-950 dark:ring-gray-200" : "")
              }
            >
              {on && <CheckIcon />}
              <span>{m}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}