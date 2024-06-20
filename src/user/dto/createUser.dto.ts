import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";



export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Optional()
    @IsString()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    password: string;
}