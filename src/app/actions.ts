"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export type PickState = { error: string } | null;

export async function savePickedTime(
  _prev: PickState,
  formData: FormData,
): Promise<PickState> {
  const time = String(formData.get("time") ?? "");

  if (!TIME_RE.test(time)) {
    return { error: "Please pick a valid time." };
  }

  const { data, error } = await getSupabase()
    .from("date_plans")
    .insert({ response: "yes", picked_time: time })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to save picked time:", error);
    return { error: "Couldn't save your time. Please try again." };
  }

  redirect(`/see-you/${data.id}`);
}

/** Records that she tapped "Not Interested". Stores no card details, only the response. */
export async function recordNotInterested(): Promise<void> {
  const { error } = await getSupabase()
    .from("date_plans")
    .insert({ response: "not_interested" });

  if (error) {
    console.error("Failed to record not-interested response:", error);
  }
}
