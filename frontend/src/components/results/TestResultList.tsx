import { Table } from "flowbite-react/components/Table";
import { TestCaseResult } from "../../shared/interfaces/TestCaseResult";
import { Badge } from "flowbite-react/components/Badge";
import { TestStatus } from "../../shared/enums";
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
                    color={
                      test.statusId === TestStatus.ACCEPTED ? "green" : "red"
                    }
                    className="flex justify-center"
                  >
                    {test.received != null ? test.received : "Błąd"}
                  </Badge>
                ) : (
                  <Badge color={"red"}>{test.error}</Badge>
                )}
              </Table.Cell>
              {test.statusId !== TestStatus.ACCEPTED && (
                <Table.Cell>{test.expected}</Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
