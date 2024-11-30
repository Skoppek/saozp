import { Modal } from "flowbite-react/components/Modal";
import { useEffect, useMemo, useRef } from "react";
import { Spinner } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient.ts";
import { BundleProblemsTable } from "./BundleProblemsTable.tsx";
import _ from "lodash";
import { TextInput } from "../../components/inputs/TextInput.tsx";

interface BundleEditModalProps {
  bundle: {
    name: string;
    id: number;
  };
  show: boolean;
  onClose: () => void;
}

export const BundleEditModal = ({
  bundle,
  show,
  onClose,
}: BundleEditModalProps) => {
  const {
    data: bundleProblems,
    isFetching: isFetchingBundle,
    refetch: refetchBundle,
  } = useQuery({
    queryKey: ["bundleProblems"],
    queryFn: () => apiClient.bundles.getProblems(bundle.id),
  });

  const {
    data: allProblems,
    isFetching: isFetchingAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["allBundles"],
    queryFn: () => apiClient.problems.getAll(),
  });

  useEffect(() => {
    if (show) {
      void refetchBundle();
      void refetchAll();
    }
  }, [show, refetchBundle, refetchAll]);

  const changeName = useRef(
    _.debounce(async (value: string) => {
      void apiClient.bundles.update(bundle.id, { name: value });
    }, 1000),
  ).current;

  const filteredAllProblems = useMemo(
    () =>
      _.differenceBy(
        (allProblems ?? []).map((problem) => {
          return {
            id: problem.problemId,
            name: problem.name,
            languageId: problem.languageId,
          };
        }),
        bundleProblems ?? [],
        "id",
      ),
    [allProblems, bundleProblems],
  );

  return (
    <>
      <Modal show={show} onClose={() => onClose()}>
        <Modal.Header>{`Edycja paczki - ${bundle.name}`}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              id={"bundleName"}
              label={"Nazwa paczki"}
              onChange={changeName}
              defaultValue={bundle.name}
            />
            <div className={"flex justify-around gap-2"}>
              {!isFetchingAll &&
              allProblems != undefined &&
              bundleProblems != undefined ? (
                <BundleProblemsTable
                  data={filteredAllProblems}
                  confirmLabel={"Dodaj do paczki"}
                  onConfirm={(problems) => {
                    apiClient.bundles
                      .addProblems(
                        bundle.id,
                        problems.map((problem) => problem.id),
                      )
                      .then(() => {
                        void refetchBundle();
                        void refetchAll();
                      });
                  }}
                />
              ) : (
                <Spinner aria-label="Extra large spinner" size="xl" />
              )}
              {!isFetchingBundle && bundleProblems !== undefined ? (
                <BundleProblemsTable
                  data={bundleProblems}
                  confirmLabel={"Usuń z paczki"}
                  onConfirm={(problems) => {
                    apiClient.bundles
                      .removeProblems(
                        bundle.id,
                        problems.map((problem) => problem.id),
                      )
                      .then(() => {
                        void refetchBundle();
                        void refetchAll();
                      });
                  }}
                />
              ) : (
                <Spinner aria-label="Extra large spinner" size="xl" />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
