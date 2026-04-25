import { execSync } from "child_process";

function exec(cmd: string) {
  return execSync(cmd, { encoding: "utf-8", stdio: "pipe" });
}

const status = JSON.parse(exec("npx supabase status --output json"));

process.env.NEXT_PUBLIC_SUPABASE_URL = status.API_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = status.ANON_KEY;
process.env.SUPABASE_SERVICE_ROLE_KEY = status.SERVICE_ROLE_KEY;
