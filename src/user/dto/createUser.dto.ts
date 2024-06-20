import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";



export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Optional()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    @Optional()
    lastName?: string;

    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    password: string;
}