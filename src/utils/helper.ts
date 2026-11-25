import { Direction, NewTaskForm, SortKey, Task } from "../types/types.ts";

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
  if (key === "priority") {
    return priorityOptions.find((option) => option.value === task.priority)?.score ?? -1;
  }
  return task[key];
}

export function sortTasks(tasks: Task[], orderBy: SortKey, direction: Direction) {
  const sortedTasks = [...tasks];

  sortedTasks.sort((a, b) => {
    const aValue = getValue(a, orderBy);
    const bValue = getValue(b, orderBy);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let comparison: number;
    if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return direction === "asc" ? comparison : -comparison;
  });

  return sortedTasks;
}

export function getPriorityClass(priority: string | null) {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-priority-high text-white";
    case "mid":
    case "medium":
      return "bg-priority-mid text-white";
    case "low":
    case "lo":
      return "bg-priority-low text-black";
    default:
      return "";
  }
}
