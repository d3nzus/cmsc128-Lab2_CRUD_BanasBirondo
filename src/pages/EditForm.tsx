import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TaskForm from "../components/TaskForm.tsx";
import { editTask, getTaskByID } from "../utils/api.ts";
import { createTaskPayload } from "../utils/helper.ts";
import type { NewTaskForm } from "../types/types.ts";

function EditForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");
  const requestedTaskListId = searchParams.get("tasklist_id");
  const [initialValues, setInitialValues] = useState<NewTaskForm | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!taskId) {
      setLoadError("Task ID was not provided.");
      return;
    }

    let cancelled = false;
    void getTaskByID(taskId)
      .then((task) => {
        if (cancelled) return;
        setInitialValues({
          title: task.title ?? "",
          date: task.due_date ?? "",
          time: (task.due_time ?? "").slice(0, 5),
          priority: task.priority ?? "mid",
          categoryId: String(task.category_id ?? ""),
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error));
      });

    return () => {
      cancelled = true;
    };
  }, [taskId]);

  async function handleSubmit(values: NewTaskForm) {
    if (!taskId) throw new Error("Task ID was not provided.");
    await editTask(taskId, createTaskPayload(values));
    navigate(requestedTaskListId
      ? `/home?tasklist_id=${encodeURIComponent(requestedTaskListId)}`
      : "/home");
  }

  if (loadError) {
    return (
      <main className="flex flex-1 items-center justify-center bg-teal-100 p-4 py-8 sm:p-8">
        <section
          className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm"
          role="alert"
        >
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-700">
            <svg
              aria-hidden="true"
              className="size-6"
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
          </span>
          <h1 className="mt-4 text-xl font-bold text-cyan-950">Could not load task</h1>
          <p className="mt-2 text-sm leading-6 text-cyan-800">{loadError}</p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-black-forest-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-forest-700"
            to="/home"
          >
            Back to tasks
          </Link>
        </section>
      </main>
    );
  }

  if (!initialValues) {
    return (
      <main className="flex flex-1 items-center justify-center bg-teal-100 p-4 py-8 sm:p-8">
        <div
          className="flex items-center gap-3 rounded-2xl border border-olive-leaf-200 bg-white/80 p-5 text-sm font-medium text-cyan-800 shadow-sm"
          role="status"
        >
          <svg
            aria-hidden="true"
            className="size-5 animate-spin text-olive-leaf-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z" />
          </svg>
          Loading task…
        </div>
      </main>
    );
  }

  return (
    <TaskForm
      heading="Edit Task"
      submitLabel="Edit Task"
      savingLabel="Editing..."
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}

export default EditForm;
