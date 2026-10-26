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
    <article
      className="surface animate-rise p-4 motion-reduce:animate-none sm:p-6"
      style={{ animationDelay: Math.min(index, 8) * 60 + "ms" }}
    >
      <div className="mb-5 flex items-center gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-950 sm:h-12 sm:w-12 sm:text-base dark:bg-gray-300/10 dark:text-gray-200">
          {initials(person.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold leading-tight tracking-tight sm:text-lg">{person.name}</h3>
          <p className="mt-0.5 truncate text-sm tabular-nums text-gray-500 dark:text-gray-400">
            {fmt(person.dob)} {"·"} {age(person.dob)} yrs
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {confirming ? (
            <>
              <button
                onClick={onDelete}
                className="h-9 rounded-lg bg-gray-800 px-3 text-sm font-medium text-white transition duration-200 hover:bg-gray-900 active:scale-95"
              >
                Delete
              </button>
              <button
                onClick={onCancelDelete}
                className="h-9 rounded-lg px-3 text-sm font-medium text-gray-600 transition duration-200 hover:bg-gray-100 active:scale-95 dark:text-gray-300 dark:hover:bg-white/10"
              >
                Keep
              </button>
            </>
          ) : (
            <button
              aria-label={"Delete " + person.name}
              onClick={onAskDelete}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 dark:hover:bg-gray-700/10 dark:hover:text-gray-300"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {person.months.map((on, i) => (
            <div
              key={i}
              className={
                "h-1.5 flex-1 rounded-full transition-colors duration-300 " +
                (on ? "bg-gray-900" : "bg-gray-200 dark:bg-white/10")
              }
            />
          ))}
        </div>
        <span className="w-12 shrink-0 text-right text-sm font-medium tabular-nums text-gray-600 dark:text-gray-300">
          {done} / 12
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-6">
        {MONTHS.map((m, i) => {
          const on = !!person.months[i];
          return (
            <button
              key={m}
              aria-pressed={on}
              aria-label={FULL[i] + " for " + person.name}
              onClick={() => onToggle(i)}
              className={
                "flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium transition duration-200 active:scale-[0.97] sm:px-3 " +
                (on
                  ? "bg-gray-900 text-white hover:bg-gray-950"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10") +
                (!on && i === currentMonth ? " ring-1 ring-inset ring-gray-900" : "")
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
