import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const SCHEMAS_PATH = './src/model/schemas';

const PSQL_HOST = process.env.PSQL_HOST;
const PSQL_USER = process.env.PSQL_USER;
const PSQL_PASSWORD = process.env.PSQL_PASSWORD;
const PSQL_NAME = process.env.PSQL_NAME;

if (!PSQL_HOST || !PSQL_USER || !PSQL_PASSWORD || !PSQL_NAME) {
    throw new Error('PSQL credentials not set properly. Check env variables.');
}

export default {
    schema: [
        `${SCHEMAS_PATH}/problemSchema.ts`,
        `${SCHEMAS_PATH}/profileSchema.ts`,
        `${SCHEMAS_PATH}/resultSchema.ts`,
        `${SCHEMAS_PATH}/sessionSchema.ts`,
        `${SCHEMAS_PATH}/submissionSchema.ts`,
        `${SCHEMAS_PATH}/userSchema.ts`,
        `${SCHEMAS_PATH}/adminSchema.ts`,
        `${SCHEMAS_PATH}/testSchema.ts`,
    ],
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        host: PSQL_HOST,
        user: PSQL_USER,
        password: PSQL_PASSWORD,
        database: PSQL_NAME,
    },
} satisfies Config;
