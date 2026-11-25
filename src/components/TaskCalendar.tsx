import { useMemo, useState } from "react";
import type { Task } from "../types/types.ts";
import { getPriorityClass, getPriorityOutlineClass } from "../utils/helper.ts";
type TaskCalendarProps = {
  tasks: Task[];
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function TaskCalendar({ tasks }: TaskCalendarProps) {
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState(todayKey);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      if (!task.due_date) continue;
      const key = task.due_date.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), task]);
    }
    return map;
  }, [tasks]);

  function changeMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedKey(todayKey);
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedTasks = [...(tasksByDate.get(selectedKey) ?? [])].sort((a, b) =>
    (a.due_time ?? "").localeCompare(b.due_time ?? ""),
  );

  const buttonClass =
    "rounded-md bg-teal-100 px-3 py-2 font-semibold text-cyan-950 shadow-sm hover:bg-teal-200 focus:outline-2 focus:outline-offset-2 focus:outline-olive-leaf-600";

  return (
    <div className="w-full min-w-0 space-y-4 text-cyan-950">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={buttonClass} onClick={() => changeMonth(-1)} aria-label="Previous month">
          &lt;
        </button>
        <h2 className="min-w-44 text-center text-2xl font-bold sm:text-3xl">{monthLabel}</h2>
        <button type="button" className={buttonClass} onClick={() => changeMonth(1)} aria-label="Next month">
          &gt;
        </button>
        <button type="button" className={buttonClass} onClick={goToToday}>
          Today
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 text-center text-sm font-bold">
            {day}
          </div>
        ))}

        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;

          const key = toDateKey(viewYear, viewMonth, day);
          const dayTasks = tasksByDate.get(key) ?? [];
          const isSelected = key === selectedKey;
          const isToday = key === todayKey;

          return (
            <button
              type="button"
              key={key}
              onClick={() => setSelectedKey(key)}
              aria-pressed={isSelected}
              className={`min-h-16 rounded-md p-1 text-left align-top shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-olive-leaf-600 sm:min-h-24 ${
                isSelected ? "bg-olive-leaf-600 text-white" : "bg-teal-100 hover:bg-teal-200"
              } ${isToday ? "ring-2 ring-cyan-950" : ""}`}
            >
              <span className="text-sm font-bold">{day}</span>

              {dayTasks.length > 0 && (
                <span className="mt-1 block rounded bg-cyan-950 px-1 text-xs text-white sm:hidden">
                  {dayTasks.length}
                </span>
              )}

              <span className="mt-1 hidden space-y-0.5 sm:block">
                {dayTasks.slice(0, 2).map((task) => (
                  <span
                    key={task.id}
                    className={`box-border block truncate rounded border px-1 text-xs ${
                        isSelected
                            ? `font-bold ${getPriorityOutlineClass(task.priority)}`
                            : `border-transparent ${getPriorityClass(task.priority) || "bg-white/70 text-cyan-950"}`
                    } ${task.done ? "line-through opacity-60" : ""}`}
                  >
                    {task.title}
                  </span>
                ))}
                {dayTasks.length > 2 && <span className="block text-xs">+{dayTasks.length - 2} more</span>}
              </span>
            </button>
          );
        })}
      </div>

      <section className="rounded-md bg-teal-100 p-4 shadow-sm">
        <h3 className="mb-2 text-xl font-bold">{selectedKey}</h3>
        {selectedTasks.length === 0 ? (
          <p>No tasks due on this day.</p>
        ) : (
          <ul className="space-y-2">
            {selectedTasks.map((task) => (
              <li key={task.id} className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{task.due_time}</span>
                <span className={task.done ? "line-through opacity-60" : ""}>{task.title}</span>
                {task.category && (
                  <span className="rounded bg-white/70 px-2 text-xs">{task.category.name}</span>
                )}
                {task.priority && (
                  <span className={`rounded px-2 text-xs ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default TaskCalendar;