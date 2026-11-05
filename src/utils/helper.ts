import { Direction, NewTaskForm, SortKey, Task } from "../types/types.ts";

function pendingDeleteStorageKey(userId: string) {
  return `pending-task-deletes:${userId}`;
}

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

export function readPendingDeleteIds(userId: string): number[] {
  try {
    const storedIds: unknown = JSON.parse(
      sessionStorage.getItem(pendingDeleteStorageKey(userId)) ?? "[]",
    );
    return Array.isArray(storedIds)
      ? storedIds.filter((id): id is number => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
}

function savePendingDeleteIds(userId: string, taskIds: number[]) {
  sessionStorage.setItem(pendingDeleteStorageKey(userId), JSON.stringify(taskIds));
}

export function queuePendingDelete(
  pendingIds: ReadonlySet<number>,
  taskId: number,
  userId: string,
): Set<number> {
  const nextPendingIds = new Set(pendingIds);
  nextPendingIds.add(taskId);
  savePendingDeleteIds(userId, [...nextPendingIds]);
  return nextPendingIds;
}

export function undoPendingDelete(
  pendingIds: ReadonlySet<number>,
  taskId: number,
  userId: string,
): Set<number> {
  const nextPendingIds = new Set(pendingIds);
  nextPendingIds.delete(taskId);
  savePendingDeleteIds(userId, [...nextPendingIds]);
  return nextPendingIds;
}

export function clearPendingDeleteIds(userId: string) {
  sessionStorage.removeItem(pendingDeleteStorageKey(userId));
}

export function getPriorityClass(priority: string | null) {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-900 ring-red-300";
    case "mid":
    case "medium":
      return "bg-orange-100 text-orange-900 ring-orange-300";
    case "low":
    case "lo":
      return "bg-yellow-100 text-yellow-950 ring-yellow-300";
    default:
      return "bg-olive-leaf-100 text-olive-leaf-900 ring-olive-leaf-300";
  }
}

export function formatDueDate(value: string | null | undefined) {
  if (!value) return "—";

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDueTime(value: string | null | undefined) {
  if (!value) return "—";

  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
