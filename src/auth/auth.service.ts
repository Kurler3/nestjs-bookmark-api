import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { LoginDto, SignUpDto } from "./dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {

    constructor(
        private databaseService: DatabaseService,
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


    login(
        data: LoginDto
    ) {

        // Check if user with email exists

        // Compare passwords

        // Generate access and refresh tokens

        return 'login'
    }

}