export const useNumberParam = ({ param }: { param?: string }) => {
  let result = undefined;
  if (!param) result = undefined;

  const value = Number(param);
  result = Number.isNaN(value) ? undefined : value;

  return {
    value: result,
  };
};
