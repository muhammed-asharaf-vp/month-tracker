import { useState } from "react";

const inputClass =
  "block h-12 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10";

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
        <div className="border-b border-line px-6 py-6 sm:px-8">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-sm font-bold text-brass">MT</div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-brass">Yearly checklist</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink">Month Tracker</h1>
          <p className="mt-2 text-sm text-muted">Sign in to open the shared tracker.</p>
        </div>

        <div className="p-6 sm:p-8">
          {configured ? (
            <>
              <p className="text-sm leading-relaxed text-muted">
                Use the account provided by the tracker administrator.
              </p>
              <form className="mt-5 space-y-4" onSubmit={submit}>
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-ink/80">Email</label>
                  <input id="login-email" className={inputClass} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                  <label htmlFor="login-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-ink/80">Password</label>
                  <input id="login-password" className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                {error && <p role="alert" className="text-sm text-[#9B3F36]">{error}</p>}
                <button disabled={busy} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent-deep px-5 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-wait disabled:opacity-60">
                  {busy ? "Signing in…" : "Sign in"}
                </button>
              </form>
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
                Accounts are managed by the administrator. Public sign-up is disabled.
              </p>
            </>
          ) : (
            <div className="rounded-xl border border-line bg-canvas p-4 text-sm leading-relaxed text-ink">
              <p className="font-medium">Supabase connection is not configured yet.</p>
              <p className="mt-2">Add the project URL and public key to the environment variables, then follow <code>SUPABASE_SETUP.md</code>.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
