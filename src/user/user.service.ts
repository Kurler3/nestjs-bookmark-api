import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import exclude from '../utils/functions/excludeFields';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {

    constructor (private databaseService: DatabaseService) {}

    // Get user by email
    async getUserByEmail(
        email: string,
    ) {
        return this.databaseService.user.findUnique({
            where: {
                email,
            }
        })
    }

    // Get user by id
    async getUserById(
        id: number,
    ) {
        return this.databaseService.user.findUnique({
            where: {
                id,
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
            },
        })

        return exclude<User>(newUser, ['hash']);

    }

    // Update user
    async updateUser(
        userId: number,
        updateUserDto: UpdateUserDto
    ) {

        const updateUser = await this.databaseService.user.update({
            where: {
                id: userId,
            },
            data: updateUserDto,
        })

        return exclude(updateUser, ['hash']);
    }
}   
