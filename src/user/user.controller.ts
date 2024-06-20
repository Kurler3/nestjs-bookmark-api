import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

    // Me
    @Get('me')
    async getMe(@Request() req) {
        return req.user;
    }

}
