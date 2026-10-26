export default function Header() {
  return (
    <header className="min-w-0">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gray-950 dark:bg-gray-100" />
        Yearly checklist
      </p>
      <h1 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-gray-950 [text-wrap:balance] sm:text-4xl dark:text-white">
        Month Tracker
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">A clear view of progress, month by month.</p>
    </header>
  );
}