import { useEffect, useMemo, useRef, useState } from "react";
import { Form, useBlocker } from "react-router-dom";
import { Task, SortKey, Direction } from "../types/types.ts";
import { deleteTask, getTask, ToggleTaskDone } from "../utils/api.ts";
import {
  clearPendingDeleteIds,
  getPriorityClass,
  queuePendingDelete,
  readPendingDeleteIds,
  sortTasks,
  undoPendingDelete,
} from "../utils/helper.ts";
import { getCurrentUser } from "../utils/userAuth.ts";
import AddTask from "./AddTask.tsx";

const pendingDeleteIdsAtPageLoad = readPendingDeleteIds();
let pageLoadDeletesHandled = false;

// Get the value we want to compare for each column

function TaskList() {
  //palette
  const contentRowStyleBase = "p-3 sm:p-4";
  const headerRowStyleBase ="p-3 bg-olive-leaf-600 text-cyan-50 sm:p-4";
  const prioCellStyleBase = "";


  const [tasks, setTask] = useState<Task[]>([]);
  const [orderBy, setOrderBy] = useState<SortKey>("id");
  const [direction, setDirection] = useState<Direction>("asc");
  const [pendingDeleteIds, setPendingDeleteIds] = useState(
    () => new Set(readPendingDeleteIds()),
  );
  const initialized = useRef(false);
  const navigationCommitInProgress = useRef(false);
  const blocker = useBlocker(pendingDeleteIds.size > 0);

  function handleDelete(taskId: number) {
    setPendingDeleteIds(queuePendingDelete(pendingDeleteIds, taskId));
  }

  function handleUndoDelete(taskId: number) {
    setPendingDeleteIds(undoPendingDelete(pendingDeleteIds, taskId));
  }

  async function handleToggleDone(task: Task) {
    const done = !task.done;
    const updated = await ToggleTaskDone(task.id, done);
    if (!updated) return;

    setTask((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, done } : currentTask,
      ),
    );
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      if (!pageLoadDeletesHandled) {
        pageLoadDeletesHandled = true;
        clearPendingDeleteIds();

        const results = await Promise.all(
          pendingDeleteIdsAtPageLoad.map((taskId) => deleteTask(taskId)),
        );
        const failedDelete = results.find((result) => result.error || !result.data);
        if (failedDelete) {
          const message = failedDelete.error?.message
            ?? "No task was deleted. Check that the task exists and your Supabase DELETE policy allows this operation.";
          console.error(failedDelete.error ?? message);
          alert("Could not delete task: " + message);
        }
        setPendingDeleteIds(new Set());
      }

      const user = await getCurrentUser();
      if (!user) {
        setTask([]);
        return;
      }

      const data = await getTask(user.id);
      setTask((data ?? []) as unknown as Task[]);
    })();
  }, []);

  useEffect(() => {
    if (blocker.state !== "blocked" || navigationCommitInProgress.current) return;

    navigationCommitInProgress.current = true;
    const taskIds = [...pendingDeleteIds];
    clearPendingDeleteIds();

    void Promise.all(taskIds.map((taskId) => deleteTask(taskId))).then((results) => {
      const failedDelete = results.find((result) => result.error || !result.data);
      if (failedDelete) {
        const message = failedDelete.error?.message
          ?? "No task was deleted. Check that the task exists and your Supabase DELETE policy allows this operation.";
        console.error(failedDelete.error ?? message);
        alert("Could not delete task: " + message);
      }
    }).catch((error: unknown) => {
      console.error(error);
      alert("Could not delete pending tasks: " + String(error));
    }).finally(() => {
      setPendingDeleteIds(new Set());
      navigationCommitInProgress.current = false;
      if (blocker.state === "blocked") blocker.proceed();
    });
  }, [blocker, pendingDeleteIds]);

  // Runs again only when tasks, orderBy, or direction change
  const sortedTasks = useMemo(() => {
    return sortTasks(tasks, orderBy, direction);
  }, [tasks, orderBy, direction]);

  return (
    <div className="w-full min-w-0 space-y-4 text-cyan-950">
      <h1 className="mb-5 text-2xl sm:text-3xl"><strong>Task List</strong></h1>

      

      <div className="flex w-full flex-col justify-center gap-3 sm:flex-row sm:items-center">
        <AddTask />
        <form className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-olive-leaf-600 p-3 text-cyan-50 shadow-xl shadow-teal-600/50 sm:p-4">
          <label htmlFor="order">Order By:</label>
          <select
            className="min-w-0 rounded-md border-0 bg-cornsilk-300 px-2 py-1.5 text-cyan-950 [&>option:hover]:bg-cornsilk-900"
            id="order"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as SortKey)}
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="due_date">Due Date</option>
            <option value="due_time">Due Time</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
          </select>

          <label htmlFor="asc_desc">Order:</label>
          <select
            className="min-w-0 rounded-md border-0 bg-cornsilk-300 px-2 py-1.5 text-cyan-950"
            id="asc_desc"
            value={direction}
            onChange={(e) => setDirection(e.target.value as Direction)}
          >
            <option value="asc">ascending</option>
            <option value="desc">descending</option>
          </select>
        </form>
      </div>
      <div className="w-full max-w-full overflow-x-auto rounded-xl shadow-xl shadow-teal-600/50">
        <table className="w-full min-w-[900px] border-collapse text-cyan-950">
          <thead>
          <tr>
              <th className = {`${headerRowStyleBase}`}> Status</th>
              <th className = {`${headerRowStyleBase}`}> Title </th>
              <th className = {`${headerRowStyleBase}`}> Due Date</th>
              <th className = {`${headerRowStyleBase}`}> Due Time</th>
              <th className = {`${headerRowStyleBase}`}> Priority</th>
              <th className = {`${headerRowStyleBase}`}> Category</th>
              <th className = {`${headerRowStyleBase}`}> Actions</th>
          </tr>
          </thead>
          <tbody>
            {sortedTasks.map((t) => (
              <tr
                key={t.id}
                className={`${pendingDeleteIds.has(t.id) ? "bg-gray-300 text-gray-500" : "bg-sunlit-clay-200 inset-shadow-sm/30 inset-shadow-sunlit-clay-400"}`}
              >
              <td className="p-4">
                <button
                  className={`w-full shadow-black-forest-800 shadow-xl/30 ${pendingDeleteIds.has(t.id) ? "bg-gray-500" : t.done ? "bg-green-500 hover:bg-green-700" : "bg-black-forest-700 hover:bg-black-forest-950"} text-white font-bold py-2 px-2 rounded`}
                  type="button"
                  onClick={() => void handleToggleDone(t)}
                  disabled={pendingDeleteIds.has(t.id)}
                >
                  {t.done ? "Done" : "Not Done"}
                </button>
              </td>
              <td className={`${contentRowStyleBase}`}>{t.title}</td>
              <td className={`${contentRowStyleBase}`}>{t.due_date}</td>
              <td className={`${contentRowStyleBase}`}>{t.due_time}</td>
              <td className={`${contentRowStyleBase} ${getPriorityClass(t.priority)} ${prioCellStyleBase}`}>{t.priority}</td>
              <td className={`${contentRowStyleBase}`}>{t.category?.name}</td>
              <td className={`${contentRowStyleBase}`}>
                {pendingDeleteIds.has(t.id) ? (
                  <button
                    className="w-full bg-black-forest-500 hover:bg-black-forest-700 text-white font-bold py-2 px-2 rounded"
                    type="button"
                    onClick={() => handleUndoDelete(t.id)}
                  >
                    Undo
                  </button>
                ) : (
                  <Form className="flex gap-1" method="get" action="/editForm">
                    <input type="hidden" name="task_id" value={t.id} />
                    <button
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                      type="button"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="w-full bg-black-forest-500 hover:bg-black-forest-700 text-white font-bold py-2 px-2 rounded"
                      type="submit"
                    >
                      Edit
                    </button>
                  </Form>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

export default TaskList;