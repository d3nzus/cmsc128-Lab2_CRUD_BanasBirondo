import type { UserTaskList } from "../utils/api.ts";
import { useNavigate } from "react-router-dom";

type TaskListDropdownProps = {
  taskLists: UserTaskList[];
  selectedTaskListId: string;
  onSelect: (taskListId: string) => void;
};

function TaskListDropdown({
  taskLists,
  selectedTaskListId,
  onSelect,
}: TaskListDropdownProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <select
        className="w-fit max-w-full rounded-md border border-teal-100 bg-teal-100 px-3 py-2 text-2xl font-bold text-cyan-950 shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-olive-leaf-600 sm:text-3xl"
        id="tasklist-select"
        value={selectedTaskListId}
        onChange={(event) => {
          const selectedValue = event.target.value;
          if (selectedValue === "__add_tasklist__") {
            navigate("/addTaskList");
            return;
          }
          onSelect(selectedValue);
        }}
      >
        {taskLists.map((taskList) => (
          <option
            className="bg-teal-100 text-lg font-semibold text-cyan-950"
            key={taskList.id}
            value={taskList.id}
          >
            {taskList.name || `Task List ${taskList.id}`}
          </option>
        ))}
        <option
          className="bg-teal-100 text-lg font-semibold text-cyan-950"
          value="__add_tasklist__"
        >
          + New tasklist
        </option>
      </select> 
    </div>
  );
}

export default TaskListDropdown;
