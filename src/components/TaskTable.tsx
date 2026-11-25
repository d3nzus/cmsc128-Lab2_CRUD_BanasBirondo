import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Direction, SortKey, Task } from "../types/types.ts";
import { getPriorityClass, sortTasks } from "../utils/helper.ts";
import TaskCard from "./TaskCard.tsx";
import TaskStatusButton from "./TaskStatusButton.tsx";

type TaskTableProps = {
  tasks: Task[];
  deletingId: number | null;
  onDelete: (task: Task) => void;
  onToggleDone: (task: Task) => void;
};

function TaskTable({ tasks, deletingId, onDelete, onToggleDone }: TaskTableProps) {
  const [orderBy, setOrderBy] = useState<SortKey>("id");
  const [direction, setDirection] = useState<Direction>("asc");
  const sortedTasks = useMemo(() => sortTasks(tasks, orderBy, direction), [tasks, orderBy, direction]);
  const cellClass = "p-3 sm:p-4 text-center";
  const headerClass = "bg-olive-leaf-700 p-3 text-cyan-50 sm:p-4";

  return (
    <>
      <form className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-olive-leaf-700 p-3 text-cyan-50 shadow-sm shadow-teal-600/50 sm:p-4">
        <label htmlFor="order">Order By:</label>
        <select
          className="min-h-11 min-w-0 rounded-md border-0 bg-cornsilk-300 px-2 py-1.5 text-cyan-950"
          id="order"
          value={orderBy}
          onChange={(event) => setOrderBy(event.target.value as SortKey)}
        >
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="due_date">Due Date</option>
          <option value="due_time">Due Time</option>
          <option value="priority">Priority</option>
          <option value="category">Category</option>
        </select>
        <label htmlFor="sort-direction">Order:</label>
        <select
          className="min-h-11 min-w-0 rounded-md border-0 bg-cornsilk-300 px-2 py-1.5 text-cyan-950"
          id="sort-direction"
          value={direction}
          onChange={(event) => setDirection(event.target.value as Direction)}
        >
          <option value="asc">ascending</option>
          <option value="desc">descending</option>
        </select>
      </form>

      <div className="hidden w-full max-w-full overflow-x-auto rounded-xl shadow-sm shadow-teal-600/50 md:block">
        <table className="w-full min-w-[900px] border-collapse text-cyan-950">
          <caption className="sr-only">Tasks in the selected task list</caption>
          <thead>
            <tr>
              <th className={headerClass} scope="col">Status</th>
              <th className={headerClass} scope="col">Title</th>
              <th className={headerClass} scope="col">Due Date</th>
              <th className={headerClass} scope="col">Due Time</th>
              <th className={headerClass} scope="col">Priority</th>
              <th className={headerClass} scope="col">Category</th>
              <th className={headerClass} scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => {
              const deleting = deletingId === task.id;
              return (
                <tr
                  key={task.id}
                  className="bg-sunlit-clay-200 inset-shadow-sm/30 inset-shadow-sunlit-clay-400"
                >
                  <td className="p-4 text-center align-middle">
                    <TaskStatusButton task={task} onToggle={onToggleDone} className="w-32" />
                  </td>
                  <td className={`${cellClass} break-words`}>{task.title}</td>
                  <td className={cellClass}>{task.due_date}</td>
                  <td className={cellClass}>{task.due_time}</td>
                  <td className={cellClass}>
                    <span className={`inline-flex rounded-full px-5 py-1 text-sm font-semibold shadow-xs ${getPriorityClass(task.priority)}`}>
                      {task.priority ?? "—"}
                    </span>
                  </td>
                  <td className={cellClass}>{task.category?.name}</td>
                  <td className={cellClass}>
                    <div className="flex gap-1">
                      <button
                        className="min-h-11 w-full rounded bg-red-700 px-2 py-2 font-bold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={() => onDelete(task)}
                        disabled={deleting}
                        aria-label={`Delete ${task.title}`}
                        data-task-delete={task.id}
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                      <Link
                        className="inline-flex min-h-11 w-full justify-center rounded bg-olive-leaf-950 px-2 py-2 font-bold text-cornsilk-50 hover:bg-olive-leaf-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-leaf-700"
                        to={`/editForm?task_id=${task.id}&tasklist_id=${task.tasklist_id}`}
                        aria-label={`Edit ${task.title}`}
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            deleting={deletingId === task.id}
            onDelete={onDelete}
            onToggleDone={onToggleDone}
          />
        ))}
      </ul>
    </>
  );
}

export default TaskTable;
