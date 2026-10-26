import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase, supabaseConfigured } from "./supabase";
import Header from "./components/Header";
import Summary from "./components/Summary";
import AddPersonForm from "./components/AddPersonForm";
import Filters from "./components/Filters";
import PersonCard from "./components/PersonCard";
import EmptyState from "./components/EmptyState";
import AuthGate from "./components/AuthGate";

const CUR = new Date().getMonth();
const PERSON_FIELDS = "id,name,dob,months";

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [people, setPeople] = useState([]);
  const [peopleLoaded, setPeopleLoaded] = useState(false);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [actionError, setActionError] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("no");
  const [confirmId, setConfirmId] = useState(null);
  const loadSequence = useRef(0);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setAuthLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setActionError("Could not check sign-in status: " + error.message);
      setSession(data?.session ?? null);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadPeople = useCallback(async ({ initial = false } = {}) => {
    if (!supabase || !session) return false;
    const request = ++loadSequence.current;
    if (initial) setPeopleLoading(true);
    setDataError("");

    const { data, error } = await supabase
      .from("people")
      .select(PERSON_FIELDS)
      .order("created_at", { ascending: true });

    if (request !== loadSequence.current) return false;
    if (error) {
      setDataError(error.message);
      if (initial) setPeopleLoading(false);
      return false;
    }

    setPeople(data ?? []);
    setPeopleLoaded(true);
    setPeopleLoading(false);
    return true;
  }, [session]);

  useEffect(() => {
    if (!session || !supabase) {
      loadSequence.current += 1;
      setPeople([]);
      setPeopleLoaded(false);
      setPeopleLoading(false);
      setDataError("");
      return undefined;
    }

    setPeople([]);
    setPeopleLoaded(false);
    void loadPeople({ initial: true });

    const channel = supabase
      .channel("shared-people")
      .on("postgres_changes", { event: "*", schema: "public", table: "people" }, () => {
        void loadPeople();
      })
      .subscribe();

    return () => {
      loadSequence.current += 1;
      void supabase.removeChannel(channel);
    };
  }, [session, loadPeople]);

  const shown = useMemo(
    () => people.filter((person) => {
      if (month === "") return true;
      const ticked = !!person.months[Number(month)];
      return status === "yes" ? ticked : !ticked;
    }),
    [people, month, status]
  );

  const pending = people.filter((person) => !person.months[CUR]).length;
  const done = people.filter((person) => person.months.every(Boolean)).length;

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    setActionError("");
    const { error } = await supabase.auth.signOut();
    if (error) setActionError("Could not sign out: " + error.message);
  };

  const addPerson = async (person) => {
    setActionError("");
    const { data, error } = await supabase
      .from("people")
      .insert({
        name: person.name,
        dob: person.dob,
        months: person.months,
        created_by: session.user.id,
      })
      .select(PERSON_FIELDS)
      .single();
    if (error) throw error;
    setPeople((previous) => previous.some((item) => item.id === data.id) ? previous : [...previous, data]);
  };

  const toggleMonth = async (id, index) => {
    setConfirmId(null);
    setActionError("");
    const current = people.find((person) => person.id === id);
    if (!current) return;
    const { data, error } = await supabase.rpc("toggle_person_month", {
      p_person_id: id,
      p_month_index: index,
    });
    if (error || !data) {
      setActionError("Could not save that month: " + (error?.message || "The person may have been deleted."));
      return;
    }
    setPeople((previous) => previous.map((person) => person.id === id ? data : person));
  };

  const deletePerson = async (id) => {
    setActionError("");
    const { error } = await supabase.from("people").delete().eq("id", id);
    if (error) {
      setActionError("Could not delete that person: " + error.message);
      return;
    }
    setPeople((previous) => previous.filter((person) => person.id !== id));
    setConfirmId(null);
  };

  const changeMonth = (value) => { setMonth(value); setConfirmId(null); };
  const changeStatus = (value) => { setStatus(value); setConfirmId(null); };

  return (
    <div className="min-h-screen min-h-dvh overflow-x-hidden bg-[#f7f7f6] font-sans text-gray-950 antialiased dark:bg-[#111111] dark:text-gray-100 [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-gray-900 dark:[&_button:focus-visible]:ring-gray-100">
      {authLoading ? (
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Header />
          <p role="status" className="text-sm text-gray-600 dark:text-gray-400">Checking sign-in…</p>
        </main>
      ) : !session ? (
        <AuthGate configured={supabaseConfigured} onSignIn={signIn} />
      ) : (
        <main
          id="main"
          className="mx-auto max-w-6xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:pb-16 sm:pt-[max(2.5rem,env(safe-area-inset-top))] lg:px-8"
        >
          <div className="mb-7 flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-gray-800 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <Header />
            <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
              <p className="min-w-0 truncate text-sm text-gray-600 dark:text-gray-400">Signed in as <span className="font-medium text-gray-900 dark:text-gray-200">{session.user.email}</span></p>
              <button onClick={signOut} className="h-9 shrink-0 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Sign out</button>
            </div>
          </div>

          {actionError && <p role="alert" className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">{actionError}</p>}
          {peopleLoading ? (
            <p role="status" className="surface p-5 text-sm text-gray-600 dark:text-gray-400">Loading shared tracker…</p>
          ) : !peopleLoaded ? (
            <div role="alert" className="surface p-5">
              <p className="text-sm text-gray-700 dark:text-gray-300">Could not load the shared tracker. {dataError}</p>
              <button onClick={() => void loadPeople({ initial: true })} className="mt-4 h-10 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200">Try again</button>
            </div>
          ) : (
            <>
              {dataError && <p role="alert" className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">Live refresh failed: {dataError}. Reload the page to retry.</p>}
              <Summary pending={pending} total={people.length} done={done} />
              <AddPersonForm onAdd={addPerson} />
              <Filters
                month={month}
                status={status}
                count={shown.length}
                total={people.length}
                onMonth={changeMonth}
                onStatus={changeStatus}
              />

              <section aria-label="People" className="grid gap-4 sm:gap-5 lg:grid-cols-2">
                {shown.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    currentMonth={CUR}
                    confirming={confirmId === person.id}
                    onToggle={(monthIndex) => void toggleMonth(person.id, monthIndex)}
                    onAskDelete={() => setConfirmId(person.id)}
                    onCancelDelete={() => setConfirmId(null)}
                    onDelete={() => void deletePerson(person.id)}
                  />
                ))}
              </section>

              {shown.length === 0 && <EmptyState hasPeople={people.length > 0} month={month} status={status} />}
              <footer className="mt-10 border-t border-gray-200 pt-5 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:mt-12">
                Changes are shared with signed-in tracker members.
              </footer>
            </>
          )}
        </main>
      )}
    </div>
  );
}