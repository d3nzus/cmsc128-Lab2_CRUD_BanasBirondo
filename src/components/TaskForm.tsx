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

const labelClass = "mb-1.5 block text-sm font-semibold text-white";
const inputClass =
  "w-full min-w-0 rounded-lg border border-olive-leaf-300 bg-cornsilk-50 px-3 py-2.5 text-black-forest-950 shadow-sm outline-none transition placeholder:text-cyan-700/50 hover:border-cornsilk-300 focus:border-cornsilk-300 focus:ring-2 focus:ring-cornsilk-300/60";

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
    <main className="flex flex-1 items-center justify-center bg-teal-100 p-4 py-8 sm:p-8">
      <section
        aria-labelledby="task-form-heading"
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
              <rect x="4" y="3" width="16" height="18" rx="3" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive-leaf-100">
              Task details
            </p>
            <h1 id="task-form-heading" className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {heading}
            </h1>
            <p className="mt-1 text-sm leading-6 text-olive-leaf-100">
              Fields marked with <span className="text-cornsilk-200">*</span> are required.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="task-title">
                Title <span className="text-cornsilk-300" aria-hidden="true">*</span>
              </label>
              <input
                autoFocus
                className={inputClass}
                id="task-title"
                placeholder="e.g. Submit the lab report"
                value={values.title}
                onChange={(event) => updateValue("title", event.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="task-date">
                Due date <span className="text-cornsilk-300" aria-hidden="true">*</span>
              </label>
              <input
                className={inputClass}
                id="task-date"
                type="date"
                value={values.date}
                onChange={(event) => updateValue("date", event.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="task-time">
                Due time <span className="text-cornsilk-300" aria-hidden="true">*</span>
              </label>
              <input
                className={inputClass}
                id="task-time"
                type="time"
                value={values.time}
                onChange={(event) => updateValue("time", event.target.value)}
                required
              />
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-sm font-semibold text-white">
                Priority <span className="text-cornsilk-300" aria-hidden="true">*</span>
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                      values.priority === option.value
                        ? "border-cornsilk-200 bg-olive-leaf-600 ring-2 ring-cornsilk-300/50"
                        : "border-olive-leaf-500 bg-olive-leaf-800/70 hover:bg-olive-leaf-900"
                    }`}
                  >
                    <input
                      className="size-4 accent-cornsilk-300"
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
              <label className={labelClass} htmlFor="task-category">
                Category <span className="text-cornsilk-300" aria-hidden="true">*</span>
              </label>
              <select
                className={inputClass}
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
              type="submit"
              disabled={saving}
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
              {saving ? savingLabel : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default TaskForm;
