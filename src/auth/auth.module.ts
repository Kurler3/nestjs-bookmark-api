import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        UserModule, 
        JwtModule.register({
            //TODO Hide
            secret: "c909e901c857850bacbd94d81b6b115ee6aa52061453c4abc7008c3a4cd0192f",
        }),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: []
})
export class AuthModule {}