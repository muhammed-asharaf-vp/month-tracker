import { useRef, useState } from "react";
import { PlusIcon } from "./Icons";

const inputBase =
  "block h-11 w-full min-w-0 rounded-lg border bg-white px-3.5 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/15 dark:bg-gray-950 dark:text-gray-100";
const labelCls = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

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
    bad ? " border-gray-700 ring-2 ring-gray-700/30" : " border-gray-300 dark:border-white/15";

  return (
    <section className="surface mb-6 p-4 sm:mb-8 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold tracking-tight sm:mb-5 sm:text-xl">Add a person</h2>
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
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white transition duration-200 hover:bg-gray-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <PlusIcon />
          {saving ? "Saving…" : "Add"}
        </button>
      </div>
      <p role="alert" className={"mt-3 text-sm text-gray-900 dark:text-gray-300" + (error ? "" : " hidden")}>
        {error}
      </p>
    </section>
  );
}