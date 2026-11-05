import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Invitations from "../components/Invitations";
import MyTaskLists from "../components/MyTaskLists";
import { getUserName } from "../utils/api";

function Profile() {
  const [username, setUsername] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [listsVersion, setListsVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getUserName()
      .then((result) => {
        if (active) setUsername(result ?? "");
      })
      .catch(() => {
        if (active) setUsername("");
      })
      .finally(() => {
        if (active) setProfileLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayName = username || (profileLoaded ? "Your profile" : "Loading profile…");
  const initials = username.trim().slice(0, 1).toUpperCase() || "✓";

  return (
    <main className="flex flex-1 justify-center bg-teal-100 p-3 text-cyan-950 sm:p-6">
      <div className="w-full min-w-0 max-w-6xl space-y-6">
        <header className="rounded-3xl border border-olive-leaf-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl border-2 border-olive-leaf-300 bg-olive-leaf-100 text-2xl font-bold text-black-forest-900 shadow-sm sm:size-20 sm:text-3xl"
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive-leaf-700">
                  Profile
                </p>
                <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-cyan-950 sm:text-3xl">
                  {displayName}
                </h1>
                <p className="mt-1 text-sm leading-6 text-cyan-800">
                  Manage your task lists and invitations.
                </p>
              </div>
            </div>
            <Link
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-black-forest-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-forest-700 sm:w-auto"
              to="/home"
            >
              Open task board
              <svg
                aria-hidden="true"
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="min-w-0 rounded-2xl border border-olive-leaf-200 bg-white/70 p-4 shadow-sm sm:p-5">
            <MyTaskLists title="Your task lists" titleId="task-lists-heading" key={listsVersion} />
          </div>
          <div className="min-w-0 rounded-2xl border border-copperwood-200 bg-white/70 p-4 shadow-sm sm:p-5">
            <Invitations
              title="Invitations"
              titleId="invitations-heading"
              onAccepted={() => setListsVersion((version) => version + 1)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
