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
      className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-olive-leaf-600 p-3 text-cyan-50 shadow-xl shadow-teal-600/50 sm:p-4"
      onSubmit={handleSubmit}
    >
      <label htmlFor="invite-email">Invite someone to this list using their email:</label>
      <input
        className="min-w-0 rounded-md border-0 bg-cornsilk-300 px-2 py-1.5 text-cyan-950"
        id="invite-email"
        type="email"
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        className="rounded bg-black-forest-500 px-4 py-2 font-bold text-white hover:bg-black-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={sending || taskListId === null}
      >
        {sending ? "Sending..." : "Send"}
      </button>
      {error && <p className="w-full text-red-100" role="alert">{error}</p>}
      {message && <p className="w-full" role="status">{message}</p>}
    </form>
  );
}

export default InviteForm;