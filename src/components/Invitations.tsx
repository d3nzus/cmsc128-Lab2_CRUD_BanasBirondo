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
  const headerClass = "bg-olive-leaf-600 p-3 text-cyan-50 sm:p-4";

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
        <div className="w-full max-w-full overflow-x-auto rounded-xl shadow-xl shadow-teal-600/50">
          <table className="w-full border-collapse text-cyan-950">
            <thead>
              <tr>
                <th className={`${headerClass} text-left`}>Task List</th>
                <th className={`${headerClass} text-left`}>Invited By</th>
                <th className={headerClass}>Actions</th>
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
                        className="w-full rounded bg-black-forest-500 px-2 py-2 font-bold text-white hover:bg-black-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={() => handleAccept(invite.id)}
                        disabled={busyId !== null}
                      >
                        Accept
                      </button>
                      <button
                        className="w-full rounded bg-red-600 px-2 py-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={() => handleDecline(invite.id)}
                        disabled={busyId !== null}
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
      )}
    </section>
  );
}

export default Invitations;