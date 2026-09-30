import { supabase } from "../../supabase/supabase.ts";

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  } catch (error) {
    return error instanceof Error ? error.message : "Unable to log in.";
  }
}