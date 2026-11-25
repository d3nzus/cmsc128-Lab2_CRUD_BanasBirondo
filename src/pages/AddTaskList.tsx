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
    <main className="flex min-h-screen w-full items-center justify-center bg-teal-100 p-4 py-10 inset-shadow-teal-200 inset-shadow-sm sm:p-8">
      <section
        aria-labelledby="add-tasklist-heading"
        className="w-full max-w-2xl rounded-lg bg-olive-leaf-700 p-5 text-white shadow-xl shadow-teal-700/30 sm:p-8"
      >
        <h1 id="add-tasklist-heading" className="text-2xl font-bold sm:text-3xl">
          New Task List
        </h1>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="tasklist-name">
              Name
            </label>
            <input
              autoFocus
              className="w-full rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-700 focus:ring-2 focus:ring-copperwood-300"
              id="tasklist-name"
              maxLength={100}
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </div>

          {errorMessage && <p role="alert" className="text-sm text-red-100">{errorMessage}</p>}

          <div className="flex flex-col-reverse gap-3 border-t border-olive-leaf-500 pt-5 sm:flex-row sm:justify-end">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-cornsilk-300/70 bg-transparent px-5 py-2 font-bold text-cornsilk-50 hover:bg-olive-leaf-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
              to="/home"
            >
              Cancel
            </Link>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-cornsilk-300 px-5 py-2 font-bold text-olive-leaf-950 hover:bg-cornsilk-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving}
              type="submit"
            >
              {saving ? "Creating..." : "Create Task List"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddTaskList;
