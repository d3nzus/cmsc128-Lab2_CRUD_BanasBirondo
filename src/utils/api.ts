import { supabase } from "../../supabase/supabase.ts";
import { Task, Category } from "../types/types.ts";

export async function getTask() {
  const { data, error } = await supabase.from("task").select(`
    id,
    title,
    due_date,
    due_time,
    priority,
    category:category_id ( name ),
    done
  `);

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

export async function addTask() {

}
