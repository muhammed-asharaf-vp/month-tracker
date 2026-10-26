import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase, supabaseConfigured } from "./supabase";
import { FULL } from "./constants";
import Header from "./components/Header";
import AddPersonForm from "./components/AddPersonForm";
import Filters from "./components/Filters";
import PersonCard from "./components/PersonCard";
import EmptyState from "./components/EmptyState";
import AuthGate from "./components/AuthGate";
import DashboardShell from "./components/DashboardShell";
import DashboardOverview from "./components/DashboardOverview";

const CUR = new Date().getMonth();
const PERSON_FIELDS = "id,name,dob,months";
const TAB_META = {
  overview: ["Dashboard", "Your yearly tracker at a glance."],
  add: ["Add Person", "Add someone to the shared tracker."],
  people: ["People", "Search and update monthly checklists."],
};

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
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
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
      const matchesName = person.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
      if (!matchesName) return false;
      if (month === "") return true;
      const ticked = !!person.months[Number(month)];
      return status === "yes" ? ticked : !ticked;
    }),
    [people, month, status, query]
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

  const navigate = (tab) => {
    setActiveTab(tab);
    setConfirmId(null);
  };
  const changeMonth = (value) => { setMonth(value); setConfirmId(null); };
  const changeStatus = (value) => { setStatus(value); setConfirmId(null); };

  return (
    <div className="min-h-screen min-h-dvh overflow-x-hidden bg-canvas font-sans text-ink antialiased [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-accent">
      {authLoading ? (
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Header />
          <p role="status" className="text-sm text-muted">Checking sign-in…</p>
        </main>
      ) : !session ? (
        <AuthGate configured={supabaseConfigured} onSignIn={signIn} />
      ) : (
        <DashboardShell
          activeTab={activeTab}
          onNavigate={navigate}
          email={session.user.email}
          onSignOut={signOut}
          title={TAB_META[activeTab][0]}
          description={TAB_META[activeTab][1]}
        >
          {actionError && <p role="alert" className="mb-5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink">{actionError}</p>}
          {peopleLoading ? (
            <p role="status" className="surface p-5 text-sm text-muted">Loading shared tracker…</p>
          ) : !peopleLoaded ? (
            <div role="alert" className="surface p-5">
              <p className="text-sm text-ink">Could not load the shared tracker. {dataError}</p>
              <button onClick={() => void loadPeople({ initial: true })} className="mt-4 h-10 rounded-xl bg-accent-deep px-4 text-sm font-semibold text-white hover:bg-accent">Try again</button>
            </div>
          ) : (
            <>
              {dataError && <p role="alert" className="mb-5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink">Live refresh failed: {dataError}. Reload the page to retry.</p>}

              {activeTab === "overview" && (
                <DashboardOverview
                  pending={pending}
                  total={people.length}
                  done={done}
                  currentMonth={FULL[CUR]}
                  onNavigate={navigate}
                />
              )}

              {activeTab === "add" && <AddPersonForm onAdd={addPerson} />}

              {activeTab === "people" && (
                <>
                  <Filters
                    month={month}
                    status={status}
                    count={shown.length}
                    total={people.length}
                    query={query}
                    onQuery={setQuery}
                    onMonth={changeMonth}
                    onStatus={changeStatus}
                  />

                  {shown.length > 0 ? (
                    <section aria-label="People" className="surface overflow-hidden">
                      <div className="hidden grid-cols-[minmax(0,1fr)_minmax(150px,220px)_auto] items-center gap-5 border-b border-line bg-canvas px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted md:grid">
                        <span>Person</span>
                        <span>Progress</span>
                        <span className="text-right">Actions</span>
                      </div>
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
                  ) : (
                    <EmptyState
                      hasPeople={people.length > 0}
                      month={month}
                      status={status}
                      query={query}
                    />
                  )}
                </>
              )}
            </>
          )}
        </DashboardShell>
      )}
    </div>
  );
}
