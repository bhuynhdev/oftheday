import { db } from "@/drizzle/drizzle";
import { inspirations } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import Completion from "./Completion";
import { openaiInstance } from "@/lib/openai";

export default function Contribute() {
  async function createNewExtension(formData: FormData) {
    "use server";
    const prompt = formData.get("prompt")?.toString();
    if (!prompt) return;
    const result = await openaiInstance.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.5,
      top_p: 1,
    });

    await db.insert(inspirations).values({ prompt: prompt, content: result.choices[0].text });
    redirect("/marketplace");
  }

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-6 md:p-16">
      <Completion createNewExtension={createNewExtension} />
    </main>
  );
}
