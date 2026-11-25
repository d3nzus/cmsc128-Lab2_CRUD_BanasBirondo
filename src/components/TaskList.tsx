import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Task } from "../types/types.ts";
import {
  deleteTask,
  getTaskLists,
  getTasksForList,
  restoreTask,
  toggleTaskDone,
  type UserTaskList,
} from "../utils/api.ts";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../utils/userAuth.ts";
import AddTask from "./AddTask.tsx";
import TaskListDropdown from "./TaskListDropdown.tsx";
import TaskTable from "./TaskTable.tsx";
import InviteForm from "./InviteForm.tsx";

type Toast =
  | { kind: "undo"; task: Task }
  | { kind: "message"; tone: "success" | "error"; text: string };

const undoWindowMs = 8000;
const messageDurationMs = 5000;

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function TaskToast({
  toast,
  onUndo,
  onDismiss,
  toastRef,
}: {
  toast: Toast;
  onUndo: (task: Task) => void;
  onDismiss: () => void;
  toastRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isError = toast.kind === "message" && toast.tone === "error";

  return (
    <div
      ref={toastRef}
      role={isError ? "alert" : "status"}
      className="group fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 overflow-hidden rounded-lg bg-olive-leaf-950 px-4 py-3 text-cornsilk-100 shadow-xl/30 sm:inset-x-auto sm:right-6 sm:left-auto"
    >
      <p className="min-w-0 text-sm">
        {toast.kind === "undo" ? `Deleted "${toast.task.title}".` : toast.text}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        {toast.kind === "undo" && (
          <button
            className="rounded-md bg-cornsilk-300 px-3 py-1.5 text-sm font-bold text-cyan-950 hover:bg-cornsilk-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-100"
            type="button"
            onClick={() => onUndo(toast.task)}
            aria-label={`Undo delete of ${toast.task.title}`}
          >
            Undo
          </button>
        )}
        <button
          className="rounded-md px-2 py-1.5 text-sm font-semibold text-cornsilk-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-100"
          type="button"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
      {toast.kind === "undo" && (
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-cornsilk-100/20">
          <div
            className="h-full origin-left bg-cornsilk-300 group-focus-within:[animation-play-state:paused]"
            style={{ animation: `undo-countdown ${undoWindowMs}ms linear forwards` }}
          />
        </div>
      )}
    </div>
  );
}

function TaskList() {
  const [searchParams] = useSearchParams();
  const requestedTaskListId = searchParams.get("tasklist_id");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<UserTaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const initialized = useRef(false);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    void (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Please sign in to view task lists.");

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

  async function handleDelete(task: Task) {
    setActionError("");
    setDeletingId(task.id);

    // If the row's Delete button had focus, removing the row would drop focus
    // to <body>; the undo toast takes it instead.
    const focusWasOnDelete =
      document.activeElement instanceof HTMLElement &&
      document.activeElement.dataset.taskDelete === String(task.id);

    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      // Single undo slot: a new delete replaces the previous toast, so only the
      // most recent delete can be undone.
      setToast({ kind: "undo", task });

      if (focusWasOnDelete) {
        requestAnimationFrame(() => {
          toastRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        });
      }
    } catch (error) {
      setActionError(`Could not delete "${task.title}": ${errorText(error)}`);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUndoDelete(task: Task) {
    setToast(null);
    setActionError("");

    try {
      const restored = await restoreTask(task);
      setTasks((current) => [...current, restored]);
      setToast({
        kind: "message",
        tone: "success",
        text: `Restored "${task.title}".`,
      });
    } catch (error) {
      setActionError(`Could not restore "${task.title}": ${errorText(error)}`);
    }
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

  // Auto-dismiss the toast, but leave it up while the user is focused on it so
  // the Undo button cannot disappear mid-interaction.
  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      if (toastRef.current?.contains(document.activeElement)) return;
      setToast(null);
    }, toast.kind === "undo" ? undoWindowMs : messageDurationMs);

    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <div className="w-full min-w-0 space-y-4 text-cyan-950">
      <TaskListDropdown
        taskLists={taskLists}
        selectedTaskListId={selectedTaskListId}
        onSelect={setSelectedTaskListId}
      />

      <div className="space-y-3">
        <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:justify-start">
          <AddTask taskListId={selectedTaskListId} />
          {selectedTaskListId && (
            <Link
              to={`/calendar?tasklist_id=${selectedTaskListId}`}
              className="inline-flex h-full items-center rounded-xl bg-black-forest-700 px-4 py-2 font-bold text-white shadow-sm shadow-teal-600/50 hover:bg-black-forest-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Calendar
            </Link>
          )}
        </div>
        <TaskTable
          tasks={tasks}
          deletingId={deletingId}
          onDelete={(task) => void handleDelete(task)}
          onToggleDone={(task) => void handleToggleDone(task)}
        />
      </div>

      {(loadingLists || loadingTasks) && <p role="status">Loading...</p>}
      {loadError && <p className="text-red-800" role="alert">{loadError}</p>}
      {actionError && <p className="text-red-800" role="alert">{actionError}</p>}
      {!loadingLists && !loadingTasks && !loadError && tasks.length === 0 && (
        <p>
          {selectedTaskListId
            ? "No tasks in this task list yet."
            : "You don't have a task list yet. Use \"+ New task list\" above to create one."}
        </p>
      )}

      {selectedTaskListId !== null && <InviteForm taskListId={selectedTaskListId} />}

      {toast && (
        <TaskToast
          key={toast.kind === "undo" ? `undo-${toast.task.id}` : `message-${toast.text}`}
          toast={toast}
          onUndo={(task) => void handleUndoDelete(task)}
          onDismiss={() => setToast(null)}
          toastRef={toastRef}
        />
      )}
    </div>
  );
}

export default TaskList;
