import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { editTask, getCategories, getTaskByID } from "../utils/api";
import { CategoryOption } from "../types/types.ts";
import { createTaskPayload, priorityOptions } from "../utils/helper";

function EditForm() {
  const [searchParams] = useSearchParams();
  const task_id = searchParams.get("task_id");

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("mid");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getCategories();
      setCategories((data ?? []) as CategoryOption[]);
    })();
  }, []);

  useEffect(() => {
    if (!task_id) return;

    (async () => {
      const task = await getTaskByID(task_id);
      if (!task) return;

      setTitle(task.title ?? "");
      setTime((task.due_time ?? "").slice(0, 5));
      setDate(task.due_date ?? "");
      setPriority(task.priority ?? "mid");
      setCategoryId(String(task.category_id ?? ""));
    })();
  }, [task_id]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stops the page from reloading
    setSaving(true);

    const updated = await editTask(
      task_id,
      createTaskPayload({ title, date, time, priority, categoryId }),
    ); //change to edit task

    setSaving(false);

    if (!updated) return;

    navigate("/home"); // go back to the task list
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-teal-100 p-4 py-10 inset-shadow-teal-200 inset-shadow-sm sm:p-8">
      <section
        aria-labelledby="edit-task-heading"
        className="w-full max-w-2xl rounded-lg bg-olive-leaf-700 p-5 text-white shadow-xl shadow-teal-700/30 sm:p-8"
      >
        <h1 id="edit-task-heading" className="text-left text-2xl font-bold sm:text-3xl">
          Edit Task
        </h1>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-left text-sm font-semibold" htmlFor="task-title">
                Title
              </label>
              <input
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-left text-sm font-semibold" htmlFor="task-date">
                Date
              </label>
              <input
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-left text-sm font-semibold" htmlFor="task-time">
                Time
              </label>
              <input
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-left text-sm font-semibold">Priority</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm ${priority === option.value ? "border-cornsilk-300 bg-olive-leaf-600" : "border-olive-leaf-300 bg-olive-leaf-800 hover:bg-olive-leaf-900"}`}
                  >
                    <input
                      className="accent-cornsilk-300"
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={priority === option.value}
                      onChange={(e) => setPriority(e.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-left text-sm font-semibold" htmlFor="task-category">
                Category
              </label>
              <select
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-olive-leaf-500 pt-5 sm:flex-row sm:justify-end">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-copperwood-600 px-5 py-2 font-bold text-white hover:bg-copperwood-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
              to="/home"
            >
              Cancel
            </Link>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-black-forest-500 px-5 py-2 font-bold text-white hover:bg-black-forest-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={saving}
          >
            {saving ? "Editing..." : "Edit Task"}
          </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditForm;
