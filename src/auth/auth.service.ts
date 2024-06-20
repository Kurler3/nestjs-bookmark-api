import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { LoginDto, SignUpDto } from "./dto";
import { UserService } from "src/user/user.service";
import * as argon from 'argon2';

@Injectable()
export class AuthService {

    constructor(
        private databaseService: DatabaseService,
        private userService: UserService,
    ) { }
    
    async signup(
        data: SignUpDto
    ) {

        // Check if user with this email already exists
        const existingUser = await this.userService.getUserByEmail(data.email);

        if(existingUser) {
            throw new ForbiddenException();
        }

        // Hash password
        const hash = argon.hash(data.password);

        // Save new user in db
        

        // Generate access and refresh tokens

        // Return tokens

        return 'signup'
    }


    login(
        data: LoginDto
    ) {

        // Check if user with email exists

        // Compare passwords

        // Generate access and refresh tokens

        return 'login'
    }

}