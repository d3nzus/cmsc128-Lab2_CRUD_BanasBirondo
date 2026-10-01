import { useEffect, useMemo, useState } from "react";
import { Form } from "react-router-dom";
import { Task, SortKey, Direction } from "../types/types.ts";
import { deleteTask, getTask, ToggleTaskDone } from "../utils/api.ts";
import { getValue, getPriorityClass } from "../utils/helper.ts";
import { getCurrentUser } from "../utils/userAuth.ts";
import AddTask from "./AddTask.tsx";

// Get the value we want to compare for each column

function TaskList() {
  const [tasks, setTask] = useState<Task[]>([]);
  const [orderBy, setOrderBy] = useState<SortKey>("id");
  const [direction, setDirection] = useState<Direction>("asc");

  async function handleDelete(taskId: number) {
    if (!window.confirm("Delete this task?")) return;

    const { error } = await deleteTask(taskId);
    if (error) {
      console.error(error);
      alert("Could not delete task: " + error.message);
      return;
    }

    setTask((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  async function handleToggleDone(task: Task) {
    const done = !task.done;
    const updated = await ToggleTaskDone(task.id, done);
    if (!updated) return;

    setTask((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, done } : currentTask,
      ),
    );
  }

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        setTask([]);
        return;
      }

      const data = await getTask(user.id);
      setTask((data ?? []) as unknown as Task[]);
    })();
  }, []);

  // Runs again only when tasks, orderBy, or direction change
  const sortedTasks = useMemo(() => {
    const copy = [...tasks]; // copy first, so we don't change the original array

    copy.sort((a, b) => {
      const aVal = getValue(a, orderBy);
      const bVal = getValue(b, orderBy);

      // Empty values always go to the bottom
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let result: number;
      if (typeof aVal === "number" && typeof bVal === "number") {
        result = aVal - bVal;
      } else {
        result = String(aVal).localeCompare(String(bVal));
      }

      return direction === "asc" ? result : -result;
    });

    return copy;
  }, [tasks, orderBy, direction]);

  return (
    <div>
      <h1 className="text-white">Task List</h1>

      <form className="p-4 bg-cyan-700 rounded-xl m-4">
        <label htmlFor="order"> Order By: </label>
        <select
          className="bg-cyan-300 border-0 rounded-md"
          id="order"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as SortKey)}
        >
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="due_date">Due Date</option>
          <option value="due_time">Due Time</option>
          <option value="priority">Priority</option>
          <option value="category">Category</option>
        </select>

        <label htmlFor="asc_desc"> Order: </label>
        <select
          className="bg-cyan-300 border-0 rounded-md"
          id="asc_desc"
          value={direction}
          onChange={(e) => setDirection(e.target.value as Direction)}
        >
          <option value="asc">ascending</option>
          <option value="desc">descending</option>
        </select>
      </form>

      <div className="flex flex-row gap-3 w-full justify-start">
        <AddTask />
      </div>
      
      <table className="border-4 text-cyan-100 mb-5">
        <thead className='border-4'>
        <tr>
            <th className = "p-4 bg-cyan-950"> Status</th>
            <th className = "p-4 bg-cyan-950"> Title </th>
            <th className = "p-4 bg-cyan-950"> Due Date</th>
            <th className = "p-4 bg-cyan-950"> Due Time</th>
            <th className = "p-4 bg-cyan-950"> Priority</th>
            <th className = "p-4 bg-cyan-950"> Category</th>
            <th className = "p-4 bg-cyan-950"> Actions</th>
        </tr>
        </thead>
        <tbody>
          {sortedTasks.map((t) => (
            <tr key={t.id} className="border-4 border-cyan-800 bg-cyan-900">
            <td className="p-4 border border-cyan-700">
              <button
                className={`w-full ${t.done ? "bg-green-500 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-700"} text-white font-bold py-2 px-2 rounded`}
                type="button"
                onClick={() => void handleToggleDone(t)}
              >
                {t.done ? "Done" : "Not Done"}
              </button>
            </td>
            <td className="p-4 border border-cyan-700">{t.title}</td>
            <td className="p-4 border border-cyan-700">{t.due_date}</td>
            <td className="p-4 border border-cyan-700">{t.due_time}</td>
            <td className={getPriorityClass(t.priority)}>{t.priority}</td>
            <td className="p-4 border border-cyan-700">{t.category?.name}</td>
            <td className="p-4 border border-cyan-700">
              <Form className="flex gap-1" method="get" action="/editForm">
                <input type="hidden" name="task_id" value={t.id} />
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                  type="button"
                  onClick={() => void handleDelete(t.id)}
                >
                  Delete
                </button>
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                  type="submit"
                >
                  Edit
                </button>
              </Form>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;