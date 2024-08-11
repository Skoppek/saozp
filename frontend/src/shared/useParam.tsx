export const useParam = ({
  param,
  type,
}: {
  param?: string;
  type: "string" | "number";
}) => {
  let result = undefined;
  if (!param) result = undefined;

  switch (type) {
    case "string":
      result = param;
      break;
    case "number":
      const value = Number(param);
      result = Number.isNaN(value) ? undefined : value;
  }

  return {
    value: result,
  };
};
