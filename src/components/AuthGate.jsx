import { useState } from "react";

const inputClass =
  "block h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/15 dark:border-white/15 dark:bg-gray-950 dark:text-gray-100";

export default function AuthGate({ configured, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSignIn(email.trim(), password);
    } catch (err) {
      setError(err?.message || "Could not sign in. Check your email and password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative z-10 mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-10 sm:px-6">
      <section className="surface w-full p-6 sm:p-8">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Shared yearly checklist</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Month Tracker</h1>
        {configured ? (
          <>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Sign in with an account provided by the tracker administrator.
            </p>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input id="login-email" className={inputClass} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input id="login-password" className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              {error && <p role="alert" className="text-sm text-gray-900 dark:text-gray-300">{error}</p>}
              <button disabled={busy} className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60">
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className="mt-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Accounts are managed by the administrator. Public sign-up is disabled for this shared list.
            </p>
          </>
        ) : (
          <div className="mt-4 rounded-xl bg-gray-100 p-4 text-sm leading-relaxed text-gray-700 dark:bg-white/5 dark:text-gray-300">
            <p className="font-medium">Supabase connection is not configured yet.</p>
            <p className="mt-2">Add the project URL and public key to the environment variables, then follow <code>SUPABASE_SETUP.md</code>.</p>
          </div>
        )}
      </section>
    </main>
  );
}