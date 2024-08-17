import { FileInput, Label } from "flowbite-react";
import apiClient from "../../client/apiClient";
import { useMemo } from "react";
import { TestCase } from "../../shared/interfaces/TestCase";
import { atomOneDark, CodeBlock } from "react-code-blocks";
import { InfoCard } from "../InfoCard.tsx";

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
    <InfoCard>
      <div className="flex w-full justify-between gap-4">
        <Label value="Przypadki testowe" />
        <div>{tests?.length ? `Ilość testów: ${tests?.length}` : ""}</div>
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
    </InfoCard>
  );
};
