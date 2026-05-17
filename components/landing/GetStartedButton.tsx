import { cookies } from "next/headers";

export async function GetStartedButton() {
  const cookieStore = await cookies();
  const done = cookieStore.get("onboarding_complete")?.value;
  return <a href={done ? "/dashboard" : "/onboarding"}>Continue Learning</a>;
}
