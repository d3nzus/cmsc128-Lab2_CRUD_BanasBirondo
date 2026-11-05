import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../utils/userAuth";
import Title from "./Title";
import { deleteTaskLists, getTaskLists } from "../utils/api";
import type { UserTaskList } from "../utils/api";

type MyTaskListsProps = {
  title?: string;
  titleId?: string;
};

const cellClass = "px-3 py-3 align-middle sm:px-4";
const headerClass =
  "bg-olive-leaf-600 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-cornsilk-50 sm:px-4";

function MyTaskLists({ title = "My Task Lists", titleId }: MyTaskListsProps) {
  const [lists, setLists] = useState<UserTaskList[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function loadLists() {
    try {
      const user = await getCurrentUser();
      if (!user) return;
      setLists(await getTaskLists(user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load task lists.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLists();
  }, []);

  function toggleSelected(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    setSelected((prev) => (prev.length === lists.length ? [] : lists.map((list) => list.id)));
  }

  async function handleDelete() {
    if (selected.length === 0) return;
    const ok = window.confirm(
      `Delete ${selected.length} task list(s) and all of their tasks? This can't be undone.`
    );
    if (!ok) return;

    setDeleting(true);
    setError("");
    try {
      await deleteTaskLists(selected);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setSelected([]);
      await loadLists();
      setDeleting(false);
    }
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby={titleId}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Title id={titleId}>{title}</Title>
          {!loading && lists.length > 0 && (
            <span className="rounded-full bg-olive-leaf-100 px-2.5 py-0.5 text-xs font-bold text-olive-leaf-900">
              {lists.length}
            </span>
          )}
        </div>
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-black-forest-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-forest-700 sm:w-auto"
          to="/addTaskList"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New task list
        </Link>
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
          Loading task lists…
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && lists.length === 0 && (
        <div className="rounded-xl border border-dashed border-olive-leaf-300 bg-white/70 p-6 text-center">
          <p className="text-sm font-semibold text-cyan-950">No task lists yet</p>
          <p className="mt-1 text-sm leading-6 text-cyan-800">
            Create your first list to start organizing tasks with others.
          </p>
        </div>
      )}

      {lists.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-olive-leaf-200 bg-white/80 p-3 text-sm text-cyan-900 sm:p-4">
            <span aria-live="polite" className="font-medium">
              {selected.length === 0
                ? `${lists.length} ${lists.length === 1 ? "list" : "lists"}`
                : `${selected.length} of ${lists.length} selected`}
            </span>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-copperwood-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-copperwood-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-700 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={handleDelete}
              disabled={selected.length === 0 || deleting}
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
                <path d="M4 7h16" />
                <path d="M10 11v6M14 11v6" />
                <path d="M6 7l1 13h10l1-13" />
                <path d="M9 7V4h6v3" />
              </svg>
              {deleting ? "Deleting…" : "Delete selected"}
            </button>
          </div>
          <div className="w-full max-w-full overflow-hidden rounded-xl border border-olive-leaf-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-cyan-950">
                <caption className="sr-only">Your task lists</caption>
                <thead>
                  <tr>
                    <th className={`${headerClass} w-20 text-center`}>
                      <span className="sr-only">Select</span>
                      <input
                        className="size-4 accent-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-600"
                        type="checkbox"
                        aria-label="Select all task lists"
                        checked={lists.length > 0 && selected.length === lists.length}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className={headerClass}>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {lists.map((list) => (
                    <tr
                      key={list.id}
                      className="border-t border-olive-leaf-100 bg-white transition hover:bg-olive-leaf-50"
                    >
                      <td className="w-20 px-3 py-3 text-center align-middle sm:px-4">
                        <input
                          className="size-4 accent-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-600"
                          type="checkbox"
                          aria-label={`Select ${list.name ?? "Untitled list"}`}
                          checked={selected.includes(list.id)}
                          onChange={() => toggleSelected(list.id)}
                        />
                      </td>
                      <td className={cellClass}>
                        <Link
                          className="inline-flex min-h-11 items-center gap-2 font-semibold text-black-forest-800 underline decoration-black-forest-500/40 underline-offset-2 hover:text-black-forest-950 hover:decoration-black-forest-950 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-600"
                          to={`/home?tasklist_id=${list.id}`}
                        >
                          <svg
                            aria-hidden="true"
                            className="size-4 text-olive-leaf-600"
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
                          </svg>
                          {list.name ?? "Untitled list"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyTaskLists;
