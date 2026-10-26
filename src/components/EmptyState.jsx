import { FULL } from "../constants";
import { CalendarIcon } from "./Icons";

export default function EmptyState({ hasPeople, month, status, query = "" }) {
  const searching = query.trim().length > 0;
  const title = hasPeople ? "No matching people" : "No people yet";
  const body = !hasPeople
    ? "Use the Add Person tab to create the first entry."
    : searching
    ? "No names match “" + query.trim() + "”. Try another search or adjust the filters."
    : status === "no"
    ? "Everyone is complete for " + FULL[Number(month)] + "."
    : "Nobody is complete for " + FULL[Number(month)] + " yet.";

  return (
    <div className="surface flex flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-12">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <CalendarIcon />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted [text-wrap:pretty]">{body}</p>
    </div>
  );
}
