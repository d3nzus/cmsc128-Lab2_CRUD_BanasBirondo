import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Direction, SortKey, Task } from "../types/types.ts";
import { getPriorityClass, sortTasks } from "../utils/helper.ts";

type TaskTableProps = {
  tasks: Task[];
  pendingDeleteIds: ReadonlySet<number>;
  onDelete: (taskId: number) => void;
  onUndoDelete: (taskId: number) => void;
  onToggleDone: (task: Task) => void;
};

function TaskTable({ tasks, pendingDeleteIds, onDelete, onUndoDelete, onToggleDone }: TaskTableProps) {
  const [orderBy, setOrderBy] = useState<SortKey>("id");
  const [direction, setDirection] = useState<Direction>("asc");
  const sortedTasks = useMemo(() => sortTasks(tasks, orderBy, direction), [tasks, orderBy, direction]);
  const cellClass = "p-3 sm:p-4";
  const headerClass = "bg-olive-leaf-600 p-3 text-cyan-50 sm:p-4";

  return (
    <>
      <form className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-olive-leaf-600 p-3 text-cyan-50 shadow-xl shadow-teal-600/50 sm:p-4">
        <label htmlFor="order">Order By:</label>
        <select
          className="min-w-0 rounded-md border-0 bg-cornsilk-300 px-2 py-1.5 text-cyan-950"
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
          className="min-w-0 rounded-md border-0 bg-cornsilk-300 px-2 py-1.5 text-cyan-950"
          id="sort-direction"
          value={direction}
          onChange={(event) => setDirection(event.target.value as Direction)}
        >
          <option value="asc">ascending</option>
          <option value="desc">descending</option>
        </select>
      </form>

      <div className="w-full max-w-full overflow-x-auto rounded-xl shadow-xl shadow-teal-600/50">
        <table className="w-full min-w-[900px] border-collapse text-cyan-950">
          <thead>
            <tr>
              <th className={headerClass}>Status</th>
              <th className={headerClass}>Title</th>
              <th className={headerClass}>Due Date</th>
              <th className={headerClass}>Due Time</th>
              <th className={headerClass}>Priority</th>
              <th className={headerClass}>Category</th>
              <th className={headerClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => {
              const pendingDelete = pendingDeleteIds.has(task.id);
              return (
                <tr
                  key={task.id}
                  className={pendingDelete
                    ? "bg-gray-300 text-gray-500"
                    : "bg-sunlit-clay-200 inset-shadow-sm/30 inset-shadow-sunlit-clay-400"}
                >
                  <td className="p-4 text-center align-middle">
                    <button
                      className={`w-32 rounded px-2 py-2 font-bold text-white shadow-xl/30 shadow-black-forest-800 ${pendingDelete ? "bg-gray-500" : task.done ? "bg-green-500 hover:bg-green-700" : "bg-black-forest-700 hover:bg-black-forest-950"}`}
                      type="button"
                      onClick={() => onToggleDone(task)}
                      disabled={pendingDelete}
                    >
                      {task.done ? "Done" : "Not Done"}
                    </button>
                  </td>
                  <td className={cellClass}>{task.title}</td>
                  <td className={cellClass}>{task.due_date}</td>
                  <td className={cellClass}>{task.due_time}</td>
                  <td className={`${cellClass} ${getPriorityClass(task.priority)}`}>{task.priority}</td>
                  <td className={cellClass}>{task.category?.name}</td>
                  <td className={cellClass}>
                    {pendingDelete ? (
                      <button
                        className="w-full rounded bg-black-forest-500 px-2 py-2 font-bold text-white hover:bg-black-forest-700"
                        type="button"
                        onClick={() => onUndoDelete(task.id)}
                      >
                        Undo
                      </button>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          className="w-full rounded bg-red-600 px-2 py-2 font-bold text-white hover:bg-red-700"
                          type="button"
                          onClick={() => onDelete(task.id)}
                        >
                          Delete
                        </button>
                        <Link
                          className="inline-flex w-full justify-center rounded bg-black-forest-500 px-2 py-2 font-bold text-white hover:bg-black-forest-700"
                          to={`/editForm?task_id=${task.id}&tasklist_id=${task.tasklist_id}`}
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TaskTable;
