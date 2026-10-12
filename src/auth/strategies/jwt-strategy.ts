import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "../interfaces/interfaces.js";
import { PassportStrategy } from "@nestjs/passport";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepostory: Repository<User>
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        const user = await this.userRepostory.findOneBy({ id });

        if (!user) throw new UnauthorizedException("Token not valid");
        if (!user.isActive) throw new UnauthorizedException("User is not active");

        return user;
    }
}