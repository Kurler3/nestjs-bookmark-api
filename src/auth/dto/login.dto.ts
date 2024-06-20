import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    @IsString()
    password: string;
}