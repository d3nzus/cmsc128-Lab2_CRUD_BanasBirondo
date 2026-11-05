import type { UserTaskList } from "../utils/api.ts";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="min-w-0 flex-1">
      <label
        className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-olive-leaf-700"
        htmlFor="tasklist-select"
      >
        Current task list
      </label>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-xl border border-olive-leaf-200 bg-white px-4 py-3 pr-11 text-lg font-bold text-cyan-950 shadow-sm transition hover:border-olive-leaf-300 focus:border-copperwood-500 focus:outline-none focus:ring-2 focus:ring-copperwood-300 sm:text-xl"
          id="tasklist-select"
          value={`${selectedTaskListId}`}
          onChange={(event) => {
            const selectedValue = event.target.value;
            if (selectedValue === "__add_tasklist__") {
              navigate("/addTaskList");
              return;
            }
            onSelect(Number(selectedValue));
          }}
        >
          {taskLists.map((taskList) => (
            <option
              className="bg-white text-base font-semibold text-cyan-950"
              key={taskList.id}
              value={taskList.id}
            >
              {taskList.name || `Task List ${taskList.id}`}
            </option>
          ))}
          <option
            className="bg-white text-base font-semibold text-cyan-950"
            value="__add_tasklist__"
          >
            + Create a new task list
          </option>
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-olive-leaf-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export default TaskListDropdown;
