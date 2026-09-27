import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase.ts";
import { Task } from "../types/types.ts";
import { getTask } from "../utils/api.ts";

function TaskList() {
  const [tasks, setTask] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getTask();
      setTask((data ?? []) as unknown as Task[]);
    })();
  }, []);

  return (
    <div>
      <table className='border-4 text-cyan-100 mb-5'>
    <thead className='border-4'>
        <tr>
            <th className = "p-4 bg-cyan-950"> Title </th>
            <th className = "p-4 bg-cyan-950"> Due Date</th>
            <th className = "p-4 bg-cyan-950"> Due Time</th>
            <th className = "p-4 bg-cyan-950"> Priority</th>
            <th className = "p-4 bg-cyan-950"> Category</th>
            <th className = "p-4 bg-cyan-950"> Done</th>
            <th className = "p-4 bg-cyan-950"> Actions</th>
        </tr>
    </thead>
    <tbody>{
      tasks.map((t) => (
          <tr key={t.id} className="border-4 border-cyan-800 bg-cyan-900">
            <td className="p-4 border border-cyan-700">{t.title}</td>
            <td className="p-4 border border-cyan-700">{t.due_date}</td>
            <td className="p-4 border border-cyan-700">{t.due_time}</td>
            <td className="p-4 border border-cyan-700">{t.priority}</td>
            <td className="p-4 border border-cyan-700">{t.category?.name}</td>
            <td className="p-4 border border-cyan-700">{t.done ? "Yes" : "No"}</td>
            <td className="p-4 border border-cyan-700"></td>
                </tr>
        ))}
    </tbody>
    </table>
    </div>
  );
}

export default TaskList;
