import { FULL } from "../constants";
import { CalendarIcon } from "./Icons";

export default function EmptyState({ hasPeople, month, status }) {
  const title = hasPeople ? "No matches" : "Nobody here yet";
  const body = !hasPeople
    ? "Add a name and date of birth above, then tick months as they are completed."
    : status === "no"
    ? "Everyone is ticked for " + FULL[Number(month)] + "."
    : "Nobody is ticked for " + FULL[Number(month)] + " yet.";

  return (
    <div className="mt-2 flex flex-col items-center rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center sm:px-6 sm:py-14 dark:border-white/15">
      <div className="mb-4 text-gray-900 dark:text-gray-300">
        <CalendarIcon />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500 [text-wrap:pretty] dark:text-gray-400">{body}</p>
    </div>
  );
}
