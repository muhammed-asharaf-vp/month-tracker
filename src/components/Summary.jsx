const label = "text-[10px] font-semibold uppercase tracking-[0.14em] text-muted";
const num = "mt-3 text-4xl font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink";

export default function Summary({ pending, total, done }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      <div className="surface relative overflow-hidden p-5 sm:p-6">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brass" />
        <p className={label}>Pending this month</p>
        <p className={num}>{pending}</p>
        <p className="mt-2 text-xs text-muted">Awaiting an update</p>
      </div>
      <div className="surface relative overflow-hidden p-5 sm:p-6">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-accent" />
        <p className={label}>People tracked</p>
        <p className={num}>{total}</p>
        <p className="mt-2 text-xs text-muted">In your shared list</p>
      </div>
      <div className="surface relative overflow-hidden p-5 sm:p-6">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#8A8578]" />
        <p className={label}>Year complete</p>
        <p className={num}>{done}</p>
        <p className="mt-2 text-xs text-muted">All 12 months marked</p>
      </div>
    </section>
  );
}
