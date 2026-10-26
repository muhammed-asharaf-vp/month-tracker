const label = "mt-1.5 text-xs leading-snug text-gray-500 sm:text-sm dark:text-gray-400";
const num = "text-3xl font-semibold leading-none tracking-tight tabular-nums sm:text-4xl";

export default function Summary({ pending, total, done }) {
  return (
    <section
      aria-label="Summary"
      className="surface mb-6 grid grid-cols-3 divide-x divide-gray-200 sm:mb-8 dark:divide-white/10"
    >
      <div className="p-4 sm:p-6">
        <p className={num + " text-gray-900 dark:text-gray-300"}>{pending}</p>
        <p className={label}>Pending this month</p>
      </div>
      <div className="p-4 sm:p-6">
        <p className={num}>{total}</p>
        <p className={label}>People</p>
      </div>
      <div className="p-4 sm:p-6">
        <p className={num}>{done}</p>
        <p className={label}>Fully complete</p>
      </div>
    </section>
  );
}
