import { Task, SortKey } from "../types/types.ts";

export function getValue(task: Task, key: SortKey) {
  if (key === "category") return task.category?.name ?? "";
  return task[key];
}

export function getPriorityClass(priority: string) {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-600 text-white";
    case "mid":
    case "medium":
      return "bg-orange-500 text-white";
    case "low":
    case "lo":
      return "bg-yellow-300 text-black";
    default:
      return "";
  }
}