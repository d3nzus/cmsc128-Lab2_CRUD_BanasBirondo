import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Task } from "../types/types.ts";
import { getTasksForList } from "../utils/api.ts";
import TaskCalendar from "../components/TaskCalendar.tsx";

function CalendarPage() {
  const [searchParams] = useSearchParams();
  const taskListId = Number(searchParams.get("tasklist_id"));
  const invalidId = !Number.isInteger(taskListId) || taskListId <= 0;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (invalidId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError("");
    void getTasksForList(taskListId)
      .then((loaded) => {
        if (!cancelled) setTasks(loaded);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(`Could not load tasks: ${error instanceof Error ? error.message : String(error)}`);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [taskListId, invalidId]);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-4 text-cyan-950">
      <Link
        to={invalidId ? "/home" : `/home?tasklist_id=${taskListId}`}
        className="inline-block rounded-md bg-teal-100 px-3 py-2 font-semibold shadow-sm hover:bg-teal-200 focus:outline-2 focus:outline-offset-2 focus:outline-olive-leaf-600"
      >
        &larr; Back to task list
      </Link>

      {invalidId && <p role="alert" className="text-red-800">No task list selected.</p>}
      {loading && <p role="status">Loading...</p>}
      {loadError && <p role="alert" className="text-red-800">{loadError}</p>}
      {!invalidId && !loading && !loadError && <TaskCalendar tasks={tasks} />}
    </main>
  );
}

export default CalendarPage;