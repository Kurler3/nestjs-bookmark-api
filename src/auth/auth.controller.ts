import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";



@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // Login
    @Post('login')
    login() {
        return this.authService.login();
    }

    // Sign up
    @Post('signup')
    signup() {
        return this.authService.signup();
    }


}