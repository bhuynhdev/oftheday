import { drizzle } from 'drizzle-orm/postgres-js';

// import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
 
// declaring enum in database
// export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);
 
// for query purposes
const queryClient = postgres(process.env.DB_URL!);
export const db = drizzle(queryClient);