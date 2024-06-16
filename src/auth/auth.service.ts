import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class AuthService {

    constructor(
        private databaseService: DatabaseService
    ) { }
    
    signup() {

        // 

        return 'signup'
    }


    login() {
        return 'login'
    }

}