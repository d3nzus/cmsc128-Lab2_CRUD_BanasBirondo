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

