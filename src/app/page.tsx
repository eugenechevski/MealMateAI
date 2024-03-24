import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return (
    <div className="font-primary text-primary-text">
      The project is in progress.
    </div>
  );
}
