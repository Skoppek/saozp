type MyMap = <T, W>(
    value: T | null | undefined,
    mapFn: (a: NonNullable<T>) => W,
) => W | undefined;

export const mapIfPresent: MyMap = (value, mapFn) => {
    if (value === undefined || value === null) return undefined;
    else return mapFn(value);
};
