import { User } from "../entities/user.entity.js";
import { AuthUserInterface } from "../interfaces/interfaces.js";

export class UserResource {
    static authUser(user: User, token: string): AuthUserInterface {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            token: token
        };
    }
}