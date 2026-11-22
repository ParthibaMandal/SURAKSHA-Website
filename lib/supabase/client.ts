import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ametcduxlhqqbvwxtpyp.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZXRjZHV4bGhxcWJ2d3h0cHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzMjkxMTQsImV4cCI6MjExMDkwNTExNH0.TLygXCPl9yrhMHVMRwsdQLOhiTVlp1WxicuAq6XZw-E";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
