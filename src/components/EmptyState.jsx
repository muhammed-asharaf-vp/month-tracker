import { FULL } from "../constants";
import { CalendarIcon } from "./Icons";

export default function EmptyState({ hasPeople, month, status }) {
  const title = hasPeople ? "No matches" : "Nobody here yet";
  const body = !hasPeople
    ? "Add a name and date of birth above, then tick months as they are completed."
    : status === "no"
    ? "Everyone is complete for " + FULL[Number(month)] + "."
    : "Nobody is complete for " + FULL[Number(month)] + " yet.";

  return (
    <div className="surface flex flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-12">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        <CalendarIcon />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-gray-950 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500 [text-wrap:pretty] dark:text-gray-400">{body}</p>
    </div>
  );
}