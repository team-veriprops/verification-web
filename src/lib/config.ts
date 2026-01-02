export const config = {
  apiUrl: "/api",
  backendApi: process.env.API_BASE_URL!,
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Veriprops",
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  microsoftClarityProjectId: process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID,
  // Only use on server
  secretKey: process.env.BACKEND_SECRET_KEY || "",
};
