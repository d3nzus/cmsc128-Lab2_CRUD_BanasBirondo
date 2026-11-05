import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Direction, SortKey, Task } from "../types/types.ts";
import {
  formatDueDate,
  formatDueTime,
  getPriorityClass,
  sortTasks,
} from "../utils/helper.ts";

type TaskTableProps = {
  tasks: Task[];
  pendingDeleteIds: ReadonlySet<number>;
  loading?: boolean;
  emptyMessage?: string;
  onDelete: (taskId: number) => void;
  onUndoDelete: (taskId: number) => void;
  onToggleDone: (task: Task) => void;
};

const headerClass =
  "whitespace-nowrap bg-olive-leaf-600 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-cornsilk-50 sm:px-4";
const cellClass = "px-3 py-3 align-middle sm:px-4";
const selectClass =
  "min-h-10 rounded-lg border border-olive-leaf-200 bg-white px-2.5 py-2 text-sm font-semibold text-cyan-950 shadow-sm transition hover:border-olive-leaf-300 focus:border-copperwood-500 focus:outline-none focus:ring-2 focus:ring-copperwood-300";

type StatusButtonProps = {
  task: Task;
  pendingDelete: boolean;
  onToggleDone: (task: Task) => void;
};

function StatusButton({ task, pendingDelete, onToggleDone }: StatusButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 min-w-28 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition ${
        pendingDelete
          ? "cursor-not-allowed bg-gray-400 text-gray-700"
          : task.done
            ? "bg-olive-leaf-600 text-white hover:bg-olive-leaf-700"
            : "bg-black-forest-700 text-white hover:bg-black-forest-800"
      }`}
      type="button"
      onClick={() => onToggleDone(task)}
      disabled={pendingDelete}
      aria-pressed={task.done}
      aria-label={
        task.done
          ? `Mark ${task.title} as not done`
          : `Mark ${task.title} as done`
      }
    >
      {task.done ? (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      )}
      {pendingDelete ? "Pending" : task.done ? "Done" : "To do"}
    </button>
  );
}

type TaskActionsProps = {
  task: Task;
  pendingDelete: boolean;
  onDelete: (taskId: number) => void;
  onUndoDelete: (taskId: number) => void;
};

function TaskActions({ task, pendingDelete, onDelete, onUndoDelete }: TaskActionsProps) {
  if (pendingDelete) {
    return (
      <button
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-black-forest-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-black-forest-700"
        type="button"
        onClick={() => onUndoDelete(task.id)}
      >
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
        </svg>
        Undo
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-black-forest-300 bg-white px-3 py-2 text-xs font-bold text-black-forest-800 shadow-sm transition hover:bg-black-forest-50"
        to={`/editForm?task_id=${task.id}&tasklist_id=${task.tasklist_id}`}
      >
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        Edit
      </Link>
      <button
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
        type="button"
        onClick={() => onDelete(task.id)}
      >
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7h16" />
          <path d="M10 11v6M14 11v6" />
          <path d="M6 7l1 13h10l1-13" />
          <path d="M9 7V4h6v3" />
        </svg>
        Delete
      </button>
    </div>
  );
}

function PriorityBadge({ task }: { task: Task }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ring-inset ${getPriorityClass(task.priority)}`}
    >
      {task.priority ?? "None"}
    </span>
  );
}

function CategoryBadge({ task }: { task: Task }) {
  return (
    <span className="inline-flex items-center rounded-full bg-olive-leaf-100 px-2.5 py-1 text-xs font-semibold text-olive-leaf-900 ring-1 ring-inset ring-olive-leaf-200">
      {task.category?.name ?? "Uncategorized"}
    </span>
  );
}

function TaskBadges({ task }: { task: Task }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <PriorityBadge task={task} />
      <CategoryBadge task={task} />
    </div>
  );
}

