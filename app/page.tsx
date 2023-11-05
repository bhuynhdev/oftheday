import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <a
        href="/api/auth/login?returnTo=/marketplace"
        className="rounded-xl bg-rose-600 px-8 py-4 text-2xl"
      >
        Login
      </a>
    </main>
  );
}
