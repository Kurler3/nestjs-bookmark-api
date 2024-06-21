import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    // Me
    @Get('me')
    async getMe(@GetUser() user: User) {
        return user;
    }

    @Patch('/update')
    async updateUser(
        @GetUser('id') userId: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.updateUser(
            userId,
            updateUserDto
        );
    }
}
