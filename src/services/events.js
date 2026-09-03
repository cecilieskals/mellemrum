import { fetchFromSupabase } from "../lib/supabase";

const query = "select=*,venue:venues(*)";

export async function getEvent(eventId) {
  const data = await fetchFromSupabase(`/events?id=eq.${eventId}&${query}`,
  );

  return data[0] ?? null;
}

export async function getEvents() {
  return fetchFromSupabase(`/events?${query}&order=date.asc`);
}
