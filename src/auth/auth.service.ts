import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { LoginDto, SignUpDto } from "./dto";
import { UserService } from "src/user/user.service";
import * as argon from 'argon2';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
    ) { }
    
    async signup(
        data: SignUpDto
    ) {

        // Save new user in db
        const newUser = await this.userService.createUser(data);

        //TODO Generate access and refresh tokens


        //TODO Return tokens

        return newUser
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

        return 'login'
    }

}