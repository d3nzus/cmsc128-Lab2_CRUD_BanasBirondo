import { useEffect, useState } from "react";
import Title from "./Title";
import { acceptInvite, declineInvite, getMyInvites } from "../utils/api";
import type { TaskListInvite } from "../utils/api";

type InvitationsProps = {
  title?: string;
  titleId?: string;
  onAccepted?: () => void;
};

const cellClass = "px-3 py-3 align-middle sm:px-4";
const headerClass =
  "bg-olive-leaf-600 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-cornsilk-50 sm:px-4";

function Invitations({ title = "Invitations", titleId, onAccepted }: InvitationsProps) {
  const [invites, setInvites] = useState<TaskListInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

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
    <section className="flex flex-col gap-4" aria-labelledby={titleId}>
      <div className="flex min-w-0 items-center gap-2.5">
        <Title id={titleId}>{title}</Title>
        {!loading && invites.length > 0 && (
          <span className="rounded-full bg-copperwood-100 px-2.5 py-0.5 text-xs font-bold text-copperwood-900">
            {invites.length}
          </span>
        )}
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm font-medium text-cyan-800" role="status">
          <svg
            aria-hidden="true"
            className="size-4 animate-spin text-olive-leaf-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z" />
          </svg>
          Loading invitations…
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && invites.length === 0 && (
        <div className="rounded-xl border border-dashed border-copperwood-300 bg-white/70 p-6 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-copperwood-50 text-copperwood-700">
            <svg
              aria-hidden="true"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <p className="mt-3 text-sm font-semibold text-cyan-950">No pending invitations</p>
          <p className="mt-1 text-sm leading-6 text-cyan-800">
            Shared task list invites will appear here.
          </p>
        </div>
      )}

      {invites.length > 0 && (
        <div className="w-full max-w-full overflow-hidden rounded-xl border border-copperwood-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-cyan-950">
              <caption className="sr-only">Pending task list invitations</caption>
              <thead>
                <tr>
                  <th className={headerClass}>Task list</th>
                  <th className={headerClass}>Invited by</th>
                  <th className={headerClass}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr
                    key={invite.id}
                    className="border-t border-copperwood-100 bg-white transition hover:bg-copperwood-50/60"
                  >
                    <td className={`${cellClass} font-semibold text-cyan-950`}>
                      {invite.tasklist_name ?? "Untitled list"}
                    </td>
                    <td className={`${cellClass} text-cyan-800`}>
                      {invite.invited_by_username ?? "Unknown"}
                    </td>
                    <td className={cellClass}>
                      <div className="flex gap-2">
                        <button
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-black-forest-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-black-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-600 disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={() => handleAccept(invite.id)}
                          disabled={busyId !== null}
                        >
                          <svg
                            aria-hidden="true"
                            className="size-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m5 12 4 4L19 6" />
                          </svg>
                          {busyId === invite.id ? "Working…" : "Accept"}
                        </button>
                        <button
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-copperwood-300 bg-copperwood-50 px-3 py-2 text-xs font-bold text-copperwood-900 transition hover:bg-copperwood-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-600 disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={() => handleDecline(invite.id)}
                          disabled={busyId !== null}
                        >
                          <svg
                            aria-hidden="true"
                            className="size-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default Invitations;
