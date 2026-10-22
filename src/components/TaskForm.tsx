import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CategoryOption, NewTaskForm } from "../types/types.ts";
import { getCategories } from "../utils/api.ts";
import { priorityOptions } from "../utils/helper.ts";

type TaskFormProps = {
  heading: string;
  submitLabel: string;
  savingLabel: string;
  initialValues?: NewTaskForm;
  onSubmit: (values: NewTaskForm) => Promise<void>;
};

const emptyValues: NewTaskForm = {
  title: "",
  date: "",
  time: "",
  priority: "mid",
  categoryId: "",
};

function TaskForm({
  heading,
  submitLabel,
  savingLabel,
  initialValues = emptyValues,
  onSubmit,
}: TaskFormProps) {
  const [values, setValues] = useState(initialValues);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    void getCategories()
      .then((loadedCategories) => {
        if (!cancelled) setCategories(loadedCategories);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : String(error));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateValue(field: keyof NewTaskForm, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    try {
      await onSubmit(values);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-teal-100 p-4 py-10 inset-shadow-teal-200 inset-shadow-sm sm:p-8">
      <section
        aria-labelledby="task-form-heading"
        className="w-full max-w-2xl rounded-lg bg-olive-leaf-700 p-5 text-white shadow-xl shadow-teal-700/30 sm:p-8"
      >
        <h1 id="task-form-heading" className="text-2xl font-bold sm:text-3xl">
          {heading}
        </h1>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="task-title">
                Title
              </label>
              <input
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-title"
                value={values.title}
                onChange={(event) => updateValue("title", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="task-date">
                Date
              </label>
              <input
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-date"
                type="date"
                value={values.date}
                onChange={(event) => updateValue("date", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="task-time">
                Time
              </label>
              <input
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-time"
                type="time"
                value={values.time}
                onChange={(event) => updateValue("time", event.target.value)}
                required
              />
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-sm font-semibold">Priority</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm ${values.priority === option.value ? "border-cornsilk-300 bg-olive-leaf-600" : "border-olive-leaf-300 bg-olive-leaf-800 hover:bg-olive-leaf-900"}`}
                  >
                    <input
                      className="accent-cornsilk-300"
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={values.priority === option.value}
                      onChange={(event) => updateValue("priority", event.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="task-category">
                Category
              </label>
              <select
                className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
                id="task-category"
                value={values.categoryId}
                onChange={(event) => updateValue("categoryId", event.target.value)}
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && <p className="text-sm text-red-100" role="alert">{errorMessage}</p>}

          <div className="flex flex-col-reverse gap-3 border-t border-olive-leaf-500 pt-5 sm:flex-row sm:justify-end">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-copperwood-600 px-5 py-2 font-bold text-white hover:bg-copperwood-700"
              to="/home"
            >
              Cancel
            </Link>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-black-forest-500 px-5 py-2 font-bold text-white hover:bg-black-forest-600 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={saving}
            >
              {saving ? savingLabel : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default TaskForm;
