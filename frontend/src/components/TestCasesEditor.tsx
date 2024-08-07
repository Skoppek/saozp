import { TestCase } from "../shared/interfaces/TestCase";
import { useMemo, useState } from "react";
import { Badge, Button, Popover } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineTrash, HiOutlineArrowRight } from "react-icons/hi";
import { HiPencilAlt } from "react-icons/hi";
import { TextInput } from "./inputs/TextInput";

interface TestCasesEditorProps {
  testCases?: TestCase[];
  onChange?: (value: TestCase[]) => void;
}

export const TestCasesEditor = ({
  testCases,
  onChange,
}: TestCasesEditorProps) => {
  const [tests, setTests] = useState<TestCase[]>(testCases ?? []);
  const [currentTest, setCurrentTest] = useState<TestCase>({
    input: "",
    expected: "",
  });
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const isInputCorrect = useMemo<boolean>(() => {
    return (
      !tests.filter((test) => test.input === currentTest.input).length &&
      !!currentTest.input.length &&
      !!currentTest.expected.length
    );
  }, [currentTest.expected.length, currentTest.input, tests]);

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-row items-end justify-around gap-4">
        <TextInput
          label="Wejście"
          id={"test-input"}
          onChange={(value) => {
            setIsDirty(true);
            setCurrentTest((prev) => {
              return {
                ...prev,
                input: value,
              };
            });
          }}
          value={currentTest.input}
          className="w-full"
        />
        <TextInput
          label="Wartość oczekiwana"
          id={"test-expected"}
          onChange={(value) => {
            setIsDirty(true);
            setCurrentTest((prev) => {
              return {
                ...prev,
                expected: value,
              };
            });
          }}
          value={currentTest.expected}
          className="w-full"
        />
        <Popover
          open={isDirty && !isInputCorrect}
          content={
            <div className="m-4">
              <ul>
                <li>Dane wejściowe nie mogą się powtarzać</li>
                <li>Żadne z danych nie mogą być puste</li>
              </ul>
            </div>
          }
          placement="top"
        >
          <Button
            size="lg"
            className="flex justify-center"
            disabled={!isInputCorrect}
            onClick={() => {
              setCurrentTest({ input: "", expected: "" });
              setTests((prev) => {
                const newSet = [...prev, currentTest];
                onChange?.(newSet);
                return newSet;
              });
            }}
          >
            <FaPlus className="size-4" />
          </Button>
        </Popover>
      </div>
      {!!tests.length && (
        <div className="flex max-h-[20vh] flex-col gap-1 overflow-y-auto rounded-lg bg-gray-300 p-2 dark:bg-slate-700">
          {tests.map((test) => {
            return (
              <div className="ml-4 flex content-center justify-between">
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <Badge color="dark" size="sm">
                      {test.input}
                    </Badge>
                  </div>
                  <HiOutlineArrowRight className="size-6" />
                  <div className="flex gap-4">
                    <Badge color="success" size="sm">
                      {test.expected}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    outline
                    color={"normal"}
                    onClick={() => {
                      setIsDirty(false);
                      setCurrentTest(test);
                    }}
                  >
                    <HiPencilAlt />
                  </Button>
                  <Button
                    size="xs"
                    outline
                    color={"failure"}
                    onClick={() => {
                      setTests((prev) =>
                        prev.filter((item) => item.input !== test.input),
                      );
                    }}
                  >
                    <HiOutlineTrash />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
