import type { UserTaskList } from "../utils/api.ts";

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
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <select
        className="w-fit max-w-full rounded-md border border-teal-100 bg-teal-100 px-3 py-2 text-2xl font-bold text-cyan-950 shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-olive-leaf-600 sm:text-3xl"
        id="tasklist-select"
        value={selectedTaskListId}
        onChange={(event) => onSelect(event.target.value)}
        disabled={taskLists.length === 0}
      >
        {taskLists.length === 0 ? (
          <option className="bg-teal-100 text-base font-normal text-cyan-950" value="">
            No task lists available
          </option>
        ) : (
          taskLists.map((taskList) => (
            <option
              className="bg-teal-100 text-lg font-semibold text-cyan-950"
              key={taskList.id}
              value={taskList.id}
            >
              {taskList.name || `Task List ${taskList.id}`}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

export default TaskListDropdown;
