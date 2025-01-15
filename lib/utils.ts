import { supabase } from "@/lib/supabaseClient";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function isLoggedIn() {
  const { data } = await supabase.auth.getSession();

  return !!data.session;
}
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);

    return null;
  }
  return data.user;
}
