import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const SCHEMAS_PATH = './src/model/schemas';

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

if (!DB_CONNECTION_STRING) {
    throw new Error('PSQL credentials not set properly. Check env variables.');
}

export default {
    schema: [
        `${SCHEMAS_PATH}/problemSchema.ts`,
        `${SCHEMAS_PATH}/profileSchema.ts`,
        `${SCHEMAS_PATH}/sessionSchema.ts`,
        `${SCHEMAS_PATH}/submissionSchema.ts`,
        `${SCHEMAS_PATH}/userSchema.ts`,
        `${SCHEMAS_PATH}/adminSchema.ts`,
        `${SCHEMAS_PATH}/testSchema.ts`,
    ],
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: DB_CONNECTION_STRING,
    },
} satisfies Config;
