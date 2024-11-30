import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: "./src/schema",
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: Bun.env.POSTGRES_URL!,
    },
} satisfies Config;
