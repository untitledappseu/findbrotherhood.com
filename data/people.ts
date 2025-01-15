// data/people.ts
import { supabase } from "@/lib/supabaseClient";

export type Person = {
  email: string;
  skool_url: string;
  phone_number: string;
  name: string;
  position: string;
  bio: string;
  pfp_url: string;
  latitude: number; // Assuming these fields represent the person's location
  longitude: number;
};

export async function loadPeopleDataset(): Promise<Person[]> {
  const { data, error } = await supabase
    .from("users") // Replace 'people' with your actual table name
    .select();

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return [];
  }

  return data as Person[];
}
