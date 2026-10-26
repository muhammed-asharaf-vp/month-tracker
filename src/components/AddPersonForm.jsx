import { useRef, useState } from "react";
import { PlusIcon } from "./Icons";

const inputBase =
  "block h-11 w-full min-w-0 rounded-lg border bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-200 dark:focus:ring-white/10";
const labelCls = "mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-300";

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
    bad ? " border-gray-950 ring-2 ring-gray-950/15 dark:border-gray-200 dark:ring-white/15" : " border-gray-300 dark:border-gray-700";

  return (
    <section className="surface mb-7 p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-950 dark:text-white">Add a person</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a name and date of birth to the shared tracker.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_13rem_auto] sm:items-end">
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
            onKeyDown={(event) => event.key === "Enter" && void submit()}
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
            className={inputBase + " dark:[color-scheme:dark]" + border(badDob)}
          />
        </div>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={saving}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 sm:w-auto"
        >
          <PlusIcon />
          {saving ? "Saving…" : "Add"}
        </button>
      </div>
      <p role="alert" className={"mt-3 text-sm text-gray-800 dark:text-gray-200" + (error ? "" : " hidden")}>
        {error}
      </p>
    </section>
  );
}