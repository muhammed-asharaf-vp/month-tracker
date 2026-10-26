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
    <article className="border-b border-line px-4 py-4 last:border-0 sm:px-5">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(150px,220px)_auto] md:items-center md:gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas text-sm font-semibold text-ink">
            {initials(person.name)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">{person.name}</h3>
            <p className="mt-0.5 truncate text-sm tabular-nums text-muted">
              {fmt(person.dob)} <span aria-hidden="true">·</span> {age(person.dob)} yrs
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
            <span>Year progress</span>
            <span className="font-medium tabular-nums text-ink">{done} / 12</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label={person.name + " yearly progress"}
            aria-valuemin="0"
            aria-valuemax="12"
            aria-valuenow={done}
          >
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: progress + "%" }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 md:justify-end">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={"months-" + person.id}
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-line bg-paper px-3 text-sm font-medium text-ink transition hover:border-accent/30 hover:bg-accent-soft"
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
                className="h-9 rounded-xl bg-[#9B3F36] px-3 text-sm font-medium text-white transition hover:bg-[#82352E]"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onCancelDelete}
                className="h-9 rounded-xl border border-line px-3 text-sm font-medium text-muted transition hover:bg-canvas hover:text-ink"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={"Delete " + person.name}
              onClick={onAskDelete}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-[#F7EAE6] hover:text-[#9B3F36]"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div id={"months-" + person.id} className="mt-4 border-t border-line pt-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Monthly checklist</p>
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
                    "flex min-h-10 items-center justify-center gap-1 rounded-xl border px-2 text-sm font-medium transition " +
                    (checked
                      ? "border-accent-deep bg-accent-deep text-white hover:bg-accent"
                      : "border-line bg-paper text-ink hover:border-accent/40 hover:bg-accent-soft") +
                    (!checked && index === currentMonth ? " ring-1 ring-inset ring-brass" : "")
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
