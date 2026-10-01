import { Direction, NewTaskForm, SortKey, Task } from "../types/types.ts";

const pendingDeleteStorageKey = "pending-task-deletes";

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

export function readPendingDeleteIds(): number[] {
  try {
    const storedIds: unknown = JSON.parse(
      sessionStorage.getItem(pendingDeleteStorageKey) ?? "[]",
    );
    return Array.isArray(storedIds)
      ? storedIds.filter((id): id is number => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
}

function savePendingDeleteIds(taskIds: number[]) {
  sessionStorage.setItem(pendingDeleteStorageKey, JSON.stringify(taskIds));
}

export function queuePendingDelete(
  pendingIds: ReadonlySet<number>,
  taskId: number,
): Set<number> {
  const nextPendingIds = new Set(pendingIds);
  nextPendingIds.add(taskId);
  savePendingDeleteIds([...nextPendingIds]);
  return nextPendingIds;
}

export function undoPendingDelete(
  pendingIds: ReadonlySet<number>,
  taskId: number,
): Set<number> {
  const nextPendingIds = new Set(pendingIds);
  nextPendingIds.delete(taskId);
  savePendingDeleteIds([...nextPendingIds]);
  return nextPendingIds;
}

export function clearPendingDeleteIds() {
  sessionStorage.removeItem(pendingDeleteStorageKey);
}

export function getPriorityClass(priority: string) {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-600/70 text-white";
    case "mid":
    case "medium":
      return "bg-orange-500/70 text-white";
    case "low":
    case "lo":
      return "bg-yellow-300/70 text-black";
    default:
      return "";
  }
}