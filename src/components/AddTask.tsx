import { Link } from "react-router-dom";

type AddTaskProps = { taskListId: number | null };

function AddTask({ taskListId }: AddTaskProps) {
  const className = "inline-flex h-full items-center rounded-xl bg-black-forest-700 px-4 py-2 font-bold text-white shadow-sm shadow-teal-600/50 hover:bg-black-forest-900 disabled:cursor-not-allowed disabled:opacity-50";

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