function EmptyState({ loading, message }: { loading: boolean; message: string }) {
  return (
    <div className="px-4 py-14 text-center">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-cyan-800">
        <span className="flex size-12 items-center justify-center rounded-full bg-olive-leaf-100 text-olive-leaf-700">
          <svg
            aria-hidden="true"
            className="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11.5 11.2 14 15.5 8.5" />
            <rect x="3" y="4" width="18" height="16" rx="3" />
          </svg>
        </span>
        <p className="text-base font-semibold text-cyan-950">
          {loading ? "Loading tasks…" : "No tasks yet"}
        </p>
        <p className="text-sm leading-6">
          {loading ? "Fetching the latest tasks for this list." : message}
        </p>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  pendingDelete,
  onDelete,
  onUndoDelete,
  onToggleDone,
}: {
  task: Task;
  pendingDelete: boolean;
  onDelete: (taskId: number) => void;
  onUndoDelete: (taskId: number) => void;
  onToggleDone: (task: Task) => void;
}) {
  return (
    <article
      className={`rounded-xl border p-3 shadow-sm ${
        pendingDelete
          ? "border-gray-200 bg-gray-100"
          : "border-sunlit-clay-300 bg-sunlit-clay-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`break-words text-sm font-semibold ${
              pendingDelete ? "text-gray-500" : "text-cyan-950"
            }`}
          >
            {task.title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-cyan-800">
            Due {formatDueDate(task.due_date)} · {formatDueTime(task.due_time)}
          </p>
        </div>
        <StatusButton task={task} pendingDelete={pendingDelete} onToggleDone={onToggleDone} />
      </div>
      <div className="mt-3">
        <TaskBadges task={task} />
      </div>
      <div className="mt-3 border-t border-sunlit-clay-300/70 pt-3">
        <TaskActions
          task={task}
          pendingDelete={pendingDelete}
          onDelete={onDelete}
          onUndoDelete={onUndoDelete}
        />
      </div>
    </article>
  );
}

function TaskTable({
  tasks,
  pendingDeleteIds,
  loading = false,
  emptyMessage = "Add a task to start tracking your work.",
  onDelete,
  onUndoDelete,
  onToggleDone,
}: TaskTableProps) {
  const [orderBy, setOrderBy] = useState<SortKey>("id");
  const [direction, setDirection] = useState<Direction>("asc");
  const sortedTasks = useMemo(
    () => sortTasks(tasks, orderBy, direction),
    [tasks, orderBy, direction],
  );
  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-2xl border border-olive-leaf-200 bg-white/85 p-3 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-olive-leaf-600 px-3 py-1 text-xs font-bold text-white">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
          <span className="inline-flex items-center rounded-full bg-cornsilk-200 px-3 py-1 text-xs font-bold text-cornsilk-950">
            {doneCount} done
          </span>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label
              className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800"
              htmlFor="order"
            >
              Sort by
            </label>
            <select
              className={selectClass}
              id="order"
              value={orderBy}
              onChange={(event) => setOrderBy(event.target.value as SortKey)}
            >
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="due_date">Due date</option>
              <option value="due_time">Due time</option>
              <option value="priority">Priority</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div>
            <label
              className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800"
              htmlFor="sort-direction"
            >
              Order
            </label>
            <select
              className={selectClass}
              id="sort-direction"
              value={direction}
              onChange={(event) => setDirection(event.target.value as Direction)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-olive-leaf-200 bg-white shadow-sm">
        {tasks.length === 0 ? (
          <EmptyState loading={loading} message={emptyMessage} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table
                aria-busy={loading}
                className="w-full min-w-[840px] border-collapse text-left text-sm"
              >
                <caption className="sr-only">Tasks in the selected task list</caption>
                <thead>
                  <tr>
                    <th className={headerClass}>Status</th>
                    <th className={headerClass}>Title</th>
                    <th className={headerClass}>Due date</th>
                    <th className={headerClass}>Due time</th>
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
                        className={
                          pendingDelete
                            ? "border-t border-gray-200 bg-gray-100 text-gray-500"
                            : "border-t border-sunlit-clay-300/60 bg-sunlit-clay-100 transition hover:bg-sunlit-clay-200/70"
                        }
                      >
                        <td className="px-3 py-3 align-middle sm:px-4">
                          <StatusButton
                            task={task}
                            pendingDelete={pendingDelete}
                            onToggleDone={onToggleDone}
                          />
                        </td>
                        <td className={cellClass}>
                          <span className="font-semibold text-cyan-950">{task.title}</span>
                        </td>
                        <td className={`${cellClass} whitespace-nowrap text-cyan-800`}>
                          {formatDueDate(task.due_date)}
                        </td>
                        <td className={`${cellClass} whitespace-nowrap text-cyan-800`}>
                          {formatDueTime(task.due_time)}
                        </td>
                        <td className={cellClass}>
                          <PriorityBadge task={task} />
                        </td>
                        <td className={cellClass}>
                          <CategoryBadge task={task} />
                        </td>
                        <td className={cellClass}>
                          <TaskActions
                            task={task}
                            pendingDelete={pendingDelete}
                            onDelete={onDelete}
                            onUndoDelete={onUndoDelete}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 bg-olive-leaf-50/50 p-3 md:hidden">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  pendingDelete={pendingDeleteIds.has(task.id)}
                  onDelete={onDelete}
                  onUndoDelete={onUndoDelete}
                  onToggleDone={onToggleDone}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskTable;
