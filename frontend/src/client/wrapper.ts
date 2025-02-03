export const handleFail = <T,>(response: { data: T, error: any }): T => {
    if (!response.data) {
        throw new Error("Unexpected null in response.");
    }
    if (response.error) throw new Error("Something went wrong");
    return response.data;
}