import {fetchFromSupabase, sendToSupabase} from "../lib/supabase";

export async function getAll(){
    return fetchFromSupabase("/registrations?order=createdAt.desc");
}

export async function getById(id){
    const registration = await fetchFromSupabase(`/registrations?id=eq.${id}`);
    return registration[0] ?? null;
}

export async function create(registration){
    await sendToSupabase("/registrations", "POST", registration);
}

export async function update(id, registration){
    await sendToSupabase(`/registrations?id=eq.${id}`, "PATCH", registration);
}

export async function remove(id){
    await sendToSupabase(`/registrations?id=eq.${id}`, "DELETE");
}