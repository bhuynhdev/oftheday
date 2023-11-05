import { db } from "@/drizzle/drizzle";
import { inspirations } from "@/drizzle/schema";
import { redirect } from "next/navigation";

export default function Contribute() {
  async function createNewExtension(formData: FormData) {
    "use server";
    await db.insert(inspirations).values({ prompt: formData.get("prompt")?.toString() });
    redirect("/marketplace");
  }

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-6 md:p-16">
      <form action={createNewExtension}>
        <div className="flex flex-col gap-4">
          <label>Enter a prompt</label>
          <input
            type="text"
            name="prompt"
            id="prompt"
            className="block w-60 rounded-md px-2 py-1 text-black"
            required
          />
          <button type="button" className="max-w-xl rounded-md border-2 border-slate-600 px-4 py-2">
            Generate sample response
          </button>
        </div>
        <div className="h-32 w-72 border-2 border-rose-600"></div>

        <button type="submit" className="rounded-md bg-rose-500 px-4 py-2">
          Submit
        </button>
      </form>
    </main>
  );
}
