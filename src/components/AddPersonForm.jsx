import { useRef, useState } from "react";
import { PlusIcon } from "./Icons";

const inputBase =
  "block h-12 w-full min-w-0 rounded-xl border bg-paper px-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10";
const labelCls = "mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-ink/80";

export default function AddPersonForm({ onAdd }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [badName, setBadName] = useState(false);
  const [badDob, setBadDob] = useState(false);
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);
  const dobRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);

  const clearErrors = () => {
    setBadName(false);
    setBadDob(false);
    setError("");
  };

  const submit = async () => {
    if (saving) return;
    const n = name.trim();
    const noName = !n;
    const noDob = !dob;
    const future = !!dob && dob > today;
    if (noName || noDob || future) {
      setBadName(noName);
      setBadDob(noDob || future);
      setError(
        future
          ? "Date of birth can’t be in the future."
          : noName && noDob
          ? "Enter a name and choose a date of birth."
          : noName
          ? "Enter a name."
          : "Choose a date of birth."
      );
      (noName ? nameRef : dobRef).current?.focus();
      return;
    }

    clearErrors();
    setSaving(true);
    try {
      await onAdd({ name: n, dob, months: Array(12).fill(false) });
      setName("");
      setDob("");
      nameRef.current?.focus();
    } catch (err) {
      setError("Could not save this person: " + (err?.message || "Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const border = (bad) =>
    bad ? " border-[#9B3F36] ring-2 ring-[#9B3F36]/15" : " border-line";

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="surface overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brass">New entry · 01</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">Person details</h2>
            <p className="mt-1 text-sm text-muted">Add the details you want to keep in the tracker.</p>
          </div>
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep sm:flex">
            <PlusIcon />
          </div>
        </div>

        <form
          className="p-5 sm:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="person-name" className={labelCls}>Full name</label>
              <input
                id="person-name"
                ref={nameRef}
                type="text"
                placeholder="e.g. Anjali Menon"
                aria-invalid={badName}
                autoComplete="off"
                value={name}
                onChange={(event) => { setName(event.target.value); clearErrors(); }}
                className={inputBase + border(badName)}
              />
            </div>
            <div>
              <label htmlFor="person-dob" className={labelCls}>Date of birth</label>
              <input
                id="person-dob"
                ref={dobRef}
                type="date"
                aria-invalid={badDob}
                max={today}
                value={dob}
                onChange={(event) => { setDob(event.target.value); clearErrors(); }}
                className={inputBase + " [color-scheme:light]" + border(badDob)}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p role="alert" className={"text-sm text-[#9B3F36]" + (error ? "" : " hidden")}>
              {error}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-deep px-6 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-wait disabled:opacity-60 sm:ml-auto sm:w-auto"
            >
              <PlusIcon />
              {saving ? "Saving…" : "Save person"}
            </button>
          </div>
        </form>
      </section>

      <aside className="space-y-4">
        <section className="rounded-2xl bg-accent-deep p-5 text-white shadow-[0_14px_32px_rgba(53,67,52,0.16)] sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brass">What happens next</p>
          <ol className="mt-5 space-y-4">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-brass">01</span>
              <span className="pt-1 text-sm leading-relaxed text-white/85">The new person appears in your shared list.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-brass">02</span>
              <span className="pt-1 text-sm leading-relaxed text-white/85">All 12 months start unchecked.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-brass">03</span>
              <span className="pt-1 text-sm leading-relaxed text-white/85">Update the checklist anytime in View People.</span>
            </li>
          </ol>
        </section>

        <section className="surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Shared tracker</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Changes sync with other signed-in members automatically.
          </p>
        </section>
      </aside>
    </div>
  );
}
