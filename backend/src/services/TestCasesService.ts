interface TestCase {
    input: string | number | boolean;
    expected: string | number | boolean;
}

const isTestCase = (o: unknown): o is TestCase => {
    return (
        typeof o === 'object' &&
        o != null &&
        'input' in o &&
        ['string', 'number', 'boolean'].includes(typeof o.input) &&
        'expected' in o &&
        ['string', 'number', 'boolean'].includes(typeof o.expected)
    );
};

type TestCasesFile = TestCase[];

export const isTestCasesFile = (o: unknown): o is TestCasesFile => {
    return (
        o != null &&
        Array.isArray(o) &&
        o.every((entry) => {
            return isTestCase(entry);
        })
    );
};

export default abstract class TestCasesService {
    static validateTestsFile(data: unknown): TestCasesFile {
        if (isTestCasesFile(data)) {
            return data;
        }
        return [];
    }
}
