import { Link } from "react-router-dom";

type AddTaskProps = { taskListId: number | null };

function AddTask({ taskListId }: AddTaskProps) {
  const className = "inline-flex min-h-11 h-full self-start items-center rounded-xl bg-olive-leaf-950 px-4 py-2 font-bold text-cornsilk-50 shadow-sm shadow-teal-600/50 hover:bg-olive-leaf-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-leaf-700 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto";

  if (!taskListId) {
    return <button className={className} type="button" disabled>Add Task</button>;
  }

  return (
    <Link
      className={className}
      to={`/addForm?tasklist_id=${encodeURIComponent(taskListId)}`}
    >
      Add Task
    </Link>
  );
}

export default AddTask;
