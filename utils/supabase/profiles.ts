import { createClient } from "./server";
import { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  website: string | null;
  expertise: string[];
  peer_points_balance: number;
  created_at: string;
  updated_at: string;
};

export async function getUserProfile(user: User): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  
  if (error || !data) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
  return data as Profile;
}
