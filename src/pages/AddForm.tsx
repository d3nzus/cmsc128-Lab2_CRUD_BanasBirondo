import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addTask, getCategories } from "../utils/api";
import { CategoryOption } from "../types/types.ts";
import { createTaskPayload, priorityOptions } from "../utils/helper";


function AddForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("mid");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);

  // Load the categories for the dropdown
  useEffect(() => {
    (async () => {
      const data = await getCategories();
      setCategories((data ?? []) as CategoryOption[]);
    })();
  }, []);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stops the page from reloading
    setSaving(true);

    const added = await addTask(
      createTaskPayload({ title, date, time, priority, categoryId }),
    );

    setSaving(false);

    if (!added) return;

    navigate("/"); // go back to the task list
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-700 p-4 text-center gap-4">
      <h1 className="text-white text-4xl">128 Lab CRUD</h1>
      <h3 className="text-white">New Task:</h3>

      <form onSubmit={handleSubmit}>
        <table className="border-4 text-white">
          <tbody>
            <tr>
              <td className="p-4">Title:</td>
              <td className="p-4">
                <input
                  className="p-2 text-black bg-white"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="p-4">Time:</td>
              <td className="p-4">
                <input
                  className="p-2 text-black bg-white"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="p-4">Date:</td>
              <td className="p-4">
                <input
                  className="p-2 text-black bg-white"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="p-4">Priority:</td>
              <td className="p-4">
                {priorityOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={priority === option.value}
                      onChange={(e) => setPriority(e.target.value)}
                    />{" "}
                    {option.label}
                  </label>
                ))}
              </td>
            </tr>
            <tr>
              <td className="p-4">Category:</td>
              <td className="p-4">
                <select
                  className="p-2 text-black bg-white"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    --Select Category--
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-row gap-3 w-full justify-center mt-4">
          <button
            className="bg-blue-500 px-4 py-2 font-bold text-white disabled:opacity-50"
            type="submit"
            disabled={saving}
          >
            {saving ? "Adding..." : "Add Task"}
          </button>
          <Link className="bg-gray-500 px-4 py-2 font-bold text-white" to="/">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddForm;