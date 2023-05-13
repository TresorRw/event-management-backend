export function resolveToken(authorizationHeader?: string) {
    if (!authorizationHeader) {
        return undefined;
    }
    let token:string;
    if (authorizationHeader.includes("Bearer")) {
        token = authorizationHeader.replace(/^Bearer/i, '')
    } else {
        token = authorizationHeader
    }
    return token;
}