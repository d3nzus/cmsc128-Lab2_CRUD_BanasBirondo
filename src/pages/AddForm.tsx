import { useNavigate, useSearchParams } from "react-router-dom";
import TaskForm from "../components/TaskForm.tsx";
import { addTask } from "../utils/api.ts";
import { createTaskPayload } from "../utils/helper.ts";
import type { NewTaskForm } from "../types/types.ts";

function AddForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTaskListId = Number(searchParams.get("tasklist_id"));
  const taskListId = Number.isInteger(requestedTaskListId) && requestedTaskListId > 0
    ? requestedTaskListId
    : undefined;

  async function handleSubmit(values: NewTaskForm) {
    await addTask(createTaskPayload(values), taskListId);
    navigate(taskListId ? `/home?tasklist_id=${taskListId}` : "/home");
  }

  return (
    <TaskForm
      heading="New Task"
      submitLabel="Add Task"
      savingLabel="Adding..."
      onSubmit={handleSubmit}
    />
  );
}

export default AddForm;
