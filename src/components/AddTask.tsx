import { Link } from "react-router-dom";

type AddTaskProps = { taskListId: number | null };

function AddTask({ taskListId }: AddTaskProps) {
  const className =
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-black-forest-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-forest-700 disabled:cursor-not-allowed disabled:bg-black-forest-200 disabled:text-black-forest-700 disabled:shadow-none sm:w-auto";

  const content = (
    <>
      <svg
        aria-hidden="true"
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      Add task
    </>
  );

  if (!taskListId) {
    return (
      <button
        className={className}
        type="button"
        disabled
        title="Select or create a task list first"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      className={className}
      to={`/addForm?tasklist_id=${encodeURIComponent(taskListId)}`}
    >
      {content}
    </Link>
  );
}

export default AddTask;
