import { supabase } from "../../supabase/supabase.ts";
import type { createTaskPayload } from "./helper.ts";
import { getCurrentUser } from "./userAuth.ts";
import type { CategoryOption, Profile, Task } from "../types/types.ts";

export type UserTaskList = { id: number; name: string | null };
export type EditableTask = Pick<
  Task,
  "id" | "title" | "due_date" | "due_time" | "priority" | "done"
> & { category_id: number };

export async function createTaskList(name: string): Promise<UserTaskList> {
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Enter a name for the task list.");

  const { data, error } = await supabase
    .rpc("create_tasklist_with_owner", { list_name: trimmedName })
    .single();
  if (error) throw error;
  return data;
}

export async function getTaskLists(userId: string): Promise<UserTaskList[]> {
  const { data: ownerships, error: ownershipError } = await supabase
    .from("tasklist_owners")
    .select("tasklist_id")
    .eq("user_id", userId);

  if (ownershipError) throw ownershipError;
  if (ownerships.length === 0) return [];

  const { data, error } = await supabase
    .from("tasklist")
    .select("id, name")
    .in("id", ownerships.map((ownership) => ownership.tasklist_id))
    .order("id", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTasksForList(taskListId: number): Promise<Task[]> {
  const { data, error } = await supabase.from("task").select(`
    id,
    tasklist_id,
    title,
    due_date,
    due_time,
    priority,
    category:category_id ( name ),
    done
  `).eq("tasklist_id", taskListId);
  if (error) throw error;
  return data;
}

export async function getCategories(): Promise<CategoryOption[]> {
  const { data, error } = await supabase.from("category").select(`
    id,
    name
  `);

  if (error) throw error;
  return data;
}

export async function getTaskByID(taskId: string): Promise<EditableTask> {
  const { data, error } = await supabase.from("task").select(`
    id,
    title,
    due_date,
    due_time,
    priority,
    category_id,
    done
  `).eq("id", taskId).single();

  if (error) throw error;
  return data;
}

export async function addTask(
  payload: ReturnType<typeof createTaskPayload>,
  requestedTaskListId?: number,
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in to add a task.");

  const taskLists = await getTaskLists(user.id);
  const taskList = taskLists.find((list) => list.id === requestedTaskListId)
    ?? (requestedTaskListId === undefined ? taskLists[0] : undefined);
  if (!taskList) throw new Error("Select a task list before adding a task.");

  const { error } = await supabase
    .from("task")
    .insert({ ...payload, tasklist_id: taskList.id });
  if (error) throw error;
}

export async function deleteTask(taskId: number): Promise<void> {
  const { data, error } = await supabase
    .from("task")
    .delete()
    .eq("id", taskId)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`Task ${taskId} was not deleted. It may be unavailable or your DELETE policy denied access.`);
}

export async function deleteTasks(taskIds: number[]): Promise<void> {
  await Promise.all(taskIds.map(deleteTask));
}

export async function editTask(taskID: string, payload: ReturnType<typeof createTaskPayload>): Promise<void> {
  const { data, error } = await supabase
    .from("task")
    .update(payload)
    .eq("id", taskID)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No task was updated. Check that the task exists and your UPDATE policy allows this operation.");
}

export async function toggleTaskDone(taskId: number, done: boolean): Promise<void> {
  const { data, error } = await supabase
    .from("task")
    .update({ done })
    .eq("id", taskId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No matching task was updated.");
}

export async function getUserName(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Please sign in to view profile.");
  const {data, error} = await supabase.from("profile").select("id, username").eq("id", user.id);
  if (error) throw error;
  return data;
}
