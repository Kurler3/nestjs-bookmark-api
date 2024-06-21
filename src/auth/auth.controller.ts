import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignUpDto } from "./dto";



@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // Login
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(
        @Body() body: LoginDto
    ) {
        return this.authService.login(body);
    }

    // Sign up
    @Post('signup')
    signup(
        @Body() body: SignUpDto
    ) {
        return this.authService.signup(body);
    }

}