import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { problemSchema, submissionSchema, testSchema } from "./db/schema";
import _ from "lodash";
import { isNull, inArray, eq } from "drizzle-orm";
import judge0Client from "./judge0Client";
import { Pool } from "pg";

const FETCH_LIMIT = parseInt(process.env.FETCH_LIMIT!);
const FETCH_PERIOD = parseInt(process.env.FETCH_PERIOD!);

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.on("error", (err) => {
  console.log("Unexpected error on the database client:", err);
});

export const db = drizzle({ client: pool });

try {
  await db.execute("select 1");
} catch {
  console.error(
    "[ERROR] | " + new Date().toLocaleString() + " | Failed to connect to DB"
  );
  process.exit(1);
}

main();

const submitToJudge0 = async (
  tests: { id: number; input: string; expected: string }[],
  languageId: number,
  code: string
) => {
  let failedSubmitsCount = 0;
  console.log({tests});

  Promise.all(
    tests.map(async (test) => {
      try {
        const token = (
          await judge0Client.submit({
            languageId: languageId,
            code: code,
            test: {
              input: test.input,
              expected: test.expected,
            },
          })
        ).token;
        await db
          .update(testSchema)
          .set({ token })
          .where(eq(testSchema.id, test.id));
      } catch (error) {
        failedSubmitsCount += 1;
      }
    })
  ).then(() => {
    if (failedSubmitsCount > 0) {
      console.warn(
        `[WARN] | ${new Date().toLocaleString()} | Failed to submit ${failedSubmitsCount} tests to Judge0.`
      );
    }
  });
};

const getNewTests = async () =>
  await db
    .select()
    .from(testSchema)
    .where(isNull(testSchema.token))
    .limit(FETCH_LIMIT);

async function main() {
  console.log("Start");
  console.log(
    `[INFO] | ${new Date().toLocaleString()} | Testing connection to Judge0.`
  );
  judge0Client
    .getAbout()
    .then((res) => {
      console.log("Connected with success");
      console.log(res.data);
    })
    .catch((err) =>
      console.error(
        `[ERR] | ${new Date().toLocaleString()} | Failed to connect to Judge0.`
      )
    );

  setInterval(async () => {
    const tests = await getNewTests();
    if (tests.length > 0) {
      console.log(
        `${new Date().toLocaleString()} | ${tests.length} waiting tests found.`
      );
    }

    const testsBySubmission = _.groupBy(tests, "submission_id");

    const submissionsIds = Object.keys(testsBySubmission)
      .map((id) => parseInt(id))
      .filter((id) => !Number.isNaN(id));
    const submissions = await db
      .selectDistinct()
      .from(submissionSchema)
      .where(inArray(submissionSchema.id, submissionsIds));

    const problemIds = Object.keys(_.groupBy(submissions, "problemId"))
      .map((id) => parseInt(id))
      .filter((id) => !Number.isNaN(id));
    const problems = await db
      .select()
      .from(problemSchema)
      .where(inArray(problemSchema.id, problemIds));

    Promise.all(
      submissions
        .filter((x) => !!x)
        .map((submission) => {
          const submissionsTests = testsBySubmission[submission.id] ?? [];
          submitToJudge0(
            submissionsTests as any,
            problems.find((problem) => problem.id === submission.problemId)
              ?.languageId ?? 0,
            submission.code
          );
        })
    );
  }, FETCH_PERIOD);
}
