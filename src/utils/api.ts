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

export async function getTask(userId: string) {
  const { data, error } = await supabase.from("task").select(`
    id,
    title,
    due_date,
    due_time,
    priority,
    category:category_id ( name ),
    done
  `).eq("user_id", userId);

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

    const { error } = await supabase
      .from("task")
      .insert({ ...payload, user_id: user.id });
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