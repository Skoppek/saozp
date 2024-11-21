import { Table } from "flowbite-react/components/Table";
import { TestCaseResult } from "../../shared/interfaces/TestCaseResult";
import { Badge } from "flowbite-react/components/Badge";
import { STATUS_COLORS, STATUS_NAMES, TestStatus } from "../../shared/enums";
import _ from "lodash";

interface TestResultListProps {
  tests: TestCaseResult[];
}

export const TestResultList = ({ tests }: TestResultListProps) => {
  return (
    <div className="flex w-1/2 flex-col gap-1">
      <Table>
        <Table.Head>
          <Table.HeadCell>Wejście</Table.HeadCell>
          <Table.HeadCell>Wyjście</Table.HeadCell>
          <Table.HeadCell>Oczekiwano</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {tests.map((test, index) => (
            <Table.Row id={`${index}`}>
              <Table.Cell>{test.input}</Table.Cell>
              <Table.Cell>
                {_.isNil(test.error) ? (
                  <Badge
                  size={"xs"}
                  color={STATUS_COLORS[test.statusId ?? TestStatus.UNKNOWN]}
                  className="w-fit"
                >
                  {test.statusId == TestStatus.WRONG_ANSWER ? (test.received ?? "Brak wyjścia") : STATUS_NAMES[test.statusId ?? TestStatus.UNKNOWN]}
                </Badge>
                ) : (
                  <Badge color={"red"}>{test.error}</Badge>
                )}
              </Table.Cell>
              {test.statusId == TestStatus.WRONG_ANSWER && (
                <Table.Cell>{test.expected}</Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
