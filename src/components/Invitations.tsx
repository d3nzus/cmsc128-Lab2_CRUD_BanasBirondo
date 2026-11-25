import { useEffect, useState } from "react";
import Title from "./Title";
import { acceptInvite, declineInvite, getMyInvites } from "../utils/api";
import type { TaskListInvite } from "../utils/api";

type InvitationsProps = {
  title?: string;
  onAccepted?: () => void;
};

function Invitations({ title = "Invitations", onAccepted }: InvitationsProps) {
  const [invites, setInvites] = useState<TaskListInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const cellClass = "p-3 sm:p-4";
  const headerClass = "bg-olive-leaf-700 p-3 text-cyan-50 sm:p-4";

  async function loadInvites() {
    try {
      setInvites(await getMyInvites());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load invitations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvites();
  }, []);

  async function handleAccept(id: number) {
    setBusyId(id);
    setError("");
    try {
      await acceptInvite(id);
      onAccepted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not accept invitation.");
    } finally {
      await loadInvites();
      setBusyId(null);
    }
  }

  async function handleDecline(id: number) {
    setBusyId(id);
    setError("");
    try {
      await declineInvite(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not decline invitation.");
    } finally {
      await loadInvites();
      setBusyId(null);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <Title>{title}</Title>

      {loading && <p role="status">Loading...</p>}
      {error && <p className="text-red-800" role="alert">{error}</p>}
      {!loading && !error && invites.length === 0 && <p>No pending invitations.</p>}

      {invites.length > 0 && (
        <>
          <div className="hidden w-full max-w-full overflow-x-auto rounded-xl shadow-xl shadow-teal-600/50 md:block">
          <table className="w-full border-collapse text-cyan-950">
            <caption className="sr-only">Pending invitations</caption>
            <thead>
              <tr>
                <th className={`${headerClass} text-left`} scope="col">Task List</th>
                <th className={`${headerClass} text-left`} scope="col">Invited By</th>
                <th className={headerClass} scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => (
                <tr
                  key={invite.id}
                  className="bg-sunlit-clay-200 inset-shadow-sm/30 inset-shadow-sunlit-clay-400"
                >
                  <td className={cellClass}>{invite.tasklist_name ?? "Untitled list"}</td>
                  <td className={cellClass}>{invite.invited_by_username ?? "Unknown"}</td>
                  <td className={cellClass}>
                    <div className="flex gap-1">
                      <button
                        className="inline-flex min-h-11 w-full items-center justify-center rounded bg-olive-leaf-950 px-2 py-2 font-bold text-cornsilk-50 hover:bg-olive-leaf-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-leaf-700 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={() => handleAccept(invite.id)}
                        disabled={busyId !== null}
                        aria-label={`Accept invitation to ${invite.tasklist_name ?? "Untitled list"}`}
                      >
                        Accept
                      </button>
                      <button
                        className="inline-flex min-h-11 w-full items-center justify-center rounded bg-red-700 px-2 py-2 font-bold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={() => handleDecline(invite.id)}
                        disabled={busyId !== null}
                        aria-label={`Decline invitation to ${invite.tasklist_name ?? "Untitled list"}`}
                      >
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="rounded-lg bg-sunlit-clay-200 p-3 inset-shadow-sm/30 inset-shadow-sunlit-clay-400 sm:p-4"
              >
                <p className="break-words font-semibold">
                  {invite.tasklist_name ?? "Untitled list"}
                </p>
                <p className="mt-0.5 text-xs text-olive-leaf-800">
                  Invited by {invite.invited_by_username ?? "Unknown"}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded bg-olive-leaf-950 px-2 py-2 font-bold text-cornsilk-50 hover:bg-olive-leaf-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-leaf-700 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={() => handleAccept(invite.id)}
                    disabled={busyId !== null}
                    aria-label={`Accept invitation to ${invite.tasklist_name ?? "Untitled list"}`}
                  >
                    Accept
                  </button>
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded bg-red-700 px-2 py-2 font-bold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={() => handleDecline(invite.id)}
                    disabled={busyId !== null}
                    aria-label={`Decline invitation to ${invite.tasklist_name ?? "Untitled list"}`}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default Invitations;