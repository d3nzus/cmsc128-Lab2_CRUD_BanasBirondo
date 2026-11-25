import type { UserTaskList } from "../utils/api.ts";
import { Link } from "react-router-dom";

type TaskListDropdownProps = {
  taskLists: UserTaskList[];
  selectedTaskListId: number | null;
  onSelect: (taskListId: number) => void;
};

function TaskListDropdown({
  taskLists,
  selectedTaskListId,
  onSelect,
}: TaskListDropdownProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      {taskLists.length > 0 && (
        <select
          className="w-fit max-w-full rounded-md border border-teal-100 bg-teal-100 px-3 py-2 text-2xl font-bold text-cyan-950 shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-olive-leaf-600 sm:text-3xl"
          id="tasklist-select"
          aria-label="Task list"
          value={selectedTaskListId ?? ""}
          onChange={(event) => {
            if (event.target.value === "") return;
            onSelect(Number(event.target.value));
          }}
        >
          {selectedTaskListId === null && (
            <option value="" disabled>
              Select a task list
            </option>
          )}
          {taskLists.map((taskList) => (
            <option
              className="bg-teal-100 text-lg font-semibold text-cyan-950"
              key={taskList.id}
              value={taskList.id}
            >
              {taskList.name || `Task List ${taskList.id}`}
            </option>
          ))}
        </select>
      )}

      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-black-forest-700 px-4 py-2 font-bold text-white hover:bg-black-forest-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
        to="/addTaskList"
      >
        + New task list
      </Link>
    </div>
  );
}

export default TaskListDropdown;
