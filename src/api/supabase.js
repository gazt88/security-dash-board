import { supabase } from '../utils/supabase';

export async function signInWithEmail(email) {
  return supabase.auth.signInWithOtp({ email });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function getUser() {
  return supabase.auth.getUser();
} 