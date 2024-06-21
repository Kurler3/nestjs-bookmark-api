import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./dto";
import { UserService } from "../user/user.service";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }
    
    async signup(
        data: SignUpDto
    ) {

        // Save new user in db
        const newUser = await this.userService.createUser(data);

        // Generate access and refresh tokens
        const accessToken = await this.signToken(newUser.id, newUser.email);

        return {
            access_token: accessToken,
        }
    }


    async login(
        data: LoginDto
    ) {

        // Check if user with email exists
        const user = await this.userService.getUserByEmail(data.email);

        if(!user) {
            throw new BadRequestException('Wrong username or password');
        }

        // Compare passwords
        const arePwdsMatch = await argon.verify(user.hash, data.password);

        if(!arePwdsMatch) {
            throw new UnauthorizedException('Wrong username or password');
        }

        //TODO Generate access and refresh tokens

        const accessToken = await this.signToken(user.id, user.email);

        return {
            access_token: accessToken,
        }
    }


    async signToken(userId: number, email: string): Promise<string> {

        const payload = {
            sub: userId,
            email,
        }

        const options = {
            expiresIn: '15m', // Expires in 15 minutes
            secret: this.configService.get('JWT_SECRET')
        }

        return this.jwtService.signAsync(
            payload,
            options
        );
    }

}