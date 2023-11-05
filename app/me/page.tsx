import { db } from "@/drizzle/drizzle";
import { inspiration_owners, inspirations } from "@/drizzle/schema";
import { getSession } from "@auth0/nextjs-auth0";
import { eq } from "drizzle-orm";

export default async function Me() {
  const session = await getSession();

  if (!session) {
    return <></>;
  }

  const ownedInspirations = await db
    .select({
      id: inspirations.id,
      prompt: inspirations.prompt,
      content: inspirations.content,
    })
    .from(inspiration_owners)
    .innerJoin(inspirations, eq(inspiration_owners.inspirationId, inspirations.id))
    .where(eq(inspiration_owners.userId, session.user.sub));

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-6 md:p-16">
      <ul className="flex flex-col gap-12">
        {ownedInspirations.map(({ id, prompt, content }) => (
          <li key={id}>
            <div className="w-80 overflow-hidden rounded-lg bg-slate-500">
              <p className="bg-slate-600 p-4">{prompt}</p>
              <p className="p-4">{content}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
