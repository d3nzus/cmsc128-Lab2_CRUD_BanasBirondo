import { supabase } from "../../supabase/supabase.ts";
import type { User } from "@supabase/supabase-js";

export let currentUser: User | null = null;

export async function getCurrentUser() {
  if (currentUser) return currentUser;

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    currentUser = null;
    return null;
  }

  currentUser = data.user;
  return currentUser;
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    return error?.message ?? null;
  } catch (error) {
    return error instanceof Error ? error.message : "Unable to create account.";
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    currentUser = data.user;
    return error?.message ?? null;
  } catch (error) {
    currentUser = null;
    return error instanceof Error ? error.message : "Unable to log in.";
  }
}