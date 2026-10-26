const label = "text-xs font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400";
const num = "mt-3 text-3xl font-semibold leading-none tracking-tight tabular-nums text-gray-950 sm:text-4xl dark:text-white";

export default function Summary({ pending, total, done }) {
  return (
    <section aria-label="Summary" className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      <div className="surface p-4 sm:p-5">
        <p className={label}>Pending this month</p>
        <p className={num}>{pending}</p>
      </div>
      <div className="surface p-4 sm:p-5">
        <p className={label}>People</p>
        <p className={num}>{total}</p>
      </div>
      <div className="surface p-4 sm:p-5">
        <p className={label}>Fully complete</p>
        <p className={num}>{done}</p>
      </div>
    </section>
  );
}