import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTaskList } from "../utils/api.ts";

function AddTaskList() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const taskList = await createTaskList(name);
      navigate(`/home?tasklist_id=${taskList.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-teal-100 p-4 py-8 sm:p-8">
      <section
        aria-labelledby="add-tasklist-heading"
        className="w-full max-w-2xl rounded-3xl bg-olive-leaf-700 p-5 text-white shadow-xl shadow-teal-900/20 ring-1 ring-olive-leaf-800/40 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cornsilk-300 text-olive-leaf-900 shadow-sm">
            <svg
              aria-hidden="true"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16" />
              <path d="M5 7l1 13h12l1-13" />
              <path d="M9 7V4h6v3" />
              <path d="M12 11v5M9.5 13.5h5" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive-leaf-100">
              Organize your work
            </p>
            <h1 id="add-tasklist-heading" className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              New task list
            </h1>
            <p className="mt-1 text-sm leading-6 text-olive-leaf-100">
              Give this list a clear name so your team knows what it is for.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white" htmlFor="tasklist-name">
              List name <span className="text-cornsilk-300" aria-hidden="true">*</span>
            </label>
            <input
              autoFocus
              className="w-full min-w-0 rounded-lg border border-olive-leaf-300 bg-cornsilk-50 px-3 py-2.5 text-black-forest-950 shadow-sm outline-none transition placeholder:text-cyan-700/50 hover:border-cornsilk-300 focus:border-cornsilk-300 focus:ring-2 focus:ring-cornsilk-300/60"
              id="tasklist-name"
              maxLength={100}
              placeholder="e.g. CMSC 128 Final Project"
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
            <p className="mt-1.5 text-xs leading-5 text-olive-leaf-100">
              Up to 100 characters.
            </p>
          </div>

          {errorMessage && (
            <p
              className="flex items-start gap-2 rounded-lg border border-red-300/50 bg-red-950/30 p-3 text-sm text-red-100"
              role="alert"
            >
              <svg
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16.5v.5" />
              </svg>
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-olive-leaf-500/70 pt-5 sm:flex-row sm:justify-end">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-cornsilk-200/40 px-5 py-2 text-sm font-bold text-cornsilk-50 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
              to="/home"
            >
              Cancel
            </Link>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cornsilk-300 px-5 py-2 text-sm font-bold text-black-forest-950 shadow-sm transition hover:bg-cornsilk-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving && (
                <svg
                  aria-hidden="true"
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z" />
                </svg>
              )}
              {saving ? "Creating…" : "Create task list"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddTaskList;
