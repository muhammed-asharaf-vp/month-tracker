import { useState } from "react";
import { FULL, MONTHS } from "../constants";
import { age, fmt, initials } from "../utils";
import { CheckIcon, TrashIcon } from "./Icons";

export default function PersonCard({
  person,
  currentMonth,
  confirming,
  onToggle,
  onAskDelete,
  onCancelDelete,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);
  const done = person.months.filter(Boolean).length;
  const progress = Math.round((done / 12) * 100);

  return (
    <article className="border-b border-gray-200 px-4 py-4 last:border-0 sm:px-5">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(150px,220px)_auto] md:items-center md:gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
            {initials(person.name)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-950">{person.name}</h3>
            <p className="mt-0.5 truncate text-sm tabular-nums text-gray-500">
              {fmt(person.dob)} <span aria-hidden="true">·</span> {age(person.dob)} yrs
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
            <span>Year progress</span>
            <span className="font-medium tabular-nums text-gray-700">{done} / 12</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-label={person.name + " yearly progress"}
            aria-valuemin="0"
            aria-valuemax="12"
            aria-valuenow={done}
          >
            <div className="h-full rounded-full bg-gray-950 transition-[width]" style={{ width: progress + "%" }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 md:justify-end">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={"months-" + person.id}
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {expanded ? "Hide months" : "Months"}
            <svg
              aria-hidden="true"
              className={"h-4 w-4 transition-transform " + (expanded ? "rotate-180" : "")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onDelete}
                className="h-9 rounded-lg bg-gray-950 px-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onCancelDelete}
                className="h-9 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={"Delete " + person.name}
              onClick={onAskDelete}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-950"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div id={"months-" + person.id} className="mt-4 border-t border-gray-200 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Monthly checklist</p>
          <div className="grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-6">
            {MONTHS.map((label, index) => {
              const checked = !!person.months[index];
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={checked}
                  aria-label={FULL[index] + " for " + person.name}
                  onClick={() => onToggle(index)}
                  className={
                    "flex min-h-10 items-center justify-center gap-1 rounded-lg border px-2 text-sm font-medium transition " +
                    (checked
                      ? "border-gray-950 bg-gray-950 text-white hover:bg-gray-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50") +
                    (!checked && index === currentMonth ? " ring-1 ring-inset ring-gray-950" : "")
                  }
                >
                  {checked && <CheckIcon />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
