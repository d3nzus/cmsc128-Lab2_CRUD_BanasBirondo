export type Category = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  title: string;
  due_date: string;
  due_time: string;
  priority: string;
  category: { name: string } | null;
  done: boolean;
};

export type NewTaskForm = {
  title: string;
  date: string;
  time: string;
  priority: string;
  categoryId: string;
};

export type SortKey =
  | "id"
  | "title"
  | "due_date"
  | "due_time"
  | "priority"
  | "category";

export type Direction = "asc" | "desc";

export type CategoryOption = { id: number; name: string };
