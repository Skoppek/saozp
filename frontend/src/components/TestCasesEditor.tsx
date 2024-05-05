import { TestCase } from "../shared/interfaces";
import { TextInput } from "./TextInput";
import { useState } from "react";
import { Badge, Button } from "flowbite-react";
import { FaPlus } from "react-icons/fa";

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
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-end justify-around gap-4">
        <TextInput
          label="Wejście"
          id={"test-input"}
          onChange={(value) => {
            setCurrentTest((prev) => {
              return {
                ...prev,
                input: value,
              };
            });
          }}
          className="w-full"
        />
        <TextInput
          label="Wartość oczekiwana"
          id={"test-expected"}
          onChange={(value) => {
            setCurrentTest((prev) => {
              return {
                ...prev,
                expected: value,
              };
            });
          }}
          className="w-full"
        />
        <Button
          size="lg"
          className="flex justify-center"
          onClick={() => {
            setTests((prev) => {
              const newSet = [...prev, currentTest];
              onChange?.(newSet);
              return newSet;
            });
          }}
        >
          <FaPlus className="size-4" />
        </Button>
      </div>
      {!!tests.length && (
        <div className="flex flex-col gap-1 rounded-lg bg-gray-300 p-2 dark:bg-slate-700">
          {tests.map((test) => {
            return (
              <div className="flex">
                <div className="ml-8 flex w-1/2 gap-4">
                  Wejście
                  <Badge color="dark" size="sm">
                    {test.input}
                  </Badge>
                </div>
                <div className="flex gap-4">
                  Oczekuje
                  <Badge color="success" size="sm">
                    {test.expected}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
