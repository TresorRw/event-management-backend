export function resolveToken(authorizationHeader?: string) {
    if (!authorizationHeader) {
        return undefined;
    }
    let token: string;
    if (authorizationHeader.includes("Bearer")) {
        token = authorizationHeader.split(" ")[1];
    } else {
        token = authorizationHeader
    }
    return token;
}