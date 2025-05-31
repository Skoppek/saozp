import Elysia, { t } from "elysia";
import TestCasesService from "../services/TestCasesService";

export default new Elysia({
    prefix: 'testCases',
}).post(
    '/tests_validation',
    async ({ body }) =>
        await body.testsFile
            .json()
            .then((val) => TestCasesService.validateTestsFile(val)),
    {
//        body: t.Object({
//            testsFile: t.File({
//                type: 'application/json',
//           }),
//        }),
        response: t.Union([
            t.Null(),
            t.Array(
                t.Object({
                    input: t.Union([t.String(), t.Number(), t.Boolean()]),
                    expected: t.Union([
                        t.String(),
                        t.Number(),
                        t.Boolean(),
                    ]),
                }),
            ),
        ]),
    },
)
