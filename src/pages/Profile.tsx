import React from "react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/userAuth";
import Title from "../components/Title";
import { deleteTaskLists, getTaskLists, getUserName } from "../utils/api";
import type { UserTaskList } from "../utils/api";

function Profile() {
    const [username, setUsername] = useState("");
    const [lists, setLists] = useState<UserTaskList[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
    async function fetchUsername() {
        const result = await getUserName();
        setUsername(result ?? "");
    }
    fetchUsername();
    loadLists();
    }, []);
    async function loadLists() {
        try {
        const user = await getCurrentUser();
        if (!user) return;
        setLists(await getTaskLists(user.id));
        } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load task lists.");
        }
    }
    function toggleSelected(id: number) {
        setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
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
        await loadLists(); // re-sync with the server even if some deletes failed
        setDeleting(false);
        }
    }
    const cellClass = "p-3 sm:p-4";
    const headerClass = "bg-olive-leaf-600 p-3 text-cyan-50 sm:p-4";
    return(
        <main className="flex min-h-screen w-full justify-center bg-teal-100 p-3 inset-shadow-teal-200 inset-shadow-sm sm:p-6">
            <div className="w-full max-w-2xl min-w-0 space-y-4 text-cyan-950">
                <Title>Hello {username || "Loading..."}</Title>

                <section className="space-y-3">
                <Title>My Task Lists</Title>

                {loading && <p role="status">Loading...</p>}
                {error && <p className="text-red-800" role="alert">{error}</p>}
                {!loading && !error && lists.length === 0 && <p>No task lists yet.</p>}

                {lists.length > 0 && (
                    <>
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-olive-leaf-600 p-3 text-cyan-50 shadow-xl shadow-teal-600/50 sm:p-4">
                        <span>{selected.length} selected</span>
                        <button
                        className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={handleDelete}
                        disabled={selected.length === 0 || deleting}
                        >
                        {deleting ? "Deleting..." : "Delete selected"}
                        </button>
                    </div>

                    <div className="w-full max-w-full overflow-x-auto rounded-xl shadow-xl shadow-teal-600/50">
                        <table className="w-full border-collapse text-cyan-950">
                        <thead>
                            <tr>
                            <th className={headerClass}>Select</th>
                            <th className={`${headerClass} text-left`}>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists.map((list) => (
                            <tr
                                key={list.id}
                                className="bg-sunlit-clay-200 inset-shadow-sm/30 inset-shadow-sunlit-clay-400"
                            >
                                <td className="w-24 p-4 text-center align-middle">
                                <input
                                    className="size-5 accent-black-forest-500"
                                    type="checkbox"
                                    aria-label={`Select ${list.name ?? "Untitled list"}`}
                                    checked={selected.includes(list.id)}
                                    onChange={() => toggleSelected(list.id)}
                                />
                                </td>
                                <td className={cellClass}>{list.name ?? "Untitled list"}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </>
                )}
                </section>

                <Title>Invitations</Title>
            </div>
        </main>
    )
}

export default Profile;