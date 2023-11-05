import { db } from "@/drizzle/drizzle";
import { extensions } from "@/drizzle/schema";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Image from "next/image";

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

    const data = await db
      .select()
      .from(extensions)
      .where(like(extensions.prompt, `%${searchParams?.q || ""}%`));

    async function insertExtension(formData: FormData) {
      "use server";
      const result = await db.insert(extensions).values({ prompt: "Hehe" }).returning();
      revalidatePath("/");
      return result;
    }

    return (
      <main className="flex flex-col items-center justify-between gap-16 p-6 md:p-16">
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <div className="flex w-full items-center justify-evenly">
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
            <p className="mb-4 text-xl">OR</p>
            <form action={insertExtension}>
              <button type="submit" className="w-56 rounded-xl bg-rose-800 px-4 py-2">
                Contribute your own inspiration
              </button>
            </form>
          </div>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-12">
          {data.map(({ prompt }) => {
            return (
              <li>
                <div className="w-80 overflow-hidden rounded-lg bg-slate-500">
                  <p className="bg-slate-600 p-4">{prompt}</p>
                  <p className="p-4">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum laboriosam
                    molestias eius at voluptate praesentium assumenda reprehenderit, distinctio hic
                    sed!
                  </p>
                  {/* <div>
                  <ul className="flex gap-2 p-4">
                    {tags.map((tag) => (
                      <li className="rounded-md bg-gray-600 px-3 py-1 text-sm">{tag}</li>
                    ))}
                  </ul>
                </div> */}
                  <form className="flex justify-end p-4">
                    <button
                      type="submit"
                      className="rounded-md bg-slate-800 px-4 py-2 hover:opacity-70"
                    >
                      Add
                    </button>
                  </form>
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
