import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserService } from "../user/user.service";
import exclude from "../utils/functions/excludeFields";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        configService: ConfigService,
        private userService: UserService,
    ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get('JWT_SECRET'),
        });
      }
    
      async validate({ sub }: { sub: number, email: string }) {
        const user = await this.userService.getUserById(sub);
        if(user) return exclude(user, ['hash'])
        return null;
      }

}