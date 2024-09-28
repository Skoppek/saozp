import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const SCHEMAS_PATH = './src/model/schemas';
const INTERMEDIATES_SCHEMAS_PATH = SCHEMAS_PATH + '/intermediates';

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
        `${SCHEMAS_PATH}/groupSchema.ts`,
        `${SCHEMAS_PATH}/bundleSchema.ts`,
        `${SCHEMAS_PATH}/contestSchema.ts`,
        `${SCHEMAS_PATH}/passwordResetTokenSchema.ts`,
        `${SCHEMAS_PATH}/stageSchema.ts`,
        `${INTERMEDIATES_SCHEMAS_PATH}/usersToGroupSchema.ts`,
        `${INTERMEDIATES_SCHEMAS_PATH}/problemsToBundleSchema.ts`,
        `${INTERMEDIATES_SCHEMAS_PATH}/usersToContestSchema.ts`,
        `${INTERMEDIATES_SCHEMAS_PATH}/problemsToContestSchema.ts`,
    ],
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: DB_CONNECTION_STRING,
    },
} satisfies Config;
