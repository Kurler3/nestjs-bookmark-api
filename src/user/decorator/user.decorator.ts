
import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common'
import { User } from '@prisma/client';

export const GetUser = createParamDecorator<unknown, ExecutionContext, User>(
    (data: string, ctx: ExecutionContext): User => {
        const req: Express.Request = ctx.switchToHttp().getRequest();
        return data && req.user ? req.user[data] : req.user;
    }
)