export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen" />
    </div>
  );
}
