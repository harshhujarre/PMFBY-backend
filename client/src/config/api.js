/**
 * API Configuration
 * Centralized configuration for API base URL
 */

// Use environment variable or fallback to localhost
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Debug logs for deployment troubleshooting
console.log("🔍 API Config Debug:");
console.log(
  "  Environment Variable (VITE_API_BASE_URL):",
  import.meta.env.VITE_API_BASE_URL,
);
console.log("  Final API_BASE_URL:", API_BASE_URL);
console.log("  Mode:", import.meta.env.MODE);

export default {
  baseURL: API_BASE_URL,
  endpoints: {
    farms: `${API_BASE_URL}/api/farms`,
    ndvi: `${API_BASE_URL}/api`,
    alerts: `${API_BASE_URL}/api/alerts`,
    claims: `${API_BASE_URL}/api/claims`,
    divisions: `${API_BASE_URL}/api/divisions`,
  },
};
