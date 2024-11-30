import { ReactNode } from "react";

export const InfoCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex overflow-y-auto rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="prose break-words dark:prose-invert">{children}</div>
    </div>
  );
};
