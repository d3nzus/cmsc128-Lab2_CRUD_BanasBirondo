import { useState } from "react";
import { sendInvite } from "../utils/api";

function InviteForm({ taskListId }: { taskListId: number | null }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (taskListId === null) return;
    setSending(true);
    setError("");
    setMessage("");
    try {
      await sendInvite(taskListId, email);
      setMessage(`Invitation sent to ${email.trim()}.`);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send invitation.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      className="rounded-2xl border border-olive-leaf-800/20 bg-olive-leaf-700 p-4 shadow-lg shadow-teal-900/10 sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-cornsilk-300 text-olive-leaf-900">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
            </span>
            <h2 className="text-base font-bold text-white">Invite a collaborator</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-olive-leaf-100">
            Share this task list by email. Pending invitations appear in their profile.
          </p>
          <label className="sr-only" htmlFor="invite-email">
            Email address
          </label>
          <input
            className="mt-3 min-h-11 w-full min-w-0 rounded-lg border border-olive-leaf-300/60 bg-cornsilk-50 px-3 py-2.5 text-cyan-950 shadow-sm outline-none transition placeholder:text-cyan-700/60 focus:border-cornsilk-300 focus:ring-2 focus:ring-cornsilk-300/60"
            id="invite-email"
            type="email"
            autoComplete="off"
            placeholder="teammate@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-black-forest-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={sending || taskListId === null}
        >
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
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
          {sending ? "Sending…" : "Send invite"}
        </button>
      </div>
      {error && (
        <p className="mt-3 rounded-lg border border-red-300/50 bg-red-950/30 px-3 py-2 text-sm text-red-100" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-3 rounded-lg border border-cornsilk-300/40 bg-olive-leaf-800 px-3 py-2 text-sm text-cornsilk-50" role="status">
          {message}
        </p>
      )}
    </form>
  );
}

export default InviteForm;
