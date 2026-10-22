import { supabase } from "../../supabase/supabase.ts";

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        return "An account with this email already exists. Log in instead.";
      }
      return error.message;
    }

    // Supabase hides duplicate-account status when email confirmation is enabled.
    if (data.user?.identities?.length === 0) {
      return "An account with this email already exists. Log in instead.";
    }

    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Unable to create account.";
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  } catch (error) {
    return error instanceof Error ? error.message : "Unable to log in.";
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return error?.message ?? null;
}
