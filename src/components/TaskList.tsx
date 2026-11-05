import { useEffect, useRef, useState } from "react";
import { Link, useBlocker, useSearchParams } from "react-router-dom";
import type { Task } from "../types/types.ts";
import {
  deleteTasks,
  getTaskLists,
  getTasksForList,
  toggleTaskDone,
  type UserTaskList,
} from "../utils/api.ts";
import {
  clearPendingDeleteIds,
  queuePendingDelete,
  readPendingDeleteIds,
  undoPendingDelete,
} from "../utils/helper.ts";
import { getCurrentUser } from "../utils/userAuth.ts";
import AddTask from "./AddTask.tsx";
import TaskListDropdown from "./TaskListDropdown.tsx";
import TaskTable from "./TaskTable.tsx";
import InviteForm from "./InviteForm.tsx";

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function TaskList() {
  const [searchParams] = useSearchParams();
  const requestedTaskListId = searchParams.get("tasklist_id");
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<UserTaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<number>>(new Set());
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const initialized = useRef(false);
  const navigationCommitInProgress = useRef(false);
  const blocker = useBlocker(pendingDeleteIds.size > 0);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    void (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Please sign in to view task lists.");
        setUserId(user.id);

        const queuedIds = readPendingDeleteIds(user.id);
        clearPendingDeleteIds(user.id);
        if (queuedIds.length > 0) {
          try {
            await deleteTasks(queuedIds);
          } catch (error) {
            setActionError(`Could not finish pending deletes: ${errorText(error)}`);
          }
        }

        const lists = await getTaskLists(user.id);
        setTaskLists(lists);
        if (lists.length > 0) {
          const selectedList = lists.find((list) => String(list.id) === requestedTaskListId)
            ?? lists[0];
          setSelectedTaskListId(selectedList.id);
        }
      } catch (error) {
        setLoadError(errorText(error));
      } finally {
        setLoadingLists(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedTaskListId) {
      setTasks([]);
      return;
    }

    let cancelled = false;
    setTasks([]);
    setLoadingTasks(true);
    setLoadError("");
    void getTasksForList(Number(selectedTaskListId))
      .then((loadedTasks) => {
        if (!cancelled) setTasks(loadedTasks);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(`Could not load tasks: ${errorText(error)}`);
      })
      .finally(() => {
        if (!cancelled) setLoadingTasks(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTaskListId]);

  function handleDelete(taskId: number) {
    if (!userId) return;
    setPendingDeleteIds((current) => queuePendingDelete(current, taskId, userId));
  }

  function handleUndoDelete(taskId: number) {
    if (!userId) return;
    setPendingDeleteIds((current) => undoPendingDelete(current, taskId, userId));
  }

  async function handleToggleDone(task: Task) {
    try {
      await toggleTaskDone(task.id, !task.done);
      setTasks((current) => current.map((item) =>
        item.id === task.id ? { ...item, done: !task.done } : item,
      ));
    } catch (error) {
      setActionError(`Could not update task: ${errorText(error)}`);
    }
  }

  useEffect(() => {
    if (blocker.state !== "blocked" || navigationCommitInProgress.current) return;

    navigationCommitInProgress.current = true;
    const taskIds = [...pendingDeleteIds];
    if (userId) clearPendingDeleteIds(userId);

    void deleteTasks(taskIds)
      .catch((error: unknown) => {
        setActionError(`Could not delete tasks: ${errorText(error)}`);
      })
      .finally(() => {
        setPendingDeleteIds(new Set());
        navigationCommitInProgress.current = false;
        if (blocker.state === "blocked") blocker.proceed();
      });
  }, [blocker, pendingDeleteIds, userId]);

  return (
    <div className="space-y-5 text-cyan-950">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive-leaf-700">
            Workspace
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-cyan-950 sm:text-3xl">
            Your tasks
          </h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-cyan-800 sm:text-right">
          Pick a list, add tasks, and keep everyone in sync.
        </p>
      </div>

      {loadError && (
        <p
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
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
          {loadError}
        </p>
      )}

      {actionError && (
        <p
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
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
          {actionError}
        </p>
      )}

      {loadingLists ? (
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
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
            />
          </svg>
          Loading your task lists…
        </div>
      ) : loadError && taskLists.length === 0 ? null : taskLists.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-olive-leaf-300 bg-white/80 p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-olive-leaf-100 text-olive-leaf-700">
            <svg
              aria-hidden="true"
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16" />
              <path d="M5 7l1 13h12l1-13" />
              <path d="M9 7V4h6v3" />
              <path d="M9 12h6M9 16h4" />
            </svg>
          </span>
          <h2 className="mt-4 text-xl font-bold text-cyan-950">No task lists yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cyan-800">
            Create your first list to start organizing tasks, setting priorities, and
            inviting teammates.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-black-forest-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-forest-700"
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
            Create a task list
          </Link>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-olive-leaf-200 bg-white/85 p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <TaskListDropdown
                taskLists={taskLists}
                selectedTaskListId={selectedTaskListId}
                onSelect={setSelectedTaskListId}
              />
              <AddTask taskListId={selectedTaskListId} />
            </div>
          </section>

          <TaskTable
            tasks={tasks}
            loading={loadingTasks}
            pendingDeleteIds={pendingDeleteIds}
            emptyMessage={
              selectedTaskListId
                ? "No tasks in this list yet. Use “Add task” to create one."
                : "Create or select a task list to get started."
            }
            onDelete={handleDelete}
            onUndoDelete={handleUndoDelete}
            onToggleDone={(task) => void handleToggleDone(task)}
          />

          <InviteForm taskListId={selectedTaskListId} />
        </>
      )}
    </div>
  );
}

export default TaskList;
