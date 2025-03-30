import { Badge, Button, FileInput, Label } from "flowbite-react";
import apiClient from "../../client/apiClient";
import { TestCase } from "../../shared/interfaces/TestCase";
import { useCallback } from "react";

const exampleTestFile: {
  input: string | number | boolean;
  expected: string | number | boolean;
}[] = [
  {
    input: "Hello World!",
    expected: "Witaj Świecie!",
  },
  {
    input: 2,
    expected: 8,
  },
  {
    input: "Is this a monad?",
    expected: false,
  },
];

interface TestCasesFileUploadProps {
  tests: TestCase[] | undefined;
  setTests: (tests: TestCase[]) => void;
}

export const TestCasesFileUpload = ({
  tests,
  setTests,
}: TestCasesFileUploadProps) => {
  const downloadFile = useCallback((name: string, data: string | object) => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    element.download = name;
    document.body.appendChild(element);
    element.click();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Label value="Przypadki testowe" />
      <div className="flex flex-col gap-2">
        <Badge>
          {tests?.length ? `Ilość załadowanych testów: ${tests?.length}` : ""}
        </Badge>
        <FileInput
          className="w-full"
          onChange={(event) => {
            const files = event.target.files;
            if (files)
              apiClient.problems.validateTests(files).then((res) =>
                setTests(
                  res.map((test) => ({
                    input: test.input.toString(),
                    expected: test.expected.toString(),
                  })),
                ),
              );
          }}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => downloadFile("example.json", exampleTestFile)}
            size="xs"
          >
            Pobierz wzór
          </Button>
          {tests && !!tests.length && (
            <Button onClick={() => downloadFile("tests.json", tests)} size="xs">
              Pobierz obecne
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
