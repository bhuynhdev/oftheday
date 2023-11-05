import { db } from "@/drizzle/drizzle";
import { inspiration_owners, inspirations } from "@/drizzle/schema";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { and, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default withPageAuthRequired(
  async function Marketplace({
    searchParams,
  }: {
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    const session = await getSession();

    if (!session) {
      return <></>;
    }

    const allInspirations = await db
      .select()
      .from(inspirations)
      .where(ilike(inspirations.prompt, `%${searchParams?.q || ""}%`));

    const ownedInspirations = await db
      .select()
      .from(inspiration_owners)
      .where(eq(inspiration_owners.userId, session.user.sub));

    async function buyExtension(formData: FormData) {
      "use server";
      const inspirationId = formData.get("id") as string;
      await db
        .insert(inspiration_owners)
        .values({ userId: session?.user.sub, inspirationId: inspirationId });
      revalidatePath("/");
    }

    async function removeExtension(formData: FormData) {
      "use server";
      const inspirationId = formData.get("id") as string;
      await db
        .delete(inspiration_owners)
        .where(
          and(
            eq(inspiration_owners.userId, session?.user.sub),
            eq(inspiration_owners.inspirationId, inspirationId),
          ),
        );
      revalidatePath("/");
    }

    return (
      <main className="flex flex-col items-center justify-between gap-16 p-6 md:p-16">
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <div className="flex w-full flex-col items-center justify-evenly gap-5 md:flex-row md:gap-2">
          <form method="GET">
            <div className="flex flex-col gap-2">
              <label htmlFor="query">Search for a new inspiration</label>
              <input
                type="text"
                id="query"
                name="q"
                defaultValue={searchParams?.q}
                className="w-80 rounded-md px-2 py-1 text-black"
              />
            </div>
          </form>
          <div>
            <p className="mb-4 text-center text-xl md:text-left">OR</p>
            <Link
              href="contribute"
              className="block w-56 rounded-xl bg-rose-800 px-4 py-2 text-center"
            >
              Contribute your own inspiration
            </Link>
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-12">
          {allInspirations.map(({ id, prompt, content }) => {
            return (
              <li>
                <div className="w-80 overflow-hidden rounded-lg bg-slate-500">
                  <p className="bg-slate-600 p-4">{prompt}</p>
                  <p className="p-4">{content}</p>
                  {ownedInspirations.map((i) => i.inspirationId).includes(id) ? (
                    <form
                      className="flex items-center justify-between p-4"
                      action={removeExtension}
                    >
                      <p className="text-sm text-gray-100">Owned</p>
                      <button
                        type="submit"
                        className="rounded-md bg-rose-600 px-4 py-2 hover:opacity-70"
                        name="id"
                        value={id}
                      >
                        Remove
                      </button>
                    </form>
                  ) : (
                    <form className="flex justify-end p-4" action={buyExtension}>
                      <button
                        type="submit"
                        className="rounded-md bg-slate-800 px-4 py-2 hover:opacity-70"
                        name="id"
                        value={id}
                      >
                        Add
                      </button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    );
  },
  { returnTo: "/marketplace" },
);
