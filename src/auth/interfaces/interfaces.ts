export interface AuthUserInterface {
    id: string;
    name: string;
    email: string;
    roles: string[];
    token: string;
}

export interface JwtPayload {
    id: string;
}