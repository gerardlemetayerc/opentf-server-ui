// Utilitaire pour fetch avec le token d'authentification
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée ou token invalide");
  }
  return response;
}
