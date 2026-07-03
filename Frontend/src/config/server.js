// Central API base URL — reads from VITE_API_URL environment variable.
// Development: set VITE_API_URL=http://localhost:3000 in Frontend/.env
// Production:  set VITE_API_URL=https://your-backend.com in host env settings
export const ServerURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
