import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    return redirect("/marketplace");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <a href="/api/auth/login" className="rounded-xl bg-rose-600 px-8 py-4 text-2xl">
        Login
      </a>
    </main>
  );
}
