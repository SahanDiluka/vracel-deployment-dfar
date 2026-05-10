const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const GRAPHQL = `${BASE}/graphql`;

export function getToken() {
  return localStorage.getItem("dfar_token");
}

export async function gql(query, variables = {}) {
  const token = getToken();
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

export async function uploadImage(file) {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/upload-image`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Image upload failed.");
  return json.path;
}

export const currentLanguage = localStorage.getItem("language") || "en";