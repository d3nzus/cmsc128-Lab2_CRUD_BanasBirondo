import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
      <main className="flex min-h-screen items-center justify-center bg-teal-100 p-6">
        <p className="text-red-800" role="alert">Could not load task: {loadError}</p>
      </main>
    );
  }

  if (!initialValues) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-teal-100 p-6">
        <p role="status">Loading task...</p>
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
