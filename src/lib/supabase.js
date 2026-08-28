const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_APIKEY;

function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase URL and API key is missing. Check your .env file.");
  };
}

function supabaseUrl(path) {
  assertSupabaseConfig();

  const baseUrl = SUPABASE_URL.replace(/\/$/, "");
  const apiUrl = baseUrl.endsWith("/rest/v1") ? baseUrl : `${baseUrl}/rest/v1`;

  return `${apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getHeaders(extraHeaders = {}) {
    return {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        ...extraHeaders
    };
}

export async function fetchFromSupabase(path, extraHeaders = {}) {
    const response = await fetch(supabaseUrl(path), {
        headers: getHeaders(extraHeaders)
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function sendToSupabase(path, method, body, extraHeaders = {}) {
    const response = await fetch(supabaseUrl(path), {
        method,
        headers: getHeaders(extraHeaders),
        body: method === "GET" || method === "HEAD" ? null : JSON.stringify(body),
    });

    if (!response.ok) {
            throw new Error(await response.text());
        }
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
