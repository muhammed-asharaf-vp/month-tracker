import { useState } from "react";

const inputClass =
  "block h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-200 dark:focus:ring-white/10";

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
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10 sm:px-6">
      <section className="surface w-full overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-6 dark:border-gray-800 sm:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">Yearly checklist</p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-gray-950 dark:text-white">Month Tracker</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to open the shared tracker.</p>
        </div>

        <div className="p-6 sm:p-8">
          {configured ? (
            <>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Use the account provided by the tracker administrator.
              </p>
              <form className="mt-5 space-y-4" onSubmit={submit}>
                <div>
                  <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-300">Email</label>
                  <input id="login-email" className={inputClass} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                  <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-300">Password</label>
                  <input id="login-password" className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                {error && <p role="alert" className="text-sm text-gray-800 dark:text-gray-200">{error}</p>}
                <button disabled={busy} className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200">
                  {busy ? "Signing in…" : "Sign in"}
                </button>
              </form>
              <p className="mt-5 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
                Accounts are managed by the administrator. Public sign-up is disabled.
              </p>
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <p className="font-medium">Supabase connection is not configured yet.</p>
              <p className="mt-2">Add the project URL and public key to the environment variables, then follow <code>SUPABASE_SETUP.md</code>.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}