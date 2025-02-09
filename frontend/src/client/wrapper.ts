// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleFail = <T,>(response: { data: T, error: any }): NonNullable<T> => {
    if (!response.data) {
        throw new Error("Unexpected null in response.");
    }
    if (response.error) {
        throw new Error("Something went wrong")
    };
    return response.data;
}