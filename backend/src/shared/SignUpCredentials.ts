interface SignUpCredentials {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const isSignUpCredentials = (
    suspect: unknown,
): suspect is SignUpCredentials => {
    return (
        typeof suspect === 'object' &&
        !!suspect &&
        'login' in suspect &&
        typeof suspect.login === 'string' &&
        'password' in suspect &&
        typeof suspect.password === 'string' &&
        'firstName' in suspect &&
        typeof suspect.firstName === 'string' &&
        'lastName' in suspect &&
        typeof suspect.lastName === 'string'
    );
};
