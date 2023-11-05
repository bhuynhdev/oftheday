import { db } from "@/drizzle/drizzle";
import { inspirations } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { openaiKey } = await req.json();

  const openaiInstance = new OpenAI({ apiKey: openaiKey! });

  const allInspirations = await db.select().from(inspirations);

  await Promise.all(allInspirations.map(async (i) => {
    const response = await openaiInstance.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: i.prompt,
      max_tokens: 200,
      temperature: 0.5,
      top_p: 1,
    });

    const content = response.choices[0].text

    return db.update(inspirations).set({content: content}).where(eq(inspirations.id, i.id))
  }))
}
