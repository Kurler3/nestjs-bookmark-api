import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from './decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

    // Me
    @Get('me')
    async getMe(@GetUser() user: User) {
        return user;
    }

}
