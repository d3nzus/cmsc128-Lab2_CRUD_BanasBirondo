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

export async function createTaskList(name: string): Promise<UserTaskList> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in to create a task list.");

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Enter a name for the task list.");

  const { data: created, error: createError } = await supabase
    .from("tasklist")
    .insert({ name: trimmedName })
    .select("id, name")
    .single();

  if (createError) throw createError;

  const { error: ownerError } = await supabase
    .from("tasklist_owners")
    .insert({ tasklist_id: created.id, user_id: user.id });

  if (ownerError) {
    console.error(ownerError);
    throw new Error(`The list was created, but adding you as an owner failed: ${ownerError.message}`);
  }

  return created;
}

export async function getTaskLists(userId: string): Promise<UserTaskList[] | null> {
  const { data: ownerships, error: ownershipError } = await supabase
    .from("tasklist_owners")
    .select("tasklist_id")
    .eq("user_id", userId);

  if (ownershipError) {
    console.error(ownershipError);
    return null;
  }

  if (ownerships.length > 0) {
    const taskListIds = ownerships.map((ownership) => ownership.tasklist_id);
    const { data: existing, error: fetchError } = await supabase
      .from("tasklist")
      .select("id, name")
      .in("id", taskListIds)
      .order("id", { ascending: true });

    if (fetchError) {
      console.error(fetchError);
      return null;
    }
    return existing;
  }

  const { data: created, error: createError } = await supabase
    .from("tasklist")
    .insert({ name: "My Tasks" })
    .select("id, name")
    .single();

  if (createError) {
    console.error(createError);
    return null;
  }

  const { error: ownershipInsertError } = await supabase
    .from("tasklist_owners")
    .insert({ tasklist_id: created.id, user_id: userId });

  if (ownershipInsertError) {
    console.error(ownershipInsertError);
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

export async function addTask(
  payload: ReturnType<typeof createTaskPayload>,
  requestedTaskListId?: number,
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to add a task.");

    const taskLists = await getTaskLists(user.id);
    const taskList = taskLists?.find((list) => list.id === requestedTaskListId)
      ?? (requestedTaskListId === undefined ? taskLists?.[0] : undefined);
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
