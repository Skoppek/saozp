import { FileInput, Label } from "flowbite-react";
import apiClient from "../../client/apiClient";
import { useMemo } from "react";
import { TestCase } from "../../shared/interfaces/TestCase";
import { atomOneDark, CodeBlock } from "react-code-blocks";

const helpText = `{
	"input": string | number | boolean,
	"expected": string | number | boolean
}[ ]`;

interface TestCasesFileUploadProps {
  tests: TestCase[] | undefined;
  setTests: (tests: TestCase[]) => void;
}

export const TestCasesFileUpload = ({
  tests,
  setTests,
}: TestCasesFileUploadProps) => {
  const showHelp = useMemo<boolean>(() => {
    return tests != undefined && !tests.length;
  }, [tests]);

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex w-full justify-between gap-4">
          <Label value="Przypadki testowe" />
          <div className="text-green">
            {tests?.length ? `Ilość testów: ${tests?.length}` : ""}
          </div>
        </div>
        <FileInput
          className="w-full"
          color={showHelp ? "failure" : tests?.length ? "success" : undefined}
          onChange={(event) => {
            const files = event.target.files;
            if (files)
              apiClient.problems.validateTests(files).then((res) =>
                setTests(
                  res.map((test) => {
                    return {
                      input: test.input.toString(),
                      expected: test.expected.toString(),
                    };
                  }),
                ),
              );
          }}
        />
        {showHelp && (
          <div className="flex flex-col p-4">
            <div>- Plik z testami powinien być w formacie .json</div>
            <div>
              - Testy powinny znajdować się w niepustej tablicy w poniższym
              formacie
            </div>
            <br />
            <CodeBlock
              theme={atomOneDark}
              text={helpText}
              language={"js"}
              showLineNumbers={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
