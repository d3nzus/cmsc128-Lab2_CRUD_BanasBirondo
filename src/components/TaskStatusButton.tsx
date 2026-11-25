import type { Task } from "../types/types.ts";

type TaskStatusButtonProps = {
  task: Task;
  onToggle: (task: Task) => void;
  className?: string;
};

function TaskStatusButton({ task, onToggle, className = "" }: TaskStatusButtonProps) {
  const stateClass = task.done
    ? "bg-green-800 text-white hover:bg-green-900 focus-visible:outline-green-900"
    : "border border-olive-leaf-700 bg-transparent text-olive-leaf-900 hover:bg-olive-leaf-100 focus-visible:outline-olive-leaf-700";

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded px-3 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 ${stateClass} ${className}`}
      type="button"
      onClick={() => onToggle(task)}
      aria-pressed={task.done}
      aria-label={`${task.done ? "Done" : "Not Done"}: ${task.title}`}
    >
      {task.done ? "Done" : "Not Done"}
    </button>
  );
}

export default TaskStatusButton;
