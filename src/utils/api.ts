import { supabase } from "../../supabase/supabase.ts";
import type { createTaskPayload } from "./helper.ts";
import { getCurrentUser } from "./userAuth.ts";

function reportTaskError(action: string, error: unknown) {
  console.error(error);
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String(error.message)
      : String(error);
  alert(`Could not ${action} task: ${message}`);
}

export type UserTaskList = { id: number; name: string | null };

export async function getTaskLists(userId: string): Promise<UserTaskList[] | null> {
  const { data: existing, error: fetchError } = await supabase
    .from("tasklist")
    .select("id, name")
    .eq("users_id", userId)
    .order("id", { ascending: true });

  if (fetchError) {
    console.error(fetchError);
    return null;
  }
  if (existing.length > 0) return existing;

  const { data: created, error: createError } = await supabase
    .from("tasklist")
    .insert({ name: "My Tasks", users_id: userId })
    .select("id, name")
    .single();

  if (createError) {
    console.error(createError);
    return null;
  }
  return [created];
}

export async function getTasksForLists(taskListIds: number[]) {
  if (taskListIds.length === 0) return [];

  const { data, error } = await supabase.from("task").select(`
    id,
    title,
    due_date,
    due_time,
    priority,
    category:category_id ( name ),
    done
  `).in("tasklist_id", taskListIds);

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export async function getCategories() {
  const { data, error } = await supabase.from("category").select(`
    id,
    name
  `);

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export async function getTaskByID(taskId: string) {
  const { data, error } = await supabase.from("task").select(`
    id,
    title,
    due_date,
    due_time,
    priority,
    category_id,
    done
  `).eq("id", taskId).single();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export async function addTask(payload: ReturnType<typeof createTaskPayload>) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to add a task.");

    const taskLists = await getTaskLists(user.id);
    const taskList = taskLists?.[0];
    if (!taskList) throw new Error("Could not load or create your task list.");

    const { error } = await supabase
      .from("task")
      .insert({ ...payload, tasklist_id: taskList.id });
    if (error) throw error;
    return true;
  } catch (error) {
    reportTaskError("add", error);
    return false;
  }
}

export async function deleteTask(taskId: number) {
  return await supabase
    .from("task")
    .delete()
    .eq("id", taskId)
    .select("id")
    .maybeSingle();
}

export async function editTask(taskID: string | null, payload: ReturnType<typeof createTaskPayload>) {
  try {
    if (!taskID) throw new Error("task ID was not provided.");

    const { data, error } = await supabase
      .from("task")
      .update(payload)
      .eq("id", taskID)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error(
        "No task was updated. Check that the task exists and your Supabase UPDATE policy allows this operation.",
      );
    }

    return true;
  } catch (error) {
    reportTaskError("update", error);
    return false;
  }
}

export async function ToggleTaskDone(taskId: number, done: boolean) {
  try {
    const { data, error } = await supabase
      .from("task")
      .update({ done })
      .eq("id", taskId)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("No matching task was updated.");

    return true;
  } catch (error) {
    reportTaskError("update status of", error);
    return false;
  }
}
