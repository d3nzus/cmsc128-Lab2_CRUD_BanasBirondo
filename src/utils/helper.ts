import { Task, SortKey, NewTaskForm } from "../types/types.ts";

export const priorityOptions = [
  { value: "high", label: "High", score: 2 },
  { value: "mid", label: "Mid", score: 1 },
  { value: "low", label: "Low", score: 0 },
] as const;



export function createTaskPayload({ title, date, time, priority, categoryId }: NewTaskForm) {
  const selectedPriority = priorityOptions.find((option) => option.value === priority);

  return {
    title,
    due_date: date,
    due_time: time,
    priority: selectedPriority?.value,
    category_id: Number(categoryId),
    done: false,
  };
}

export function getValue(task: Task, key: SortKey) {
  if (key === "category") return task.category?.name ?? "";
  return task[key];
}

export function getPriorityClass(priority: string) {
  const base = "p-4 border border-cyan-700 text-white";
  switch (priority?.toLowerCase()) {
    case "high":
      return `${base} bg-red-600`;
    case "mid":
    case "medium":
      return `${base} bg-orange-500`;
    case "low":
    case "lo":
      return "p-4 border border-cyan-700 bg-yellow-300 text-black";
    default:
      return "";
  }
}