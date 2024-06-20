import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {

    constructor (private databaseService: DatabaseService) {}

    // Get user by email
    async getUserByEmail(
        email: string,
    ) {
        return this.databaseService.user.findFirst({
            where: {
                email,
            }
        })
    }

    // Create new user
    async createUser(
        createUserDto: CreateUserDto
    ) {

        // Check if user exists with this email
        const existingUser = await this.getUserByEmail(createUserDto.email);

        // If the user already exists
        if(existingUser) {
            throw new ForbiddenException('This email is taken');
        }

        // Hash the password
        const hash = await argon.hash(createUserDto.password)

        delete createUserDto.password;

        // Create the user
        const newUser = await this.databaseService.user.create({
            data: {
                ...createUserDto,
                hash,
            }
        })

        return newUser;

    }

}
