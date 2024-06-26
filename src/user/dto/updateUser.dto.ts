import { IsString, IsNotEmpty, IsOptional } from "class-validator";


export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName?: string;
}