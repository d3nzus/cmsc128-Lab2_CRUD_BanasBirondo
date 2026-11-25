import { Link } from "react-router-dom";
import type { Task } from "../types/types.ts";
import { getPriorityClass } from "../utils/helper.ts";
import TaskStatusButton from "./TaskStatusButton.tsx";

type TaskCardProps = {
  task: Task;
  deleting: boolean;
  onDelete: (task: Task) => void;
  onToggleDone: (task: Task) => void;
};

function TaskCard({ task, deleting, onDelete, onToggleDone }: TaskCardProps) {
  return (
    <li className="rounded-lg bg-sunlit-clay-200 p-3 inset-shadow-sm/30 inset-shadow-sunlit-clay-400">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 break-words font-semibold">{task.title}</p>
        <span className={`flex-none rounded px-2 py-1 text-xs font-semibold ${getPriorityClass(task.priority)}`}>
          {task.priority ?? "—"}
        </span>
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div className="min-w-0">
          <dt className="font-semibold text-olive-leaf-800">Due</dt>
          <dd className="break-words">{task.due_date} · {task.due_time}</dd>
        </div>
        <div className="min-w-0">
          <dt className="font-semibold text-olive-leaf-800">Category</dt>
          <dd className="break-words">{task.category?.name ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-2">
        <TaskStatusButton task={task} onToggle={onToggleDone} />
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded bg-olive-leaf-950 px-3 py-2 font-bold text-cornsilk-50 hover:bg-olive-leaf-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-leaf-700"
          to={`/editForm?task_id=${task.id}&tasklist_id=${task.tasklist_id}`}
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded bg-red-700 px-3 py-2 font-bold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={() => onDelete(task)}
          disabled={deleting}
          aria-label={`Delete ${task.title}`}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
