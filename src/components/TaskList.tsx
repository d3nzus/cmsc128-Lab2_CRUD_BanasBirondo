import { useEffect, useRef, useState } from "react";
import { useBlocker, useSearchParams } from "react-router-dom";
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

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function TaskList() {
  const [searchParams] = useSearchParams();
  const requestedTaskListId = searchParams.get("tasklist_id");
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<UserTaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState("");
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
          setSelectedTaskListId(String(selectedList.id));
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
    <div className="w-full min-w-0 space-y-4 text-cyan-950">
      <TaskListDropdown
        taskLists={taskLists}
        selectedTaskListId={selectedTaskListId}
        onSelect={setSelectedTaskListId}
      />

      <div className="space-y-3">
        <div className="flex w-full justify-center sm:justify-start">
          <AddTask taskListId={selectedTaskListId} />
        </div>
        <TaskTable
          tasks={tasks}
          pendingDeleteIds={pendingDeleteIds}
          onDelete={handleDelete}
          onUndoDelete={handleUndoDelete}
          onToggleDone={(task) => void handleToggleDone(task)}
        />
      </div>

      {(loadingLists || loadingTasks) && <p role="status">Loading...</p>}
      {loadError && <p className="text-red-800" role="alert">{loadError}</p>}
      {actionError && <p className="text-red-800" role="alert">{actionError}</p>}
      {!loadingLists && !loadingTasks && !loadError && tasks.length === 0 && (
        <p>{selectedTaskListId ? "No tasks in this task list yet." : "Create or select a task list to get started."}</p>
      )}
    </div>
  );
}

export default TaskList;
