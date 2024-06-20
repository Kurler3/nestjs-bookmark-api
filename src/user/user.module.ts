import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
  imports: []
})
export class UserModule {}
