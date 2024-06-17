import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { LoginDto, SignUpDto } from "./dto";

@Injectable()
export class AuthService {

    constructor(
        private databaseService: DatabaseService
    ) { }
    
    signup(
        data: SignUpDto
    ) {

        // 

        return 'signup'
    }


    login(
        data: LoginDto
    ) {
        return 'login'
    }

}