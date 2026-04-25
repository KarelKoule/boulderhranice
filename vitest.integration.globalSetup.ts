import { execSync } from "child_process";

function exec(cmd: string) {
  execSync(cmd, { encoding: "utf-8", stdio: "inherit" });
}

function isSupabaseReady(): boolean {
  try {
    execSync("npx supabase status --output json", {
      encoding: "utf-8",
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

function startSupabase() {
  try {
    exec("npx supabase start");
  } catch {
    console.log("Start failed, stopping stale containers and retrying...");
    exec("npx supabase stop");
    exec("npx supabase start");
  }
}

export function setup() {
  if (!isSupabaseReady()) {
    console.log("Starting local Supabase...");
    startSupabase();
  }
  exec("npx supabase db reset");
}
